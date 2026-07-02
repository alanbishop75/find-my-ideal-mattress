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
 * Current values intentionally match the golf golden source so mattress SEO
 * pages render identically. To give mattress its own brand identity later,
 * swap these values (e.g. navy -> forest, lime -> green) in this one file.
 */
export const seoPalette = {
  /** Primary brand/ink colour — headings, dark hero gradient base. */
  navy: "#0b2545",
  /** Accent colour — pill CTAs, card left-border, buy buttons. */
  lime: "#7dbe3a",
  /** Text colour placed on top of the accent (matches navy for contrast). */
  limeDark: "#0b2545",
  /** Softer accent used for hub card left-borders and hero CTA panels. */
  softLime: "#a8cf74",
  /** Pure white surfaces. */
  white: "#ffffff",
  /** Page background + neutral image backdrop. */
  surface: "#f5f8fa",
  /** Hairline border colour. */
  border: "#e1e8ed",
  /** Primary body text on light surfaces. */
  text: "#1f334c",
  /** Secondary/muted body text. */
  text2: "#516781",
} as const;

export type SeoPalette = typeof seoPalette;
