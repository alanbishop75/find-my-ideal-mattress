/**
 * scripts/rebuild-catalogue.mjs
 *
 * Phase 5 rebuild: replace products.ts and buy-links.ts with the verified
 * Amazon-UK catalogue (18 SKUs with direct ASIN affiliate links).
 *
 * Source of truth = verified entries below (curated from
 * scripts/asin-candidates.json after manual review).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const REVIEW_DATE = "2026-05-02";
const UK_TAG = "findmyidealmattress-21";

/**
 * Verified catalogue entries. Each has an Amazon UK ASIN that has been
 * confirmed via the research-asins.mjs scrape (non-sponsored brand-match)
 * and a sanity check of the title against the brand+product type.
 *
 * Pricing: rrp values are the Double-size Amazon UK ballpark. rrpUs values
 * are placeholder USD for future US-market expansion (not yet active).
 */
const PRODUCTS = [
  // ───────── BUDGET (rrp < £250) ─────────
  {
    id: "jayBe-truecore-hybrid-2000",
    brand: "Jay-Be",
    name: "Truecore Hybrid 2000 Mattress",
    description:
      "A Made-in-the-UK 23cm hybrid with 2,000 e-pocket springs and a foam comfort layer. Sustainable construction and a medium feel make it an easy budget pick for back and combination sleepers of average weight.",
    rrp: 299, rrpUs: 379,
    asin: "B0BX491JDR",
    attrs: {
      sleepPosition: "any", firmness: "medium", construction: "hybrid",
      cooling: false, hypoallergenic: true, edgeSupport: "standard",
      motionIsolation: "good", weightClass: "average", backSupport: "standard",
      priceTier: "budget",
    },
  },
  {
    id: "silentnight-7zone-memory-foam",
    brand: "Silentnight",
    name: "7 Zone Memory Foam Rolled Mattress",
    description:
      "Seven targeted pressure zones wrapped in hypoallergenic memory foam. Made in the UK and rolled for delivery, with a medium-firm feel that contours to the body and isolates motion well — a strong budget pick for solo side and back sleepers.",
    rrp: 199, rrpUs: 249,
    asin: "B008I1E374",
    attrs: {
      sleepPosition: "side", firmness: "medium-firm", construction: "memory-foam",
      cooling: false, hypoallergenic: true, edgeSupport: "none",
      motionIsolation: "excellent", weightClass: "average", backSupport: "standard",
      priceTier: "budget",
    },
  },
  {
    id: "inofia-12in-hybrid",
    brand: "Inofia",
    name: "12 Inch Aeroshield Hybrid Mattress",
    description:
      "A 30cm hybrid with Inofia's Aeroshield memory foam comfort layer over NexusArc pocket springs. Breathable cover and balanced medium feel — solid value for couples or single sleepers wanting hybrid support without premium pricing.",
    rrp: 219, rrpUs: 279,
    asin: "B0F1X6LHK8",
    attrs: {
      sleepPosition: "any", firmness: "medium", construction: "hybrid",
      cooling: false, hypoallergenic: true, edgeSupport: "standard",
      motionIsolation: "good", weightClass: "average", backSupport: "standard",
      priceTier: "budget",
    },
  },
  {
    id: "zinus-8in-green-tea",
    brand: "Zinus",
    name: "8 Inch Green Tea Memory Foam Mattress",
    description:
      "Memory foam infused with green tea extract and active charcoal to keep the foam fresher for longer. A compact 8-inch profile suits light sleepers and lower bed frames. OEKO-TEX certified and strongly hypoallergenic.",
    rrp: 169, rrpUs: 209,
    asin: "B0DHRWKR65",
    attrs: {
      sleepPosition: "side", firmness: "medium-firm", construction: "memory-foam",
      cooling: false, hypoallergenic: true, edgeSupport: "none",
      motionIsolation: "excellent", weightClass: "light", backSupport: "standard",
      priceTier: "budget",
    },
  },
  {
    id: "vesgantti-10in-hybrid",
    brand: "Vesgantti",
    name: "10.3 Inch Multilayer Hybrid Mattress",
    description:
      "A value hybrid with a Euro box-top comfort layer over individually pocketed springs. The multilayer build provides decent pressure relief and more support than budget all-foam options. Medium-firm feel suits average-weight sleepers.",
    rrp: 199, rrpUs: 249,
    asin: "B072XLVL4S",
    attrs: {
      sleepPosition: "any", firmness: "medium-firm", construction: "hybrid",
      cooling: false, hypoallergenic: true, edgeSupport: "standard",
      motionIsolation: "good", weightClass: "average", backSupport: "standard",
      priceTier: "budget",
    },
  },
  {
    id: "sweetnight-8in-memory-foam",
    brand: "Sweetnight",
    name: "8 Inch Memory Foam Sprung Mattress",
    description:
      "An 8-inch memory-foam-and-spring hybrid with a gel-infused comfort layer for light cooling. Low-profile, hypoallergenic, and built for solo sleepers in tighter spaces or guest rooms.",
    rrp: 159, rrpUs: 199,
    asin: "B08P9S1GFJ",
    attrs: {
      sleepPosition: "side", firmness: "medium-soft", construction: "hybrid",
      cooling: true, hypoallergenic: true, edgeSupport: "standard",
      motionIsolation: "good", weightClass: "light", backSupport: "standard",
      priceTier: "budget",
    },
  },
  {
    id: "dormeo-essence-hybrid-classic",
    brand: "Dormeo",
    name: "Essence Hybrid Classic Foam Mattress",
    description:
      "Dormeo's Essence Hybrid Classic combines breathable foam layers with a supportive base. Balanced medium feel for combination sleepers who want temperature-aware foam without crossing into mid-tier pricing.",
    rrp: 229, rrpUs: 289,
    asin: "B0F3X7T9HB",
    attrs: {
      sleepPosition: "any", firmness: "medium", construction: "hybrid",
      cooling: true, hypoallergenic: true, edgeSupport: "standard",
      motionIsolation: "good", weightClass: "average", backSupport: "standard",
      priceTier: "budget",
    },
  },

  // ───────── MID (£249–£599) ─────────
  {
    id: "silentnight-3zone-memory-foam",
    brand: "Silentnight",
    name: "3 Zone Memory Foam Rolled Mattress",
    description:
      "Three targeted comfort zones in UK-made hypoallergenic memory foam. Slightly softer feel than the 7-zone variant, suiting side sleepers who want pressure relief at the shoulders and hips at a mid-budget price.",
    rrp: 269, rrpUs: 339,
    asin: "B006MUTMF6",
    attrs: {
      sleepPosition: "side", firmness: "medium", construction: "memory-foam",
      cooling: false, hypoallergenic: true, edgeSupport: "none",
      motionIsolation: "excellent", weightClass: "average", backSupport: "standard",
      priceTier: "mid",
    },
  },
  {
    id: "bedstory-12in-hybrid",
    brand: "BedStory",
    name: "12 Inch Hybrid Pocket Spring Mattress",
    description:
      "A deep 30cm hybrid from BedStory with a Euro pillow top, gel-infused memory foam, and 1,000 pocket springs. Good lumbar support for heavier sleepers at a competitive mid-market price.",
    rrp: 269, rrpUs: 339,
    asin: "B0FR9G29JY",
    attrs: {
      sleepPosition: "back", firmness: "medium-firm", construction: "hybrid",
      cooling: false, hypoallergenic: true, edgeSupport: "reinforced",
      motionIsolation: "good", weightClass: "heavy", backSupport: "enhanced",
      priceTier: "mid",
    },
  },
  {
    id: "silentnight-1400-eco-comfort",
    brand: "Silentnight",
    name: "1400 Eco Comfort Mattress (Firm)",
    description:
      "Silentnight's 1400-count Eco Comfort uses recycled fibres and a firm pocket-spring core for solid back-support. No foam comfort layer keeps it breathable — a good choice for heavier back sleepers wanting traditional UK pocket-spring feel.",
    rrp: 349, rrpUs: 449,
    asin: "B00W4RQMTA",
    attrs: {
      sleepPosition: "back", firmness: "firm", construction: "pocket-spring",
      cooling: false, hypoallergenic: false, edgeSupport: "standard",
      motionIsolation: "poor", weightClass: "heavy", backSupport: "enhanced",
      priceTier: "mid",
    },
  },
  {
    id: "emma-original-lite",
    brand: "Emma",
    name: "Original Lite Mattress",
    description:
      "Emma's Original Lite — a 22cm all-foam mattress with the brand's signature Airgocell open-cell foam and a cold-process memory foam comfort layer. Responsive yet pressure-relieving feel suiting combination sleepers of average weight.",
    rrp: 379, rrpUs: 479,
    asin: "B0GSS36HF8",
    attrs: {
      sleepPosition: "combination", firmness: "medium", construction: "memory-foam",
      cooling: false, hypoallergenic: true, edgeSupport: "standard",
      motionIsolation: "excellent", weightClass: "average", backSupport: "standard",
      priceTier: "mid",
    },
  },
  {
    id: "nectar-hybrid-lite-20cm",
    brand: "Nectar",
    name: "Hybrid Lite 20cm Mattress",
    description:
      "Nectar's entry hybrid: 20cm of memory foam comfort over a supportive spring base. Balanced medium feel and a classic Nectar long trial period — accessible mid-tier comfort for solo sleepers and couples on a budget.",
    rrp: 329, rrpUs: 419,
    asin: "B0F8CK9GWF",
    attrs: {
      sleepPosition: "any", firmness: "medium", construction: "hybrid",
      cooling: false, hypoallergenic: true, edgeSupport: "standard",
      motionIsolation: "good", weightClass: "average", backSupport: "standard",
      priceTier: "mid",
    },
  },
  {
    id: "nectar-classic-hybrid-25cm",
    brand: "Nectar",
    name: "Classic Hybrid 25cm Mattress",
    description:
      "Nectar's Classic Hybrid pairs cooling memory foam with individually pocketed springs in a 25cm profile. Medium-firm feel with reinforced edges — well-suited to couples and back sleepers who want zoned support and good motion isolation.",
    rrp: 449, rrpUs: 569,
    asin: "B0GPR7JP8M",
    attrs: {
      sleepPosition: "back", firmness: "medium-firm", construction: "hybrid",
      cooling: true, hypoallergenic: true, edgeSupport: "reinforced",
      motionIsolation: "good", weightClass: "average", backSupport: "enhanced",
      priceTier: "mid",
    },
  },
  {
    id: "otty-original-hybrid-2000",
    brand: "Otty",
    name: "Original UK Hybrid 2000 Mattress",
    description:
      "Award-winning UK hybrid with a cooling gel-foam comfort layer, bamboo-charcoal memory foam, and up to 2,000 individually pocketed micro-springs. The cooling gel and open-cell construction make it one of the best temperature-regulating hybrids in the mid tier.",
    rrp: 499, rrpUs: 629,
    asin: "B01HS66RM8",
    attrs: {
      sleepPosition: "any", firmness: "medium", construction: "hybrid",
      cooling: true, hypoallergenic: true, edgeSupport: "standard",
      motionIsolation: "good", weightClass: "any", backSupport: "enhanced",
      priceTier: "mid",
    },
  },
  {
    id: "sealy-steeple-ortho-plus",
    brand: "Sealy",
    name: "Steeple Ortho Plus Mattress",
    description:
      "Sealy's orthopaedic-grade pocket spring system in their Steeple range, with a firm surface designed to support the lumbar spine. No foam comfort layers keeps it breathable — ideal for heavy back sleepers and anyone with lower-back issues who needs ortho-firm support.",
    rrp: 449, rrpUs: 569,
    asin: "B0BSR7P29W",
    attrs: {
      sleepPosition: "back", firmness: "firm", construction: "pocket-spring",
      cooling: false, hypoallergenic: false, edgeSupport: "reinforced",
      motionIsolation: "poor", weightClass: "heavy", backSupport: "ortho",
      priceTier: "mid",
    },
  },

  // ───────── PREMIUM (£599+) ─────────
  {
    id: "dormeo-octasmart-hybrid",
    brand: "Dormeo",
    name: "Octasmart Hybrid Mattress",
    description:
      "Dormeo's Octasmart Hybrid combines patented Octaspring foam-spring technology with Aerocell foam and a pocket-spring base. Excellent airflow and zoned support — a premium pick for hot sleepers who want responsive feel without traditional metal-spring noise.",
    rrp: 649, rrpUs: 829,
    asin: "B09MR3FQK3",
    attrs: {
      sleepPosition: "any", firmness: "medium", construction: "hybrid",
      cooling: true, hypoallergenic: true, edgeSupport: "standard",
      motionIsolation: "excellent", weightClass: "any", backSupport: "enhanced",
      priceTier: "premium",
    },
  },
  {
    id: "silentnight-miracoil-ortho",
    brand: "Silentnight",
    name: "Miracoil Ortho Extra Firm Mattress",
    description:
      "Silentnight's Miracoil continuous-coil spring system runs vertically rather than in a grid, providing edge-to-edge support and zero partner disturbance. The Ortho variant has an extra-firm feel suiting heavier back sleepers and anyone with lower-back complaints.",
    rrp: 599, rrpUs: 759,
    asin: "B00ATOGV9G",
    attrs: {
      sleepPosition: "back", firmness: "firm", construction: "hybrid",
      cooling: false, hypoallergenic: false, edgeSupport: "reinforced",
      motionIsolation: "good", weightClass: "heavy", backSupport: "ortho",
      priceTier: "premium",
    },
  },
  {
    id: "simba-hybrid-pro",
    brand: "Simba",
    name: "Hybrid Pro Mattress 28cm",
    description:
      "Simba's flagship 28cm hybrid: graphite-infused Simbatex cooling foam, open-cell memory foam, and up to 5,000 individually pocketed titanium-alloy aerocoil springs. The highest spring count in the range delivers exceptional zone support, near-zero motion transfer, and active heat dissipation.",
    rrp: 1099, rrpUs: 1399,
    asin: "B076PLV4Z7",
    attrs: {
      sleepPosition: "any", firmness: "medium", construction: "hybrid",
      cooling: true, hypoallergenic: true, edgeSupport: "reinforced",
      motionIsolation: "excellent", weightClass: "any", backSupport: "enhanced",
      priceTier: "premium",
    },
  },
];

