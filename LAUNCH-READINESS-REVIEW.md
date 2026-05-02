# Launch Readiness Review — find-my-ideal-pillow

**Reviewer:** Claude Opus, acting as strict multi-discipline launch readiness review board
**Date:** 30 April 2026
**Project:** `find-my-ideal-pillow` (v0.1.0-dev)
**Scope:** Full pre-launch / pre-clone audit

---

## Executive Verdict

- **Overall status:** **AMBER**
- **Confidence level:** **High**
- **Can I move to the next project now?** **Yes, with conditions** — the website itself is production-quality, but three documentation/compliance items must be cleared first or you will carry the same noise into the next product and risk an Amazon Associates / Google trust review flagging the site as half-finished.
- **One-paragraph explanation:** The product code, scoring engine, 60-product UK+US Amazon catalogue, SEO surface and legal pages are all in solid shape — none of it would embarrass you in front of a user, an Amazon reviewer or a Google quality rater. What is *not* ready is the project's narrative layer: `AFFILIATE-READINESS-PLAN.md` is still entirely the golf-ball document, `NEXT-STEPS.md` and `README.md` carry golf-ball references, the affiliate disclosure on the results page is not yet verified visible, and the US Amazon Associates approval status is undocumented. Those are cheap fixes (one afternoon) but they are the difference between AMBER and GREEN, and they are exactly the kind of thing that, left untouched, gets copied into the next product.

---

## Criticality Summary

| Criticality | Count | Summary |
|---|---|---|
| Blocker | 1 | `AFFILIATE-READINESS-PLAN.md` is the golf-ball document verbatim |
| High | 4 | Affiliate disclosure on results not verified; `NEXT-STEPS.md` / `README.md` carry golf-ball refs; US Associates approval undocumented; SiteStripe registration of UK `amzn.to` links unverified |
| Medium | 5 | Generic scoring `reasons[]` copy; weak/auto-generated OG image; admin page not parameterised; sitemap `lastModified` stale; product description copy generic |
| Low | 4 | Possible `HOMEFOUCS` typo in products; no a11y/Lighthouse tests; no hreflang for UK/US; legacy `e2e-v2.spec.ts` may be dead |

---

## Must-Fix Before Moving On

| Priority | Issue | Criticality | Why it matters | Exact fix | Suggested file/area |
|---|---|---|---|---|---|
| 1 | `AFFILIATE-READINESS-PLAN.md` is still the golf-ball document — header, retailer list, route paths, brand name all wrong | Blocker | If anyone (Amazon, Google, a future you) reads this, the project looks abandoned/half-done. Will also poison the next clone. | Rewrite end-to-end for pillow: brand `FindMyIdealPillow`, retailers (Amazon UK + Amazon US), Associate IDs (`findmyidealpillow-21`, `findmyidealpillow-20`), route paths (`/pillow/...`), checklist tailored to pillow approval state. | [AFFILIATE-READINESS-PLAN.md](AFFILIATE-READINESS-PLAN.md) |
| 2 | Affiliate disclosure on `/results` not verified visible | High | Required by Amazon Operating Agreement & FTC/ASA. Easy to fail Associates review without it. | Open the rendered results page, confirm a visible "As an Amazon Associate we earn from qualifying purchases" line (region-aware UK/US). If absent, add to the results client component above or below the recommendation cards. | `app/pillow/results/` results client component |
| 3 | `NEXT-STEPS.md` and `README.md` carry golf-ball references | High | Same credibility problem as #1; also contradicts the actual MVP state. | Search-and-replace `golf-ball` → `pillow`, `findmyidealgolfball` → `findmyidealpillow`, `app/golf-ball/` → `app/pillow/`. Re-read each must-fix bullet and confirm it still applies to pillow. | [NEXT-STEPS.md](NEXT-STEPS.md), [README.md](README.md) |
| 4 | US Amazon Associates approval status not recorded anywhere | High | You're shipping `?tag=findmyidealpillow-20` on 30 live US ASINs. If the Associate ID isn't approved/active, every US click is non-compliant and risks both UK and US accounts. | Add a "Affiliate Status" section to README and AFFILIATE-READINESS-PLAN: UK = Initial Approval (date), US = (Pending / Approved / Beta-only). If US is pending, gate the US results behind a feature flag until approved. | README, AFFILIATE-READINESS-PLAN, optionally `config/markets.ts` |
| 5 | UK `amzn.to` links labelled `source: "sitestripe"` but not actually spot-verified in Associates dashboard | High | Untagged or wrong-tag SiteStripe links pay zero commission and look identical to tagged ones. | Open Associates UK reporting → confirm at least 5 random `amzn.to` links resolve to `findmyidealpillow-21`. Document the spot-check date in README. | [config/pillow/buy-links.ts](config/pillow/buy-links.ts) |

---

## Should-Fix Soon

