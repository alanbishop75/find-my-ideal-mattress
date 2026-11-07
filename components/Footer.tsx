"use client";
import React from "react";
import Link from "next/link";
import { useTheme } from "../core/theme";


export function Footer() {
  const { tokens } = useTheme();
  const linkStyle = {
    color: tokens.textSecondary,
    textDecoration: "none",
    fontWeight: 500,
  } as const;
  return (
    <footer
      style={{
        background: tokens.surfaceAlt,
        borderTop: `1px solid ${tokens.border}`,
        color: tokens.textSecondary,
        padding: "32px 20px 24px",
        fontSize: 13,
        lineHeight: 1.7,
        marginTop: "auto",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <div style={{ marginBottom: 14, color: tokens.textPrimary, fontWeight: 700, fontSize: 15, letterSpacing: 0.2 }}>
          Find Your <span style={{ color: tokens.accent }}>Ideal Mattress</span>
        </div>
        <nav
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 22,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
        <Link href="/about" style={linkStyle}>
          About
        </Link>
        <Link href="/contact" style={linkStyle}>
          Contact
        </Link>
        <Link href="/faq" style={linkStyle}>
          FAQ
        </Link>
        <Link href="/privacy-policy" style={linkStyle}>
          Privacy Policy
        </Link>
        <Link href="/affiliate-disclosure" style={linkStyle}>
          Affiliate Disclosure
        </Link>
        <Link href="/terms" style={linkStyle}>
          Terms
        </Link>
        <a
          href="https://x.com/FYIdealMattress"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          X (Twitter)
        </a>
        </nav>
        <p style={{ margin: "0 0 6px 0", fontSize: 12, color: tokens.textSecondary }}>
          <em>
            Some links on this site are affiliate links. We may earn a small commission
            on qualifying purchases at no extra cost to you.
          </em>
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: 12, color: tokens.textSecondary }}>
          <a href="https://www.findyourideal.info" rel="noopener" style={{ color: tokens.textSecondary }}>Part of the FindYourIdeal network</a>.
        </p>
        <p style={{ margin: 0, fontSize: 12, color: tokens.textSecondary, opacity: 0.88 }}>
          &copy; {new Date().getFullYear()} FindYourIdealMattress. All rights reserved.
        </p>
      </div>

    </footer>
  );
}
