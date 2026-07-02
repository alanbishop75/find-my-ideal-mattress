/**
 * config/mattress/seo-theme.ts
 *
 * SINGLE SOURCE OF TRUTH for the mattress SEO/hub visual palette.
 *
 * Per the SEO Page Blueprint (Option B — shared structure, per-site palette):
 * every SEO/hub component (detail renderer, hub page, hub quick-buy client,
 * and any future SEO surface) MUST import these values instead of declaring
 * local colour constants or reading `useTheme()` tokens.
 *
 * To re-skin the entire mattress SEO surface (hero, hub, cards, CTAs) change
 * ONLY the hex values below. Do NOT change structure, spacing, or layout —
 * those are locked by the blueprint and shared with the golf golden source.
 *
 * These values are the mattress brand forest-green palette taken from the
 * homepage (app/HomePageClient.tsx). The homepage palette is the site-wide
 * standard: the whole mattress site — homepage, hub, SEO detail, and compare —
 * uses these exact colours so every surface renders in one consistent green.
 * The `navy`/`lime` key NAMES are kept for structural parity with the golf/
 * pillow blueprint; only the values differ.
 */
export const seoPalette = {
  /** Primary brand/ink colour (homepage FOREST) — headings, dark hero base. */
  navy: "#1a3d2f",
  /** Accent colour (homepage GREEN) — pill CTAs, card left-border, buy buttons. */
  lime: "#3bb273",
  /** Text colour placed on top of the accent (forest for contrast on green). */
  limeDark: "#1a3d2f",
  /** Softer accent (brand mint) used for hub card left-borders and hero CTA panels. */
  softLime: "#7ed4a6",
  /** Pure white surfaces. */
  white: "#ffffff",
  /** Page background + neutral image backdrop (homepage SURFACE). */
  surface: "#f6fbf7",
  /** Hairline border colour (homepage BORDER). */
  border: "#cbe3d3",
  /** Primary body text on light surfaces (homepage TEXT_PRIMARY). */
  text: "#1a3d2f",
  /** Secondary/muted body text (homepage TEXT_SECONDARY). */
  text2: "#4b6b57",
} as const;

export type SeoPalette = typeof seoPalette;
