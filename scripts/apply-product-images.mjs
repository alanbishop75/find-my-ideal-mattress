/**
 * scripts/apply-product-images.mjs
 *
 * Replaces imageUrl: "/images/placeholder.png" in config/mattress/products.ts
 * with official Amazon Associates image widget URLs for each product.
 *
 * Uses the Associates image widget (ws-eu.amazon-adsystem.com) — this is the
 * official affiliate-compliant image source, identical to what SiteStripe's
 * "Image" link type generates. No scraping, no hosting required.
 *
 * Usage:  node scripts/apply-product-images.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSOCIATE_TAG = "findmyidealmattress-21";
const IMAGE_SIZE = "SL300"; // SL160 / SL200 / SL250 / SL300 / SL500

function imageUrl(asin) {
  return (
    `https://ws-eu.amazon-adsystem.com/widgets/q` +
    `?_encoding=UTF8` +
    `&ASIN=${asin}` +
    `&ServiceVersion=20070822` +
    `&ID=AsinImage` +
    `&WS=1` +
    `&Format=${IMAGE_SIZE}` +
    `&marketplace=amazon` +
    `&tag=${ASSOCIATE_TAG}`
  );
}

// ── Extract productId → ASIN from buy-links.ts ───────────────────────────────
const buyLinksPath = path.resolve(__dirname, "../config/mattress/buy-links.ts");
const buyLinksSource = fs.readFileSync(buyLinksPath, "utf8");

// Match affiliateLink("url", "ASIN") entries
const re = /"([^"]+)":\s*affiliateLink\("[^"]+",\s*"([^"]+)"\)/g;
const asinMap = {}; // productId → ASIN
let m;
while ((m = re.exec(buyLinksSource)) !== null) {
  asinMap[m[1]] = m[2];
}

const productCount = Object.keys(asinMap).length;
if (productCount === 0) {
  console.error("No affiliateLink entries found in buy-links.ts — nothing to do.");
  process.exit(1);
}
console.log(`Found ${productCount} products in buy-links.ts.\n`);

// ── Patch products.ts ────────────────────────────────────────────────────────
const productsPath = path.resolve(__dirname, "../config/mattress/products.ts");
let source = fs.readFileSync(productsPath, "utf8");

let replaced = 0;
let skipped = 0;

for (const [productId, asin] of Object.entries(asinMap)) {
  const escapedId = productId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Match the product block: id: "product-id", ... imageUrl: "...",
  // Replace only the imageUrl line within that product's block
  // Strategy: find `id: "product-id"` and replace the next imageUrl line
  const blockRe = new RegExp(
    `(id:\\s*"${escapedId}"[\\s\\S]{0,300}?imageUrl:\\s*)"([^"]*)"`,
    "m"
  );

  if (!blockRe.test(source)) {
    console.warn(`  SKIP — could not locate imageUrl for "${productId}"`);
    skipped++;
    continue;
  }

  const newUrl = imageUrl(asin);
  source = source.replace(blockRe, `$1"${newUrl}"`);
  console.log(`  ✓ ${productId} (${asin})`);
  replaced++;
}

fs.writeFileSync(productsPath, source, "utf8");

console.log(`\nDone: ${replaced} updated, ${skipped} skipped.`);
