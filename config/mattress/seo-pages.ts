/**
 * config/mattress/seo-pages.ts
 *
 * SEO landing page definitions for FindMyIdealMattress (UK market).
 *
 * PHASE 1 STUB — pages array is intentionally empty at launch.
 * SEO content is a post-launch activity (Phase 5 of the playbook).
 * Each page needs 600+ words of original content before publishing.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * TARGET KEYWORD CLUSTER — 8 pages (to be built post-launch)
 * ──────────────────────────────────────────────────────────────────────────
 *
 *   Sleep position cluster
 *     1. best-mattress-for-side-sleepers-uk
 *     2. best-mattress-for-back-pain-uk
 *
 *   Body type cluster
 *     3. best-mattress-for-heavy-people-uk
 *     4. best-mattress-for-couples-uk
 *
 *   Temperature / material cluster
 *     5. best-cooling-mattress-uk
 *     6. best-hybrid-mattress-uk
 *
 *   Budget cluster
 *     7. best-budget-mattress-uk
 *     8. best-mattress-under-500-uk
 */

export interface MattressSeoSection {
  h2: string;
  body: string;
  subsections?: { h3: string; body: string }[];
}

export interface MattressSeoPage {
  slug: string;
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  whoItIsFor: string[];
  keyFactors: string[];
  sections: MattressSeoSection[];
  faq: { question: string; answer: string }[];
  relatedSlugs: string[];
  lastReviewed: string;
}

export const mattressSeoPages: MattressSeoPage[] = [];

export const mattressSeoPageMap: Record<string, MattressSeoPage> = Object.fromEntries(
  mattressSeoPages.map((p) => [p.slug, p])
);