| Priority | Issue | Criticality | Why it matters | Exact fix | Suggested file/area |
|---|---|---|---|---|---|
| 6 | `reasons[]` output from `scorePillow` is generic ("Designed for side sleepers", "Not hypoallergenic — may trigger allergies") | Medium | Users seeing "your top pick may not be for you" lose trust. Also the single biggest perceived-quality lift on the results page. | Convert each branch in [config/pillow/scoring.ts](config/pillow/scoring.ts) to return human-friendly, product-aware copy ("This Panda memory foam pillow is firm enough for back sleepers but stays cool thanks to its bamboo cover."). | [config/pillow/scoring.ts](config/pillow/scoring.ts) |
| 7 | OG image is auto-generated text only ([app/opengraph-image.tsx](app/opengraph-image.tsx)) | Medium | Weak social shares; competitors will look more legit. | Replace with a 1200×630 branded PNG in `public/` and remove the dynamic route, or design a proper visual via the `ImageResponse` API. | [app/opengraph-image.tsx](app/opengraph-image.tsx) |
| 8 | `app/admin/pillow/page.tsx` is ~900 lines with product-specific copy hardcoded | Medium | Exact same maintenance debt golf-ball had — will need re-hand-editing for next product. | Extract product-specific strings to a constant block at top of file, OR move the page to `app/admin/[category]/page.tsx` reading from `categoryRegistry`. | [app/admin/pillow/page.tsx](app/admin/pillow/page.tsx) |
| 9 | `app/sitemap.ts` `lastModified` dates are static (2026-04-26) | Medium | Search engines deprioritise sitemaps that never change. | Use `new Date()` for `lastModified` or pull from a per-page constant updated on each content change. | [app/sitemap.ts](app/sitemap.ts) |
| 10 | Product short descriptions are generic and interchangeable | Medium | Hurts content uniqueness and affiliate-review impression of editorial value. | Rewrite each description in 1–2 sentences referencing a *specific* feature (zip adjustability, gel layer, etc.). | [config/pillow/products.ts](config/pillow/products.ts) |

---

## Nice-to-Have / Later

| Priority | Issue | Criticality | Why it matters | Exact fix | Suggested file/area |
|---|---|---|---|---|---|
| 11 | No automated accessibility test (aXe / Lighthouse) | Low | Regression risk on a11y as you iterate. | Add a Playwright + `@axe-core/playwright` test on `/`, `/pillow/questionnaire`, `/pillow/results`. | `tests/` |
| 12 | No `<link rel="alternate" hreflang>` for UK/US | Low | Mild risk of wrong-region SERP for UK users; current geo logic is client-side. | Emit `hreflang="en-GB"` and `hreflang="en-US"` from the layout once you have separate canonical URLs per region (or accept it for v0.1). | [app/layout.tsx](app/layout.tsx) |
| 13 | Possible brand-name typo `HOMEFOUCS` | Low | Looks unprofessional if it's a typo; harmless if it's the real brand. | Cross-check against the Amazon listing for the ASIN. | [config/pillow/products.ts](config/pillow/products.ts) (~line 208) |
| 14 | `tests/e2e-v2.spec.ts` may be legacy from golf-ball quiz v2 | Low | Dead test = false sense of safety. | Either delete or rewrite to exercise current `/pillow/questionnaire`. | [tests/e2e-v2.spec.ts](tests/e2e-v2.spec.ts) |
| 15 | No URL-encoded share-results link | Low | NEXT-STEPS already lists this as post-launch. | Encode answers + score into search params on results page. | results page client |

---

## Persona Review

### First-time visitor — **Pass**
Clear hero, obvious CTA, three-step explainer, finishes the quiz quickly and gets a real recommendation. No reason to bounce.

### Skeptical user — **Partial**
Privacy/terms/about pages are honest and credible. Concerns: scoring `reasons[]` are generic ("Not hypoallergenic — may trigger allergies"), which can read as either useful warnings or as the site downgrading its own picks. Affiliate disclosure presence on the results page is the deciding factor — currently unverified.

### Mobile user — **Pass**
Flex layouts, responsive padding, no horizontal overflow observed. No mobile-specific issues flagged.

### Returning user — **Partial**
No share URL, no "redo my last quiz" flow, no saved answers. Acceptable for v0.1 but flagged as future work.

### User in a hurry — **Pass**
7 questions is the right length. Results render fast, top pick is visually emphasised.

### Beginner / non-expert — **Partial**
HelpText fields exist on questions, which is good. But the recommendation rationale is too generic to help a non-expert understand *why* a £45 pillow beats a £14 one.

### Advanced product-aware user — **Partial**
Catalogue covers Tempur, Panda, Coop, Casper etc. — credible. Lacks comparative spec depth (no fill weight, no exact loft) that an enthusiast might want, but reasonable for an affiliate site.

