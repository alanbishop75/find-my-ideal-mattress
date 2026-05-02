"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { themes } from "./themes";
import { ThemeTokens, ThemeName } from "./tokens";

interface ThemeContextType {
  tokens: ThemeTokens;
  themeName: ThemeName;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  /** Active theme provided by server/layout; defaults to white when omitted. */
  themeName?: ThemeName;
}

export function ThemeProvider({ children, themeName: overrideTheme }: ThemeProviderProps) {
  const resolvedName: ThemeName = overrideTheme ?? "white";
  const tokens = themes[resolvedName] ?? themes["white"];
  return (
    <ThemeContext.Provider value={{ tokens, themeName: resolvedName }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

