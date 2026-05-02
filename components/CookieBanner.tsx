"use client";

import { useState } from "react";

type GtagFn = (command: string, event: string, params?: Record<string, string>) => void;

const STORAGE_KEY = "cookie_consent";

function updateGtagConsent(value: "granted" | "denied") {
  if (typeof window !== "undefined" && typeof (window as typeof window & { gtag?: GtagFn }).gtag === "function") {
    (window as typeof window & { gtag: GtagFn }).gtag("consent", "update", {
      analytics_storage: value,
      ad_storage: value,
    });
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === null;
    } catch {
      // localStorage unavailable — don't show banner, fail silently
      return false;
    }
  });

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, "granted"); } catch { /* ignore */ }
    updateGtagConsent("granted");
    setVisible(false);
  }

  function decline() {
    try { localStorage.setItem(STORAGE_KEY, "denied"); } catch { /* ignore */ }
    updateGtagConsent("denied");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "#fff",
        borderTop: "1px solid #e5e7eb",
        padding: "16px 20px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
      }}
    >
      <p style={{ margin: 0, fontSize: 14, color: "#374151", flex: "1 1 260px", lineHeight: 1.5 }}>
        We use analytics cookies to understand how the site is used. You can accept or decline below.{" "}
        <a href="/privacy-policy" style={{ color: "#16a34a", textDecoration: "underline" }}>
          Privacy policy
        </a>
        .
      </p>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button
          onClick={decline}
          style={{
            padding: "8px 18px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            background: "#fff",
            color: "#374151",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Decline
        </button>
        <button
          onClick={accept}
          style={{
            padding: "8px 18px",
            borderRadius: 6,
            border: "none",
            background: "#16a34a",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
