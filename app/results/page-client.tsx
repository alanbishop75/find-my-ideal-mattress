"use client";
import { useAppState } from '../client-providers';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { ResultsCard } from '../../components/ResultsCard';
import { Button } from '../../components/Button';
import { Product } from '../../core/types';
import { ScoringEngine } from '../../lib/scoring';
import { categoryRegistry } from '../../config/registry';
import { RegionProvider, useRegion } from '../../core/geo/RegionContext';
import { getRegionLinks } from '../../config/mattress/buy-links';
import type { Region } from '../../core/geo/types';

type GtagFn = (command: string, event: string, params?: Record<string, string | number>) => void;

/** Fire a GA4 event safely (noop if gtag not loaded). */
function trackEvent(name: string, params?: Record<string, string | number>) {
  if (typeof window !== 'undefined' && typeof (window as typeof window & { gtag?: GtagFn }).gtag === 'function') {
    (window as typeof window & { gtag: GtagFn }).gtag('event', name, params ?? {});
  }
}

// ── Region selector ───────────────────────────────────────────────────────────

function RegionSelector() {
  const { region, setRegion, isLoading } = useRegion();

  if (isLoading) return null;

  const other: Region = region === 'UK' ? 'US' : 'UK';
  const label = region === 'UK' ? 'Showing UK retailers' : 'Showing US retailers';
  const switchLabel = region === 'UK' ? 'Switch to US' : 'Switch to UK';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '8px 12px',
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderRadius: 8,
      border: '1px solid rgba(255,255,255,0.2)',
      fontSize: 12,
    }}>
      <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{label}</span>
      <button
        onClick={() => setRegion(other)}
        style={{
          background: 'none',
          border: '1px solid rgba(59,178,115,0.6)',
          borderRadius: 6,
          padding: '4px 10px',
          fontSize: 12,
          fontWeight: 600,
          color: '#3bb273',
          cursor: 'pointer',
        }}
      >
        {switchLabel}
      </button>
    </div>
  );
}

// ── Inner page ────────────────────────────────────────────────────────────────

interface ResultsPageProps {
  products?: Product[];
  scoringEngine?: ScoringEngine;
  resultsHeading?: string;
  homeHref?: string;
  questionnaireHref?: string;
}

