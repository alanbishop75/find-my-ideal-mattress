"use client";
import React from "react";
import { useTheme } from "../core/theme";

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card({ children, style }: CardProps) {
  const { tokens } = useTheme();
  return (
    <div
      style={{
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: 12,
        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.03)",
        padding: 20,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
