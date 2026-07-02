"use client";

import Image from "next/image";
import Link from "next/link";
import { useRegion } from "../../../core/geo/RegionContext";
import { getRegionLinks } from "../../../config/mattress/buy-links";
import { products } from "../../../config/mattress/products";
import { useTheme } from "../../../core/theme";
import type { MattressSeoPage } from "../../../config/mattress/seo-pages";
import { mattressSeoPageMap } from "../../../config/mattress/seo-pages";

function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const NAVY = "#0b2545";
const LIME = "#7dbe3a";
const LIME_DARK = "#0b2545";
const WHITE = "#ffffff";
const SURFACE = "#f5f8fa";
const BORDER = "#e1e8ed";
const TEXT2 = "#516781";

const quickBuyBySlug: Record<string, { productId: string; bestFor: string; buttonLabel: string }> = {
  "best-mattress-for-side-sleepers": {
    productId: "silentnight-3zone-memory-foam",
    bestFor: "Built for softer pressure relief at the shoulder and hip.",
    buttonLabel: "Shop side-sleeper pick",
  },
  "best-mattress-for-back-pain": {
    productId: "nectar-classic-hybrid-25cm",
    bestFor: "Built for stronger lumbar support with a balanced medium-firm feel.",
    buttonLabel: "Shop back-support pick",
  },
  "best-mattress-for-heavy-people": {
    productId: "sealy-steeple-ortho-plus",
    bestFor: "Built for heavier loads, firmer support, and reinforced structure.",
    buttonLabel: "Shop heavier-sleeper pick",
  },
  "best-mattress-for-couples": {
    productId: "simba-hybrid-pro",
    bestFor: "Built for motion control, airflow, and shared-bed stability.",
    buttonLabel: "Shop couples pick",
  },
  "best-cooling-mattress": {
    productId: "dormeo-octasmart-hybrid",
    bestFor: "Built for hotter sleepers who need better airflow overnight.",
    buttonLabel: "Shop cooling pick",
  },
  "best-hybrid-mattress": {
    productId: "otty-original-hybrid-2000",
    bestFor: "Built for balanced spring support with foam comfort up top.",
    buttonLabel: "Shop hybrid pick",
  },
  "best-budget-mattress": {
    productId: "jayBe-truecore-hybrid-2000",
    bestFor: "Built for value-first shoppers who still need balanced support.",
    buttonLabel: "Shop budget pick",
  },
  "best-mattress-under-500": {
    productId: "inofia-12in-hybrid",
    bestFor: "Built to hit under-GBP500 budgets while keeping hybrid support.",
    buttonLabel: "Shop under-GBP500 pick",
  },
};

const quickBuyReasonBySlug: Record<string, string> = {
  "best-mattress-for-side-sleepers": "We use this preset because side sleepers usually need extra pressure relief at hips and shoulders before anything else.",
  "best-mattress-for-back-pain": "We use this preset because this topic is mainly about lumbar support and stable medium-firm alignment.",
  "best-mattress-for-heavy-people": "We use this preset because heavier sleepers usually need stronger structure and firmer long-term support.",
  "best-mattress-for-couples": "We use this preset because couples usually prioritize motion control, stability, and cooling across the whole bed.",
  "best-cooling-mattress": "We use this preset because this guide focuses on airflow and temperature control first.",
  "best-hybrid-mattress": "We use this preset because the guide is specifically about hybrid build quality and all-round balance.",
  "best-budget-mattress": "We use this preset because budget shoppers usually need the best support-per-pound starting point.",
  "best-mattress-under-500": "We use this preset because it fits a strict under-GBP500 target while keeping a balanced hybrid setup.",
};

function productMatchesTopic(product: (typeof products)[number], slug: string): number {
  const attrs = product.attributes ?? {};
  const sleepPosition = attrs.sleepPosition;
  const construction = attrs.construction;
  const cooling = attrs.cooling;
  const backSupport = attrs.backSupport;
  const priceTier = attrs.priceTier;
  const motionIsolation = attrs.motionIsolation;
  const weightClass = attrs.weightClass;

  let score = 0;

  if (slug.includes("side-sleepers") && (sleepPosition === "side" || sleepPosition === "combination" || sleepPosition === "any")) score += 4;
  if (slug.includes("back-pain") && (backSupport === "enhanced" || backSupport === "ortho")) score += 4;
  if (slug.includes("heavy-people") && (weightClass === "heavy" || backSupport === "ortho")) score += 4;
  if (slug.includes("couples") && (motionIsolation === "good" || motionIsolation === "excellent")) score += 4;
  if (slug.includes("cooling") && cooling === true) score += 4;
  if (slug.includes("hybrid") && construction === "hybrid") score += 4;
  if ((slug.includes("budget") || slug.includes("under-500")) && (priceTier === "budget" || priceTier === "mid")) score += 4;

  if (construction === "hybrid") score += 1;
  if (motionIsolation === "excellent") score += 1;
  if (backSupport === "enhanced") score += 1;

  return score;
}

