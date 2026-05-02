/**
 * scripts/coverage-check.mjs
 *
 * Runs all 8 mattress personas through the scoring engine and prints a
 * ranking table. Exits with code 1 if any persona has a top score < 30
 * or if any product ID in the catalogue returns score 0 across ALL personas
 * (dead SKU).
 *
 * Usage:  node scripts/coverage-check.mjs
 */

import { createRequire } from "module";
import { pathToFileURL } from "url";
import path from "path";
import { register } from "node:module";

// ── Bootstrap ts-node/esm so we can import TypeScript modules ─────────────────
// Requires: npm install -D ts-node @types/node (already in package.json)
process.env.TS_NODE_PROJECT = path.resolve(process.cwd(), "tsconfig.json");

// Use tsx if available, otherwise fall back to ts-node
let products, scoreMattress;

try {
  // Dynamic import — works when run via: node --import tsx/esm scripts/coverage-check.mjs
  // or simply: npx tsx scripts/coverage-check.mjs
  const productsModule = await import("../config/mattress/products.ts");
  const scoringModule = await import("../config/mattress/scoring.ts");
  products = productsModule.products;
  scoreMattress = scoringModule.scoreMattress;
} catch {
  console.error(
    "Could not import TypeScript modules directly.\n" +
    "Run via:  npx tsx scripts/coverage-check.mjs"
  );
  process.exit(2);
}

// ── Persona definitions ────────────────────────────────────────────────────────

const personas = [
  {
    label: "A — side/light/hot/pressure-points",
    answers: {
      "sleep-position": "side",
      "body-weight": "light",
      "sleep-partner": "solo",
      "pain-points": "pressure-points",
      temperature: "hot",
      material: "no-preference",
      budget: "mid",
    },
  },
  {
    label: "B — back/heavy/partner/back-pain/hybrid",
    answers: {
      "sleep-position": "back",
      "body-weight": "heavy",
      "sleep-partner": "partner",
      "pain-points": "back-pain",
      temperature: "neutral",
      material: "hybrid",
      budget: "mid",
    },
  },
  {
    label: "C — combination/partner/budget",
    answers: {
      "sleep-position": "combination",
      "body-weight": "average",
      "sleep-partner": "partner",
      "pain-points": "none",
      temperature: "neutral",
      material: "no-preference",
      budget: "budget",
    },
  },
  {
    label: "D — stomach/spring",
    answers: {
      "sleep-position": "stomach",
      "body-weight": "average",
      "sleep-partner": "solo",
      "pain-points": "none",
      temperature: "neutral",
      material: "spring",
      budget: "mid",
    },
  },
  {
    label: "E — side/light/premium/joint-pain/hot/memory-foam",
    answers: {
      "sleep-position": "side",
      "body-weight": "light",
      "sleep-partner": "solo",
      "pain-points": "joint-pain",
      temperature: "hot",
      material: "memory-foam",
      budget: "premium",
    },
  },
  {
    label: "F — back/heavy/budget/hot/back-pain",
    answers: {
      "sleep-position": "back",
      "body-weight": "heavy",
      "sleep-partner": "solo",
      "pain-points": "back-pain",
      temperature: "hot",
      material: "no-preference",
      budget: "budget",
    },
  },
  {
    label: "G — combination/partner/premium/pressure-points",
    answers: {
      "sleep-position": "combination",
      "body-weight": "average",
      "sleep-partner": "partner",
      "pain-points": "pressure-points",
      temperature: "neutral",
      material: "no-preference",
      budget: "premium",
    },
  },
  {
    label: "H — back/average/spring/back-pain/mid",
    answers: {
      "sleep-position": "back",
      "body-weight": "average",
      "sleep-partner": "solo",
      "pain-points": "back-pain",
      temperature: "neutral",
      material: "spring",
      budget: "mid",
    },
  },
];

// ── Run scoring ────────────────────────────────────────────────────────────────

let hasError = false;

// Track per-product maximum score across all personas (for dead-SKU detection)
const productMaxScore = {};
for (const p of products) productMaxScore[p.id] = 0;

for (const persona of personas) {
  const scored = products
    .map((p) => ({ product: p, ...scoreMattress(p, persona.answers) }))
    .sort((a, b) => b.score - a.score);

  const top5 = scored.slice(0, 5);
  const topScore = top5[0]?.score ?? 0;

  console.log(`\n── ${persona.label} ──`);
  console.log(`Top 5:`);
  for (const [i, r] of top5.entries()) {
    console.log(`  ${i + 1}. [${r.score.toString().padStart(3)}] ${r.product.id}`);
  }

  if (topScore < 30) {
    console.error(`  ❌ FAIL: top score ${topScore} < 30 (persona has no good match)`);
    hasError = true;
  }

  for (const r of scored) {
    if (r.score > productMaxScore[r.product.id]) {
      productMaxScore[r.product.id] = r.score;
    }
  }
}

// ── Dead SKU check ─────────────────────────────────────────────────────────────

console.log("\n── Dead SKU check ──");
const deadSkus = Object.entries(productMaxScore).filter(([, max]) => max === 0);
if (deadSkus.length > 0) {
  for (const [id] of deadSkus) {
    console.error(`  ❌ DEAD SKU: ${id} scored 0 across all personas`);
  }
  hasError = true;
} else {
  console.log("  ✅ All products scored > 0 in at least one persona");
}

// ── Exit ───────────────────────────────────────────────────────────────────────

if (hasError) {
  console.error("\n❌ Coverage check FAILED");
  process.exit(1);
} else {
  console.log("\n✅ Coverage check PASSED");
}
