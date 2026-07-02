import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { mattressSeoPageMap } from "../../../config/mattress/seo-pages";
import { products } from "../../../config/mattress/products";
import { mattressComparisonPages } from "../../../config/mattress/comparison-pages";
import { seoPalette } from "../../../config/mattress/seo-theme";
import HubQuickBuySection from "./HubQuickBuySectionClient";

const NAVY = seoPalette.navy;
const LIME = seoPalette.lime;
const SOFT_LIME = seoPalette.softLime;
const WHITE = seoPalette.white;
const SURFACE = seoPalette.surface;
const BORDER = seoPalette.border;
const TEXT = seoPalette.text;
const TEXT2 = seoPalette.text2;

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

const comparisonCards = mattressComparisonPages.map((page) => ({
  icon: "🔎",
  label: page.searchIntent,
  title: page.h1,
  summary: page.metaDescription,
  leftProductId: page.leftProductId,
  rightProductId: page.rightProductId,
  slug: page.slug,
  cta: "Open comparison page",
}));

const quickAnswerBullets = [
  "If your main issue is pressure or pain, prioritise support profile before price tier.",
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
            <span style={{ margin: "0 6px" }}>›</span>
            <span>Best Mattress</span>
          </div>

          <h1 style={{ margin: "0 0 12px 0", fontSize: "clamp(30px, 5vw, 46px)", lineHeight: 1.1, letterSpacing: -0.6 }}>
            Best Mattress: Find the Right Mattress for How You Sleep
          </h1>
          <p style={{ margin: "0 0 24px", maxWidth: 700, color: "rgba(255,255,255,0.82)", fontSize: 17, lineHeight: 1.6 }}>
            There is no universally best mattress, because the right choice depends on your sleep position, body weight,
            temperature, pressure sensitivity, and the kind of support you actually need through the night.
          </p>
          <p style={{ margin: "0 0 20px", maxWidth: 760, color: "rgba(255,255,255,0.82)", fontSize: 17, lineHeight: 1.6 }}>
            A side sleeper with hip and shoulder pressure usually needs a different mattress from someone with morning
            back stiffness, and a hot sleeper or a couple sharing a bed often prioritises cooling and motion control over
            brand name. This guide helps you narrow down the best mattress for how you sleep, then points you to the most
            relevant topic pages and the fitting quiz if you want a more precise match.
          </p>
          <ul style={{ margin: "0 0 28px", paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "🛌", label: "Pressure or pain?", text: "Start with support profile before price tier." },
              { icon: "🌡️", label: "Sleep hot or share a bed?", text: "Prioritise cooling and motion control." },
              { icon: "💷", label: "Budget is tight?", text: "Start with value-focused hybrids and check return terms." },
            ].map((item) => (
              <li key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: 10, color: "rgba(255,255,255,0.9)", fontSize: 15, lineHeight: 1.55 }}>
                <span style={{ fontSize: 18, lineHeight: 1.3, flexShrink: 0 }}>{item.icon}</span>
                <span><strong style={{ color: "#ffffff" }}>{item.label}</strong> {item.text}</span>
              </li>
            ))}
          </ul>

          <div
            style={{
              background: SOFT_LIME,
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 14,
              padding: "18px 18px 20px",
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 10px -7px rgba(20,45,34,0.28)",
            }}
          >
            <div>
              <p style={{ margin: "0 0 4px", fontWeight: 700, color: NAVY }}>Start with a personalised fitting</p>
              <p style={{ margin: 0, color: "rgba(26,61,47,0.78)", fontSize: 14 }}>
                2-minute quiz. No sign-up. Recommendation based on how you sleep.
              </p>
            </div>
            <Link
              href="/mattress/questionnaire?ref=best-mattress-hub"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: NAVY,
                color: "#ffffff",
                borderRadius: 999,
                padding: "12px 24px",
                fontWeight: 800,
                fontSize: 15,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Start Quiz now
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              margin: "16px 0",
              opacity: 0.6,
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.2)" }} />
          </div>

          <div
            style={{
              background: SOFT_LIME,
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 14,
              padding: "18px 18px 20px",
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 10px -7px rgba(20,45,34,0.28)",
            }}
          >
            <div>
              <p style={{ margin: "0 0 4px", fontWeight: 700, color: NAVY }}>Quick Buy Guide</p>
              <p style={{ margin: 0, color: "rgba(26,61,47,0.78)", fontSize: 14 }}>
                Preset recommendations. Start exploring by sleep style or need.
              </p>
            </div>
            <Link
              href="#quick-buy-starting-points"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: NAVY,
                color: "#ffffff",
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

      <main style={{ maxWidth: 920, margin: "0 auto", padding: "24px 20px 64px" }}>
        <section
          id="jump-links"
          style={{
            marginTop: 0,
            background: "#ffffff",
            borderTop: `1px solid rgba(26,61,47,0.16)`,
            borderRight: `1px solid rgba(26,61,47,0.16)`,
            borderBottom: `1px solid rgba(26,61,47,0.16)`,
            borderLeft: `4px solid ${SOFT_LIME}`,
            borderRadius: 14,
            padding: "14px 16px 16px",
            boxShadow: "0 4px 12px -12px rgba(26,61,47,0.35)",
          }}
          aria-label="Jump links"
        >
          <div style={{ marginBottom: 10 }}>
            <p style={{ margin: "0 0 3px", color: NAVY, fontSize: 13, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase" }}>
              On this page
            </p>
            <p style={{ margin: 0, color: TEXT2, fontSize: 13 }}>
              Jump straight to the section you want.
            </p>
          </div>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <div style={{ display: "flex", gap: 8, minWidth: "max-content" }}>
              {[
                ["Quick answer", "#quick-answer"],
                ["How we rank", "#how-we-rank"],
                ["Decision matrix", "#decision-matrix"],
                ["Quick Buy", "#quick-buy-starting-points"],
                ["Browse guides", "#browse-guides"],
                ["Compare products", "#compare-options"],
                ["FAQ", "#faq"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid rgba(26,61,47,0.14)`,
                    borderRadius: 999,
                    padding: "7px 14px",
                    color: NAVY,
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 700,
                    background: "#ffffff",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section
          id="quick-answer"
          style={{
            marginTop: 14,
            background: "#ffffff",
            borderTop: `1px solid ${BORDER}`,
            borderRight: `1px solid ${BORDER}`,
            borderBottom: `1px solid ${BORDER}`,
            borderLeft: `4px solid ${SOFT_LIME}`,
            borderRadius: 14,
            padding: "22px 24px",
          }}
        >
          <h2 style={{ margin: "0 0 10px 0", fontSize: 24, color: NAVY }}>Quick answer</h2>
          <p style={{ margin: "0 0 10px", color: TEXT2, lineHeight: 1.7 }}>
            If you want a fast starting point before diving into all guides, use this 30-second summary.
          </p>
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {quickAnswerBullets.map((line, index) => (
              <li key={index} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: TEXT, lineHeight: 1.6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: LIME, flexShrink: 0, marginTop: 6 }} />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="how-we-rank"
          style={{
            marginTop: 16,
            background: "#ffffff",
            borderTop: `1px solid ${BORDER}`,
            borderRight: `1px solid ${BORDER}`,
            borderBottom: `1px solid ${BORDER}`,
            borderLeft: `4px solid ${SOFT_LIME}`,
            borderRadius: 14,
            padding: "22px 24px",
          }}
        >
          <h2 style={{ margin: "0 0 10px", fontSize: 24, color: NAVY }}>How we rank options on this page</h2>
          <p style={{ margin: "0 0 10px", color: TEXT2, lineHeight: 1.7 }}>
            We prioritise fit-to-profile first, then value and consistency. That means we favour options that solve your
            main sleep problem before recommending premium cooling or feel benefits.
          </p>
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Profile fit first:", text: "sleep position, body profile, and pressure needs." },
              { label: "Value second:", text: "real-world UK price and trial/return terms." },
              { label: "Comfort third:", text: "cooling and motion control matter once support is right." },
            ].map((item) => (
              <li key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: TEXT, lineHeight: 1.6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: LIME, flexShrink: 0, marginTop: 6 }} />
                <span><strong>{item.label}</strong> {item.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="decision-matrix"
          style={{
            marginTop: 16,
            background: "#ffffff",
            borderTop: `1px solid ${BORDER}`,
            borderRight: `1px solid ${BORDER}`,
            borderBottom: `1px solid ${BORDER}`,
            borderLeft: `4px solid ${SOFT_LIME}`,
            borderRadius: 14,
            padding: "22px 24px",
          }}
        >
          <h2 style={{ margin: "0 0 10px", fontSize: 24, color: NAVY }}>Decision matrix: where to start</h2>
          <p style={{ margin: "0 0 12px", color: TEXT2, lineHeight: 1.7 }}>
            If you are not sure which guide to open first, start with the closest profile below.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {decisionRows.map((row) => {
              const startPage = mattressSeoPageMap[row.start];
              return (
                <article
                  key={row.start}
                  style={{
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    padding: "13px 14px",
                    background: "#f8fbfd",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span
                      aria-hidden="true"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "#eef5e5",
                        border: `1px solid ${SOFT_LIME}`,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 15,
                        flexShrink: 0,
                      }}
                    >
                      {row.icon}
                    </span>
                    <p style={{ margin: 0, color: NAVY, fontWeight: 800, fontSize: 15, lineHeight: 1.45 }}>{row.profile}</p>
                  </div>

                  <div>
                    <p style={{ margin: "0 0 4px", color: NAVY, fontSize: 11, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase" }}>
                      Prioritise
                    </p>
                    <p style={{ margin: 0, color: TEXT2, fontSize: 14, lineHeight: 1.55 }}>{row.prioritise}</p>
                  </div>

                  <Link
                    href={`/mattress/${row.start}`}
                    style={{
                      color: NAVY,
                      textDecoration: "none",
                      fontWeight: 800,
                      fontSize: 14,
                      marginTop: "auto",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    Start here: {startPage?.h1 ?? "Open guide"} →
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section
          style={{
            marginTop: 16,
            background: "#ffffff",
            borderTop: `1px solid ${BORDER}`,
            borderRight: `1px solid ${BORDER}`,
            borderBottom: `1px solid ${BORDER}`,
            borderLeft: `4px solid ${SOFT_LIME}`,
            borderRadius: 14,
            padding: "22px 24px",
          }}
        >
          <h2 style={{ margin: "0 0 10px 0", fontSize: 24, color: NAVY }}>How to think about the best mattress</h2>
          <p style={{ margin: "0 0 10px", color: TEXT2, lineHeight: 1.7 }}>
            Most sleepers lose more comfort from mismatch than from brand choice. A mattress that fits how you actually
            sleep often performs better than a premium model chosen for marketing reasons.
          </p>
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Waking with hip or shoulder pressure?", text: "Prioritise pressure relief and a medium feel." },
              { label: "Stiff lower back in the morning?", text: "Prioritise firmer lumbar support and alignment." },
              { label: "Already sleeping comfortably?", text: "You may benefit more from cooling and motion control." },
            ].map((item) => (
              <li key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: TEXT, lineHeight: 1.6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: LIME, flexShrink: 0, marginTop: 6 }} />
                <span><strong>{item.label}</strong> {item.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <HubQuickBuySection />

        <section id="browse-guides" style={{ marginTop: 24 }}>
          <h2 style={{ margin: "0 0 14px 0", fontSize: 24, color: NAVY }}>Browse by sleep style and problem</h2>
          <p style={{ margin: "0 0 14px", color: TEXT2, lineHeight: 1.7 }}>
            Use these detailed guides if you want a deeper breakdown for your specific situation.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 14,
            }}
          >
            {guideCards.map((page) => (
              <Link
                key={page.slug}
                href={`/mattress/${page.slug}`}
                style={{
                  background: "#ffffff",
                  border: `1px solid ${BORDER}`,
                  borderLeft: `4px solid ${SOFT_LIME}`,
                  borderRadius: 12,
                  padding: "16px 16px",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                }}
              >
                <h3 style={{ margin: "0 0 8px", color: NAVY, fontSize: 17, lineHeight: 1.35 }}>{page.h1}</h3>
                <p style={{ margin: "0 0 12px", color: TEXT2, fontSize: 14, lineHeight: 1.6, flex: 1 }}>{page.metaDescription}</p>
                <span style={{ color: NAVY, fontWeight: 700, fontSize: 13 }}>Open guide →</span>
              </Link>
            ))}
          </div>
        </section>

        <section
          id="compare-options"
          style={{
            marginTop: 24,
            background: "#ffffff",
            borderTop: `1px solid ${BORDER}`,
            borderRight: `1px solid ${BORDER}`,
            borderBottom: `1px solid ${BORDER}`,
            borderLeft: `4px solid ${SOFT_LIME}`,
            borderRadius: 14,
            padding: "22px 24px",
          }}
        >
          <h2 style={{ margin: "0 0 10px", fontSize: 24, color: NAVY }}>Compare before you pick</h2>
          <p style={{ margin: "0 0 14px", color: TEXT2, lineHeight: 1.7 }}>
            These are direct product-vs-product comparisons for common searches like Simba vs Emma.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {comparisonCards.map((card, index) => {
              const leftProduct = card.leftProductId ? products.find((product) => product.id === card.leftProductId) : undefined;
              const rightProduct = card.rightProductId ? products.find((product) => product.id === card.rightProductId) : undefined;
              return (
                <article
                  key={card.slug}
                  style={{
                    border: `1px solid ${BORDER}`,
                    borderLeft: `4px solid ${SOFT_LIME}`,
                    borderRadius: 12,
                    padding: "14px 14px 12px",
                    background: "#fbfdfb",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    minHeight: 0,
                  }}
                >
                  <p style={{ margin: 0, color: NAVY, fontSize: 11, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase" }}>
                    #{index + 1} · {card.label}
                  </p>
                  <h3 style={{ margin: 0, color: NAVY, fontSize: 16, lineHeight: 1.35 }}>{card.title}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
                    {[leftProduct, rightProduct].map((product) => (
                      <div
                        key={product?.id}
                        style={{
                          border: `1px solid ${BORDER}`,
                          borderRadius: 12,
                          background: WHITE,
                          padding: 8,
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {product ? (
                          <>
                            <Image
                              src={product.imageUrl}
                              alt={`${product.brand} ${product.name}`}
                              width={120}
                              height={120}
                              style={{ width: "100%", height: 104, objectFit: "cover", borderRadius: 10 }}
                            />
                            <div>
                              <p style={{ margin: "0 0 2px", color: NAVY, fontSize: 11, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase" }}>{product.brand}</p>
                              <p style={{ margin: 0, color: NAVY, fontSize: 14, fontWeight: 800, lineHeight: 1.35 }}>{product.name}</p>
                            </div>
                          </>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  <p style={{ margin: 0, color: TEXT2, fontSize: 14, lineHeight: 1.6, flex: 1 }}>{card.summary}</p>
                  <Link
                    href={`/mattress/compare/${card.slug}`}
                    style={{ color: NAVY, textDecoration: "none", fontWeight: 800, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    {card.cta} →
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section
          style={{
            marginTop: 24,
            background: "#ffffff",
            borderTop: `1px solid ${BORDER}`,
            borderRight: `1px solid ${BORDER}`,
            borderBottom: `1px solid ${BORDER}`,
            borderLeft: `4px solid ${SOFT_LIME}`,
            borderRadius: 14,
            padding: "20px 22px",
          }}
        >
          <h2 style={{ margin: "0 0 8px", fontSize: 22, color: NAVY }}>Which mattress should I get right now?</h2>
          <p style={{ margin: "0 0 14px", color: TEXT2, lineHeight: 1.7 }}>
            If you want a fast answer, the fitting quiz is the best starting point. It compares your profile against
            our recommendation logic and returns the most suitable options for how you sleep.
          </p>
          <Link
            href="/mattress/questionnaire?ref=best-mattress-hub-bottom"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: LIME,
              color: NAVY,
              borderRadius: 999,
              padding: "12px 24px",
              fontWeight: 800,
              fontSize: 15,
              textDecoration: "none",
            }}
          >
            Get my mattress recommendation
          </Link>
        </section>

        <section id="faq" style={{ marginTop: 24 }}>
          <h2 style={{ margin: "0 0 18px", fontSize: 24, color: NAVY }}>Frequently asked questions</h2>
          <div
            style={{
              background: "#ffffff",
              borderTop: `1px solid ${BORDER}`,
              borderRight: `1px solid ${BORDER}`,
              borderBottom: `1px solid ${BORDER}`,
              borderLeft: `4px solid ${SOFT_LIME}`,
              borderRadius: 14,
              padding: "20px 22px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                {
                  q: "What is the best mattress overall?",
                  a: "There is no single best mattress for everyone. The best option depends on sleep position, pressure needs, heat profile, and budget.",
                },
                {
                  q: "Should I use quick buy or take the quiz?",
                  a: "Use Quick Buy for a fast topic-based pick. Use the quiz when you want a more tailored match based on multiple factors together.",
                },
                {
                  q: "How long does mattress fitting take?",
                  a: "Most users finish in around two minutes and get an immediate shortlist with reasons.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    borderTop: index > 0 ? `1px solid ${BORDER}` : "none",
                    paddingTop: index > 0 ? 16 : 0,
                    paddingBottom: 16,
                  }}
                >
                  <p style={{ margin: "0 0 6px", color: NAVY, fontWeight: 800 }}>{item.q}</p>
                  <p style={{ margin: 0, color: TEXT2, lineHeight: 1.7 }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
