/**
 * scripts/fetch-product-images-us.mjs
 *
 * Fetches the real product image URL from each Amazon US /dp/ page and
 * patches config/mattress/products.ts with the direct m.media-amazon.com URL.
 *
 * Usage:  node scripts/fetch-product-images-us.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
  // Tells Amazon US to keep us on amazon.com without locale redirect prompts
  "Cookie": "i18n-prefs=USD; lc-main=en_US",
};

// Extract productId → ASIN from buy-links.ts (US entries only — usLink helper)
const buyLinksPath = path.resolve(__dirname, "../config/mattress/buy-links.ts");
const buyLinksSource = fs.readFileSync(buyLinksPath, "utf8");
const re = /"([^"]+)":\s*usLink\("([^"]+)"\)/g;
const asinMap = {};
let m;
while ((m = re.exec(buyLinksSource)) !== null) asinMap[m[1]] = m[2];

const entries = Object.entries(asinMap);
console.log(`\nFetching US images for ${entries.length} products...\n`);

async function getImageUrl(asin) {
  const url = `https://www.amazon.com/dp/${asin}`;
  const res = await fetch(url, {
    headers: HEADERS,
    signal: AbortSignal.timeout(12_000),
    redirect: "follow",
  });
  const html = await res.text();

  // Primary: landingImage data-old-hires
  const hiresMatch = html.match(/data-old-hires="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/);
  if (hiresMatch) return hiresMatch[1];

  // Fallback: landingImage src
  const srcMatch = html.match(/id="landingImage"[^>]*src="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/);
  if (srcMatch) return srcMatch[1];

  // Fallback: imgBlkFront
  const blkMatch = html.match(/"large":"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/);
  if (blkMatch) return blkMatch[1];

  return null;
}

// Sequential with 600ms pacing to stay under Amazon's bot detection threshold.
const results = [];
for (const [productId, asin] of entries) {
  try {
    const imgUrl = await getImageUrl(asin);
    const status = imgUrl ? "✓" : "✗ not found";
    console.log(`  ${status}  ${productId} (${asin})${imgUrl ? "" : " — will keep existing"}`);
    results.push({ productId, asin, imgUrl });
  } catch (e) {
    console.log(`  ✗  ${productId} (${asin}) — ${e.message}`);
    results.push({ productId, asin, imgUrl: null });
  }
  await new Promise((r) => setTimeout(r, 600));
}

// Patch products.ts
const productsPath = path.resolve(__dirname, "../config/mattress/products.ts");
let source = fs.readFileSync(productsPath, "utf8");

let updated = 0;
for (const { productId, imgUrl } of results) {
  if (!imgUrl) continue;
  const escapedId = productId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const blockRe = new RegExp(
    `(id:\\s*"${escapedId}"[\\s\\S]{0,600}?imageUrl:\\s*)"([^"]*)"`,
    "m"
  );
  if (blockRe.test(source)) {
    source = source.replace(blockRe, `$1"${imgUrl}"`);
    updated++;
  }
}

fs.writeFileSync(productsPath, source, "utf8");
console.log(`\nDone: ${updated} US image URLs written to products.ts.\n`);
