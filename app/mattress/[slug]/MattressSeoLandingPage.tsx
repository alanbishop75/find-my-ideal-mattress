"use client";
import { useTheme } from "../../../core/theme";
import type { MattressSeoPage } from "../../../config/mattress/seo-pages";
import { mattressSeoPageMap } from "../../../config/mattress/seo-pages";

/**
 * Renders an SEO landing page for a mattress keyword.
 *
 * Structure (locked — every page follows this layout for scalability):
 *   1. Breadcrumb (visual)
 *   2. <article>
 *        H1 + intro + primary CTA + reassurance row
 *        "Who this is for"
 *        How the quiz works (3 steps)
 *        Long-form sections (H2, optional H3)
 *        Mid-page repeat CTA
 *        "What our quiz looks for"
 *        FAQ
 *        Last reviewed line
 *   3. Related guides (internal links)
 */
function formatReviewDate(iso: string): string {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}

export default function MattressSeoLandingPage({ page }: { page: MattressSeoPage }) {
  const { tokens } = useTheme();
  const quizHref = `/mattress/questionnaire?ref=${page.slug}`;
  const related = page.relatedSlugs
    .map((s) => mattressSeoPageMap[s])
    .filter((p): p is MattressSeoPage => Boolean(p));

  const cardStyle: React.CSSProperties = {
    background: tokens.surface,
    border: `1px solid ${tokens.border}`,
    borderRadius: 16,
    padding: "24px 28px",
    marginTop: 20,
  };

  const h2Style: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 700,
    color: tokens.textPrimary,
    margin: "0 0 12px 0",
    lineHeight: 1.3,
  };

  const h3Style: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 700,
    color: tokens.textPrimary,
    margin: "16px 0 6px 0",
    lineHeight: 1.35,
  };

  const bodyStyle: React.CSSProperties = {
    fontSize: 15,
    color: tokens.textSecondary,
    lineHeight: 1.7,
    margin: 0,
  };

  const ctaButton = (label: string) => (
    <a
      href={quizHref}
      style={{
        marginTop: 8,
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
      {label}
    </a>
  );

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100svh",
        background: tokens.background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 32,
        paddingBottom: 48,
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <main style={{ width: "100%", maxWidth: 640 }}>
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{ fontSize: 13, color: tokens.textSecondary, marginBottom: 16 }}
        >
          <a href="/" style={{ color: tokens.textSecondary, textDecoration: "none" }}>
            Home
          </a>
          <span style={{ margin: "0 6px" }}>›</span>
          <a
            href="/mattress/questionnaire"
            style={{ color: tokens.textSecondary, textDecoration: "none" }}
          >
            Mattress finder
          </a>
          <span style={{ margin: "0 6px" }}>›</span>
          <span style={{ color: tokens.textPrimary }}>{page.keyword}</span>
        </nav>

        <article>
          {/* Hero */}
          <header
            style={{
              background: tokens.surface,
              border: `1px solid ${tokens.border}`,
              borderRadius: 16,
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
            }}
          >
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: tokens.textPrimary,
                textAlign: "center",
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              {page.h1}
            </h1>

            <p
              style={{
                fontSize: 15,
                color: tokens.textSecondary,
                textAlign: "center",
                margin: 0,
                lineHeight: 1.65,
              }}
            >
              {page.intro}
            </p>

            {ctaButton("Find Your Ideal Mattress")}

            <p
              style={{
                fontSize: 13,
                color: tokens.textSecondary,
                textAlign: "center",
                margin: 0,
              }}
            >
              Takes under 2 minutes · No sign-up · UK retailers
            </p>
          </header>

          {/* Trust strip */}
          <div
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              textAlign: "center",
            }}
          >
            {[
              { label: "Personalised", sub: "to how you sleep" },
              { label: "2 minutes", sub: "start to finish" },
              { label: "Independent", sub: "no brand bias" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: tokens.surface,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: 12,
                  padding: "14px 8px",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: tokens.textPrimary }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 12, color: tokens.textSecondary }}>{item.sub}</div>
              </div>
            ))}
          </div>

          {/* Who this is for */}
          {page.whoItIsFor.length > 0 && (
            <section style={cardStyle}>
              <h2 style={h2Style}>Is this guide for you?</h2>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {page.whoItIsFor.map((line: string, i: number) => (
                  <li key={i} style={bodyStyle}>
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* How the quiz works */}
          <section style={cardStyle}>
            <h2 style={h2Style}>How the matching quiz works</h2>
            <ol
              style={{
                margin: 0,
                paddingLeft: 20,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {[
                "Answer a few quick questions about how you sleep",
                "We match against mattresses verified on UK Amazon, scoring on fit, temperature and budget",
                "Get a shortlist with reasons — not a single pushed product",
              ].map((step, i) => (
                <li key={i} style={bodyStyle}>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          {/* Educational sections */}
          {page.sections.map((section, idx) => (
            <section key={idx} style={cardStyle}>
              <h2 style={h2Style}>{section.h2}</h2>
              {section.body && <p style={bodyStyle}>{section.body}</p>}
              {section.subsections?.map((sub, j) => (
                <div key={j}>
                  <h3 style={h3Style}>{sub.h3}</h3>
                  <p style={bodyStyle}>{sub.body}</p>
                </div>
              ))}
            </section>
          ))}

          {/* Mid-page CTA */}
          <div
            style={{
              ...cardStyle,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <p
              style={{
                ...bodyStyle,
                textAlign: "center",
                fontWeight: 600,
                color: tokens.textPrimary,
                fontSize: 16,
              }}
            >
              Ready to skip the research?
            </p>
            <p style={{ ...bodyStyle, textAlign: "center" }}>
              Answer a few quick questions and we&apos;ll match you to mattresses that fit
              your build, position and budget.
            </p>
            {ctaButton("Start the 2-minute quiz")}
          </div>

          {/* Key factors */}
          {page.keyFactors.length > 0 && (
            <section style={cardStyle}>
              <h2 style={h2Style}>What our quiz looks at</h2>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {page.keyFactors.map((factor, i) => (
                  <li key={i} style={bodyStyle}>
                    {factor}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQ */}
          {page.faq.length > 0 && (
            <section style={cardStyle}>
              <h2 style={h2Style}>Frequently asked questions</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {page.faq.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      borderTop: i > 0 ? `1px solid ${tokens.border}` : "none",
                      paddingTop: i > 0 ? 16 : 0,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: tokens.textPrimary,
                        margin: "0 0 6px 0",
                      }}
                    >
                      {item.question}
                    </p>
                    <p style={bodyStyle}>{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Last reviewed (E-E-A-T signal) */}
          <p
            style={{
              fontSize: 12,
              color: tokens.textSecondary,
              textAlign: "center",
              marginTop: 20,
              marginBottom: 0,
            }}
          >
            Last reviewed:{" "}
            {formatReviewDate(page.lastReviewed)}
            . We update this guide whenever our verified UK product list changes.
          </p>
        </article>

        {/* Related guides */}
        {related.length > 0 && (
          <aside style={cardStyle} aria-label="Related guides">
            <h2 style={h2Style}>Related guides</h2>
            <ul
              style={{
                margin: 0,
                paddingLeft: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {related.map((p) => (
                <li key={p.slug}>
                  <a
                    href={`/mattress/${p.slug}`}
                    style={{
                      color: tokens.accent,
                      textDecoration: "none",
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    {p.h1} →
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </main>
    </div>
  );
}
