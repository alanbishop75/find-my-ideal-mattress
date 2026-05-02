"use client";
import React from "react";
import { useTheme } from "../core/theme";

interface ProgressProps {
  value: number; // 0-100
}

export function Progress({ value }: ProgressProps) {
  const { tokens } = useTheme();
  return (
    <div style={{ background: tokens.surfaceAlt, borderRadius: 8, height: 8, width: "100%" }}>
      <div
        style={{
          background: tokens.accent,
          height: 8,
          borderRadius: 8,
          width: `${value}%`,
          transition: "width 0.2s",
        }}
      />
    </div>
  );
}
