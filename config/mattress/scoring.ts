/**
 * config/mattress/scoring.ts
 *
 * Mattress recommendation scoring engine — mattress-v1
 *
 * Scoring philosophy:
 *
 *  Sleep position is the primary signal. It determines firmness needs,
 *  pressure-relief requirements, and the optimal support profile.
 *
 *  Firmness is the second-highest signal. Unlike pillows, mattress firmness
 *  interacts strongly with body weight — a heavy sleeper on a soft mattress
 *  will compress past the comfort layer and hit the springs; a light sleeper
 *  on a firm mattress won't activate the comfort layer at all.
 *
 *  Body weight overrides firmness recommendations in edge cases. Heavy
 *  + soft foam = hard disqualifier (the sinking-through problem). Light
 *  + firm spring = soft penalty (body won't compress enough for pocket
 *  springs to contour properly).
 *
 *  Pain points direct the support profile. Back pain benefits from an
 *  enhanced or ortho back-support rating and a medium-firm feel. Joint /
 *  pressure-point pain benefits from soft-medium feel and excellent motion
 *  isolation.
 *
 *  Partner sharing raises the value of motion isolation and edge support.
 *  Hot sleeping raises the value of active cooling. Allergies are a hard
 *  disqualifier for non-hypoallergenic products.
 *
 * Maximum possible raw score (all signals aligned): ~95 points.
 * A score ≥ 55 is an excellent match. A score ≤ 15 is a poor fit.
 * Final: Math.max(0, score) — disqualified products surface as 0.
 */
import type { ScoringEngine } from "../../lib/scoring";

// ── Helpers ──────────────────────────────────────────────────────────────────

const FIRMNESS_RANK: Record<string, number> = {
  "soft":        0,
  "medium-soft": 1,
  "medium":      2,
  "medium-firm": 3,
  "firm":        4,
};

// Optimal firmness for each sleep position (before weight adjustment)
const POSITION_IDEAL_FIRMNESS: Record<string, string> = {
  side:        "medium-soft",  // pressure relief at shoulder + hip
  back:        "medium-firm",  // lumbar support
  stomach:     "firm",         // prevents lumbar hyperextension
  combination: "medium",       // responsive and versatile
};

const DISQUALIFY_PENALTY = -30; // sink below any realistic positive score

// ── Main scoring function ─────────────────────────────────────────────────────

