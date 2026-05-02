"use client";
import React from "react";
import { useTheme } from "../core/theme";

export function Hero({ title, subtitle }: { title: string; subtitle?: string }) {
  const { tokens } = useTheme();
  return (
    <section
      style={{
        background: tokens.background,
        color: tokens.textPrimary,
        padding: "32px 0 16px 0",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 16, color: tokens.textSecondary }}>{subtitle}</p>}
    </section>
  );
}