### Amazon affiliate reviewer — **Partial → Fail-risk**
Site looks real (60 products, real ASINs, real images, legal pages). The two things that flip a reviewer's mood: (a) the `AFFILIATE-READINESS-PLAN.md` document being for a different brand; (b) US results going live without confirmed Associate approval. Fix both before any submission for re-review.

### Google quality reviewer / SQE — **Pass**
12 SEO landing pages with 1,000+ words, JSON-LD on FAQ + landing pages, real legal pages, real authorial voice. Above the bar for "low-value affiliate site."

### Technical SEO expert — **Pass**
robots.txt, sitemap, canonicals, noindex on results, metadataBase, OG tags all present. OG image quality is the only gripe.

### Senior software architect — **Pass**
Clean registry pattern, dynamic `[category]` routes, scoring engine isolated, no `any` / `@ts-ignore`. Admin page parameterisation and scoring constants are the only architectural debt.

### QA lead — **Partial**
5 persona regression tests + config validation + Playwright smoke = good baseline. Missing: a11y, performance budgets, broken-link sweep, real e2e cookie-consent path.

---

## SEO & Google Submission Checklist

### Already OK
- `app/robots.ts` allows `/`, disallows `/admin/`, `/api/`, references sitemap
- `app/sitemap.ts` includes 16 static URLs + dynamic SEO landing pages
- Per-route metadata with canonicals and `robots: { index: true, follow: true }`
- Results page is `noindex, follow` and `force-dynamic`
- FAQ + SEO landing pages emit FAQPage / Article / BreadcrumbList JSON-LD
- `metadataBase` is set in [app/layout.tsx](app/layout.tsx)

### Must submit / verify
1. Add `findmyidealpillow.com` (and `www.` variant if used) to Google Search Console as separate properties — **must be submitted as a separate property from the golf-ball domain**.
2. Submit `https://www.findmyidealpillow.com/sitemap.xml` once live.
3. URL-inspect the homepage and 3 SEO landing pages on day 1; check indexability and canonical resolution.
4. Verify `https://www.findmyidealpillow.com/robots.txt` returns 200 with sitemap reference.
5. Verify `/pillow/results` is reported as `noindex` by URL inspection.

### Domain / property separation concerns
- Hub (`findmyideal.info`), pillow (`findmyidealpillow.com`) and golf-ball (`findmyidealgolfball.com`) **must be separate GSC properties and separate GA4 properties**. Do not combine — cross-pollutes search analytics and CTR data.
- Each product needs its own `NEXT_PUBLIC_GA4_ID` env var on Vercel.

### Indexing priorities (week 1)
1. `/` (homepage)
2. `/pillow/questionnaire`
3. The 3–4 highest-intent SEO landing pages (e.g. `best-pillow-for-side-sleepers-uk`)
4. `/about`, `/faq`

### Exact next actions
- [ ] Add domain to GSC and verify
- [ ] Submit sitemap
- [ ] URL-inspect homepage + top 3 landing pages
- [ ] Confirm `/results` returns noindex header
- [ ] Set `NEXT_PUBLIC_GA4_ID` for the pillow GA4 property
- [ ] Switch `app/sitemap.ts` to dynamic `lastModified`

---

## Technical Architecture Review

### Strengths
- Single registry wiring point ([config/registry.ts](config/registry.ts)) — exemplary
- Dynamic `[category]` routing — zero new route code per product
- Scoring engine cleanly isolated ([config/pillow/scoring.ts](config/pillow/scoring.ts))
- Strict TypeScript, no `any` / `@ts-ignore` in core paths
- Middleware properly gates `/admin/*` and `/api/admin/*`
- Dual-market structure (UK + US) is properly modelled via `availability`

