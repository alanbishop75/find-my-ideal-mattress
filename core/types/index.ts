
import type { BuyLinks } from '../geo/types';
export * from './result-card';

// ── UK Amazon Verification ────────────────────────────────────────────────────

/**
 * Strict verification status for UK Amazon affiliate readiness.
 *
 * Only AMAZON_UK_VERIFIED_EXACT may show a buy button to users.
 * MANUFACTURER_VERIFIED_NEEDS_AMAZON_MATCH means the product is real but the
 * exact Amazon UK listing has not been confirmed yet.
 * REMOVE_FROM_CATALOGUE means the product cannot be matched to Amazon UK and
 * must be excluded from live recommendations.
 */
export type UKAmazonVerificationStatus =
  | "AMAZON_UK_VERIFIED_EXACT"
  | "MANUFACTURER_VERIFIED_NEEDS_AMAZON_MATCH"
  | "NEEDS_MANUAL_REVIEW"
  | "NOT_FOUND"
  | "WRONG_PRODUCT_REMOVE"
  | "VARIANT_UNCLEAR"
  | "REMOVE_FROM_CATALOGUE";

export interface UKAmazonVerification {
  status: UKAmazonVerificationStatus;
  /** Human-readable explanation of the current status. */
  notes: string;
  /**
   * Candidate Amazon.co.uk product URL (untagged, not SiteStripe-verified).
   * Present only when a candidate ASIN/URL has been identified but not yet
   * manually confirmed correct.
   */
  amazonUkCandidateUrl?: string;
  /** Manufacturer website URL confirming this product is real and correctly specified. */
  manufacturerUrl?: string;
  /** Suggested search query to find this product on Amazon UK. */
  amazonSearchHint?: string;
  /** ISO date of last manual review (YYYY-MM-DD). */
  lastReviewed?: string;
}

// ── US Amazon Verification ────────────────────────────────────────────────────

/**
 * Strict verification status for US Amazon affiliate readiness.
 * Mirrors UKAmazonVerificationStatus.
 *
 * Only AMAZON_US_VERIFIED_EXACT may show a buy button to users.
 */
export type USAmazonVerificationStatus =
  | "AMAZON_US_VERIFIED_EXACT"
  | "MANUFACTURER_VERIFIED_NEEDS_AMAZON_MATCH"
  | "NEEDS_MANUAL_REVIEW"
  | "NOT_FOUND"
  | "WRONG_PRODUCT_REMOVE"
  | "VARIANT_UNCLEAR"
  | "REMOVE_FROM_CATALOGUE";

export interface USAmazonVerification {
  status: USAmazonVerificationStatus;
  /** Human-readable explanation of the current status. */
  notes: string;
  /** Candidate Amazon.com product URL. */
  amazonUsCandidateUrl?: string;
  /** Manufacturer website URL confirming this product is real and correctly specified. */
  manufacturerUrl?: string;
  /** Suggested search query to find this product on Amazon US. */
  amazonSearchHint?: string;
  /** ISO date of last manual review (YYYY-MM-DD). */
  lastReviewed?: string;
}

export type Product = {
  id: string;
  name: string;
  brand: string;
  /** Human-readable description used on results cards. */
  description?: string;
  attributes: Record<string, string | number | boolean>;
  imageUrl: string;
  /**
   * @deprecated Use `buyLinks.UK[amazonKey]` instead.
   * Retained for backward-compat while the migration to buyLinks is in progress.
   */
  amazonAffiliateUrl?: string;
  /** @deprecated Use `buyLinks` instead. Retained for backward-compat. */
  affiliateLinks?: { label: string; url: string }[];
  /** Region-aware buy links — the authoritative source for retailer CTAs. */
  buyLinks?: BuyLinks;
  /** Retail price in GBP (UK market). */
  rrp?: number;
  /** Retail price in USD (US market). */
  rrpUs?: number;
  /**
   * UK Amazon affiliate verification status.
   * Only AMAZON_UK_VERIFIED_EXACT products may show a buy button to users.
   * REMOVE_FROM_CATALOGUE products must be excluded from recommendations.
   */
  ukAmazonVerification?: UKAmazonVerification;
  /**
   * US Amazon affiliate verification status.
   * Only AMAZON_US_VERIFIED_EXACT products may show a buy button to users.
   */
  usAmazonVerification?: USAmazonVerification;
};

export type AnswerOption = {
  id: string;
  label: string;
};

export type Question = {
  id: string;
  text: string;
  options: AnswerOption[];
  type?: string;
  condition?: (answers: Record<string, string>) => boolean;
  helpText?: string;
  branch?: {
    dependsOn: string;
    values: string[];
  };
};

export type Questionnaire = {
  id: string;
  version: string;
  title: string;
  questions: Question[];
};

export type RecommendationResult = {
  productId: string;
  label: 'Best Match' | 'Strong Alternative' | 'Best Value';
  reasons: string[];
};

export type ThemeConfig = {
  id: string;
  name: string;
  colors: Record<string, string>;
};
