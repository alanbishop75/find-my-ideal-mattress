# SEO Page Blueprint (Mattress)

Status: Active guardrail
Purpose: Prevent format drift and enforce exact SEO page rendering parity.
Visual golden source: golf SEO renderer in app/golf-ball/[slug]/GolfBallSeoLandingPage.tsx.
Mattress implementation target: app/mattress/[slug]/MattressSeoLandingPage.tsx must match the golf renderer structure, layout, section behavior, and interaction pattern exactly.

## No-Drift Rule (Non-Negotiable)

- Golf SEO page is the golden source for look and feel.
- Mattress SEO pages must preserve the same section order, container widths, card pattern, CTA row pattern, jump-link behavior, and anchor IDs used by golf.
- Allowed substitutions only:
  - Product noun/content (golf ball to mattress)
  - Route paths (/golf-ball/* to /mattress/*)
  - CTA label token (non-golf uses Start Quiz)
  - Data payload (whoItIsFor/sections/keyFactors/faq/relatedSlugs)
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

```
const NAVY = "#0b2545";
const LIME = "#7dbe3a";
const LIME_DARK = "#0b2545";
const WHITE = "#ffffff";
const SURFACE = "#f5f8fa";
const BORDER = "#e1e8ed";
const TEXT2 = "#516781";
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
