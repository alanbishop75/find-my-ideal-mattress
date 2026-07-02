"use client";

import Image from "next/image";
import Link from "next/link";
import { useRegion } from "../../../core/geo/RegionContext";
import { getRegionLinks } from "../../../config/mattress/buy-links";
import { products } from "../../../config/mattress/products";
import { seoPalette } from "../../../config/mattress/seo-theme";
import type { MattressSeoPage } from "../../../config/mattress/seo-pages";
import { mattressSeoPageMap } from "../../../config/mattress/seo-pages";

function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const NAVY = seoPalette.navy;
const LIME = seoPalette.lime;
const LIME_DARK = seoPalette.limeDark;
const WHITE = seoPalette.white;
const SURFACE = seoPalette.surface;
const BORDER = seoPalette.border;
const TEXT2 = seoPalette.text2;

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
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 14,
        alignItems: "stretch",
      }}
    >
      <aside
        style={{
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          padding: "14px 14px",
          background: "#f0f7f4",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          minHeight: 360,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: NAVY,
            fontWeight: 800,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            background: "#d4e8df",
            borderRadius: 999,
            padding: "6px 10px",
            alignSelf: "flex-start",
          }}
        >
          Quick Buy vs Quiz
        </p>
        <h3 style={{ margin: 0, fontSize: 18, color: NAVY, lineHeight: 1.25 }}>
          Choose the preset top pick, or use the quiz for a deeper fit
        </h3>
        <p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.7 }}>
          <strong>Quick Buy</strong> is the fastest path when you already know the page topic. It shows the preset mattress we have assigned to this guide, so you can jump straight to a recommended option.
        </p>
        <p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.7 }}>
          <strong>Quiz</strong> is better if you want us to weigh up your sleep position, body profile, temperature preference and budget before recommending a mattress.
        </p>
        <Link
          href="/mattress/questionnaire?ref=quick-buy-vs-quiz"
          style={{
            marginTop: "auto",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: NAVY,
            color: "#ffffff",
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
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          padding: "14px 14px",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          minHeight: 360,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: NAVY,
            fontWeight: 800,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            background: SURFACE,
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
            style={{ objectFit: "contain", borderRadius: 8, flexShrink: 0, background: SURFACE }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <h3 style={{ margin: 0, fontSize: 18, color: NAVY }}>
              {product.brand} {product.name}
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: TEXT2, fontWeight: 700, lineHeight: 1.4 }}>
              {recommendation.bestFor}
            </p>
          </div>
        </div>

        <p style={{ margin: 0, fontSize: 13, color: TEXT2, lineHeight: 1.5 }}>
          {quickBuyReasonBySlug[pageSlug] ?? "This is the preset Quick Buy choice for this topic."}
        </p>

        <p style={{ margin: 0, fontSize: 13, color: TEXT2 }}>
          {typeof product.attributes?.rrp === "number" ? `Approx. £${product.attributes.rrp}` : "Check latest price"}
        </p>

        <Link href={`/mattress/${pageSlug}`} style={{ margin: 0, fontSize: 13, color: NAVY, fontWeight: 700, textDecoration: "none" }}>
          Read full guide for this topic →
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
            background: LIME,
            color: LIME_DARK,
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
  const quizHref = `/mattress/questionnaire?ref=${page.slug}`;
  const related = page.relatedSlugs
    .map((s) => mattressSeoPageMap[s])
    .filter((p): p is MattressSeoPage => Boolean(p));
  const rankedOptions = buildRankedOptions(page.slug);
  const hasQuickBuy = Boolean(quickBuyBySlug[page.slug]);

  const cardStyle: React.CSSProperties = {
    background: WHITE,
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    padding: "24px 28px",
    marginTop: 20,
    borderLeft: `4px solid ${LIME}`,
  };

  const h2Style: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 700,
    color: NAVY,
    margin: "0 0 14px 0",
    lineHeight: 1.3,
  };

  const h3Style: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 700,
    color: NAVY,
    margin: "18px 0 6px 0",
    lineHeight: 1.35,
  };

  const bodyStyle: React.CSSProperties = {
    fontSize: 15,
    color: TEXT2,
    lineHeight: 1.75,
    margin: 0,
  };

  const ctaButton = (label: string) => (
    <Link
      href={quizHref}
      style={{
        marginTop: 8,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: LIME,
        color: LIME_DARK,
        borderRadius: 999,
        padding: "14px 30px",
        fontWeight: 800,
        fontSize: 16,
        textDecoration: "none",
        letterSpacing: 0.2,
        boxShadow: "0 8px 24px -8px rgba(125,190,58,0.5)",
      }}
    >
      {label}
    </Link>
  );

  return (
    <div style={{ width: "100%", background: SURFACE }}>
      <style>{`
        @media (max-width: 640px) {
          .seo-hero-row { justify-content: center !important; }
          .seo-hero-logo { margin: 0 auto; }
          .seo-hero-text { text-align: center !important; }
          .seo-hero-text p { margin-left: auto !important; margin-right: auto !important; }
          .seo-hero-cta { justify-content: center !important; }
          .quick-buy-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* HERO — forest-green gradient, logo left */}
      <section
        style={{
          background: "linear-gradient(135deg, #1a3d2f 0%, #1e4d38 55%, #245c42 100%)",
          color: "#ffffff",
          padding: "48px 20px 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div aria-hidden style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", border: `2px solid ${LIME}`, opacity: 0.14 }} />

        {/* Breadcrumb */}
        <div style={{ maxWidth: 900, margin: "0 auto 24px", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 6px" }}>›</span>
          <Link href="/mattress/best-mattress" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Best Mattress</Link>
          <span style={{ margin: "0 6px" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.85)" }}>{page.keyword}</span>
        </div>

        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 40,
            flexWrap: "wrap",
          }}
          className="seo-hero-row"
        >
          {/* Logo */}
          <div style={{ flexShrink: 0 }} className="seo-hero-logo">
            <Image
              src="/images/logo.PNG"
              alt="Find Your Ideal Mattress"
              width={120}
              height={120}
              style={{ borderRadius: "50%", display: "block", boxShadow: "0 8px 32px -8px rgba(0,0,0,0.5)" }}
            />
          </div>

          {/* Heading + CTA */}
          <div style={{ flex: "1 1 280px" }} className="seo-hero-text">
            <h1
              style={{
                fontSize: "clamp(26px, 4vw, 42px)",
                fontWeight: 800,
                margin: "0 0 12px 0",
                letterSpacing: -0.8,
                lineHeight: 1.1,
              }}
            >
              {page.h1}
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.78)", margin: "0 0 24px", lineHeight: 1.55, maxWidth: 520 }}>
              {page.intro}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }} className="seo-hero-cta">
              {ctaButton("Start Quiz")}
              {hasQuickBuy ? (
                <>
                  <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 700, fontSize: 16 }}>Or</span>
                  <Link
                    href="#quick-buy-starting-point"
                    style={{
                      marginTop: 8,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: LIME,
                      color: LIME_DARK,
                      borderRadius: 999,
                      padding: "14px 30px",
                      fontWeight: 800,
                      fontSize: 16,
                      textDecoration: "none",
                      letterSpacing: 0.2,
                      boxShadow: "0 8px 24px -8px rgba(125,190,58,0.5)",
                    }}
                  >
                    Quick Buy
                  </Link>
                </>
              ) : null}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Fitting in less than a minute</span>
              {hasQuickBuy ? <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Top-rated picks, ready to buy</span> : null}
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 20px 64px",
        }}
      >
        <article>

          {/* Mini stats */}
          <div
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              textAlign: "center",
            }}
          >
            {[
              { icon: "🎯", label: "Personalised", sub: "to how you sleep" },
              { icon: "⏱️", label: "2 minutes", sub: "start to finish" },
              { icon: "📋", label: "Independent", sub: "no brand bias" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "#ffffff",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  padding: "16px 8px",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>{item.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: NAVY }}>{item.label}</div>
                <div style={{ fontSize: 12, color: TEXT2, marginTop: 2 }}>{item.sub}</div>
              </div>
            ))}
          </div>

          {page.whoItIsFor.length > 0 && (
            <section style={cardStyle}>
              <h2 style={h2Style}>Is this guide for you?</h2>
              <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                {page.whoItIsFor.map((line, index) => (
                  <li key={index} style={bodyStyle}>{line}</li>
                ))}
              </ul>
            </section>
          )}

          <section style={cardStyle} aria-label="Jump links">
            <h2 style={h2Style}>Jump to a section</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {[
                { label: "Quick verdict", href: "#quick-verdict" },
                { label: "Best options at a glance", href: "#best-options-at-a-glance" },
                { label: "How we ranked these options", href: "#how-we-ranked-these-options" },
                { label: "Quick Buy starting point", href: "#quick-buy-starting-point" },
                { label: "How the matching quiz works", href: "#matching-quiz-works" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 999,
                    padding: "8px 12px",
                    color: NAVY,
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 700,
                    background: WHITE,
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <section id="quick-verdict" style={cardStyle}>
            <h2 style={h2Style}>Quick verdict</h2>
            <p style={bodyStyle}>
              If you want the shortest route to the right choice, start here.
            </p>
            <ul style={{ margin: "12px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              <li style={bodyStyle}>Use Quick Buy if you already know your primary problem and want a fast shortlist now.</li>
              <li style={bodyStyle}>Use the quiz if you need us to balance support, temperature, and budget together.</li>
              <li style={bodyStyle}>For most shoppers, the best result is the mattress that fits your position plus body profile.</li>
            </ul>
          </section>

          <section id="best-options-at-a-glance" style={cardStyle}>
            <h2 style={h2Style}>Best options at a glance</h2>
            <p style={bodyStyle}>
              These options cover the most common buying paths for {page.keyword.toLowerCase()}: strongest baseline fit, value route, and a balanced upgrade path.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginTop: 14 }}>
              {rankedOptions.map((product, index) => (
                <article key={product.id} style={{ border: `1px solid ${BORDER}`, borderRadius: 14, padding: 14, background: WHITE }}>
                  <p style={{ margin: 0, fontSize: 11, color: NAVY, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase" }}>
                    #{index + 1} option
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                    <Image
                      src={product.imageUrl}
                      alt={`${product.brand} ${product.name}`}
                      width={84}
                      height={84}
                      style={{ objectFit: "contain", borderRadius: 8, flexShrink: 0, background: SURFACE }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <h3 style={{ margin: 0, fontSize: 18, color: NAVY, lineHeight: 1.25 }}>
                        {product.brand} {product.name}
                      </h3>
                      <p style={{ margin: 0, fontSize: 12, color: TEXT2, fontWeight: 700, lineHeight: 1.4 }}>
                        {bestForLine(product)}
                      </p>
                    </div>
                  </div>
                  <p style={{ margin: "10px 0 0", fontSize: 13, color: TEXT2, lineHeight: 1.6 }}>
                    {reasonLine(product)}
                  </p>
                  <p style={{ margin: "10px 0 0", fontSize: 13, color: TEXT2 }}>
                    {typeof product.attributes?.rrp === "number" ? `Approx. £${product.attributes.rrp}` : "Check latest price"}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                    {attributeChips(product).map((chip) => (
                      <span
                        key={chip}
                        style={{
                          border: `1px solid ${BORDER}`,
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          color: NAVY,
                          background: WHITE,
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

          <section id="how-we-ranked-these-options" style={cardStyle}>
            <h2 style={h2Style}>How we ranked these options</h2>
            <p style={bodyStyle}>
              We rank mattresses by topic-fit first, then adjust for support behaviour, motion control, temperature profile, and realistic UK budget fit.
            </p>
            <ul style={{ margin: "12px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              <li style={bodyStyle}>Topic fit first: position and problem relevance carry the highest weight.</li>
              <li style={bodyStyle}>Performance second: support depth, motion isolation, and cooling shape rank stability.</li>
              <li style={bodyStyle}>Value always: we keep picks actionable with real-world UK price context.</li>
            </ul>
          </section>

          {/* Quick Buy vs Quiz */}
          <QuickBuySection pageSlug={page.slug} />

          <section style={cardStyle}>
            <h2 style={h2Style}>Want the full mattress overview?</h2>
            <p style={bodyStyle}>
              If you want to compare the whole landscape before diving into specific sleep profiles,
              start with our central guide.
            </p>
            <Link
              href="/mattress/best-mattress"
              style={{
                marginTop: 12,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: WHITE,
                color: NAVY,
                border: `1px solid ${BORDER}`,
                borderRadius: 999,
                padding: "10px 18px",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              Read: Best Mattress guide →
            </Link>
          </section>

          <section id="matching-quiz-works" style={cardStyle}>
            <h2 style={h2Style}>How the matching quiz works</h2>
            <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Answer a few quick questions about how you sleep",
                "We match against mattresses verified on UK Amazon, scoring on fit, temperature and budget",
                "Get a shortlist with reasons, not just a single pushed product",
              ].map((step, index) => (
                <li key={index} style={bodyStyle}>{step}</li>
              ))}
            </ol>
          </section>

          {page.sections.map((section, index) => (
            <section key={index} id={slugifyHeading(section.h2)} style={cardStyle}>
              <h2 style={h2Style}>{section.h2}</h2>
              {section.body ? <p style={bodyStyle}>{section.body}</p> : null}
              {section.subsections?.map((subsection, subsectionIndex) => (
                <div key={subsectionIndex}>
                  <h3 style={h3Style}>{subsection.h3}</h3>
                  <p style={bodyStyle}>{subsection.body}</p>
                </div>
              ))}
            </section>
          ))}

          {/* Mid-page CTA */}
          <div
            style={{
              ...cardStyle,
              background: "linear-gradient(135deg, #1a3d2f 0%, #245c42 100%)",
              border: "none",
              borderLeft: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <p style={{ margin: 0, fontWeight: 700, color: "#ffffff", fontSize: 18 }}>
              Ready to stop guessing?
            </p>
            <p style={{ margin: 0, fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.55 }}>
              Answer a few quick questions and we&apos;ll match you to mattresses that fit your build, position and budget.
            </p>
            {ctaButton("Start the 2-minute quiz")}
          </div>

          {page.keyFactors.length > 0 && (
            <section style={cardStyle}>
              <h2 style={h2Style}>What our quiz looks at</h2>
              <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                {page.keyFactors.map((factor, index) => (
                  <li key={index} style={bodyStyle}>{factor}</li>
                ))}
              </ul>
            </section>
          )}

          {page.faq.length > 0 && (
            <section style={cardStyle}>
              <h2 style={h2Style}>Frequently asked questions</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {page.faq.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      borderTop: index > 0 ? `1px solid ${BORDER}` : "none",
                      paddingTop: index > 0 ? 16 : 0,
                    }}
                  >
                    <p style={{ fontSize: 15, fontWeight: 700, color: NAVY, margin: "0 0 6px 0" }}>
                      {item.question}
                    </p>
                    <p style={bodyStyle}>{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <p
            style={{
              fontSize: 12,
              color: TEXT2,
              textAlign: "center",
              marginTop: 24,
              marginBottom: 0,
            }}
          >
            Last reviewed: {formatReviewDate(page.lastReviewed)}. We update this guide when
            our verified UK mattress catalogue changes.
          </p>
        </article>

        {related.length > 0 && (
          <aside style={{ ...cardStyle, borderLeft: `4px solid ${BORDER}` }} aria-label="Related guides">
            <h2 style={h2Style}>Related guides</h2>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {related.map((relatedPage) => (
                <li key={relatedPage.slug}>
                  <Link
                    href={`/mattress/${relatedPage.slug}`}
                    style={{ color: LIME, textDecoration: "none", fontSize: 15, fontWeight: 600 }}
                  >
                    {relatedPage.h1} →
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}