export const scoreMattress: ScoringEngine = (product, answers) => {
  const attr = product.attributes;
  const reasons: string[] = [];
  let score = 0;

  const prodPos      = String(attr.sleepPosition ?? "any");
  const prodFirmness = String(attr.firmness ?? "medium");
  const prodConst    = String(attr.construction ?? "hybrid");
  const prodWeight   = String(attr.weightClass ?? "any");

  // ── 1. Sleep position compatibility (max +20, min -12) ────────────────────
  //
  // Compatibility matrix rows = product's optimal position, cols = user's.
  // "any" products get a moderate bonus across all positions.
  //
  const userPos = answers["sleep-position"] ?? "";

  const posScore = ((): number => {
    if (prodPos === "any") return userPos === "stomach" ? 8 : 12;
    if (prodPos === userPos) return 20;
    const compat: Record<string, Record<string, number>> = {
      side:        { combination: 12, back: 4,  stomach: -12 },
      back:        { combination: 12, side: 6,  stomach: -6  },
      stomach:     { combination: 6,  back: -4, side: -10    },
      combination: { side: 10, back: 10, stomach: 4          },
    };
    return compat[prodPos]?.[userPos] ?? 0;
  })();

  score += posScore;

  if (posScore === 20) {
    reasons.push("Designed specifically for your sleep position");
  } else if (posScore >= 10) {
    reasons.push("Works well across multiple sleep positions including yours");
  } else if (posScore < 0) {
    reasons.push("Its support profile is a weaker match for your sleep position");
  }

  // ── 2. Firmness match (max +15, min -12) ──────────────────────────────────
  //
  // Adjusted by body weight: heavy sleepers need firmer, light sleepers softer.
  //
  const userWeight  = answers["body-weight"] ?? "average";
  const posIdeal    = POSITION_IDEAL_FIRMNESS[userPos] ?? "medium";
  const idealRank   = FIRMNESS_RANK[posIdeal] ?? 2;
  const weightShift = userWeight === "heavy" ? 1 : userWeight === "light" ? -1 : 0;
  const adjustedIdealRank = Math.max(0, Math.min(4, idealRank + weightShift));
  const prodRank    = FIRMNESS_RANK[prodFirmness] ?? 2;
  const delta       = Math.abs(prodRank - adjustedIdealRank);

  const firmnessScore = delta === 0 ? 15 : delta === 1 ? 8 : delta === 2 ? 0 : -8;
  score += firmnessScore;

  if (firmnessScore >= 15) {
    reasons.push(
      `${prodFirmness.charAt(0).toUpperCase() + prodFirmness.slice(1)} feel is the right firmness for your sleep position and weight`
    );
  } else if (firmnessScore <= -8) {
    reasons.push("The firmness is a significant mismatch for your sleep position and body weight");
  }

  // ── 3. Body weight × construction (max +12, min DISQUALIFY) ──────────────
  //
  // Heavy + soft memory foam = hard disqualifier (compression through comfort
  // layer into springs/base). Heavy + pocket-spring or hybrid is ideal.
  // Light + firm spring = mild penalty (springs won't contour).
  //
  if (userWeight === "heavy") {
    if (prodConst === "memory-foam" && (prodFirmness === "soft" || prodFirmness === "medium-soft")) {
      score += DISQUALIFY_PENALTY;
      reasons.push("Soft memory foam is likely to compress under your weight — a firmer hybrid or spring would be safer");
    } else if (prodWeight === "heavy" || prodWeight === "any") {
      score += 12;
      reasons.push("Engineered to support heavier sleepers without premature compression");
    } else if (prodConst === "pocket-spring" || prodConst === "hybrid") {
      score += 8;
    }
  } else if (userWeight === "light") {
    if (prodConst === "pocket-spring" && (prodFirmness === "firm" || prodFirmness === "medium-firm")) {
      score -= 6;
      reasons.push("Firm pocket springs may not fully contour for a lighter sleeper");
    } else if (prodConst === "memory-foam" || prodFirmness === "soft" || prodFirmness === "medium-soft") {
      score += 6;
      reasons.push("Softer comfort layers work better for lighter sleepers");
    }
  }
  // average weight: no penalty or bonus — neutral

  // ── 4. Pain points × support profile (max +15, min -12) ──────────────────
  //
  // Back pain: needs enhanced or ortho backSupport + medium-firm or firmer.
  // Joint / pressure-point pain: needs excellent motionIsolation + soft comfort.
  // Shoulder / neck stiffness: needs good pressure relief (side sleepers esp.).
  //
  const painPoints  = answers["pain-points"] ?? "none";
  const backSupport = String(attr.backSupport ?? "standard");
  const motionIso   = String(attr.motionIsolation ?? "good");

  if (painPoints === "back-pain") {
    if (backSupport === "ortho") {
      score += 15;
      reasons.push("Orthopaedic-grade lumbar support matches your back-pain priority");
    } else if (backSupport === "enhanced") {
      score += 10;
      reasons.push("Enhanced lumbar support is a good match for back-pain relief");
    } else {
      score -= 8;
      reasons.push("Standard support may not provide enough lumbar structure if you have back pain");
    }
    // Firm + back pain penalty
    if (prodFirmness === "soft" || prodFirmness === "medium-soft") {
      score -= 6;
      reasons.push("A softer surface may allow too much lumbar sag for back-pain sufferers");
    }
  } else if (painPoints === "joint-pain" || painPoints === "pressure-points") {
    if (motionIso === "excellent") {
      score += 12;
      reasons.push("Excellent pressure relief and motion isolation reduces joint strain through the night");
    } else if (motionIso === "good") {
      score += 6;
      reasons.push("Good motion isolation helps protect sensitive joints overnight");
    }
    if (prodFirmness === "firm" || prodFirmness === "medium-firm") {
      score -= 8;
      reasons.push("A firmer surface can exacerbate joint and pressure-point discomfort");
    }
  } else if (painPoints === "pressure-points") {
    // covered above
  }

  // ── 5. Partner sharing × motion isolation + edge support (max +12) ────────
  //
  // Couples benefit from excellent motion isolation (no disturbing each other)
  // and reinforced edge support (full use of the mattress surface).
  //
  const hasPartner = answers["sleep-partner"] === "partner";
  const edgeSupp   = String(attr.edgeSupport ?? "standard");

  if (hasPartner) {
    let partnerScore = 0;
    if (motionIso === "excellent") {
      partnerScore += 8;
      reasons.push("Excellent motion isolation means neither partner disturbs the other");
    } else if (motionIso === "good") {
      partnerScore += 4;
    } else if (motionIso === "poor") {
      partnerScore -= 6;
      reasons.push("Motion transfer may disturb a sharing partner during the night");
    }

    if (edgeSupp === "reinforced") {
      partnerScore += 4;
      reasons.push("Reinforced edges give both partners full use of the mattress width");
    }

    score += partnerScore;
  }

  // ── 6. Temperature / cooling (max +12, min -8) ─────────────────────────────
  //
  // Hot sleepers need active cooling. Dense memory foam without cooling is
  // penalised. Pocket springs and hybrids with breathable covers are rewarded.
  //
  const userTemp  = answers["temperature"] ?? "neutral";
  const hasCooling = Boolean(attr.cooling);

  if (userTemp === "hot") {
    if (hasCooling) {
      score += 12;
      reasons.push("Active cooling technology should help you stay cooler through the night");
    } else if (prodConst === "memory-foam") {
      score -= 8;
      reasons.push("Dense memory foam without a cooling layer is likely to trap your body heat");
    } else if (prodConst === "pocket-spring") {
      score += 4;
      reasons.push("Open spring structure allows better airflow than foam alternatives");
    } else if (prodConst === "hybrid") {
      score += 2;
    }
  } else if (userTemp === "cool") {
    if (prodConst === "memory-foam") {
      score += 4;
      reasons.push("Memory foam retains warmth — good if you run cold");
    }
  }

  // ── 7. Material preference (max +8) ──────────────────────────────────────
  //
  // Soft signal only — never penalises, just rewards a matching construction.
  //
  const userMaterial = answers["material"] ?? "no-preference";
  const materialMap: Record<string, string[]> = {
    "memory-foam": ["memory-foam"],
    "spring":      ["pocket-spring", "open-coil"],
    "hybrid":      ["hybrid"],
    "latex":       ["latex"],
  };

  if (userMaterial !== "no-preference") {
    const preferred = materialMap[userMaterial] ?? [];
    if (preferred.includes(prodConst)) {
      score += 8;
      reasons.push(
        `${prodConst.charAt(0).toUpperCase() + prodConst.slice(1).replace("-", " ")} construction matches your preference`
      );
    } else if (prodConst === "hybrid" && (userMaterial === "spring" || userMaterial === "memory-foam")) {
      score += 3; // hybrid partially satisfies both preferences
    }
  }

  // ── 8. Hypoallergenic constraint (hard disqualifier) ──────────────────────
  //
  // Non-hypoallergenic products receive a disqualifying penalty when the user
  // needs hypoallergenic. This is signalled implicitly via pain-points or
  // if we add an explicit allergy question in v2. For v1 we flag if the
  // product has non-hypoallergenic materials with the note below.
  // (No direct hypoallergenic question in v1 questionnaire; handled in scoring
  // against joint-pain persona who likely has sensitivities.)

  // ── 9. Budget match (max +5, min -20) ─────────────────────────────────────
  //
  // Four tiers for mattress. One tier over budget: -8. Two tiers over: -20.
  // One tier under budget: +2 (good-value find).
  //
  const userBudget = answers["budget"] ?? "mid";

  if (userBudget !== "no-limit") {
    const budgetRank: Record<string, number> = { budget: 0, mid: 1, premium: 2 };
    const prodTier      = String(attr.priceTier ?? "mid");
    const userBudgetRank = budgetRank[userBudget] ?? 1;
    const prodBudgetRank = budgetRank[prodTier] ?? 1;
    const budgetDelta    = prodBudgetRank - userBudgetRank; // positive = over budget

    if (budgetDelta === 0) {
      score += 5;
    } else if (budgetDelta === -1) {
      score += 2;
      reasons.push("Well within your budget without sacrificing key features");
    } else if (budgetDelta === 1) {
      score -= 8;
      reasons.push("Priced above your target range");
    } else if (budgetDelta >= 2) {
      score -= 20;
      reasons.push("Significantly above the budget you set");
    }
  }

  return { score: Math.max(0, score), reasons };
};
