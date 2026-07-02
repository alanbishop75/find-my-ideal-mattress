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

- Hero CTA row matches golf layout exactly.
- Jump-link chips render and all targets scroll to existing IDs.
- Quick verdict, best-options, and methodology sections are present.
- Quick Buy block is two-column and matches golf card composition.
- Hub bridge card points to /mattress/best-mattress.
- Related guides render from relatedSlugs with internal links.
- No section additions/removals/reorders relative to this blueprint.
