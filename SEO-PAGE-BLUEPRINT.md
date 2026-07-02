# SEO Page Blueprint (Mattress)

Status: Active guardrail
Purpose: Prevent format drift and enforce exact SEO page rendering parity.
Visual golden source: golf SEO renderer in app/golf-ball/[slug]/GolfBallSeoLandingPage.tsx and golf hub in app/golf-ball/best-golf-ball/page.tsx.
Mattress implementation targets:
- Detail pages: app/mattress/[slug]/MattressSeoLandingPage.tsx
- Hub page: app/mattress/best-mattress/page.tsx + app/mattress/best-mattress/HubQuickBuySectionClient.tsx
must match the golf structure, layout, section behavior, and interaction pattern exactly.

## Palette Strategy (Option B — shared structure, per-site palette object)

- Structure/layout/spacing are LOCKED and shared with golf. Colours are the ONLY
  per-site variable, and they live in ONE file: `config/mattress/seo-theme.ts` (`seoPalette`).
- Every SEO/hub surface MUST import `seoPalette` and derive its local `NAVY/LIME/...`
  constants from it. Do NOT hardcode hex values in components and do NOT read
  `useTheme()`/`tokens.*` in any SEO/hub component.
- To re-skin the mattress SEO surface, change ONLY the hex values in `seoPalette`.
  Never change structure to change colour.
- Current `seoPalette` values intentionally equal the golf golden source.

## No Global Chrome On SEO/Hub Pages

- Golf renders NO global `<Header>`; the navy hero IS the header. Mattress must match.
- The app root layout MUST NOT render a global site header above SEO/hub pages
  (this caused the "extra header" — a green bar stacked above the navy hero).
- Exactly ONE header per page: the page's own hero. One palette per page across
  hero, hub, and any chrome — never a different-coloured header above the hero.

## No-Drift Rule (Non-Negotiable)

