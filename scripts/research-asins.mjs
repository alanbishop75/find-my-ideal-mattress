/**
 * scripts/research-asins.mjs
 *
 * Phase 5.1 — Catalogue Population Pipeline
 *
 * Searches Amazon UK for each product and selects the FIRST result whose
 * title contains the expected brand name (skipping sponsored slots that
 * promote unrelated products).
 *
 * Outputs scripts/asin-candidates.json — review manually before patching.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.resolve(__dirname, "../config/mattress/products.ts");
const outPath = path.resolve(__dirname, "asin-candidates.json");

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept":
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-GB,en;q=0.9",
  "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
  "Cookie": "i18n-prefs=GBP; lc-acbuk=en_GB",
};

const PACING_MS = 1500;

const source = fs.readFileSync(productsPath, "utf8");
const blockRe =
  /id:\s*"([^"]+)",\s*brand:\s*"([^"]+)",\s*name:\s*"([^"]+)",[\s\S]*?ukPending\("([^"]+)"\)/g;
const products = [];
let m;
while ((m = blockRe.exec(source)) !== null) {
  products.push({ id: m[1], brand: m[2], name: m[3], searchHint: m[4] });
}

console.log(`Researching ${products.length} products on Amazon UK...`);

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: HEADERS,
    signal: AbortSignal.timeout(15_000),
    redirect: "follow",
  });
  const html = await res.text();
  if (
    html.includes("Sorry, we just need to make sure") ||
    html.includes("api-services-support@amazon.com")
  ) {
    throw new Error("CAPTCHA returned by Amazon");
  }
  return { status: res.status, html };
}

function extractAllResults(html) {
  const parts = html.split(/data-component-type="s-search-result"/);
  const results = [];
  for (let i = 1; i < parts.length; i++) {
    const prev = parts[i - 1];
    const divStart = prev.lastIndexOf("<div");
    const divOpening = divStart >= 0 ? prev.slice(divStart) : prev.slice(-500);
    const asinMatch = divOpening.match(/data-asin="([A-Z0-9]{10})"/);
    if (!asinMatch) continue;
    const asin = asinMatch[1];
    const after = parts[i].slice(0, 10000);
    // Each card has two H2s: [0] = brand, [1] = product name. Combine.
    const h2s = [...after.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)];
    const decode = (s) =>
      s.replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&#34;|&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
    const brandText = h2s[0] ? decode(h2s[0][1]) : "";
    const nameText = h2s[1] ? decode(h2s[1][1]) : "";
    const title = [brandText, nameText].filter(Boolean).join(" ").trim();
    const sponsored = /AdHolder|Sponsored Ad|s-sponsored-label/i.test(divOpening + after.slice(0, 2000));
    if (asin && title) results.push({ asin, title, sponsored });
  }
  const seen = new Set();
  return results.filter(r => { if (seen.has(r.asin)) return false; seen.add(r.asin); return true; });
}

function pickBest(results, brand) {
  const brandTokens = brand
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(t => t.length >= 3 && !["the", "and"].includes(t));
  const isMattress = (t) => /\bmattress(es)?\b/i.test(t);
  const isNotSingleOnly = (t) => !/\bsingle\b/i.test(t.toLowerCase()) || /\bdouble\b/i.test(t.toLowerCase());
  const matchesBrand = (t) => {
    const low = t.toLowerCase();
    return brandTokens.some(tok => low.includes(tok));
  };
  for (const r of results) {
    if (!r.sponsored && matchesBrand(r.title) && isMattress(r.title) && isNotSingleOnly(r.title))
      return { ...r, matchTier: "non-sponsored brand-match" };
  }
  for (const r of results) {
    if (matchesBrand(r.title) && isMattress(r.title) && isNotSingleOnly(r.title))
      return { ...r, matchTier: "any brand-match" };
  }
  for (const r of results) {
    if (matchesBrand(r.title) && isMattress(r.title))
      return { ...r, matchTier: "brand-match (size unverified)" };
  }
  return null;
}

const out = [];
for (let i = 0; i < products.length; i++) {
  const p = products[i];
  const searchUrl = `https://www.amazon.co.uk/s?k=${encodeURIComponent(p.searchHint)}`;
  process.stdout.write(`[${String(i + 1).padStart(2)}/${products.length}] ${p.id.padEnd(38)} `);
  try {
    const { html, status } = await fetchHtml(searchUrl);
    if (status !== 200) {
      console.log(`x HTTP ${status}`);
      out.push({ ...p, asin: null, error: `HTTP ${status}` });
      await new Promise(r => setTimeout(r, PACING_MS));
      continue;
    }
    const results = extractAllResults(html);
    const best = pickBest(results, p.brand);
    if (!best) {
      console.log(`x no brand match (${results.length} results)`);
      out.push({ ...p, asin: null, error: "no brand match", topThree: results.slice(0, 3) });
    } else {
      console.log(`+ ${best.asin}  [${best.matchTier}]  | ${best.title.slice(0, 60)}`);
      out.push({ ...p, asin: best.asin, title: best.title, matchTier: best.matchTier, sponsored: best.sponsored });
    }
  } catch (e) {
    console.log(`x ${e.message}`);
    out.push({ ...p, asin: null, error: e.message });
  }
  await new Promise(r => setTimeout(r, PACING_MS));
}

fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
const found = out.filter(r => r.asin).length;
console.log(`\n----- Summary -----`);
console.log(`Brand-matched ASIN found:  ${found}/${out.length}`);
console.log(`Output: ${outPath}`);
