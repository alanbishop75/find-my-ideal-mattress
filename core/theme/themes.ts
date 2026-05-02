import { ThemeTokens } from "./tokens";

export const themes: Record<string, ThemeTokens> = {
  /**
   * White — clean SaaS / generic hub look.
   * Suits: FindMyIdealHub, generic product categories.
   */
  "white": {
    background: "#fff",
    surface: "#f7f7f9",
    surfaceAlt: "#ececf0",
    textPrimary: "#18181b",
    textSecondary: "#52525b",
    border: "#e5e7eb",
    accent: "#2563eb",
    accentHover: "#1d4ed8",
    accentSoft: "#dbeafe",
    accentForeground: "#ffffff",
    success: "#22c55e",
    warning: "#f59e42",
  },
  /**
   * Light Green — fresh, outdoor/sports feel.
   * Suits: FindMyIdealGolfBall, golf accessories.
   */
  "light-green": {
    background: "#f6fbf7",
    surface: "#eaf6ec",
    surfaceAlt: "#d7eedd",
    textPrimary: "#1a3d2f",
    textSecondary: "#4b6b57",
    border: "#cbe3d3",
    accent: "#3bb273",
    accentHover: "#2e8c5e",
    accentSoft: "#e0f5e9",
    accentForeground: "#ffffff",
    success: "#22c55e",
    warning: "#f59e42",
  },
  /**
   * Blue — tech / digital / modern feel.
   * Suits: FindMyIdealHeadphones, electronics, software.
   */
  "blue": {
    background: "#f7faff",
    surface: "#eaf0fa",
    surfaceAlt: "#dbe7f6",
    textPrimary: "#1a2340",
    textSecondary: "#4b5876",
    border: "#c7d3e6",
    accent: "#2563eb",
    accentHover: "#1d4ed8",
    accentSoft: "#e0eaff",
    accentForeground: "#ffffff",
    success: "#22c55e",
    warning: "#f59e42",
  },
  /**
   * Classic Navy — premium US-market feel.
   * Deep navy + clean cool-white. Trustworthy and authoritative without any
   * explicit political or novelty signalling.
   * Suits: US-facing affiliate sites — FindMyIdealGolfBall (US), running shoes,
   *        mattresses, pillows, any product needing a credible American premium feel.
   */
  "classic-navy": {
    background: "#f8f9fc",
    surface: "#edf0f8",
    surfaceAlt: "#e1e6f4",
    textPrimary: "#1c2340",
    textSecondary: "#4b5275",
    border: "#cdd4e8",
    accent: "#1b3a6e",
    accentHover: "#142d56",
    accentSoft: "#dce5f5",
    accentForeground: "#ffffff",
    success: "#22c55e",
    warning: "#f59e42",
  },
};
