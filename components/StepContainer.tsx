"use client";
import React from "react";
import { useTheme } from "../core/theme";

export function StepContainer({ children }: { children: React.ReactNode }) {
  const { tokens } = useTheme();
  return (
    <div
      style={{
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: 12,
        padding: 20,
        margin: "0 auto",
        maxWidth: 480,
      }}
    >
      {children}
    </div>
  );
}