### Risks
- Hardcoded `"pillow"` build-phase fallback in [app/layout.tsx](app/layout.tsx) (same shape as golf-ball's bug — already a known clone hazard)
- Admin page is large and product-specific
- Scoring penalty/bonus values are magic numbers; no `DISQUALIFY` constant or documented thresholds — future tuning will be opaque
- No runtime validation (zod) on questionnaire response payloads — currently safe but a tightening opportunity

### Legacy / noise concerns
- `AFFILIATE-READINESS-PLAN.md` is still the golf-ball document
- `NEXT-STEPS.md` mixes pillow status with leftover golf-ball language
- `README.md` references "Founded on golf-ball v1.0.0" with stale structure examples
- `app/admin/affiliate-uk-temp.tsx` (or similar) suggests interim tooling that should be either promoted or deleted

### Readiness for reuse in next project
**Pillow is the right base to clone for the next product** (per existing memory note), provided the foundation fixes from the golf-ball retro are applied first:
- Replace `"pillow"` build-phase fallback with `process.env.DEFAULT_CATEGORY_ID ?? "pillow"`
- Make `NEXT_PUBLIC_SITE_URL` mandatory in robots/sitemap (throw on missing)
- Parameterise admin page or extract product strings to constants
- Add `scripts/new-product.ps1` clone helper

---

## Testing & Release Readiness Review

### Current likely coverage
- 5 persona regression tests (rank-based assertions — robust)
- Config validation: product uniqueness, buy-link presence, ASIN format, no search URLs
- Buy-link format / domain validation
- Market-config structure
- Playwright e2e smoke: homepage → questionnaire → results, footer/contact, privacy, admin login

### Missing coverage
- Accessibility (aXe) checks
- Performance / Core Web Vitals budgets
- Broken-link sweep (internal + outbound buy-links)
- Cookie-consent / GA4 consent gating path
- Verification that affiliate disclosure text actually renders on `/pillow/results`

### Minimum tests required before green
1. Add a Playwright assertion that `/pillow/results` page contains the affiliate-disclosure string
2. Delete or rewrite `tests/e2e-v2.spec.ts`
3. Add a test that loops every UK + US buy-link and asserts the URL pattern matches the expected per-region template (already largely present in `lib/buy-links.test.ts` — just confirm coverage = 60/60)

### Suggested smoke-test checklist (manual, pre-launch)
- [ ] `/robots.txt` and `/sitemap.xml` return 200 on live domain
- [ ] Homepage canonical = production URL
- [ ] Quiz completes in mobile Chrome and desktop Safari
- [ ] All 3 results cards render with image + price + buy button
- [ ] At least 1 UK and 1 US buy link click-through reaches the correct Amazon listing with the correct tag in the URL
- [ ] `/admin/login` redirects unauthenticated users
- [ ] Privacy, terms, FAQ, about, contact all render

### Production release checklist
- [ ] `NEXT_PUBLIC_SITE_URL=https://www.findmyidealpillow.com` set in Vercel
- [ ] `NEXT_PUBLIC_GA4_ID` set
- [ ] `ADMIN_PASSWORD` and `ADMIN_TOKEN_SECRET` set (and rotated from any dev value)
- [ ] `DEFAULT_CATEGORY_ID=pillow`
- [ ] `npm run build` passes locally
- [ ] All tests pass (`npm test`, `npx playwright test`)
- [ ] Tag the commit (`pillow-v0.1.0`)

---

## Product / Scoring / Affiliate Review

### Product catalogue risks
- 60 products across UK + US, all verified with real ASINs and Amazon media images, all permanent (no `isTemporary: true`), no search URLs — **strong**.
- Coverage check: side, back, stomach, combination, hot sleepers, allergies, all three price tiers — **all covered**.
- Single concern: possible `HOMEFOUCS` typo — verify against listing.

### Link risks
- UK `amzn.to` short links labelled SiteStripe but not spot-verified in Associates dashboard — **must verify**.
- US links use embedded `?tag=findmyidealpillow-20` (Associates-compliant pattern), but US Associate approval status undocumented — **must document**.

### Recommendation quality risks
- Generic `reasons[]` strings are the biggest perceived-quality risk on the results page.
- No fill-weight or exact-loft data may disappoint an enthusiast persona but is acceptable.

### Weak categories
- Stomach sleepers have only 2 dedicated products (the rest fall into combination/any) — acceptable as long as combination products do score well for that persona, which the current regression tests do not explicitly cover.

### Bias / scoring fairness
- Scoring is purely attribute-driven; no brand bonuses, no commission-rate weighting. Score order is independent of which retailer pays more — **clean**.
- Penalty constants are magic numbers; consider extracting to a `WEIGHTS` object for transparency.

---

## Final Go / No-Go Decision

GO STATUS: **AMBER**

MOVE TO NEXT PROJECT:
- **Yes, after these specific fixes:**
  1. Rewrite `AFFILIATE-READINESS-PLAN.md` for pillow
  2. Verify (and add if missing) the affiliate disclosure on the results page
  3. Update `NEXT-STEPS.md` and `README.md` to remove golf-ball language
  4. Document Amazon UK Associate approval state and Amazon US approval state
  5. Spot-check at least 5 UK `amzn.to` links in the Associates dashboard

TOP 5 ACTIONS:
1. Rewrite `AFFILIATE-READINESS-PLAN.md` for pillow brand, retailers and Associate IDs.
2. Open `/pillow/results` in a browser and confirm the affiliate-disclosure line is visible; add it if not.
3. Search-and-replace `golf-ball` → `pillow` across `README.md` and `NEXT-STEPS.md`, then re-read each must-fix bullet.
4. Add an "Affiliate Status" section recording UK approval date and US approval state (gate US behind a flag if pending).
5. Spot-check 5 UK `amzn.to` links in the Associates dashboard and record the verification date.

After these five: site flips to **GREEN** and is safe to clone for the next product.
