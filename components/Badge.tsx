"use client";
import React from "react";
import { useTheme } from "../core/theme";

interface BadgeProps {
  children: React.ReactNode;
  color?: "accent" | "success" | "warning";
}

export function Badge({ children, color = "accent" }: BadgeProps) {
  const { tokens } = useTheme();
  const bg =
    color === "success"
      ? tokens.success
      : color === "warning"
      ? tokens.warning
      : tokens.accentSoft;
  const text =
    color === "success" || color === "warning"
      ? "#fff"
      : tokens.accent;
  return (
    <span
      style={{
        display: "inline-block",
        background: bg,
        color: text,
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 500,
        padding: "2px 10px",
        marginRight: 6,
        marginBottom: 4,
      }}
    >
      {children}
    </span>
  );
}