// Sanity: no duplicate IDs, no duplicate ASINs
const ids = new Set(), asins = new Set();
for (const p of PRODUCTS) {
  if (ids.has(p.id)) throw new Error(`duplicate id: ${p.id}`);
  if (asins.has(p.asin)) throw new Error(`duplicate ASIN: ${p.asin} (${p.id})`);
  ids.add(p.id); asins.add(p.asin);
}
console.log(`Catalogue size: ${PRODUCTS.length} products, ${asins.size} unique ASINs.`);

// ─── Generate products.ts ─────────────────────────────────────────────────

function renderProduct(p) {
  const a = p.attrs;
  return `  {
    id: "${p.id}",
    brand: ${JSON.stringify(p.brand)},
    name: ${JSON.stringify(p.name)},
    description:
      ${JSON.stringify(p.description)},
    imageUrl: "/placeholder.png",
    rrp: ${p.rrp},
    rrpUs: ${p.rrpUs},
    attributes: {
      sleepPosition: ${JSON.stringify(a.sleepPosition)},
      firmness: ${JSON.stringify(a.firmness)},
      construction: ${JSON.stringify(a.construction)},
      cooling: ${a.cooling},
      hypoallergenic: ${a.hypoallergenic},
      edgeSupport: ${JSON.stringify(a.edgeSupport)},
      motionIsolation: ${JSON.stringify(a.motionIsolation)},
      weightClass: ${JSON.stringify(a.weightClass)},
      backSupport: ${JSON.stringify(a.backSupport)},
      priceTier: ${JSON.stringify(a.priceTier)},
      rrp: ${p.rrp},
      rrpUs: ${p.rrpUs},
      availability: "uk",
    },
    ukAmazonVerification: ukVerified("${p.asin}"),
  },`;
}

