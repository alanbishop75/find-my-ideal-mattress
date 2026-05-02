/**
 * config/mattress/buy-links.ts
 *
 * UK Amazon direct-ASIN buy-links for the mattress catalogue.
 *
 * Phase 5 (direct-link milestone, 2026-05-02):
 *   Every entry uses an Amazon UK direct ASIN URL of the form
 *     https://www.amazon.co.uk/dp/<ASIN>?tag=findmyidealmattress-21
 *   These URLs are Associates-compliant without needing SiteStripe.
 *
 * STATUS: All entries have isTemporary: false and source: 'manual'.
 *
 * BEFORE LIVE LAUNCH:
 * 1. Register the affiliate tag "findmyidealmattress-21" with Amazon Associates UK.
 * 2. Re-run scripts/validate-affiliate-links.mjs to confirm each ASIN still
 *    resolves on Amazon UK (ASINs occasionally get retired or rebranded).
 */
import type { BuyLinks } from "../../core/geo/types";
import type { Region } from "../../core/geo/types";

const REVIEW_DATE = "2026-05-02";
const UK_TAG = "findmyidealmattress-21";

export const mattressBuyLinks: Record<string, BuyLinks> = {
  "jayBe-truecore-hybrid-2000": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: `https://www.amazon.co.uk/dp/B0BX491JDR?tag=${UK_TAG}`,
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "manual",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  },
  "silentnight-7zone-memory-foam": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: `https://www.amazon.co.uk/dp/B008I1E374?tag=${UK_TAG}`,
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "manual",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  },
  "inofia-12in-hybrid": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: `https://www.amazon.co.uk/dp/B0F1X6LHK8?tag=${UK_TAG}`,
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "manual",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  },
  "zinus-8in-green-tea": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: `https://www.amazon.co.uk/dp/B0DHRWKR65?tag=${UK_TAG}`,
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "manual",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  },
  "vesgantti-10in-hybrid": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: `https://www.amazon.co.uk/dp/B072XLVL4S?tag=${UK_TAG}`,
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "manual",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  },
  "sweetnight-8in-memory-foam": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: `https://www.amazon.co.uk/dp/B08P9S1GFJ?tag=${UK_TAG}`,
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "manual",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  },
  "dormeo-essence-hybrid-classic": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: `https://www.amazon.co.uk/dp/B0F3X7T9HB?tag=${UK_TAG}`,
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "manual",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  },
  "silentnight-3zone-memory-foam": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: `https://www.amazon.co.uk/dp/B006MUTMF6?tag=${UK_TAG}`,
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "manual",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  },
  "bedstory-12in-hybrid": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: `https://www.amazon.co.uk/dp/B0FR9G29JY?tag=${UK_TAG}`,
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "manual",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  },
  "silentnight-1400-eco-comfort": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: `https://www.amazon.co.uk/dp/B00W4RQMTA?tag=${UK_TAG}`,
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "manual",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  },
  "emma-original-lite": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: `https://www.amazon.co.uk/dp/B0GSS36HF8?tag=${UK_TAG}`,
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "manual",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  },
  "nectar-hybrid-lite-20cm": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: `https://www.amazon.co.uk/dp/B0F8CK9GWF?tag=${UK_TAG}`,
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "manual",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  },
  "nectar-classic-hybrid-25cm": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: `https://www.amazon.co.uk/dp/B0GPR7JP8M?tag=${UK_TAG}`,
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "manual",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  },
  "otty-original-hybrid-2000": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: `https://www.amazon.co.uk/dp/B01HS66RM8?tag=${UK_TAG}`,
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "manual",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  },
  "sealy-steeple-ortho-plus": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: `https://www.amazon.co.uk/dp/B0BSR7P29W?tag=${UK_TAG}`,
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "manual",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  },
  "dormeo-octasmart-hybrid": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: `https://www.amazon.co.uk/dp/B09MR3FQK3?tag=${UK_TAG}`,
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "manual",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  },
  "silentnight-miracoil-ortho": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: `https://www.amazon.co.uk/dp/B00ATOGV9G?tag=${UK_TAG}`,
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "manual",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  },
  "simba-hybrid-pro": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        region: "UK",
        url: `https://www.amazon.co.uk/dp/B076PLV4Z7?tag=${UK_TAG}`,
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "manual",
        lastCheckedAt: REVIEW_DATE,
      },
    ],
    US: [],
  },
};

export function getRegionLinks(productId: string, region: Region) {
  const entry = mattressBuyLinks[productId];
  if (!entry) return [];
  return entry[region] ?? [];
}
