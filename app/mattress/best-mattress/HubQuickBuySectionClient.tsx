"use client";

import Image from "next/image";
import Link from "next/link";
import { useRegion } from "../../../core/geo/RegionContext";
import { getRegionLinks } from "../../../config/mattress/buy-links";
import { mattressSeoPageMap } from "../../../config/mattress/seo-pages";
import { products } from "../../../config/mattress/products";

const FOREST = "#1a3d2f";
const GREEN = "#3bb273";
const SURFACE = "#f6fbf7";
const BORDER = "#cbe3d3";
const TEXT2 = "#4b6b57";

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
  "best-budget-mattress": {
    productId: "jayBe-truecore-hybrid-2000",
    bestFor: "Built for value-first shoppers who still need balanced support.",
    buttonLabel: "Shop budget pick",
  },
};

const quickBuyGuides = Object.keys(quickBuyBySlug);

export default function HubQuickBuySection() {
  const { region, isLoading } = useRegion();
  const displayRegion = isLoading ? "UK" : region;

  return (
    <section
      id="quick-buy-starting-points"
      style={{
        marginTop: 24,
        background: "#ffffff",
        border: `1px solid ${BORDER}`,
        borderLeft: `4px solid ${GREEN}`,
        borderRadius: 14,
        padding: "20px 22px",
      }}
    >
      <h2 style={{ margin: "0 0 8px", fontSize: 22, color: FOREST }}>Quick Buy starting points</h2>
      <p style={{ margin: "0 0 16px", color: TEXT2, lineHeight: 1.7 }}>
        These are the fastest topic-based starting points if you already know the kind of mattress problem you want to solve.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        {quickBuyGuides.map((slug) => {
          const guide = mattressSeoPageMap[slug];
          const recommendation = quickBuyBySlug[slug];
          const product = recommendation ? products.find((item) => item.id === recommendation.productId) : undefined;
          const buyLink = recommendation ? getRegionLinks(recommendation.productId, displayRegion)[0]?.url : undefined;

          if (!guide || !recommendation || !product) return null;

          return (
            <article
              key={slug}
              style={{
                border: `1px solid ${BORDER}`,
                borderRadius: 12,
                padding: 14,
                background: SURFACE,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <p style={{ margin: 0, fontSize: 11, color: FOREST, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase" }}>
                Quick Buy
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Image src={product.imageUrl} alt={`${product.brand} ${product.name}`} width={72} height={72} style={{ objectFit: "contain", borderRadius: 8, background: "#ffffff", flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ margin: 0, fontSize: 16, color: FOREST, lineHeight: 1.3 }}>{guide.h1}</h3>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: TEXT2, lineHeight: 1.45 }}>{recommendation.bestFor}</p>
                </div>
              </div>
              <Link href={`/mattress/${slug}`} style={{ color: FOREST, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
                Open the full guide {"->"}
              </Link>
              <a
                href={buyLink ?? `/mattress/${slug}`}
                target={buyLink ? "_blank" : undefined}
                rel={buyLink ? "sponsored nofollow noopener noreferrer" : undefined}
                style={{
                  marginTop: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: GREEN,
                  color: FOREST,
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
          );
        })}
      </div>
    </section>
  );
}
