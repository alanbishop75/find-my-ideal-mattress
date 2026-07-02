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
  "best-mattress-for-side-sleepers",
  "best-mattress-for-back-pain",
  "best-mattress-for-heavy-people",
  "best-mattress-for-couples",
  "best-cooling-mattress",
  "best-hybrid-mattress",
  "best-budget-mattress",
  "best-mattress-under-500",
];

const guideCards = coreGuides.map((slug) => mattressSeoPageMap[slug]).filter((page) => Boolean(page));

const quickAnswerBullets = [
  "If your main issue is pressure or pain, prioritize support profile before price tier.",
  "If you sleep hot or share a bed, cooling and motion control usually matter more than brand name.",
  "If budget is tight, start with value-focused hybrids and verify trial/return terms first.",
];

const decisionRows = [
  {
    icon: "🛌",
    profile: "Side sleepers with pressure points",
    prioritise: "Pressure relief and medium support balance",
    start: "best-mattress-for-side-sleepers",
  },
  {
    icon: "🩺",
    profile: "Morning back stiffness",
    prioritise: "Stronger lumbar support and alignment",
    start: "best-mattress-for-back-pain",
  },
  {
    icon: "🌡️",
    profile: "Hot sleepers or warmer rooms",
    prioritise: "Cooling layers and better airflow",
    start: "best-cooling-mattress",
  },
  {
    icon: "💷",
    profile: "Budget-focused buyers",
    prioritise: "Value-first hybrids with practical support",
    start: "best-budget-mattress",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the best mattress overall?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There is no single best mattress for everyone. The right mattress depends on your sleep position, support needs, temperature profile, and budget.",
      },
    },
    {
      "@type": "Question",
      name: "Should I use quick buy or take the quiz?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use Quick Buy if you already know your main sleep issue. Use the quiz if you want a more tailored recommendation that balances support, temperature, and budget together.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to find a mattress match?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most users complete the fitting quiz in around two minutes and immediately receive a ranked shortlist with reasoning.",
      },
    },
  ],
};

export default function BestMattressHubPage() {
  return (
    <div style={{ width: "100%", background: SURFACE }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
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
              <span style={{ margin: "0 6px" }}>{">"}</span>
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
        <section id="quick-answer" style={{ background: "#ffffff", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "22px 24px" }}>
          <h2 style={{ margin: "0 0 10px", fontSize: 24, color: TEXT }}>Quick answer</h2>
          <p style={{ margin: 0, color: TEXT2, lineHeight: 1.7 }}>
            Start with the quick-buy starting points if you already know your main problem, or use the quiz if you want a more tailored recommendation based on position, support needs, and budget.
          </p>
          <ul style={{ margin: "12px 0 0", paddingLeft: 18, color: TEXT2, lineHeight: 1.7 }}>
            {quickAnswerBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="how-to-think" style={{ marginTop: 18, background: "#ffffff", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 24px" }}>
          <h2 style={{ margin: "0 0 10px", fontSize: 22, color: TEXT }}>How to think about the best mattress</h2>
          <p style={{ margin: "0 0 10px", color: TEXT2, lineHeight: 1.7 }}>
            The best mattress is not about brand rank; it is about matching support behavior to how you actually sleep.
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, color: TEXT2, lineHeight: 1.7 }}>
            <li>Prioritize sleep-position and pressure profile first.</li>
            <li>Then check cooling and motion isolation if you sleep hot or share a bed.</li>
            <li>Use price as a tie-breaker once fit is already right.</li>
          </ul>
        </section>

        <section style={{ marginTop: 18, background: "#ffffff", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 20px" }}>
          <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 13, color: TEXT, letterSpacing: 0.2, textTransform: "uppercase" }}>On this page</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              ["Quick answer", "#quick-answer"],
              ["How to think", "#how-to-think"],
              ["Decision matrix", "#decision-matrix"],
              ["Quick Buy", "#quick-buy-starting-points"],
              ["Browse guides", "#browse-guides"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                style={{
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 700,
                  color: TEXT,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 999,
                  padding: "6px 12px",
                  background: SURFACE,
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </section>

        <section id="decision-matrix" style={{ marginTop: 22, background: "#ffffff", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 22px" }}>
          <h2 style={{ margin: "0 0 10px", fontSize: 24, color: TEXT }}>Decision matrix: where to start</h2>
          <p style={{ margin: "0 0 14px", color: TEXT2, lineHeight: 1.7 }}>
            If you are unsure which guide to open first, use this 2x2 starting matrix.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
            {decisionRows.map((row) => (
              <article key={row.start} style={{ border: `1px solid ${BORDER}`, borderRadius: 12, padding: 14, background: SURFACE }}>
                <p style={{ margin: "0 0 8px", fontSize: 20 }} aria-hidden>{row.icon}</p>
                <h3 style={{ margin: "0 0 6px", fontSize: 16, color: TEXT }}>{row.profile}</h3>
                <p style={{ margin: "0 0 10px", fontSize: 14, color: TEXT2, lineHeight: 1.5 }}>
                  <strong>Prioritise:</strong> {row.prioritise}
                </p>
                <Link href={`/mattress/${row.start}`} style={{ color: TEXT, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
                  Start here {"->"}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <HubQuickBuySection />

        <section id="browse-guides" style={{ marginTop: 24 }}>
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

        <section id="faq" style={{ marginTop: 24, background: "#ffffff", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 22px" }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 22, color: FOREST }}>Frequently asked questions</h2>
          <div style={{ display: "grid", gap: 12 }}>
            <article>
              <h3 style={{ margin: "0 0 4px", fontSize: 16, color: TEXT }}>What is the best mattress overall?</h3>
              <p style={{ margin: 0, color: TEXT2, lineHeight: 1.65 }}>There is no single best mattress for everyone. The best option depends on sleep position, pressure needs, heat profile, and budget.</p>
            </article>
            <article>
              <h3 style={{ margin: "0 0 4px", fontSize: 16, color: TEXT }}>Should I use quick buy or take the quiz?</h3>
              <p style={{ margin: 0, color: TEXT2, lineHeight: 1.65 }}>Use Quick Buy for a fast topic-based pick. Use the quiz when you want a more tailored match based on multiple factors together.</p>
            </article>
            <article>
              <h3 style={{ margin: "0 0 4px", fontSize: 16, color: TEXT }}>How long does mattress fitting take?</h3>
              <p style={{ margin: 0, color: TEXT2, lineHeight: 1.65 }}>Most users finish in around two minutes and get an immediate shortlist with reasons.</p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
