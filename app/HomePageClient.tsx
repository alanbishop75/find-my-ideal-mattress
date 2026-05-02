"use client";

import Link from "next/link";
import { useTheme } from "../core/theme";
import { useRegion } from "../core/geo/RegionContext";
import { getHomepageIntro } from "../core/geo/content";

export default function HomePageClient() {
  const { tokens } = useTheme();
  const { region, isLoading } = useRegion();
  const intro = getHomepageIntro(isLoading ? "UK" : region);
  const popularGuides: { href: string; label: string }[] = [];

  return (
    <div style={{ width: "100%", background: tokens.background, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 16px 40px" }}>
      <main style={{ width: "100%", maxWidth: 600 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: tokens.textPrimary, margin: "0 0 12px 0", letterSpacing: -0.5 }}>
            Find your ideal <span style={{ color: tokens.accent }}>mattress</span>.
          </h1>
          <p style={{ fontSize: 17, color: tokens.textSecondary, margin: 0, maxWidth: 480, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            {intro}
          </p>
        </div>
        <div style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 28, display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { step: "1", text: "Answer a few quick questions" },
            { step: "2", text: "Our engine scores every product against your answers" },
            { step: "3", text: "Get your personalised top picks - free, instantly" },
          ].map(({ step, text }) => (
            <div key={step} style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: "1 1 160px", minWidth: 160 }}>
              <span style={{ background: tokens.accent, color: "#fff", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{step}</span>
              <p style={{ margin: 0, fontSize: 14, color: tokens.textSecondary, lineHeight: 1.5 }}>{text}</p>
            </div>
          ))}
        </div>
        <Link
          href="/mattress/questionnaire"
          style={{
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            background: tokens.accent,
            color: "#fff",
            borderRadius: 10,
            height: 52,
            fontWeight: 700,
            fontSize: 18,
            textDecoration: "none",
            letterSpacing: 0.2,
          }}
        >
          Start fitting {"->"}
        </Link>
        <p style={{ fontSize: 13, color: tokens.textSecondary, textAlign: "center", margin: 0, marginTop: 16 }}>
          Takes under 2 minutes - No sign-up required
        </p>
        {popularGuides.length > 0 && (
        <section style={{ marginTop: 24 }} aria-label="Popular mattress guides">
          <h2 style={{ fontSize: 18, fontWeight: 700, color: tokens.textPrimary, margin: "0 0 12px 0" }}>
            Popular mattress guides
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {popularGuides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                style={{
                  fontSize: 14,
                  color: tokens.textPrimary,
                  background: tokens.surface,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: 999,
                  padding: "8px 12px",
                  textDecoration: "none",
                }}
              >
                {guide.label}
              </Link>
            ))}
          </div>
        </section>
        )}
      </main>
    </div>
  );
}
