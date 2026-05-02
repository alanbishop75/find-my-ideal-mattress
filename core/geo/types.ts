/** Active display region — UK or US. Anything else normalises to UK as fallback. */
export type Region = "UK" | "US";

/** How a buy link was introduced into the system. */
export type LinkSource =
  | "existing"   // Carried over from the previous amazonAffiliateUrl field
  | "imported"   // Bulk-imported from a spreadsheet / external source
  | "manual"     // Hand-entered by an admin
  | "sitestripe" // Amazon SiteStripe-tagged affiliate URL
  | "temporary"  // Placeholder entered while waiting for a real URL
  | "generated"; // Auto-generated search/category link — must be replaced before going fully live

/**
 * A single retailer buy-link for one region.
 *
 * Required fields are enough to render a working button.
 * Optional fields (affiliateNetwork, trackingMarker, etc.) are reserved
 * for the affiliate-network integration pass and should not be populated
 * until real IDs are available.
 */
export interface BuyLink {
  /** Stable machine key — never changes once set (used in analytics events). */
  retailerKey: string;
  /** Human-readable retailer name shown on buttons. */
  retailerName: string;
  /** Display region this link belongs to. */
  region: Region;
  /** Fully-qualified buy/search URL. */
  url: string;
  /** Expected domain — used for audit/validation (e.g. "amazon.co.uk"). */
  expectedDomain: string;
  /**
   * True when this URL is a search/category placeholder rather than a
   * direct product page.  Generated links are ALWAYS temporary.
   */
  isTemporary: boolean;
  /** Provenance of this link entry. */
  source: LinkSource;
  /** Optional human-readable note (e.g. "ASIN verified Apr 2026"). */
  notes?: string;

  // ── Future-ready fields (populate during affiliate-network integration) ──
  /** e.g. "amazon-associates", "awin" */
  affiliateNetwork?: string;
  /** Affiliate tag / partner ID — do NOT populate until you have a real ID. */
  trackingMarker?: string;
  /** ISO date of last automated health-check. */
  lastCheckedAt?: string;
  /** Result of last health-check, e.g. "ok", "404", "redirect". */
  lastCheckStatus?: string;
  /** Last observed price (informational only). */
  priceObserved?: string;
  /** Mark one link per region as the primary/recommended retailer. */
  isPrimary?: boolean;
}

/** All buy links for a single product, split by display region. */
export interface BuyLinks {
  UK: BuyLink[];
  US: BuyLink[];
}
