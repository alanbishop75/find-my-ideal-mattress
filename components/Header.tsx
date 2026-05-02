
"use client";
import Link from "next/link";
import { useTheme } from "../core/theme";
import { useCategoryContext } from "../core/category-context";
import { FindMyIdealIcon, PillowIcon } from "./icons/FindMyIdealIcon";

export function Header() {
  const { tokens } = useTheme();
  const { brandName } = useCategoryContext();

  return (
    <header
      style={{
        background: tokens.surface,
        borderBottom: `1px solid ${tokens.border}`,
        color: tokens.textPrimary,
        padding: "16px 0",
        fontWeight: 600,
        fontSize: 28,
        letterSpacing: 0.5,
        textAlign: "center",
      }}
    >
      <Link
        href="/"
        style={{
          color: tokens.textPrimary,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <FindMyIdealIcon size={48} color={tokens.accent} />
        {brandName}
        <PillowIcon size={48} color={tokens.accent} />
      </Link>
    </header>
  );
}
