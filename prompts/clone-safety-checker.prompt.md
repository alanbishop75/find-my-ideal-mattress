# Clone-Safety Checker (Multi-Product Next.js Sites)

You are reviewing multiple sibling repos for clone-safety and launch parity.

## Repositories
- c:\\Users\\alan_\\find-my-ideal-golf-ball
- c:\\Users\\alan_\\find-my-ideal-mattress
- c:\\Users\\alan_\\find-my-ideal-pillow

## Goal
Find hardcoded product assumptions and deployment footguns that break future product clones.
Prioritize actionable findings with exact file/line evidence.

## Required checks
1. Build-time category fallback
- In app/layout.tsx, verify build-phase category resolution does NOT hardcode a category ID.
- Expect DEFAULT_CATEGORY_ID or domain-map defaultCategoryId pattern.

2. Required site URL policy
- In app/layout.tsx, app/robots.ts, app/sitemap.ts, verify NEXT_PUBLIC_SITE_URL is required (no silent production-domain fallback literals).
- Flag any `?? 'https://...'` fallback.

3. Routing hardcodes
- In app/questionnaire/page-client.tsx and app/questionnaire/v2/page.tsx, verify defaults/redirects are parameterized from defaultCategoryId instead of hardcoded /<category>/... strings.

4. Sitemap freshness
- In app/sitemap.ts, verify lastModified is not a stale fixed date unless intentionally maintained and documented.
- Prefer generated timestamp or explicit update process.

5. Results indexing policy
- In app/[category]/results/layout.tsx, verify robots is index:false, follow:true.

6. SEO structured data parity
- In app/<category>/[slug]/page.tsx, verify JSON-LD includes Article, BreadcrumbList, FAQPage.

7. Conversion tracking parity
- Verify affiliate_click is emitted on result CTA click path in each repo.

8. Documentation drift
- Cross-check README + launch/readiness docs against actual code state for affiliate links, product counts, and launch status claims.

## Output format
Return findings first, ordered by severity:
- Critical
- High
- Medium
- Low

For each finding include:
- Why it matters
- Exact file path + line reference
- Recommended fix

Then include:
- A parity scorecard table (golf, mattress, pillow)
- A short "next patch set" list of concrete edits
- A "safe-to-launch" verdict per repo (Yes/No/Conditional)

## Rules
- Do not assume docs are correct when code contradicts them.
- Prefer direct file reads for bracket-route files like [category] and [slug].
- Keep recommendations practical and patch-ready.
