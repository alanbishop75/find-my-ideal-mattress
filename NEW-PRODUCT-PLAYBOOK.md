# FindMyIdeal — New Product Playbook
> Derived from: golf-ball v1.0.0 → pillow v0.1 retrospective (April 2026)
>
> Follow this document top-to-bottom to launch a new FindMyIdeal product site.
> **Estimated time for a domain expert: 4–6 hours to Phase 4 (all tests passing).**

---

## Quick Reference: Which Build to Clone

**Clone `find-my-ideal-pillow` at the latest tagged release.**

Do not clone `find-my-ideal-golf-ball` — pillow has:
- `force-dynamic` on results layouts (prevents prerender crash)
- Dual-market product model (`rrpUs` field)
- Both UK + US buy-links from day 1
- Admin page with corrected wording patterns

```powershell
git clone https://github.com/<org>/find-my-ideal-pillow find-my-ideal-<product>
cd find-my-ideal-<product>
git remote set-url origin https://github.com/<org>/find-my-ideal-<product>
```

---

## Phase 0 — Clone & Brand (30 min)

### 0.1 Rename config directory
```
config/pillow/ → config/<product>/
```
Files inside: `questionnaire.ts`, `products.ts`, `scoring.ts`, `buy-links.ts`, `seo-pages.ts`

### 0.2 Rename app route directory
```
app/pillow/ → app/<product>/
```
Files inside: `questionnaire/page.tsx`, `results/`, `results/layout.tsx`, `[slug]/page.tsx`, `[slug]/PillowSeoLandingPage.tsx`

- Rename `PillowSeoLandingPage.tsx` → `<Product>SeoLandingPage.tsx`
- Inside that file: update component name and import

### 0.3 Rename admin route directory
```
app/admin/pillow/ → app/admin/<product>/
```

### 0.4 String replacements — run these in bulk
Find/replace across the entire repo (case-sensitive where noted):

| Find | Replace with |
|---|---|
| `pillow` | `<product>` |
| `Pillow` | `<Product>` |
| `PILLOW` | `<PRODUCT>` |
| `findmyidealpillow` | `findmyideal<product>` |
| `FindMyIdealPillow` | `FindMyIdeal<Product>` |
| `findmyidealpillow.com` | `findmyideal<product>.com` |
| `scorePillow` | `score<Product>` |
| `pillowQuestionnaire` | `<product>Questionnaire` |
| `pillowProducts` | `<product>Products` |
| `pillowBuyLinks` | `<product>BuyLinks` |
| `pillowSeoPages` | `<product>SeoPages` |
| `PillowSeoPage` (interface) | `<Product>SeoPage` |

### 0.5 Files to rewrite from scratch (do not use search/replace)

| File | Action |
|---|---|
| `README.md` | Rewrite for new product |
| `NEXT-STEPS.md` | Rewrite (see template at end of this doc) |
| `AFFILIATE-READINESS-PLAN.md` | Rewrite (replace retailer names, domain, brand) |
| `.env.local` | Update `NEXT_PUBLIC_SITE_URL` and `DEFAULT_CATEGORY_ID` |

### 0.6 Update key config files

**`config/domain-map.ts`:**
```ts
export const domainCategoryMap: Record<string, string> = {
  'findmyideal<product>.com':     '<product>',
  'www.findmyideal<product>.com': '<product>',
};
export const defaultCategoryId = '<product>';
```

**`app/layout.tsx`** (line ~18):
```ts
if (process.env.NEXT_PHASE === BUILD_PHASE) return "<product>";
```

**`.env.local`:**
```
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_GA4_ID=
ADMIN_PASSWORD=dev-password
DEFAULT_CATEGORY_ID=<product>
```

### 0.7 Gate check
```powershell
npx tsc --noEmit
# Must exit 0 before moving to Phase 1
```

---

## Phase 1 — Research (1–2 hours, human work)

Before writing any code, answer these questions with domain expertise:

### 1.1 Define the customer's decision problem
- What is the primary attribute driving purchase? (e.g. sleep position, budget, material preference)
- What are the hard constraints? (allergies, neck pain, etc.)
- What are the nice-to-haves? (cooling, adjustable, brand)

### 1.2 Draft 5 buyer personas
Write 5 fictional buyers with: age, key need, budget, constraints.
Use these as test cases in Phase 3. Example:
- Persona A: Side sleeper, budget-conscious, no allergies → should get silentnight or slumberdown
- Persona E: Back sleeper, allergic to feathers → must NOT get natural-down; penalty = disqualifier

### 1.3 Product catalogue research
Aim for **10–15 products** across 3 tiers:
- **Budget** (2–3 products): well-known brands, RRP < £25/US $30
- **Mid** (5–7 products): mainstream premium, £25–£80/US $30–$100
- **Premium** (2–3 products): aspirational, £80+/US $100+

