/**
 * config/mattress/buy-links.ts
 *
 * UK Amazon buy-links for the mattress catalogue.
 *
 * PHASE 1 — All links are Amazon UK search URLs (isTemporary: true).
 * The search URLs resolve to the correct product listing in most cases
 * but do not contain a tracking tag.
 *
 * BEFORE LAUNCH:
 * 1. Run scripts/validate-affiliate-links.mjs to verify each search URL
 *    resolves to the correct product.
 * 2. Register https://affiliate-program.amazon.co.uk with tag
 *    findmyidealmattress-21.
 * 3. Use SiteStripe on each product page to generate a tagged deep link.
 * 4. Replace the search URL with the SiteStripe URL.
 * 5. Set isTemporary: false and source: 'manual'.
 *
 * No buy buttons are shown to users while isTemporary is true — the admin
 * panel shows these as "pending verification".
 */
import type { BuyLinks } from "../../core/geo/types";

const REVIEW_DATE = "2026-05-02";
const UK_TAG = "findmyidealmattress-21"; // register this before launch

function searchLink(productId: string, searchTerms: string): BuyLinks {
  const encoded = encodeURIComponent(searchTerms);
  return {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: `https://www.amazon.co.uk/s?k=${encoded}&tag=${UK_TAG}`,
        expectedDomain: "amazon.co.uk",
        isTemporary: true,
        source: "generated",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  };
}

export const mattressBuyLinks: Record<string, BuyLinks> = {
  "jayBe-slumber-pocket": searchLink(
    "jayBe-slumber-pocket",
    "Jay-Be Slumber Pocket Spring Double Mattress"
  ),
  "silentnight-7zone-memory-foam": searchLink(
    "silentnight-7zone-memory-foam",
    "Silentnight 7 Zone Memory Foam Double Mattress"
  ),
  "inofia-25cm-hybrid": searchLink(
    "inofia-25cm-hybrid",
    "inofia 25cm 1000 Pocket Spring Hybrid Double Mattress"
  ),
  "zinus-15cm-green-tea": searchLink(
    "zinus-15cm-green-tea",
    "Zinus 15cm Green Tea Memory Foam Double Mattress"
  ),
  "vesgantti-11inch-hybrid": searchLink(
    "vesgantti-11inch-hybrid",
    "Vesgantti 11 Inch Multilayer Hybrid Double Mattress"
  ),
  "sweetnight-10inch-hybrid": searchLink(
    "sweetnight-10inch-hybrid",
    "Sweetnight 10 Inch Hybrid Gel Memory Foam Double Mattress"
  ),
  "dormeo-options-hybrid": searchLink(
    "dormeo-options-hybrid",
    "Dormeo Options Hybrid Double Mattress"
  ),
  "silentnight-miracoil-3": searchLink(
    "silentnight-miracoil-3",
    "Silentnight Miracoil 3 Spring Memory Foam Double Mattress"
  ),
  "simba-hybrid-original": searchLink(
    "simba-hybrid-original",
    "Simba Hybrid Original Double Mattress"
  ),
  "emma-original": searchLink(
    "emma-original",
    "Emma Original Double Mattress"
  ),
  "nectar-smart-hybrid": searchLink(
    "nectar-smart-hybrid",
    "Nectar Smart Hybrid Double Mattress"
  ),
  "hyde-sleep-purple-hybrid": searchLink(
    "hyde-sleep-purple-hybrid",
    "Hyde Sleep Purple Hybrid Double Mattress"
  ),
  "otty-hybrid": searchLink(
    "otty-hybrid",
    "Otty Hybrid Double Mattress"
  ),
  "panda-hybrid-bamboo": searchLink(
    "panda-hybrid-bamboo",
    "Panda Hybrid Bamboo Double Mattress"
  ),
  "bedstory-12inch-hybrid": searchLink(
    "bedstory-12inch-hybrid",
    "BedStory 12 Inch Hybrid Pocket Spring Double Mattress"
  ),
  "silentnight-studio-luxury": searchLink(
    "silentnight-studio-luxury",
    "Silentnight Studio Collection Luxury Pocket Spring Double Mattress"
  ),
  "sealy-ortho-posture": searchLink(
    "sealy-ortho-posture",
    "Sealy Ortho Posture Pocket Spring Double Mattress"
  ),
  "hypnia-supreme-hybrid": searchLink(
    "hypnia-supreme-hybrid",
    "Hypnia Supreme Hybrid Double Mattress"
  ),
  "eve-original": searchLink(
    "eve-original",
    "eve Original Hybrid Double Mattress"
  ),
  "mlily-harmony-plus": searchLink(
    "mlily-harmony-plus",
    "Mlily Harmony Plus Hybrid Double Mattress"
  ),
  "simba-hybrid-pro": searchLink(
    "simba-hybrid-pro",
    "Simba Hybrid Pro Double Mattress"
  ),
  "emma-hybrid-premium": searchLink(
    "emma-hybrid-premium",
    "Emma Hybrid Premium Double Mattress"
  ),
  "emma-luxe-cooling": searchLink(
    "emma-luxe-cooling",
    "Emma Luxe Cooling Double Mattress"
  ),
  "tempur-cloud": searchLink(
    "tempur-cloud",
    "Tempur Cloud Double Mattress"
  ),
  "tempur-sensation-elite": searchLink(
    "tempur-sensation-elite",
    "Tempur Sensation Elite Double Mattress"
  ),
  "dormeo-octaspring-body-zone": searchLink(
    "dormeo-octaspring-body-zone",
    "Dormeo Octaspring Body Zone Double Mattress"
  ),
  "silentnight-octaspring": searchLink(
    "silentnight-octaspring",
    "Silentnight Octaspring Active Plus Double Mattress"
  ),
  "hypnia-elite-hybrid": searchLink(
    "hypnia-elite-hybrid",
    "Hypnia Elite Hybrid Double Mattress"
  ),
  "sealy-posturepedic-silver": searchLink(
    "sealy-posturepedic-silver",
    "Sealy Posturepedic Silver Collection Double Mattress"
  ),
  "silentnight-miracoil-7": searchLink(
    "silentnight-miracoil-7",
    "Silentnight Miracoil 7 Spring Memory Foam Double Mattress"
  ),
};

/**
 * Returns the buy-links for a given product and region.
 * Returns an empty array if the product has no links for the region.
 */
export function getRegionLinks(
  productId: string,
  region: "UK" | "US"
): import("../../core/geo/types").BuyLink[] {
  return mattressBuyLinks[productId]?.[region] ?? [];
}
