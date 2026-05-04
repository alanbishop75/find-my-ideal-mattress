"use client";
import React from "react";
import Link from "next/link";
import { useTheme } from "../core/theme";


export function Footer() {
  const { tokens } = useTheme();
  return (
    <footer
      style={{
        background: tokens.surfaceAlt,
        borderTop: `1px solid ${tokens.border}`,
        color: tokens.textSecondary,
        padding: "20px 16px",
        fontSize: 13,
        textAlign: "center",
        lineHeight: 1.8,
      }}
    >
      <p style={{ margin: "0 0 6px 0" }}>
        &copy; {new Date().getFullYear()} FindYourIdealMattress. All rights reserved.
      </p>
      <p style={{ margin: "0 0 6px 0" }}>
        <em>
          Some links on this site are affiliate links. We may earn a small commission
          on qualifying purchases at no extra cost to you.
        </em>
      </p>
      <nav style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
        <Link href="/about" style={{ color: tokens.textSecondary, textDecoration: "underline" }}>
          About
        </Link>
        <Link href="/contact" style={{ color: tokens.textSecondary, textDecoration: "underline" }}>
          Contact
        </Link>
        <Link href="/faq" style={{ color: tokens.textSecondary, textDecoration: "underline" }}>
          FAQ
        </Link>
        <Link href="/privacy-policy" style={{ color: tokens.textSecondary, textDecoration: "underline" }}>
          Privacy Policy
        </Link>
        <Link href="/terms" style={{ color: tokens.textSecondary, textDecoration: "underline" }}>
          Terms
        </Link>
        <a
          href="https://x.com/FYIdealMattress"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: tokens.textSecondary, textDecoration: "underline" }}
        >
          X (Twitter)
        </a>
      </nav>

    </footer>
  );
}
