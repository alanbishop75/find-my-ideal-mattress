"use client";
import React from "react";
import Image from "next/image";
import { useTheme } from "../core/theme";
import { Badge } from "./Badge";
import type { BuyLink } from "../core/geo/types";

const priceTierLabel: Record<string, string> = {
  premium: "Premium",
  mid: "Mid-range",
  budget: "Budget",
};

interface ResultsCardProps {
  image: string;
  title: string;
  explanation: string;
  badges: string[];
  /** Region-filtered buy links for the active market. */
  buyLinks?: BuyLink[];
  label?: string;
  isBest?: boolean;
  priceTier?: string;
  /** Approximate price string shown on the card, e.g. "~£40" or "~$50". */
  priceHint?: string;
  onCtaClick?: () => void;
}

// ── Multi-link "Where to buy" section ────────────────────────────────────────

interface BuyLinksProps {
  links: BuyLink[];
  tokens: ReturnType<typeof useTheme>["tokens"];
  onCtaClick?: () => void;
}

function BuyLinksSection({ links, tokens, onCtaClick }: BuyLinksProps) {
  // Strict rule: only show links that are fully verified (isTemporary: false).
  // Search URLs, generated candidates, and unverified ASINs must not be
  // shown to users regardless of how they arrive in the links array.
  const verifiedLinks = links.filter((l) => !l.isTemporary);
  if (verifiedLinks.length === 0) return null;

  const primary = verifiedLinks.find((l) => l.isPrimary) ?? verifiedLinks[0];
  const secondary = verifiedLinks.filter((l) => l.retailerKey !== primary.retailerKey);

  return (
    <div style={{ marginTop: 14 }}>
      <p style={{
        fontSize: 11,
        fontWeight: 600,
        color: tokens.textSecondary,
        margin: "0 0 8px 0",
        textTransform: "uppercase",
        letterSpacing: 0.6,
      }}>
        Where to buy
      </p>

      {/* Primary retailer — full-width accent button */}
      <a
        href={primary.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={onCtaClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          background: tokens.accent,
          color: tokens.accentForeground,
          borderRadius: 8,
          height: 44,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
          marginBottom: secondary.length > 0 ? 6 : 0,
        }}
      >
        {primary.retailerName}
      </a>

      {/* Secondary retailers — compact pill row */}
      {secondary.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {secondary.map((link) => (
            <a
              key={link.retailerKey}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={onCtaClick}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                minWidth: 0,
                border: `1px solid ${tokens.border}`,
                background: tokens.surface,
                color: tokens.textPrimary,
                borderRadius: 8,
                height: 36,
                fontWeight: 600,
                fontSize: 12,
                textDecoration: "none",
                whiteSpace: "nowrap",
                padding: "0 10px",
              }}
            >
              {link.retailerName}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

export function ResultsCard({ image, title, explanation, badges, buyLinks, label, isBest, priceTier, priceHint, onCtaClick }: ResultsCardProps) {
  const { tokens } = useTheme();

  const hasBuyLinks = buyLinks && buyLinks.length > 0;

  return (
    <div
      style={{
        background: tokens.surface,
        border: `${isBest ? "2px" : "1px"} solid ${isBest ? tokens.accent : tokens.border}`,
        borderRadius: 14,
        boxShadow: isBest ? `0 4px 16px 0 ${tokens.accentSoft}` : "0 2px 8px 0 rgba(0,0,0,0.04)",
        padding: "16px",
        width: "100%",
      }}
    >
      {/* Label row */}
      {label && (
        <div style={{ marginBottom: 12 }}>
          <span style={{
            display: "inline-block",
            background: isBest ? tokens.accent : tokens.accentSoft,
            color: isBest ? tokens.accentForeground : tokens.accent,
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 10px",
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}>{label}</span>
        </div>
      )}

      {/* Horizontal product row */}
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 12 }}>
        <Image
          src={image}
          alt={title}
          width={72}
          height={72}
          style={{ objectFit: "contain", borderRadius: 8, background: tokens.surfaceAlt, flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: tokens.textPrimary, margin: "0 0 3px 0", lineHeight: 1.25 }}>{title}</h3>
          {priceTier && (
            <p style={{ fontSize: 13, color: tokens.textSecondary, margin: "0 0 6px 0", fontWeight: 500 }}>
              {priceTierLabel[priceTier] ?? priceTier}
              {priceHint && (
                <span style={{ marginLeft: 6, fontWeight: 400, opacity: 0.75 }}>· {priceHint}</span>
              )}
            </p>
          )}
          <p style={{ fontSize: 14, color: tokens.textSecondary, margin: 0, lineHeight: 1.5 }}>{explanation}</p>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
          {badges.slice(0, 3).map((b) => (
            <Badge key={b}>{b}</Badge>
          ))}
        </div>
      )}

      {/* Buy links */}
      {hasBuyLinks ? (
        <BuyLinksSection links={buyLinks} tokens={tokens} onCtaClick={onCtaClick} />
      ) : null /* No links available for this product/region */}
    </div>
  );
}
