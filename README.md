# FindYourIdealMattress

> AI-powered mattress recommendation tool for the UK market.

Live site: **https://www.findyouridealmattress.com**

---

## What It Does

Users answer 7 questions (sleep position, body weight, partner sharing, pain points, temperature, material preference, budget). The scoring engine ranks 30 UK mattress products and returns the top 5 personalised matches with affiliate buy-links.

---

## Tech Stack

- **Next.js 15** (App Router, Turbopack in dev)
- **TypeScript 5 / React 19**
- **Jest + ts-jest** for unit tests
- **Playwright** for e2e smoke tests
- **Vercel** for hosting

---

## Local Development

```bash
npm install
npm run dev        # http://localhost:3000
```

Set up `.env.local` (copy from `.env.example`):

```
NEXT_PUBLIC_SITE_URL=https://www.findyouridealmattress.com
NEXT_PUBLIC_GA4_ID=<your-ga4-id>
ADMIN_PASSWORD=<secure-value>
ADMIN_TOKEN_SECRET=<secure-value>
DEFAULT_CATEGORY_ID=mattress
```

---

## Project Structure

```
config/mattress/         # Product catalogue, scoring engine, questionnaire
app/mattress/            # Dynamic SEO landing pages + results route
app/admin/mattress/      # Admin panel: products, affiliate audit, theme
components/              # Generic UI (card, quiz, nav)
core/                    # Shared types, context, geo, analytics
lib/                     # Tests: scoring regression, buy-links, config validation
scripts/                 # Affiliate link validation, image fetching, coverage check
```

---

## Running Tests

```bash
npx jest                          # all tests
npx jest lib/scoring-regression   # scoring regression only
npx jest lib/buy-links            # affiliate link validation
npx jest lib/config-validation    # catalogue integrity
```

---

## Scripts

```bash
node scripts/coverage-check.mjs                  # run 8 personas, check no dead SKUs
npx tsx scripts/validate-affiliate-links.mjs     # validate live UK affiliate links
```

---

## Affiliate Programme

- Retailer: Amazon UK
- Associate tag: `findyouridealmattress-21`
- Current phase: **pre-verification** - all links are temporary Amazon search URLs
- Next step: manually verify ASINs and replace search URLs with direct `amazon.co.uk/dp/<ASIN>?tag=findyouridealmattress-21` links

See AFFILIATE-READINESS-PLAN.md for the full verification roadmap.

---

## Deployment

Hosted on Vercel. Set these environment variables before deploying:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.findyouridealmattress.com` |
| `NEXT_PUBLIC_GA4_ID` | your GA4 measurement ID |
| `ADMIN_PASSWORD` | secure random string |
| `ADMIN_TOKEN_SECRET` | secure random string (32+ chars) |
| `DEFAULT_CATEGORY_ID` | `mattress` |

---

## Platform Architecture

This repo is one product in the FindYourIdeal platform. Only `config/mattress/` and `app/mattress/` are mattress-specific. All other code is shared infrastructure.