For each product collect:
- Brand, Name, RRP (GBP + USD)
- Key attributes (material, firmness, key selling point)
- Amazon ASIN (UK + US) — or at minimum search URL
- Any UK specialist retailer presence

### 1.4 Scoring signals
Map each questionnaire question to a scoring signal:
- Max positive score for a perfect match
- Penalty for a mismatch
- Hard constraint vs soft penalty

---

## Phase 2 — Questionnaire (1 hour)

**Target: 5–8 questions, ≤ 4 options each. No more than 1 branched question.**

Edit `config/<product>/questionnaire.ts`:

```ts
export const <product>Questionnaire: Questionnaire = {
  id: '<product>-v1',
  version: '1.0',
  questions: [
    {
      id: '<primary-signal>',
      text: '...',
      options: [
        { id: 'option-a', label: '...', description: '...' },
        // ...
      ],
    },
    // ...
  ],
};
```

**Rules for good questionnaire design:**
1. First question = highest-signal attribute (drives 30%+ of scoring weight)
2. Last question = budget (lowest emotional friction; highest product-impact)
3. Branching questions: use sparingly; only branch from Q2 or Q3
4. Every option should have at least 2 products that match it well
5. Avoid questions where all products score the same (zero signal)

---

## Phase 3 — Products & Scoring (2 hours)

### 3.1 Products (`config/<product>/products.ts`)

Follow the existing `Product` type — attributes are a `Record<string, string | number | boolean>`.
Keep attributes consistent across all products. Common pattern:

```ts
export const products: Product[] = [
  {
    id: '<brand>-<name-slug>',
    brand: '<Brand>',
    name: '<Full Product Name>',
    description: '<60-word max description>',
    imageUrl: '/placeholder.png',
    rrp: <gbp-number>,
    rrpUs: <usd-number>,
    attributes: {
      <primaryAttr>: '<value>',
      <secondaryAttr>: '<value>',
      priceTier: 'budget' | 'mid' | 'premium',
      availability: 'uk' | 'us' | 'both',
      // add product-specific boolean flags
    },
  },
];
```

### 3.2 Scoring engine (`config/<product>/scoring.ts`)

Structure your scoring engine with **one clearly named section per questionnaire question**:

```ts
import type { ScoringEngine } from '../../lib/scoring';
import { products as productList } from './products';

export const score<Product>: ScoringEngine = (product, answers) => {
  const a = product.attributes;
  let score = 0;
  const reasons: string[] = [];

  // ── 1. <Primary Signal> ──────────────────────────────────────────────────
  // Max: +15, hard mismatch: −10
  const position = answers['<primary-signal>'];
  if (/* perfect match */) {
    score += 15;
    reasons.push('...');
  } else if (/* compatible */) {
    score += 6;
  } else {
    score -= 10;
  }

  // ── 2. Hard Constraints (allergies, critical preferences) ────────────────
  // Use large penalties: −25 to −999 for hard disqualifiers
  const needsHypo = answers['<constraint-question>'] === 'yes';
  if (needsHypo && !a.<hypoAttr>) {
    score -= 25;  // Large enough to push below any realistic score
    reasons.push('Not suitable — triggers allergies');
  }

  // ... more sections ...

  return { score: Math.max(0, score), reasons };
};
```

**Scoring calibration rules:**
- Run your 5 personas mentally before writing tests
- Primary signal should be ±10–15 points
- Hard constraints: -25 or more (or use `DISQUALIFY = -9999`)
- Budget: soft penalty only (−5 to −15), never hard block
- Total max realistic score: aim for 50–80 points

### 3.3 Buy-links (`config/<product>/buy-links.ts`)

Phase 1 (launch): Use generated search URLs marked `isTemporary: true`.
Phase 2 (pre-promotion): Replace with direct ASINs/product URLs.

```ts
export const <product>BuyLinks: Record<string, BuyLinks> = {
  '<product-id>': {
    UK: [
      {
        retailerKey: 'amazon',
        retailerName: 'Amazon UK',
        region: 'UK',
        url: 'https://www.amazon.co.uk/s?k=<search+terms>&tag=<uk-associate-tag>',
        expectedDomain: 'amazon.co.uk',
        isTemporary: true,
        source: 'generated',
      },
      // Add John Lewis, specialist retailers as available
    ],
    US: [
      {
        retailerKey: 'amazon',
        retailerName: 'Amazon US',
        region: 'US',
        url: 'https://www.amazon.com/s?k=<search+terms>&tag=findmyideal-20',
        expectedDomain: 'amazon.com',
        isTemporary: true,
        source: 'generated',
      },
    ],
  },
  // ... repeat for all products
};
```

