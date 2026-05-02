// Semantic design tokens for FindMyIdeal platform
export type ThemeTokens = {
  background: string;
  surface: string;
  surfaceAlt: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  accent: string;
  accentHover: string;
  accentSoft: string;
  /** Foreground (text) colour for elements whose background is `accent`. */
  accentForeground: string;
  success: string;
  warning: string;
};

export const themeNames = [
  "white",
  "light-green",
  "blue",
  "classic-navy",
] as const;

export type ThemeName = typeof themeNames[number];