const productsTs = `/**
 * config/mattress/products.ts
 *
 * Mattress product catalogue — UK market, Double size baseline.
 *
 * Catalogue rebuilt ${REVIEW_DATE} (mattress-v1.1, Phase 5 direct-link milestone).
 * All ${PRODUCTS.length} entries point to a verified Amazon UK ASIN with the affiliate
 * tag "${UK_TAG}". Source ASINs were validated via
 * scripts/research-asins.mjs (non-sponsored brand-match) and curated.
 *
 * Earlier iterations of this catalogue contained 30 SKUs, but DTC-only brands
 * (Hypnia, MLily, Eve, Hyde&Sleep, Tempur mattresses, Panda mattresses) do
 * not sell on Amazon UK. Those entries were removed rather than mislink to
 * unrelated products.
 *
 * Attribute key reference (used by the scoring engine):
 *
 *  sleepPosition  'side' | 'back' | 'stomach' | 'combination' | 'any'
 *  firmness       'soft' | 'medium-soft' | 'medium' | 'medium-firm' | 'firm'
 *  construction   'memory-foam' | 'pocket-spring' | 'hybrid' | 'latex' | 'open-coil'
 *  cooling        boolean — true if product has active cooling layer/technology
 *  hypoallergenic boolean — true if safe for dust-mite/allergy sufferers
 *  edgeSupport    'none' | 'standard' | 'reinforced'
 *  motionIsolation 'poor' | 'good' | 'excellent'
 *  weightClass    'light' | 'average' | 'heavy' | 'any'
 *  backSupport    'standard' | 'enhanced' | 'ortho'
 *  priceTier      'budget' | 'mid' | 'premium'
 *  rrp            UK RRP in GBP (Double size)
 *  rrpUs          US RRP in USD (Queen size, for future US market)
 *  availability   'uk' | 'us' | 'both'
 */
import type { Product } from "../../core/types";

const REVIEW_DATE = "${REVIEW_DATE}";

function ukVerified(asin: string) {
  return {
    status: "AMAZON_UK_VERIFIED_EXACT" as const,
    notes:
      \`Verified on Amazon UK via scripts/research-asins.mjs (non-sponsored brand-match). ASIN: \${asin}.\`,
    amazonUkCandidateUrl: \`https://www.amazon.co.uk/dp/\${asin}\`,
    lastReviewed: REVIEW_DATE,
  };
}

export const products: Product[] = [
${PRODUCTS.map(renderProduct).join("\n\n")}
];
`;

