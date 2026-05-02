"use client";
/**
 * FindMyIdeal Icon System
 * -----------------------
 * THEME INTEGRATION
 * All icons accept a `color` prop (defaults to `currentColor`).
 * This means they automatically inherit the surrounding text colour, which
 * is itself driven by theme tokens — no extra wiring needed for most uses.
 *
 * For explicit token-driven colours pass `color={tokens.accent}` from useTheme():
 *   const { tokens } = useTheme();
 *   <GolfBallIcon size={24} color={tokens.accent} />
 *
 * ADDING A NEW PRODUCT ICON
 * 1. Create an export below following the existing pattern (IconProps, makeId, currentColor default).
 * 2. Add it to the product's Header/Footer via the categoryRegistry icon field (see THEME-SYSTEM.md).
 * 3. Never hardcode a hex colour inside an icon component — always use `color` or `currentColor`.
 *
 * ICON CATALOGUE
 * FindMyIdealIcon  — generic "target + find" mark for cross-product / hub use
 * GolfBallIcon     — FindMyIdealGolfBall
 * PillowIcon       — FindMyIdealPillow
 * MattressIcon     — FindMyIdealMattress
 * HeadphonesIcon   — FindMyIdealHeadphones
 *
 * Size guide:
 *   16px — favicon / tight nav
 *   24px — header / footer
 *   32px — landing page badge
 *   48px — large marketing use
 */

import React from "react";

// ─── Shared types ────────────────────────────────────────────────────────────

export interface IconProps {
  /** Pixel size. Rendered as a square. Default: 24 */
  size?: number;
  /** className forwarded to the <svg> element */
  className?: string;
  /** Inline style forwarded to the <svg> element */
  style?: React.CSSProperties;
  /**
   * Accessible label. When provided, the icon is announced by screen readers.
   * Omit (or pass undefined) for purely decorative icons — aria-hidden is set automatically.
   */
  title?: string;
  /** Override stroke/fill colour. Defaults to currentColor. */
  color?: string;
  /**
   * Dimple dot colour for GolfBallIcon. Defaults to rgba(255,255,255,0.92).
   * Pass a dark value when rendering on a light background.
   */
  overlayColor?: string;
}

// ─── Base icon ───────────────────────────────────────────────────────────────

/**
 * Generic FindMyIdeal icon — "Target + Find".
 * No product overlay. Use this in cross-product contexts (hub, shared nav, etc.)
 */
export function FindMyIdealIcon({
  size = 24,
  className,
  style,
  title,
  color = "currentColor",
  overlay,
}: IconProps & { overlay?: React.ReactNode }) {
  const titleId = title ? `fmi-icon-title-${title.replace(/\s+/g, "-").toLowerCase()}` : undefined;
  const isDecorative = !title;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden={isDecorative ? "true" : undefined}
      aria-labelledby={titleId}
      role={isDecorative ? undefined : "img"}
      className={className}
      style={style}
    >
      {title && <title id={titleId}>{title}</title>}

      {/* Outer ring — continuous */}
      <circle
        cx="10"
        cy="10"
        r="8.5"
        stroke={color}
        strokeWidth="1.4"
        opacity="0.5"
      />

      {/* Inner ring fill — gives the icon depth and glow */}
      <circle
        cx="10"
        cy="10"
        r="5.5"
        fill={color}
        opacity="0.1"
      />

      {/* Inner ring stroke — the strong defining edge */}
      <circle
        cx="10"
        cy="10"
        r="5.5"
        stroke={color}
        strokeWidth="1.9"
        opacity="0.9"
      />

      {/* Centre dot — the ideal match, prominent */}
      <circle
        cx="10"
        cy="10"
        r="2.5"
        fill={color}
        opacity="1"
      />

      {/* Product overlay slot */}
      {overlay}
    </svg>
  );
}

// ─── Shared helper ───────────────────────────────────────────────────────────

function makeId(title: string | undefined) {
  return title ? `fmi-icon-title-${title.replace(/\s+/g, "-").toLowerCase()}` : undefined;
}

// ─── Golf Ball ────────────────────────────────────────────────────────────────
// White sphere, coloured stroke, 9 coloured dimple flecks in a 3×3 grid.

/**
 * Golf Ball icon — use in FindMyIdealGolfBall header, footer, favicon.
 * Ball face is white; `color` controls the outline and dimple colour (use accent green).
 */
