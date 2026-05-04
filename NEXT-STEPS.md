# FindYourIdealMattress - Next Steps

See AFFILIATE-READINESS-PLAN.md for affiliate verification steps.
See README.md for deployment checklist.

## Phase 1 - Before Live Traffic

1. Replace all placeholder.png images in config/mattress/products.ts
2. Add affiliate disclosure to results page
3. Verify ASINs for all 30 products (all are NEEDS_MANUAL_REVIEW)
4. Replace temporary buy-links with verified amazon.co.uk/dp/ASIN?tag=findyouridealmattress-21 links

## Phase 2 - Before Promotion

5. Add SEO landing pages to config/mattress/seo-pages.ts
6. Set NEXT_PUBLIC_GA4_ID in Vercel
7. Run scripts/coverage-check.mjs to verify all personas have good matches

## Phase 3 - After First Traffic

8. Add US Amazon links (separate -us product IDs)
9. Expand product catalogue to 50+ products
10. Tune scoring weights based on GA4 data

## Vercel Environment Variables

- NEXT_PUBLIC_SITE_URL=https://www.findyouridealmattress.com
- NEXT_PUBLIC_GA4_ID=<mattress GA4 measurement ID>
- ADMIN_PASSWORD=<strong random string>
- ADMIN_TOKEN_SECRET=<strong random string>
- DEFAULT_CATEGORY_ID=mattress