const productsPath = path.join(ROOT, "config/mattress/products.ts");
fs.writeFileSync(productsPath, productsTs, "utf8");
console.log(`Wrote ${productsPath} (${productsTs.length} bytes)`);

// ─── Generate buy-links.ts ────────────────────────────────────────────────

function renderBuyLinks(p) {
  return `  "${p.id}": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: \`https://www.amazon.co.uk/dp/${p.asin}?tag=\${UK_TAG}\`,
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "manual",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  },`;
}

const buyLinksTs = `/**
 * config/mattress/buy-links.ts
 *
 * UK Amazon direct-ASIN buy-links for the mattress catalogue.
 *
 * Phase 5 (direct-link milestone, ${REVIEW_DATE}):
 *   Every entry uses an Amazon UK direct ASIN URL of the form
 *     https://www.amazon.co.uk/dp/<ASIN>?tag=${UK_TAG}
 *   These URLs are Associates-compliant without needing SiteStripe.
 *
 * STATUS: All entries have isTemporary: false and source: 'manual'.
 *
 * BEFORE LIVE LAUNCH:
 * 1. Register the affiliate tag "${UK_TAG}" with Amazon Associates UK.
 * 2. Re-run scripts/validate-affiliate-links.mjs to confirm each ASIN still
 *    resolves on Amazon UK (ASINs occasionally get retired or rebranded).
 */
import type { BuyLinks } from "../../core/geo/types";
import type { Region } from "../../core/geo/types";

const REVIEW_DATE = "${REVIEW_DATE}";
const UK_TAG = "${UK_TAG}";

export const mattressBuyLinks: Record<string, BuyLinks> = {
${PRODUCTS.map(renderBuyLinks).join("\n")}
};

export function getRegionLinks(productId: string, region: Region) {
  const entry = mattressBuyLinks[productId];
  if (!entry) return [];
  return entry[region] ?? [];
}
`;

const buyLinksPath = path.join(ROOT, "config/mattress/buy-links.ts");
fs.writeFileSync(buyLinksPath, buyLinksTs, "utf8");
console.log(`Wrote ${buyLinksPath} (${buyLinksTs.length} bytes)`);

console.log("\nDone. Run: npx tsc --noEmit && npm test");