export function GolfBallIcon({
  size = 24,
  className,
  style,
  title,
  color = "currentColor",
}: IconProps) {
  const titleId = makeId(title);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden={!title ? "true" : undefined}
      aria-labelledby={titleId}
      role={title ? "img" : undefined}
      className={className}
      style={style}
    >
      {title && <title id={titleId}>{title}</title>}
      {/* Ball — white face, coloured outline */}
      <circle cx="10" cy="10" r="8.5" fill="white" stroke={color} strokeWidth="1.6" />
      {/* Dimples — 19 hex-packed dots, 5 rows */}
      {/* Row 1 */}
      <circle cx="7.5"  cy="5.4"  r="0.85" fill={color} opacity="0.75" />
      <circle cx="10"   cy="5.4"  r="0.85" fill={color} opacity="0.75" />
      <circle cx="12.5" cy="5.4"  r="0.85" fill={color} opacity="0.75" />
      {/* Row 2 */}
      <circle cx="6.2"  cy="7.5"  r="0.85" fill={color} opacity="0.75" />
      <circle cx="8.7"  cy="7.5"  r="0.85" fill={color} opacity="0.75" />
      <circle cx="11.3" cy="7.5"  r="0.85" fill={color} opacity="0.75" />
      <circle cx="13.8" cy="7.5"  r="0.85" fill={color} opacity="0.75" />
      {/* Row 3 — widest */}
      <circle cx="5.0"  cy="9.8"  r="0.85" fill={color} opacity="0.75" />
      <circle cx="7.5"  cy="9.8"  r="0.85" fill={color} opacity="0.75" />
      <circle cx="10"   cy="9.8"  r="0.85" fill={color} opacity="0.75" />
      <circle cx="12.5" cy="9.8"  r="0.85" fill={color} opacity="0.75" />
      <circle cx="15.0" cy="9.8"  r="0.85" fill={color} opacity="0.75" />
      {/* Row 4 */}
      <circle cx="6.2"  cy="12.1" r="0.85" fill={color} opacity="0.75" />
      <circle cx="8.7"  cy="12.1" r="0.85" fill={color} opacity="0.75" />
      <circle cx="11.3" cy="12.1" r="0.85" fill={color} opacity="0.75" />
      <circle cx="13.8" cy="12.1" r="0.85" fill={color} opacity="0.75" />
      {/* Row 5 */}
      <circle cx="7.5"  cy="14.2" r="0.85" fill={color} opacity="0.75" />
      <circle cx="10"   cy="14.2" r="0.85" fill={color} opacity="0.75" />
      <circle cx="12.5" cy="14.2" r="0.85" fill={color} opacity="0.75" />
    </svg>
  );
}

// ─── Pillow ───────────────────────────────────────────────────────────────────
// Outer shell + inset face + centre seam — clearly a pillow at any size.

/**
 * Pillow icon — placeholder for FindMyIdealPillow.
 */
export function PillowIcon({
  size = 24,
  className,
  style,
  title,
  color = "currentColor",
}: IconProps) {
  const titleId = makeId(title);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden={!title ? "true" : undefined}
      aria-labelledby={titleId}
      role={title ? "img" : undefined}
      className={className}
      style={style}
    >
      {title && <title id={titleId}>{title}</title>}
      {/* Outer pillow shell */}
      <rect x="1.5" y="5.5" width="17" height="9" rx="4.5" stroke={color} strokeWidth="1.6" />
      {/* Inset face panel */}
      <rect x="4.5" y="7.5" width="11" height="5" rx="2.5" stroke={color} strokeWidth="0.85" opacity="0.4" />
      {/* Horizontal centre seam */}
      <line x1="4.5" y1="10" x2="15.5" y2="10" stroke={color} strokeWidth="0.85" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

// ─── Mattress ─────────────────────────────────────────────────────────────────
// Side view: thick comfort top + flat base + 3 spring columns.

/**
 * Mattress icon — placeholder for FindMyIdealMattress.
 */
export function MattressIcon({
  size = 24,
  className,
  style,
  title,
  color = "currentColor",
}: IconProps) {
  const titleId = makeId(title);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden={!title ? "true" : undefined}
      aria-labelledby={titleId}
      role={title ? "img" : undefined}
      className={className}
      style={style}
    >
      {title && <title id={titleId}>{title}</title>}
      {/* Comfort top layer */}
      <rect x="1.5" y="4.5" width="17" height="5" rx="2" stroke={color} strokeWidth="1.6" />
      {/* Horizontal quilt line inside top layer */}
      <line x1="3" y1="7" x2="17" y2="7" stroke={color} strokeWidth="0.75" strokeLinecap="round" opacity="0.35" />
      {/* Base platform */}
      <rect x="1.5" y="12.5" width="17" height="3" rx="1" stroke={color} strokeWidth="1.6" />
      {/* Spring columns */}
      <line x1="5.5"  y1="9.5"  x2="5.5"  y2="12.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
      <line x1="10"   y1="9.5"  x2="10"   y2="12.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
      <line x1="14.5" y1="9.5"  x2="14.5" y2="12.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

// ─── Headphones ───────────────────────────────────────────────────────────────
// Over-ear: smooth headband arc + ear cups with speaker-grille inner rings.

/**
 * Headphones icon — placeholder for FindMyIdealHeadphones.
 */
export function HeadphonesIcon({
  size = 24,
  className,
  style,
  title,
  color = "currentColor",
}: IconProps) {
  const titleId = makeId(title);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden={!title ? "true" : undefined}
      aria-labelledby={titleId}
      role={title ? "img" : undefined}
      className={className}
      style={style}
    >
      {title && <title id={titleId}>{title}</title>}
      {/* Headband — smooth arc sitting on top of ear cups */}
      <path d="M 3.5 13 A 6.5 7.5 0 0 1 16.5 13" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* Left ear cup */}
      <rect x="1.5" y="11.5" width="4" height="5.5" rx="2" stroke={color} strokeWidth="1.6" />
      {/* Left speaker grille */}
      <circle cx="3.5" cy="14.25" r="1" stroke={color} strokeWidth="0.75" opacity="0.4" />
      {/* Right ear cup */}
      <rect x="14.5" y="11.5" width="4" height="5.5" rx="2" stroke={color} strokeWidth="1.6" />
      {/* Right speaker grille */}
      <circle cx="16.5" cy="14.25" r="1" stroke={color} strokeWidth="0.75" opacity="0.4" />
    </svg>
  );
}

