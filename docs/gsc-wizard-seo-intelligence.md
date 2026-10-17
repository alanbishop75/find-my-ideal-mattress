# GSC Wizard SEO intelligence integration — review-only

Property: `sc-domain:findyouridealmattress.com`.

## Reuse before extending
Inspect the existing SEO agents, collectors, opportunity queues, indexing checks and measurement logs in this repository. **Do not replace or duplicate them.** GSC Wizard is currently an interactive connected tool, not an available unattended GitHub Actions API. This specification adds an operator evidence handoff; it does not claim a working scheduled connector or introduce credentials.

## Evidence contract
Accept a dated read-only GSC Wizard export/report with `property`, `source`, `retrievedAt`, `settledThrough`, `startDate`, `endDate`, `dimensions`, `rows`, `paginationComplete` and `limitations`. Reject mismatched properties, incomplete/immature dates, unlabelled CTR units, and silent missing-row-to-zero conversions. Keep page totals separate from query totals; preserve country and device slices.

## Agent use cases
1. **Opportunity detection:** shortlist meaningful impression queries at positions 5–20, and potential low-CTR pages only against similar-position peers; review search intent, content overlap and low-sample confidence before suggesting an edit.
2. **Indexing and sitemaps:** compare Search Console submitted sitemaps and targeted URL inspections against repository routes, live HTTP/canonicals and substantive `lastmod` updates. Check inspection quota first. Inspection reports Google's indexed snapshot, not a live crawl or an indexing submission.
3. **SEO change measurement:** preserve PR/release SHA, target URLs and queries, pre-change baseline, and 14/28/56-day post-release reviews after settled-day lag. Classify improvement, no impact, decline or insufficient data; do not claim causation from GSC alone.
4. **Portfolio priority:** emit a site-level candidate with estimated traffic opportunity, attainability, commercial relevance, evidence confidence, effort and risk; the central hub aggregates across authorised properties. Never query another property's private traffic as if it belonged to this site.
5. **Shared intelligence:** consume the same versioned evidence schema used by sibling sites, but retain this site's current direct GSC fetcher/SEO workflows as the source of truth where available. Report discrepancies for human review.

## Controls and acceptance
- Never change content, affiliate links, canonical URLs, robots, sitemap dates, indexing state, credentials or production deployment automatically.
- Human review is required before any implementation or merge.
- A future executable adapter requires mock tests for stale data, pagination, low impressions, property mismatch, missing permissions, conflicting sources and measurement windows.
- Current status: **instructions and handoff contract only**. No unattended GSC Wizard connector, new CI workflow or automatic portfolio data transfer is claimed.
