"use client";
import React from "react";
import { useTheme } from "../core/theme";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export function Button({ variant = "primary", children, ...props }: ButtonProps) {
  const { tokens } = useTheme();
  const base = {
    border: `1px solid ${tokens.border}`,
    borderRadius: 8,
    padding: "12px 20px",
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s, border 0.2s",
    outline: "none",
  } as React.CSSProperties;
  const styles =
    variant === "primary"
      ? {
          ...base,
          background: tokens.accent,
          color: tokens.accentForeground,
          border: `1px solid ${tokens.accent}`,
        }
      : {
          ...base,
          background: tokens.accentSoft,
          color: tokens.accent,
        };
  return (
    <button style={styles} {...props}>
      {children}
    </button>
  );
}