function formatConstruction(construction: string | undefined): string {
  if (!construction) return "Balanced build";
  return construction
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildRankedOptions(slug: string): (typeof products)[number][] {
  const quickBuyProductId = quickBuyBySlug[slug]?.productId;
  const quickBuyProduct = quickBuyProductId ? products.find((item) => item.id === quickBuyProductId) : null;

  const rankedPool = [...products]
    .sort((a, b) => productMatchesTopic(b, slug) - productMatchesTopic(a, slug))
    .filter((item, index, all) => all.findIndex((p) => p.id === item.id) === index);

  const top = quickBuyProduct
    ? [quickBuyProduct, ...rankedPool.filter((item) => item.id !== quickBuyProduct.id)]
    : rankedPool;

  return top.slice(0, 3);
}

function attributeChips(product: (typeof products)[number]): string[] {
  const attrs = product.attributes ?? {};
  const construction = typeof attrs.construction === "string" ? attrs.construction : undefined;
  const firmness = typeof attrs.firmness === "string" ? attrs.firmness : undefined;
  const cooling = attrs.cooling === true;

  return [
    `${formatConstruction(construction)} construction`,
    `${(firmness ?? "balanced").replace("-", " ")} feel`,
    cooling ? "Cooling profile" : "Neutral temperature",
  ];
}

function bestForLine(product: (typeof products)[number]): string {
  const attrs = product.attributes ?? {};
  const sleepPosition = typeof attrs.sleepPosition === "string" ? attrs.sleepPosition : "any";
  const position = sleepPosition === "any" ? "mixed sleep positions" : `${sleepPosition} sleepers`;
  return `Best for ${position} needing consistent overnight support.`;
}

function reasonLine(product: (typeof products)[number]): string {
  const attrs = product.attributes ?? {};
  if (attrs.cooling === true) return "Included for better heat control and steadier overnight comfort.";
  if (attrs.motionIsolation === "excellent") return "Included for stronger motion control and fewer partner disturbances.";
  if (attrs.backSupport === "ortho") return "Included for firmer spinal support and longer-term structure.";
  return "Included for balanced support, practical value, and reliable everyday comfort.";
}

/**
 * Renders an SEO landing page for a mattress keyword.
 *
 * Structure (locked - every page follows this layout for scalability):
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

function QuickBuySection({ pageSlug }: { pageSlug: string }) {
  const { tokens } = useTheme();
  const { region, isLoading } = useRegion();
  const recommendation = quickBuyBySlug[pageSlug];

  if (!recommendation) return null;

  const product = products.find((item) => item.id === recommendation.productId);
  if (!product) return null;

  const displayRegion = isLoading ? "UK" : region;
  const links = getRegionLinks(product.id, displayRegion);
  const amazonLink =
    links.find((link) => link.retailerKey === "amazon-uk" || link.retailerKey === "amazon-us")?.url ??
    getRegionLinks(product.id, "UK").find((link) => link.retailerKey === "amazon-uk")?.url;

  return (
    <section
      id="quick-buy-starting-point"
      className="quick-buy-grid"
      style={{
        marginTop: 20,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 14,
        alignItems: "stretch",
      }}
    >
      <aside
        style={{
          background: tokens.surface,
          border: `1px solid ${tokens.border}`,
          borderRadius: 16,
          padding: "16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: tokens.textPrimary,
            fontWeight: 800,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            background: tokens.surfaceAlt,
            borderRadius: 999,
            padding: "6px 10px",
            alignSelf: "flex-start",
          }}
        >
          Quick Buy vs Quiz
        </p>
        <h2 style={{ margin: 0, fontSize: 20, color: tokens.textPrimary, lineHeight: 1.3 }}>
          Choose the preset top pick, or use the quiz for a deeper fit
        </h2>
        <p style={{ margin: 0, fontSize: 14, color: tokens.textSecondary, lineHeight: 1.7 }}>
          <strong>Quick Buy</strong> is the fastest path when you already know this page topic and want an immediate starting pick.
        </p>
        <p style={{ margin: 0, fontSize: 14, color: tokens.textSecondary, lineHeight: 1.7 }}>
          <strong>Quiz</strong> is better when you want us to weigh sleep position, body profile, temperature preference, and budget before recommending a mattress.
        </p>
        <Link
          href="/mattress/questionnaire?ref=quick-buy-vs-quiz"
          style={{
            marginTop: "auto",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: tokens.accent,
            color: "#fff",
            borderRadius: 999,
            padding: "12px 16px",
            fontWeight: 800,
            textDecoration: "none",
            width: "100%",
          }}
        >
          Take the fitting quiz
        </Link>
      </aside>

      <article
        style={{
          background: "#ffffff",
          border: `1px solid ${tokens.border}`,
          borderRadius: 16,
          padding: "16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: tokens.textPrimary,
            fontWeight: 800,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            background: tokens.surfaceAlt,
            borderRadius: 999,
            padding: "6px 10px",
            alignSelf: "flex-start",
          }}
        >
          Quick Buy
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image
            src={product.imageUrl}
            alt={`${product.brand} ${product.name}`}
            width={90}
            height={90}
            style={{ objectFit: "contain", borderRadius: 8, flexShrink: 0, background: tokens.surface }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <h3 style={{ margin: 0, fontSize: 18, color: tokens.textPrimary }}>
              {product.brand} {product.name}
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: tokens.textSecondary, fontWeight: 700, lineHeight: 1.4 }}>
              {recommendation.bestFor}
            </p>
          </div>
        </div>

        <p style={{ margin: 0, fontSize: 14, color: tokens.textSecondary, lineHeight: 1.6 }}>
          {quickBuyReasonBySlug[pageSlug] ?? "This is the preset Quick Buy choice for this topic."}
        </p>

        <p style={{ margin: 0, fontSize: 13, color: tokens.textSecondary }}>
          {typeof product.attributes?.rrp === "number" ? `Approx. GBP${product.attributes.rrp}` : "Check latest price"}
        </p>

        <Link
          href={`/mattress/${pageSlug}`}
          style={{ margin: 0, fontSize: 13, color: tokens.textPrimary, fontWeight: 700, textDecoration: "none" }}
        >
          Read full guide for this topic {"->"}
        </Link>

        <a
          href={amazonLink ?? "#"}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          style={{
            marginTop: "auto",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: tokens.accent,
            color: "#fff",
            borderRadius: 999,
            padding: "11px 14px",
            fontWeight: 800,
            textDecoration: "none",
            width: "100%",
          }}
        >
          {recommendation.buttonLabel}
        </a>
      </article>
    </section>
  );
}

export default function MattressSeoLandingPage({ page }: { page: MattressSeoPage }) {
  const { tokens } = useTheme();
  const quizHref = `/mattress/questionnaire?ref=${page.slug}`;
  const related = page.relatedSlugs
    .map((s) => mattressSeoPageMap[s])
    .filter((p): p is MattressSeoPage => Boolean(p));
  const rankedOptions = buildRankedOptions(page.slug);

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
      <style>{`
        @media (max-width: 640px) {
          .quick-buy-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <main style={{ width: "100%", maxWidth: 640 }}>
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{ fontSize: 13, color: tokens.textSecondary, marginBottom: 16 }}
        >
          <a href="/" style={{ color: tokens.textSecondary, textDecoration: "none" }}>
            Home
          </a>
          <span style={{ margin: "0 6px" }}>{">"}</span>
          <a
            href="/mattress/questionnaire"
            style={{ color: tokens.textSecondary, textDecoration: "none" }}
          >
            Mattress finder
          </a>
          <span style={{ margin: "0 6px" }}>{">"}</span>
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

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              {ctaButton("Start Quiz")}
              <span style={{ fontSize: 13, color: tokens.textSecondary }}>OR</span>
              <a
                href="#quick-buy-starting-point"
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  maxWidth: 280,
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
                Quick Buy
              </a>
            </div>

            <p
              style={{
                fontSize: 13,
                color: tokens.textSecondary,
                textAlign: "center",
                margin: 0,
              }}
            >
              Takes under 2 minutes - No sign-up - Top retailers
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

          <section style={cardStyle} id="jump-to-a-section">
            <h2 style={h2Style}>Jump to a section</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {[
                { label: "Quick verdict", href: "#quick-verdict" },
                { label: "Best options at a glance", href: "#best-options-at-a-glance" },
                { label: "How we ranked these options", href: "#how-we-ranked-these-options" },
                { label: "Quick Buy starting point", href: "#quick-buy-starting-point" },
                { label: "How the matching quiz works", href: "#matching-quiz-works" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 14px",
                    borderRadius: 999,
                    border: `1px solid ${tokens.border}`,
                    background: tokens.surfaceAlt,
                    color: tokens.textPrimary,
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </section>

          <section style={cardStyle} id="quick-verdict">
            <h2 style={h2Style}>Quick verdict</h2>
            <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              <li style={bodyStyle}>Use Quick Buy if you already know your primary problem and want a fast shortlist now.</li>
              <li style={bodyStyle}>Use the quiz if you need us to balance support, temperature, and budget together.</li>
              <li style={bodyStyle}>For most shoppers, the best result is the mattress that fits your position plus body profile.</li>
            </ul>
          </section>

          <section style={cardStyle} id="best-options-at-a-glance">
            <h2 style={h2Style}>Best options at a glance</h2>
            <div style={{ display: "grid", gap: 12 }}>
              {rankedOptions.map((product, index) => (
                <article
                  key={product.id}
                  style={{
                    border: `1px solid ${tokens.border}`,
                    borderRadius: 12,
                    padding: 14,
                    background: "#ffffff",
                    display: "grid",
                    gap: 6,
                  }}
                >
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: tokens.textPrimary, textTransform: "uppercase", letterSpacing: 0.4 }}>
                    #{index + 1} option
                  </p>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: tokens.textPrimary }}>
                    {product.brand} {product.name}
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: tokens.textSecondary }}>
                    {bestForLine(product)}
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: tokens.textSecondary }}>
                    {reasonLine(product)}
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: tokens.textSecondary }}>
                    {typeof product.attributes?.rrp === "number" ? `Approx. GBP${product.attributes.rrp}` : "Check latest price"}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 2 }}>
                    {attributeChips(product).map((chip) => (
                      <span
                        key={chip}
                        style={{
                          border: `1px solid ${tokens.border}`,
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          color: tokens.textPrimary,
                          background: tokens.surfaceAlt,
                          padding: "4px 10px",
                        }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section style={cardStyle} id="how-we-ranked-these-options">
            <h2 style={h2Style}>How we ranked these options</h2>
            <p style={bodyStyle}>
              We rank mattresses by topic-fit first, then adjust for support behavior, motion control, temperature profile, and realistic UK budget fit.
            </p>
            <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              <li style={bodyStyle}>Topic fit first: position and problem relevance carry the highest weight.</li>
              <li style={bodyStyle}>Performance second: support depth, motion isolation, and cooling shape rank stability.</li>
              <li style={bodyStyle}>Value always: we keep picks actionable with real-world UK price context.</li>
            </ul>
          </section>

          {/* Quick Buy vs Quiz */}
          <QuickBuySection pageSlug={page.slug} />

          <section style={cardStyle} id="hub-bridge">
            <h2 style={h2Style}>Need the broader comparison?</h2>
            <p style={bodyStyle}>
              If you want the broader hub view, use the main mattress roundup instead of staying on this topic-specific page.
            </p>
            <Link
              href="/mattress/best-mattress"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 12,
                padding: "12px 16px",
                borderRadius: 999,
                background: NAVY,
                color: WHITE,
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              Open the main mattress guide
            </Link>
          </section>

          {/* How the quiz works */}
          <section style={cardStyle} id="matching-quiz-works">
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
                "Get a shortlist with reasons - not a single pushed product",
              ].map((step, i) => (
                <li key={i} style={bodyStyle}>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          {/* Educational sections */}
          {page.sections.map((section, idx) => (
            <section key={idx} style={cardStyle} id={slugifyHeading(section.h2)}>
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
              marginBottom: 6,
            }}
          >
            Last reviewed:{" "}
            {formatReviewDate(page.lastReviewed)}
            . We update this guide whenever our verified UK product list changes.
          </p>
          <p style={{ margin: 0, fontSize: 11, color: tokens.textSecondary, textAlign: "center" }}>
            Generated with GitHub Copilot.
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
                    {p.h1} {"->"}
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