function ResultsPageInner({
  products,
  scoringEngine,
  resultsHeading,
  homeHref = '/',
  questionnaireHref = '/mattress/questionnaire',
}: ResultsPageProps) {
  const { answers, reset } = useAppState();
  const { region } = useRegion();
  const router = useRouter();
  const [legacyV2Mode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const v = new URLSearchParams(window.location.search).get('v');
    return v === '2';
  });
  const affiliateDisclosure = region === 'UK'
    ? 'Affiliate disclosure: Some links on this page are affiliate links. As an Amazon Associate, we earn from qualifying purchases. We may also earn a commission from other retailer partners at no extra cost to you. This helps keep the tool free.'
    : 'Affiliate disclosure: Some links on this page are affiliate links. If you purchase through them, we may earn a small commission at no extra cost to you. This helps keep the tool free.';

  // Exclude products marked REMOVE_FROM_CATALOGUE — these have no UK purchase path.
  // Also filter by availability so only region-appropriate products are scored;
  // otherwise UK products fill the top 3 for US visitors (and vice versa).
  const resolvedProducts = (products ?? categoryRegistry['mattress'].products)
    .filter((p) => p.ukAmazonVerification?.status !== 'REMOVE_FROM_CATALOGUE')
    .filter((p) => {
      const avail = String(p.attributes.availability ?? 'both');
      if (avail === 'both') return true;
      if (region === 'UK') return avail === 'uk';
      if (region === 'US') return avail === 'us';
      return true;
    });
  const resolvedEngine = scoringEngine ?? categoryRegistry['mattress'].scoringEngine;
  const resolvedHeading = resultsHeading ?? categoryRegistry['mattress'].meta.resultsHeading;

  const hasAnswers = Object.keys(answers).length > 0 || legacyV2Mode;

  // Redirect to questionnaire if there are no answers (direct URL access)
  useEffect(() => {
    if (!hasAnswers) {
      router.replace(questionnaireHref);
    }
  }, [hasAnswers, questionnaireHref, router]);

  const scored = resolvedProducts.map((p) => {
    const { score, reasons } = hasAnswers ? resolvedEngine(p, answers) : { score: 0, reasons: [] };
    return { ...p, _score: score, _reasons: reasons };
  }).sort((a, b) => b._score - a._score);

  // Best Match: highest score
  const best = scored[0];
  // Strong Alternative: second-best unique fit (brand can match if score supports it).
  const alt = scored.find((p) => p.id !== best.id) || best;
  // Best Value: pick the lowest-cost unique option that still clears a fit threshold.
  // Uses product-level RRP if available; otherwise falls back to price tiers.
  const usedIds = new Set([best.id, alt.id]);
  function getTier(p: typeof scored[0]): 'budget' | 'mid' | 'premium' | '' {
    const tier = String(p.attributes.priceTier ?? '');
    if (tier === 'budget' || tier === 'mid' || tier === 'premium') return tier;
    return '';
  }
  function getTierRank(p: typeof scored[0]): number {
    const tier = getTier(p);
    if (tier === 'budget') return 0;
    if (tier === 'mid') return 1;
    if (tier === 'premium') return 2;
    return 3;
  }
  function getRrp(p: typeof scored[0]): number | null {
    const raw = Number(p.attributes.rrp);
    return Number.isFinite(raw) && raw > 0 ? raw : null;
  }

  const uniqueCandidates = scored.filter((p) => !usedIds.has(p.id));
  const uniqueFallback = uniqueCandidates[0] || scored[scored.length - 1];

  // Keep Best Value credible by requiring a minimum fit standard versus Best Match.
  const valueFitTolerance = 4;
  const minValueFitScore = Math.max(1, best._score - valueFitTolerance);

  // Best Value must never be a premium-priced product when non-premium options exist.
  // Priority: (1) non-premium + fit threshold, (2) any non-premium, (3) fit threshold
  // (including premium), (4) all unique candidates.
  const nonPremiumCandidates = uniqueCandidates.filter((p) => getTier(p) !== 'premium');
  const valueEligibleNonPremium = nonPremiumCandidates.filter((p) => p._score >= minValueFitScore);
  const valueEligibleAll = uniqueCandidates.filter((p) => p._score >= minValueFitScore);

  const valuePool =
    valueEligibleNonPremium.length > 0 ? valueEligibleNonPremium :
    nonPremiumCandidates.length > 0 ? nonPremiumCandidates :
    valueEligibleAll.length > 0 ? valueEligibleAll :
    uniqueCandidates;

  const usedValueFitFallback = valueEligibleNonPremium.length === 0;

  const budget = [...valuePool].sort((a, b) => {
    const rrpA = getRrp(a);
    const rrpB = getRrp(b);
    if (rrpA !== null && rrpB !== null && rrpA !== rrpB) return rrpA - rrpB;
    if (rrpA !== null && rrpB === null) return -1;
    if (rrpA === null && rrpB !== null) return 1;
    const tierDelta = getTierRank(a) - getTierRank(b);
    if (tierDelta !== 0) return tierDelta;
    return b._score - a._score;
  })[0] || uniqueFallback;

  function getSummary(product: typeof scored[0], bestReasons?: string[]) {
    const hasUserAnswers = Object.keys(answers).length > 0;
    const reasons = (product._reasons ?? []) as string[];
    if (hasUserAnswers && reasons.length > 0) {
      const unique = Array.from(new Set(reasons));
      if (bestReasons && bestReasons.length > 0) {
        const bestSet = new Set(bestReasons);
        // Lead with reasons exclusive to this card so the explanation is
        // visually distinct from the Best Match card.
        const exclusive = unique.filter((r) => !bestSet.has(r));
        const shared = unique.filter((r) => bestSet.has(r));
        if (exclusive.length >= 2) {
          const second = exclusive[1].charAt(0).toLowerCase() + exclusive[1].slice(1);
          return `${exclusive[0]} — ${second}.`;
        }
        if (exclusive.length === 1) {
          // Pair the exclusive reason with a shared one for a richer sentence.
          if (shared.length > 0) {
            const second = shared[0].charAt(0).toLowerCase() + shared[0].slice(1);
            return `${exclusive[0]} — ${second}.`;
          }
          return `${exclusive[0]}.`;
        }
        // All reasons identical to Best Match — fall back to description.
        return product.description ?? 'A strong match based on your answers.';
      }
      if (unique.length >= 2) {
        const second = unique[1].charAt(0).toLowerCase() + unique[1].slice(1);
        return `${unique[0]} — ${second}.`;
      }
      return `${unique[0]}.`;
    }
    return product.description ?? 'A strong match based on your answers.';
  }

  function getBullets(product: typeof scored[0]): string[] {
    if (!product._reasons) return [];
    return Array.from(new Set(product._reasons)).slice(0, 3).map(String);
  }

  function getPriceHint(product: typeof scored[0]): string | undefined {
    const rrpUk = Number(product.attributes.rrp);
    const rrpUs = Number(product.attributes.rrpUs);
    if (region === 'UK' && Number.isFinite(rrpUk) && rrpUk > 0) return `~£${rrpUk}`;
    if (region === 'US' && Number.isFinite(rrpUs) && rrpUs > 0) return `~$${rrpUs}`;
    return undefined;
  }

  const cards = [
    { label: 'Best Match', product: best },
    { label: 'Strong Alternative', product: alt },
    { label: 'Best Value', product: budget },
  ];

  // Fire results_viewed once on mount
  useEffect(() => {
    if (!hasAnswers) return;
    trackEvent('results_viewed', { best_match: best.id });
  }, [hasAnswers, best.id]);

  if (!hasAnswers) {
    return (
      <div style={{ minHeight: "100vh", background: "#f6fbf7", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
        <main style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a3d2f" }}>Let&apos;s start with the quiz</h2>
          <p style={{ margin: 0, color: "#4b6b57", lineHeight: 1.6 }}>
            We need your answers before we can build personalised mattress matches. Redirecting you now.
          </p>
          <Button
            onClick={() => router.replace(questionnaireHref)}
            variant="primary"
            style={{ width: "100%", fontWeight: 700, fontSize: 16 }}
          >
            Go to questionnaire
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: "url('/images/a-soft-inviting-mattress.jpeg')",
      backgroundSize: "cover",
      backgroundPosition: "center 40%",
      backgroundAttachment: "fixed",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "32px 16px",
      position: "relative",
    }}>
      {/* Forest overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(26, 61, 47, 0.55)", zIndex: 0 }} />

      <main style={{
        width: "100%",
        maxWidth: 440,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        position: "relative",
        zIndex: 1,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 20,
        padding: 28,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}>
        <div style={{ width: "100%" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, textAlign: "left", margin: "0 0 4px 0", color: "#ffffff", textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>{resolvedHeading}</h2>
          <p style={{ textAlign: "left", margin: 0, color: "rgba(255,255,255,0.8)", fontSize: 15 }}>Based on your answers — here are your top picks.</p>
        </div>

        <RegionSelector />

        <p style={{ width: "100%", margin: 0, fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
          <em>{affiliateDisclosure}</em>
        </p>
        <p style={{ width: "100%", margin: 0, fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
          Prices and availability are set by retailers and may change at any time. Always confirm the current price before purchasing.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
          {cards.map(({ label, product }, i) => (
            <ResultsCard
              key={label}
              label={label}
              isBest={i === 0}
              image={product.imageUrl}
              title={`${product.brand} ${product.name}`}
              explanation={getSummary(product, i > 0 ? (best._reasons as string[]) : undefined)}
              badges={getBullets(product)}
              priceTier={String(product.attributes.priceTier ?? '')}
              priceHint={getPriceHint(product)}
              buyLinks={getRegionLinks(product.id, region)}
              onCtaClick={() => trackEvent('affiliate_click', { product_id: product.id, slot: label, position: i })}
            />
          ))}
        </div>
        <Button
          onClick={() => {
            reset();
            router.push(homeHref);
          }}
          variant="primary"
          style={{ marginTop: 32, width: "100%", fontWeight: 700, fontSize: 16 }}
        >
          Start again
        </Button>
      </main>
    </div>
  );
}

// ── Page wrapper — injects RegionProvider around the inner page ───────────────

function ResultsPageWithRegion(props: ResultsPageProps) {
  return (
    <RegionProvider>
      <ResultsPageInner {...props} />
    </RegionProvider>
  );
}

export default function ResultsPage(props: ResultsPageProps) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#888" }}>Finding your best matches…</div>}>
      <ResultsPageWithRegion {...props} />
    </Suspense>
  );
}
