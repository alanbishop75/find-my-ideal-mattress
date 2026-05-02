/**
 * scripts/validate-affiliate-links.mjs
 *
 * Validates every SiteStripe affiliate link in config/mattress/buy-links.ts
 * by following the amzn.to redirect and confirming the final URL contains
 * both the expected ASIN and the expected UK Associates tag.
 *
 * Usage:
 *   node scripts/validate-affiliate-links.mjs
 *   node scripts/validate-affiliate-links.mjs --concurrency 3
 *
 * Requires Node 18+. Makes real HTTP requests — run manually, not in CI.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UK_ASSOCIATE_TAG = "findmyidealmattress-21";
const CONCURRENCY = (() => {
  const idx = process.argv.indexOf("--concurrency");
  return idx !== -1 ? parseInt(process.argv[idx + 1], 10) || 3 : 3;
})();

// ── Parse buy-links.ts ───────────────────────────────────────────────────────
const filePath = path.resolve(__dirname, "../config/mattress/buy-links.ts");
const source = fs.readFileSync(filePath, "utf8");

// Match:  "product-id": affiliateLink("https://amzn.to/...", "ASIN"),
const re = /"([^"]+)":\s*affiliateLink\("([^"]+)",\s*"([^"]+)"\)/g;
const entries = [];
let m;
while ((m = re.exec(source)) !== null) {
  entries.push({ productId: m[1], url: m[2], asin: m[3] });
}

if (entries.length === 0) {
  console.log("No affiliateLink entries found — nothing to validate.");
  process.exit(0);
}

console.log(`\nValidating ${entries.length} SiteStripe links (concurrency ${CONCURRENCY})...\n`);
console.log(
  "Product ID".padEnd(42),
  "Short URL".padEnd(28),
  "Expected ASIN".padEnd(14),
  "Tag".padEnd(8),
  "Result"
);
console.log("─".repeat(110));

// ── HTTP check ───────────────────────────────────────────────────────────────
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; validate-affiliate-links/1.0)",
  "Accept-Language": "en-GB,en;q=0.9",
};

async function checkLink({ productId, url, asin }) {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: HEADERS,
      signal: AbortSignal.timeout(10_000),
    });
    const finalUrl = res.url;
    const asinPass = finalUrl.includes(asin);
    const tagPass = finalUrl.includes(`tag=${UK_ASSOCIATE_TAG}`);
    const pass = asinPass && tagPass;
    return { productId, url, asin, finalUrl, asinPass, tagPass, pass, error: null };
  } catch (err) {
    return {
      productId,
      url,
      asin,
      finalUrl: null,
      asinPass: false,
      tagPass: false,
      pass: false,
      error: err.message,
    };
  }
}

// Run with limited concurrency
async function runBatch(items, fn, concurrency) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
    // Small delay between batches to be polite to Amazon's servers
    if (i + concurrency < items.length) {
      await new Promise((r) => setTimeout(r, 800));
    }
  }
  return results;
}

const results = await runBatch(entries, checkLink, CONCURRENCY);

// ── Print results ────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

for (const r of results) {
  const status = r.pass
    ? "✓ PASS"
    : r.error
      ? `✗ ERROR: ${r.error}`
      : `✗ FAIL — resolved to: ${r.finalUrl ?? "(no URL)"}`;
  console.log(
    r.productId.padEnd(42),
    r.url.padEnd(28),
    r.asin.padEnd(14),
    String(r.tagPass ? "yes" : "no").padEnd(8),
    status
  );
  if (r.pass) passed++;
  else failed++;
}

console.log("\n" + "─".repeat(110));
console.log(`\nResults: ${passed} passed, ${failed} failed out of ${results.length} links.\n`);

if (failed > 0) {
  console.error(`${failed} link(s) did not resolve to the expected ASIN. Check the output above.`);
  process.exit(1);
} else {
  console.log("All SiteStripe links resolved correctly.");
  process.exit(0);
}