---

## Phase 4 — Wire Up & Test Gate (30 min)

### 4.1 Update `config/registry.ts`
```ts
import { <product>Questionnaire } from './<product>/questionnaire';
import { products as <product>Products } from './<product>/products';
import { score<Product> } from './<product>/scoring';

export const categoryRegistry: Record<string, CategoryConfig> = {
  '<product>': {
    id: '<product>',
    meta: {
      title: 'FindMyIdeal<Product> — Find Your Perfect <Product>',
      description: 'Answer a few quick questions and get a free, personalised <product> recommendation.',
      brandName: 'FindMyIdeal<Product>',
      hero: 'Answer a few questions.\nGet your ideal <product>.',
      subhero: 'Free, instant recommendations tailored to <benefit>.',
      ctaText: 'Start fitting →',
      resultsHeading: 'Your best-fit <products>',
    },
    theme: '<theme>',  // 'blue' | 'light-green' | 'white' | 'classic-navy'
    questionnaire: <product>Questionnaire,
    products: <product>Products,
    scoringEngine: score<Product>,
  },
};
```

### 4.2 Write regression tests (`lib/scoring-regression.test.ts`)

One `describe` block per persona. Assertions should be **rank-based**, not score-based:

```ts
describe('Persona A — <description>', () => {
  const answers: Record<string, string> = { '<q-id>': '<answer>', ... };

  it('<top product> ranks #1', () => {
    const ranked = rank(answers);
    expect(ranked[0].id).toBe('<expected-top-product-id>');
  });

  it('<disqualified product> is not in top 3', () => {
    const ranked = rank(answers);
    const idx = ranked.findIndex(r => r.id === '<bad-product-id>');
    expect(idx).toBeGreaterThan(2);
  });
});
```

**Avoid**: `expect(score).toBeLessThan(15)` — scores drift when you tune weights.
**Prefer**: `expect(rank).toBeGreaterThan(2)` — stable against scoring tweaks.

### 4.3 Run the test gate
```powershell
cd C:\Users\alan_\find-my-ideal-<product>
node_modules\.bin\jest --testPathPatterns="lib/" --no-coverage
npx tsc --noEmit
node .\node_modules\next\dist\bin\next build > "$env:TEMP\build.txt" 2>&1
Get-Content "$env:TEMP\build.txt" | Where-Object { $_ -match "error|Error" }
```

All must pass before commit.

### 4.4 Final grep for stale refs
```powershell
# Replace <old-product> with what you cloned from (e.g. "pillow")
Select-String -Path "app\**\*.tsx","config\**\*.ts","lib\**\*.ts" -Pattern "<old-product>" -Recurse
```

---

## Phase 5 — SEO Content (2–4 hours, copywriting)

Edit `config/<product>/seo-pages.ts`. Target **4–6 landing pages**.

Page slug pattern: `best-<product>-for-<audience>` e.g.:
- `best-pillow-for-side-sleepers`
- `best-pillow-for-hot-sleepers`
- `best-memory-foam-pillow-uk`

Each page needs:
- `metaTitle` (~60 chars)
- `metaDescription` (~155 chars)
- `h1` (slightly different from metaTitle)
- `intro` (2–3 sentences, audience-specific)
- `keyFactors` (3–5 bullet points)
- `faq` (3–4 Q&A pairs, ~100 words each)
- `whyItMatters` (2–3 sentences)

Minimum word count per page: **500 words** (for Amazon Associates review).

---

## Phase 6 — Launch Checklist

### 6.1 Replace temporary buy-links
- [ ] Replace all `isTemporary: true` search URLs with direct product page ASINs
- [ ] Verify each URL resolves correctly
- [ ] Update `source` from `'generated'` to `'manual'`
- [ ] Add `lastCheckedAt: 'YYYY-MM-DD'`

### 6.2 Product images
- [ ] Replace all `/placeholder.png` with real product images
- [ ] Use brand press-pack images or properly licensed product photos
- [ ] Optimise: WebP, max 800×800px

### 6.3 Vercel environment variables
```
NEXT_PUBLIC_SITE_URL=https://www.findmyideal<product>.com
NEXT_PUBLIC_GA4_ID=<product-specific GA4 measurement ID>
ADMIN_PASSWORD=<strong random string>
ADMIN_TOKEN_SECRET=<strong random string>
DEFAULT_CATEGORY_ID=<product>
```

### 6.4 SEO verification (after first deploy)
- [ ] `https://www.findmyideal<product>.com/robots.txt` returns 200
- [ ] `https://www.findmyideal<product>.com/sitemap.xml` returns 200 with correct URLs
- [ ] Homepage canonical tag is correct
- [ ] Results page is noindex
- [ ] Admin and API routes are disallowed in robots.txt

