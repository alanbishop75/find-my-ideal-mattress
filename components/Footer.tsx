"use client";
import React from "react";
import Link from "next/link";
import { useTheme } from "../core/theme";


export function Footer() {
  const { tokens } = useTheme();
  const linkStyle = {
    color: "rgba(255,255,255,0.78)",
    textDecoration: "none",
    fontWeight: 500,
  } as const;
  return (
    <footer
      style={{
        background: "#0b2545",
        color: "rgba(255,255,255,0.7)",
        padding: "32px 20px 24px",
        fontSize: 13,
        lineHeight: 1.7,
        marginTop: "auto",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <div style={{ marginBottom: 14, color: "#ffffff", fontWeight: 700, fontSize: 15, letterSpacing: 0.2 }}>
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
        <a
          href="https://www.findyourideal.info"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          FindYourIdeal Hub
        </a>
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
        <p style={{ margin: "0 0 6px 0", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
          <em>
            Some links on this site are affiliate links. We may earn a small commission
            on qualifying purchases at no extra cost to you.
          </em>
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
          Part of the <a href="https://www.findyourideal.info" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.78)" }}>FindYourIdeal network</a>.
        </p>
        <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
          &copy; {new Date().getFullYear()} FindYourIdealMattress. All rights reserved.
        </p>
      </div>

    </footer>
  );
}
