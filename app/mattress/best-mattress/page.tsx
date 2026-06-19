import type { Metadata } from "next";
import Link from "next/link";
import { mattressSeoPageMap } from "../../../config/mattress/seo-pages";
import HubQuickBuySection from "./HubQuickBuySectionClient";

const FOREST = "#1a3d2f";
const GREEN = "#3bb273";
const SURFACE = "#f6fbf7";
const BORDER = "#cbe3d3";
const TEXT = "#1a3d2f";
const TEXT2 = "#4b6b57";

export const metadata: Metadata = {
  title: "Best Mattress (2026): Find the Right Mattress for How You Sleep | FindYourIdeal",
  description:
    "Compare the best mattresses by sleep style and problem type, then choose between quick-buy starting points and a personalised fitting quiz.",
  alternates: {
    canonical: "/mattress/best-mattress",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const coreGuides = [
  "best-mattress-for-side-sleepers-uk",
  "best-mattress-for-back-pain-uk",
  "best-mattress-for-heavy-people-uk",
  "best-mattress-for-couples-uk",
  "best-cooling-mattress-uk",
  "best-hybrid-mattress-uk",
  "best-budget-mattress-uk",
  "best-mattress-under-500-uk",
];

const guideCards = coreGuides.map((slug) => mattressSeoPageMap[slug]).filter((page) => Boolean(page));

export default function BestMattressHubPage() {
  return (
    <div style={{ width: "100%", background: SURFACE }}>
      <section
        style={{
          background: "linear-gradient(135deg, #1a3d2f 0%, #1e4d38 55%, #245c42 100%)",
          color: "#ffffff",
          padding: "48px 20px 56px",
        }}
      >
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 18 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 6px" }}>›</span>
            <span>Best Mattress</span>
          </div>

          <h1 style={{ margin: "0 0 12px 0", fontSize: "clamp(30px, 5vw, 46px)", lineHeight: 1.1, letterSpacing: -0.6 }}>
            Best Mattress: Find the Right Mattress for How You Sleep
          </h1>
          <p style={{ margin: "0 0 24px", maxWidth: 760, color: "rgba(255,255,255,0.82)", fontSize: 17, lineHeight: 1.6 }}>
            There is no single best mattress for everyone. The right choice depends on your sleep position, build, temperature, pressure sensitivity, and what kind of support you actually need through the night.
          </p>

          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 14,
              padding: "18px 18px 20px",
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ margin: "0 0 4px", fontWeight: 700 }}>Start with a personalised fitting</p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: 14 }}>
                2-minute quiz. No sign-up. Recommendation based on how you sleep.
              </p>
            </div>
            <Link
              href="/mattress/questionnaire?ref=best-mattress-hub"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: GREEN,
                color: FOREST,
                borderRadius: 999,
                padding: "12px 24px",
                fontWeight: 800,
                fontSize: 15,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Start fitting now
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, margin: "16px 0", opacity: 0.6 }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.2)" }} />
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 14,
              padding: "18px 18px 20px",
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ margin: "0 0 4px", fontWeight: 700 }}>Quick Buy Guide</p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: 14 }}>
                Preset mattress starting points by sleep style and problem type.
              </p>
            </div>
            <Link
              href="#quick-buy-starting-points"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: GREEN,
                color: FOREST,
                borderRadius: 999,
                padding: "12px 24px",
                fontWeight: 800,
                fontSize: 15,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              See options
            </Link>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "24px 20px 64px" }}>
        <section style={{ background: "#ffffff", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "22px 24px" }}>
          <p style={{ margin: 0, color: TEXT2, lineHeight: 1.7 }}>
            Start with the quick-buy starting points if you already know your main problem, or use the quiz if you want a more tailored recommendation based on position, support needs, and budget.
          </p>
        </section>

        <HubQuickBuySection />

        <section style={{ marginTop: 24 }}>
          <h2 style={{ margin: "0 0 14px 0", fontSize: 24, color: FOREST }}>Browse by sleep style and problem</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14 }}>
            {guideCards.map((page) => (
              <Link key={page.slug} href={`/mattress/${page.slug}`} style={{ background: "#ffffff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px 16px", textDecoration: "none", display: "block" }}>
                <h3 style={{ margin: "0 0 8px", color: TEXT, fontSize: 17, lineHeight: 1.35 }}>{page.h1}</h3>
                <p style={{ margin: 0, color: TEXT2, fontSize: 14, lineHeight: 1.6 }}>{page.metaDescription}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}