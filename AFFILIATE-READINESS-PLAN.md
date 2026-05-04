# FindYourIdealMattress - Affiliate Readiness Plan

Amazon UK Associates tag: findyouridealmattress-21

## Current State

All 30 products have NEEDS_MANUAL_REVIEW status.
All buy-links are temporary Amazon UK search URLs.
No SiteStripe links applied yet.

## Phase 1 - ASIN Verification (do before launch)

For each product in config/mattress/products.ts:
1. Search Amazon UK for the product by name/brand
2. Confirm the listing matches the product attributes
3. Copy the ASIN from the URL (e.g. amazon.co.uk/dp/ASIN)
4. Update ukAmazonVerification.status to AMAZON_UK_VERIFIED_EXACT
5. Update ukAmazonVerification.evidence with the product title from Amazon
6. Update the buy-link URL in config/mattress/buy-links.ts:
   https://www.amazon.co.uk/dp/ASIN?tag=findyouridealmattress-21
7. Set isTemporary: false on the updated link

## Phase 2 - SiteStripe Links

Once approved and signed in to Amazon Associates:
1. Navigate to each product page on Amazon UK
2. Use SiteStripe bar (top of page) to copy the short link
3. Replace the /dp/ URL with the amzn.to short link
4. Set source: 'sitestripe' on the link

## Priority Order for Verification

Verify highest-scoring products first (those most likely to appear in results):
- Simba Hybrid Pro (simba-hybrid-pro)
- Emma Hybrid Premium (emma-hybrid-premium)
- Tempur Cloud (tempur-cloud)
- Simba Hybrid Original (simba-hybrid-original)
- Eve Original (eve-original)
- Emma Original (emma-original)
- Nectar Smart Hybrid (nectar-smart-hybrid)

## Rejection Criteria

- Wrong category (not a mattress)
- Fewer than 20 reviews
- No UK listing
- Out of stock with no restock date

## Amazon Associates Requirements

- Affiliate disclosure must be visible on results page
- Do not artificially inflate click counts
- Do not use affiliate links in emails
- Review the Amazon Associates Operating Agreement annually
