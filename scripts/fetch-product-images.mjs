/**
 * scripts/fetch-product-images.mjs
 *
 * Fetches the real product image URL from each Amazon UK /dp/ page and
 * patches config/mattress/products.ts with the direct m.media-amazon.com URL.
 *
 * Usage:  node scripts/fetch-product-images.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept-Language": "en-GB,en;q=0.9",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
};

// Extract productId → ASIN from buy-links.ts
const buyLinksPath = path.resolve(__dirname, "../config/mattress/buy-links.ts");
const buyLinksSource = fs.readFileSync(buyLinksPath, "utf8");
const re = /"([^"]+)":\s*affiliateLink\("[^"]+",\s*"([^"]+)"\)/g;
const asinMap = {};
let m;
while ((m = re.exec(buyLinksSource)) !== null) asinMap[m[1]] = m[2];

const entries = Object.entries(asinMap);
console.log(`\nFetching images for ${entries.length} products...\n`);

async function getImageUrl(asin) {
  const url = `https://www.amazon.co.uk/dp/${asin}`;
  const res = await fetch(url, {
    headers: HEADERS,
    signal: AbortSignal.timeout(12_000),
    redirect: "follow",
  });
  const html = await res.text();

  // Primary: landingImage data-old-hires (highest res, always present on dp pages)
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

const CONCURRENCY = 3;
const results = [];

for (let i = 0; i < entries.length; i += CONCURRENCY) {
  const batch = entries.slice(i, i + CONCURRENCY);
  const batchResults = await Promise.all(
    batch.map(async ([productId, asin]) => {
      try {
        const imgUrl = await getImageUrl(asin);
        const status = imgUrl ? "✓" : "✗ not found";
        console.log(`  ${status}  ${productId} (${asin})${imgUrl ? "" : " — will keep existing"}`);
        return { productId, asin, imgUrl };
      } catch (e) {
        console.log(`  ✗  ${productId} (${asin}) — ${e.message}`);
        return { productId, asin, imgUrl: null };
      }
    })
  );
  results.push(...batchResults);
  if (i + CONCURRENCY < entries.length) await new Promise(r => setTimeout(r, 1000));
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
console.log(`\nDone: ${updated} image URLs written to products.ts.\n`);