### 6.5 Affiliate account applications
- [ ] Apply for Amazon UK Associates (https://affiliate-program.amazon.co.uk)
- [ ] Apply for Amazon US Associates
- [ ] Note: requires live site with original content, privacy policy, about page, contact page

### 6.6 GA4 setup
- [ ] Create new GA4 property for this product
- [ ] Add `NEXT_PUBLIC_GA4_ID` to Vercel
- [ ] Verify `quiz_start`, `question_answered`, `results_viewed`, `affiliate_click` events fire

---

## Phase 7 — Post-Launch Growth

| # | Action | Impact |
|---|---|---|
| 1 | Add email capture on results page | Builds list; second affiliate click opportunity |
| 2 | Add shareable results URL (answers in query string) | Viral coefficient; link building |
| 3 | Expand UK specialist retailers (e.g. John Lewis, Dunelm, specialist shops) | Higher commission rates (5–8% vs Amazon 3–5%) |
| 4 | Add Open Graph / Twitter card tags | Social sharing previews |
| 5 | Add "How scoring works" explainer to About page | Trust; Amazon reviewer credibility signal |
| 6 | Run A/B test on question order | CRO; reduce drop-off |
| 7 | Add product comparison table to SEO pages | Affiliate link density; dwell time |
| 8 | Apply for specialist retailer affiliate programmes (Awin, TRIAD) | Revenue diversification |

---

## NEXT-STEPS.md Template for New Product

Copy this into `NEXT-STEPS.md` at clone time and fill in `<product>`:

```markdown
# <Product> Finder — Next Steps Guide

_Created <date>. All items grounded in code review._

## 🔴 Must Fix Before Any Live Traffic

| # | What | Where |
|---|---|---|
| 1 | Replace all `/placeholder.png` with real product images | `config/<product>/products.ts` |
| 2 | Add affiliate disclosure to results page (UK ASA + Amazon Associates requirement) | `app/results/page.tsx` |
| 3 | Review result card explanations — make them conversion-worthy sentences | `app/results/page.tsx` |

## 🟡 Fix Before Promotion / SEO Launch

| # | What | Notes |
|---|---|---|
| 4 | Replace all temporary search buy-links with direct product page ASINs | `config/<product>/buy-links.ts` |
| 5 | Build SEO landing pages (4–6 pages, 500+ words each) | `config/<product>/seo-pages.ts` |
| 6 | Add GA4 analytics events from day one | `lib/analytics.ts` |
| 7 | Add About page content describing the algorithm | `app/about/AboutPageClient.tsx` |

## 🟢 Post-Launch

| # | What | Notes |
|---|---|---|
| 8 | Email capture on results page | — |
| 9 | Shareable results URL | — |
| 10 | Specialist retailer affiliate programmes | Awin, TRIAD |
| 11 | Open Graph / Twitter card meta | `app/layout.tsx` |
| 12 | Scoring tuning pass (once real GA4 data available) | `config/<product>/scoring.ts` |
```

---

## Appendix: Scoring Engine Patterns

### Pattern A: Ranked attribute match (e.g. firmness, compression)
```ts
const RANK: Record<string, number> = { soft: 0, 'medium-soft': 1, medium: 2, firm: 3 };
const delta = Math.abs(RANK[userPref] - RANK[String(a.firmness)]);
score += delta === 0 ? 12 : delta === 1 ? 6 : delta === 2 ? 0 : -6;
```

### Pattern B: Hard constraint / disqualifier
```ts
const DISQUALIFY_PENALTY = -25; // large enough to sink below any realistic score
if (needsFeature && !a.hasFeature) {
  score += DISQUALIFY_PENALTY;
  reasons.push('Does not meet your essential requirement');
}
// Final: score = Math.max(0, totalScore) — disqualified products score 0
```

### Pattern C: Compatibility matrix (e.g. sleep position × pillow type)
```ts
const COMPAT: Record<string, Record<string, number>> = {
  'side':   { 'side': 15, 'back': 4, 'stomach': -10, 'any': 10 },
  'back':   { 'back': 15, 'side': 4, 'stomach': -4,  'any': 10 },
  'stomach':{ 'stomach': 15, 'back': 4, 'side': -6,  'any': 6  },
};
score += COMPAT[userPosition]?.[String(a.sleepPosition)] ?? 0;
```

### Pattern D: Tier-based budget
```ts
const TIERS = ['budget', 'mid', 'premium'];
const userIdx = TIERS.indexOf(userBudget);
const prodIdx = TIERS.indexOf(String(a.priceTier));
const over = prodIdx - userIdx;
score += over === 0 ? 5 : over === -1 ? 2 : over === 1 ? -5 : -15;
```