- Golf SEO page is the golden source for look and feel.
- Mattress SEO pages must preserve the same section order, container widths, card pattern, CTA row pattern, jump-link behavior, and anchor IDs used by golf.
- Allowed substitutions only:
  - Product noun/content (golf ball to mattress)
  - Route paths (/golf-ball/* to /mattress/*)
  - CTA label token (non-golf uses Start Quiz)
  - Data payload (whoItIsFor/sections/keyFactors/faq/relatedSlugs)
  - Palette hex values via `seoPalette` (structure stays identical)
- Not allowed:
  - Reordering sections
  - Replacing chip-style jump links with list-style links
  - Removing section IDs used by jump links
  - Changing hero CTA layout pattern (primary CTA + Or + Quick Buy + trust micro-line)
  - Using theme tokens (useTheme/tokens.*) instead of the fixed palette constants below
  - Centered single-column hero, plain white hero card, or maxWidth other than 900

## Visual System (Exact — copy these values, do not re-interpret)

This is the source of past drift. The renderer must use these literal values.
Do NOT swap them for `useTheme()` tokens, brand colors, or "close enough" equivalents.

### Palette constants (declare at top of renderer)

Derive from the single source of truth — do NOT hardcode hex values:

```
import { seoPalette } from "../../../config/mattress/seo-theme";

const NAVY = seoPalette.navy;        // "#0b2545"
const LIME = seoPalette.lime;        // "#7dbe3a"
const LIME_DARK = seoPalette.limeDark; // "#0b2545"
const SOFT_LIME = seoPalette.softLime; // "#a8cf74" (hub accents)
const WHITE = seoPalette.white;      // "#ffffff"
const SURFACE = seoPalette.surface;  // "#f5f8fa"
const BORDER = seoPalette.border;    // "#e1e8ed"
const TEXT = seoPalette.text;        // "#1f334c" (hub body)
const TEXT2 = seoPalette.text2;      // "#516781"
```

### Outer wrapper + mobile style block

- Outer: `<div style={{ width: "100%", background: SURFACE }}>` (NOT centered flex, NOT tokens.background).
- Include the `<style>` block with mobile media queries for `.seo-hero-row`, `.seo-hero-logo`, `.seo-hero-text`, `.seo-hero-cta`, `.quick-buy-grid`.

### Hero (navy gradient, logo left)

- Section background: `linear-gradient(135deg, #0b2545 0%, #0e2d52 55%, #143869 100%)`, color `#ffffff`, padding `48px 20px 56px`, `position: relative`, `overflow: hidden`.
- Decorative circle: absolutely positioned, `top:-80 right:-80`, `280x280`, `borderRadius:"50%"`, `border: 2px solid LIME`, `opacity: 0.14`.
- Breadcrumb: `maxWidth 900`, white translucent links `rgba(255,255,255,0.55)`, `›` separators, active crumb `rgba(255,255,255,0.85)`.
- Row: `maxWidth 900`, flex, `gap 40`, `flexWrap`, className `seo-hero-row`.
- Logo: circular `Image src="/images/logo.PNG"` width/height `120`, `borderRadius:"50%"`, `boxShadow:"0 8px 32px -8px rgba(0,0,0,0.5)"`, className `seo-hero-logo`.
- H1: `fontSize: "clamp(26px, 4vw, 42px)"`, `fontWeight: 800`, `letterSpacing: -0.8`, `lineHeight: 1.1`.
- Intro: `fontSize 16`, `rgba(255,255,255,0.78)`, `maxWidth 520`.
- Primary CTA: LIME pill (see below).
- Secondary: `Or` in `rgba(255,255,255,0.8)` weight 700, then a LIME pill link to `#quick-buy-starting-point`.
- Trust micro-line row: two spans `rgba(255,255,255,0.5)` fontSize 13.

### LIME pill CTA (ctaButton)

```
background: LIME; color: LIME_DARK; borderRadius: 999; padding: "14px 30px";
fontWeight: 800; fontSize: 16; letterSpacing: 0.2;
boxShadow: "0 8px 24px -8px rgba(125,190,58,0.5)";
```

### Content column

- `maxWidth: 900`, `margin: "0 auto"`, `padding: "0 20px 64px"`.

### Mini stats (3 cards, with emoji icons)

- Grid `repeat(3, 1fr)`, gap 12, centered.
- Each card: white bg, `1px solid BORDER`, `borderRadius 12`, `padding "16px 8px"`.
- Emoji icon `fontSize 24`, label `fontSize 15 / weight 800 / NAVY`, sub `fontSize 12 / TEXT2`.
- Icons: 🎯 / ⏱️ / 📋 (subs may adapt to the product noun).

### Card style (all content sections)

```
background: WHITE; border: 1px solid BORDER; borderRadius: 16;
padding: "24px 28px"; marginTop: 20; borderLeft: "4px solid LIME";
```

- `h2Style`: fontSize 20, weight 700, NAVY, `margin "0 0 14px 0"`.
- `h3Style`: fontSize 16, weight 700, NAVY.
- `bodyStyle`: fontSize 15, TEXT2, `lineHeight 1.75`.

### Jump-link chips

- Pill `Link`: `1px solid BORDER`, `borderRadius 999`, `padding "8px 12px"`, color NAVY, weight 700, background WHITE.

### Quick Buy (fixed two-column)

- Grid: `repeat(2, minmax(0, 1fr))`, gap 14, `alignItems: "stretch"`, className `quick-buy-grid`, id `quick-buy-starting-point`.
- Left aside: `1px solid BORDER`, `borderRadius 12`, `padding "14px 14px"`, background `#f0f7f4`, `minHeight 360`. Badge background `#d4e8df`, NAVY pill CTA (`background NAVY`, white, `borderRadius 999`, full width).
- Right article: white, same border/radius/padding, `minHeight 360`. Product `Image` 90x90 contain. LIME pill buy button (`background LIME`, `color LIME_DARK`, full width). Buy link `rel="sponsored nofollow noopener noreferrer"` `target="_blank"`.

### Mid-page CTA block

- `cardStyle` overridden: `background: "linear-gradient(135deg, #0b2545 0%, #143869 100%)"`, `border: none`, `borderLeft: none`, white heading (fontSize 18/weight 700), body `rgba(255,255,255,0.75)`, then LIME pill CTA.

### Related guides

- `aside` = `cardStyle` with `borderLeft: "4px solid BORDER"` (not LIME). Links colored LIME, weight 600, `→` suffix.


## Required Page Order (Exact)

1. Metadata + canonical + robots index/follow
2. Structured data (Article + Breadcrumb + FAQ when available)
3. Hero section
- Breadcrumb trail
- Logo
- H1
- Intro paragraph
- Primary CTA
- Or separator
- Secondary CTA
- Trust micro-line row
4. Mini stats row (3 cards)
5. Is this guide for you?
6. Jump to a section (chip links)
7. Quick verdict
8. Best options at a glance
9. How we ranked these options
10. Quick Buy section (two-column compare card)
11. Hub bridge card
12. How the matching quiz works
13. Educational content sections (H2 + optional H3), each H2 with stable slug ID
14. Mid-page CTA block
15. What our quiz looks at
16. FAQ section
17. Last reviewed line
18. Related guides

## Required IDs and Anchors

- quick-verdict
- best-options-at-a-glance
- how-we-ranked-these-options
- quick-buy-starting-point
- matching-quiz-works
- slugified IDs for each educational H2 section

## Hub Page (best-mattress) — Exact Spec

Golden source: golf hub `app/golf-ball/best-golf-ball/page.tsx` + `HubQuickBuySectionClient.tsx`.
The hub shares the SAME palette (`seoPalette`) and the SAME visual language as the detail pages.

### Hub structure (exact order)

1. FAQPage JSON-LD (`<script type="application/ld+json">`).
2. Hero `<section>`: navy gradient `linear-gradient(135deg, #0b2545 0%, #0e2d52 55%, #143869 100%)`, `maxWidth 920`.
   - Breadcrumb (Home › Best Mattress), H1 `clamp(30px,5vw,46px)`, two intro paragraphs.
   - Icon bullet list (3 items, emoji + bold label + text) in white translucent text.
   - CTA panel 1 (fitting): `background SOFT_LIME`, NAVY heading, dark button `#123358`.
   - `OR` divider (two hairlines + centered `OR`).
   - CTA panel 2 (Quick Buy): same SOFT_LIME panel, links to `#quick-buy-starting-points`.
3. `<main maxWidth 920 padding "24px 20px 64px">`:
   - `#jump-links` chip bar (SOFT_LIME left border, "On this page", horizontal scroll chips).
   - `#quick-answer` — LIME-dot bullet list.
   - `#how-we-rank` — LIME-dot bullet list.
   - `#decision-matrix` — 2-col cards, circular emoji badge, "Prioritise" label, "Start here: <h1> →".
   - "How to think about the best mattress" card — LIME-dot bullets.
   - `<HubQuickBuySection>` (`#quick-buy-starting-points`).
   - `#browse-guides` — auto-fit guide cards, each `borderLeft: 4px solid SOFT_LIME`, "Open guide →".
   - Bottom CTA card — LIME pill "Get my mattress recommendation".
   - `#faq` — accordion-style list, NAVY questions, TEXT2 answers.

### Hub card pattern

- All hub content cards: white bg, 3-sided `1px solid BORDER` + `borderLeft: 4px solid SOFT_LIME`, `borderRadius 14`, `padding "22px 24px"`.
- Hub H2: `fontSize 24, color NAVY`. Body: `color TEXT2, lineHeight 1.7`. Bullet dot: 8px LIME circle.

### Hub Quick Buy cards (HubQuickBuySectionClient)

- Section: white card, `borderLeft: 4px solid LIME`.
- Cards grid: `repeat(auto-fit, minmax(220px, 1fr))`, gap 14, cards on `SURFACE` bg.
- Each card: "Quick Buy" eyebrow (NAVY), 72px product image, guide H1, bestFor line, reason line, "Open the full guide →" (NAVY), LIME pill buy button (`color NAVY`, full width, `rel="sponsored nofollow noopener noreferrer"`).

### Hub required IDs

- quick-buy-starting-points, quick-answer, how-we-rank, decision-matrix, browse-guides, faq, jump-links

### Hub allowed omissions

- The golf hub has a "Compare products" section fed by a comparison-pages config.
  Mattress has no comparison-pages config, so that section AND its `#compare-options`
  jump-link chip are omitted. If a mattress comparison config is added later, restore
  both to match golf exactly.

## Pre-Release Checklist

- Palette constants (NAVY/LIME/LIME_DARK/WHITE/SURFACE/BORDER/TEXT2) are declared and used — NO `useTheme`/`tokens.*` anywhere in the renderer.
- Outer wrapper is `width:100% background:SURFACE`; content column is `maxWidth 900`.
- Hero uses the navy gradient, decorative LIME circle, circular 120px logo on the left, and white translucent breadcrumb.
- Primary + secondary CTAs are LIME pills (`borderRadius 999`, LIME boxShadow); mid-page CTA block uses the navy gradient.
- Mini stats show emoji icons (🎯 / ⏱️ / 📋).
- Every content `cardStyle` has `borderLeft: 4px solid LIME`; related-guides aside uses `borderLeft: 4px solid BORDER`.
- Hero CTA row matches golf layout exactly.
- Jump-link chips render and all targets scroll to existing IDs.
- Quick verdict, best-options, and methodology sections are present.
- Quick Buy block is two-column and matches golf card composition.
- Hub bridge card points to /mattress/best-mattress.
- Related guides render from relatedSlugs with internal links.
- No section additions/removals/reorders relative to this blueprint.
- Colours come only from `seoPalette`; no hardcoded hex in components; no `useTheme`/`tokens.*`.
- No global site header renders above the hero (exactly one header per page).
- Hub page matches the "Hub Page (best-mattress) — Exact Spec" section, including navy hero and SOFT_LIME accents.
