# Pillow MVP Pre-Start Checklist

> Architecture-level gate. Complete in order. Do not begin building until all items are checked.
> Based on code audit: April 24, 2026.
>
> **Architectural principle confirmed:** Each product category owns its versioning layer, scoring engines, and admin panel in full isolation. There is no shared or catch-all admin. Golf ball's questionnaire versions, scoring engines, and admin page are golf-only. Pillow will have an equivalent, fully independent set. Neither category's admin or versioning logic touches the other.

---

## Phase 1 — Protect Golf Ball (Do First)

- [ ] 1. Run full golf-ball E2E test suite and confirm all tests pass cleanly. Establish this as the regression baseline before any work begins.

---

## Phase 2 — Confirm Platform Blockers

- [ ] 2. Audit `resolveQuestionnaire()` and `resolveScoring()` in `config/registry.ts` — both functions currently ignore the `categoryId` argument and hardcode golf ball. Confirm they would correctly serve pillow config if a pillow entry existed, or confirm they need hardening before pillow can function.

- [ ] 3. Confirm the literal type constraint in `pages/api/set-questionnaire.ts` (`VALID_CATEGORIES = ['golf-ball'] as const`) is understood and planned for. This file **must** be touched to register pillow as a valid category for version switching. The fix is additive — golf ball's valid versions are not changed, pillow's version list is simply added alongside it.

- [ ] 4. Validate whether `config/questionnaire-config.json` version changes persist across Vercel deployments (they likely do not — the file is written at runtime by the API). Accept this limitation or resolve it before adding a second category to the version store.

---

## Phase 3 — Establish Conventions Before Writing Code

- [ ] 5. Decide affiliate strategy — use the same Amazon UK tag (`findmyidealpillow-21`) or create a separate pillow-specific tag for attribution. Establish this convention before any `products.ts` file is created.

- [ ] 6. Decide SEO page routing — will pillow SEO landing pages use `app/pillow/[slug]/` (new, category-specific) or a generic `app/[category]/[slug]/` route? This decision affects how much structural work is needed.

---

## Phase 4 — Domain Knowledge (Cannot Be Skipped or Automated)

- [ ] 7. Commission sleep domain expert input for questionnaire questions and scoring weight definitions. Questions must reflect how people actually describe sleep discomfort, not generic "preferences." This is not optional and cannot be AI-generated.

- [ ] 8. Define the pillow attribute schema before writing any product data:
  - `loft` (low / mid / high)
  - `firmness` (1–10 scale or discrete: soft / medium / firm)
  - `fill` (memory foam / latex / down / synthetic / hybrid)
  - `coolingRating` (numeric or boolean)
  - `supportZones` (boolean)
  - `allergenFree` (boolean)
  - `priceTier` (budget / mid / premium — confirm labels work for pillow price ranges)

---

## Phase 5 — Product Data Before Scoring Model

- [ ] 9. Source and verify a minimum of 6–8 real pillow products with:
  - Correct Amazon UK ASINs (verify live)
  - Correct attribute values per the schema above
  - Accurate descriptions

  > Scoring weights cannot be validated without real product data to test against. Do not write the scoring engine before this step.

---

## Phase 6 — Validate Scoring Off-Platform

- [ ] 10. Build and validate the scoring model in a spreadsheet first. Define weight constants, test against at least 10 synthetic user profiles (e.g., hot side-sleeper / firm preference / budget, cold back-sleeper / soft preference / premium). Confirm the top-ranked product is genuinely correct for each profile before writing any code.

  > Note: Pillow recommendations have a physical health dimension golf ball recommendations do not. A wrong recommendation can cause neck or back pain. The scoring model must be credible, not plausible.

---

## Phase 7 — Safe Registry Entry

- [ ] 11. Create `config/pillow/` stub directory with placeholder files (empty questionnaire, empty product list, stub scoring engine returning `{ score: 0, reasons: [] }`).

- [ ] 12. Add `'pillow'` entry to `categoryRegistry` in `config/registry.ts` with `comingSoon: true`. The domain `findmyidealpillow.com` is already mapped in `config/domain-map.ts`.

- [ ] 13. Deploy and confirm `findmyidealpillow.com` renders the coming soon holding page correctly.

- [ ] 14. **Run full golf-ball E2E and smoke test suite again.** Confirm zero regression after the registry addition.

---

## Phase 8 — Clear to Build

All items above must be checked before beginning. The following is the complete isolated artefact set for pillow — none of these files exist yet, none touch golf-ball files:

### Config layer (mirrors `config/golf-ball/` exactly in structure)
- `config/pillow/questionnaire.v1.ts` — first questionnaire version
- `config/pillow/scoring.ts` — scoring engine paired to v1
- `config/pillow/questionnaire.versions.ts` — version registry (`pillowQuestionnaireVersions`, `pillowScoringEngines`, `pillowVersionList`)
- `config/pillow/products.ts` — product catalogue with pillow-specific attributes
- `config/pillow/seo-pages.ts` — SEO landing page definitions

### Admin layer (category-specific, not shared)
- `app/admin/pillow/page.tsx` — pillow-only admin panel
  - Imports from `config/pillow/` only
  - Shows pillow questionnaire versions (`pillowVersionList`)
  - Has no awareness of golf-ball admin or golf-ball versions
  - Mirrors `app/admin/golf-ball/page.tsx` in structure, not in content

### Registry wiring
- Add `'pillow'` entry to `categoryRegistry` in `config/registry.ts`
  - `resolveQuestionnaire()` and `resolveScoring()` must correctly dispatch to `pillowQuestionnaireVersions` for `categoryId === 'pillow'`
  - Golf ball's dispatch path is unchanged

> **The admin page for golf ball is `app/admin/golf-ball/page.tsx`. The admin page for pillow is `app/admin/pillow/page.tsx`. There is no shared admin page. Each knows only its own category.**

---

## Known Structural Work Required (Not Optional)

These files must be touched to support pillow — they contain hardcoded golf-ball coupling. All changes are additive; golf ball behaviour is unchanged.

| File | Issue | Nature of Change |
|---|---|---|
| `config/registry.ts` | `resolveQuestionnaire()` and `resolveScoring()` ignore `categoryId` — always return golf ball | Add pillow dispatch branch; golf path untouched |
| `pages/api/set-questionnaire.ts` | `VALID_CATEGORIES` literal type contains only `'golf-ball'` | Add `'pillow'` and register `pillowQuestionnaireVersions` |
| `app/results/page.tsx` | Fallback hardcoded to `categoryRegistry['golf-ball']` | Replace with a neutral error or null state |
| `app/page.tsx` | Hub `CATEGORIES` array is hardcoded inline, not registry-driven | Add pillow entry inline (or make registry-driven later) |
| `app/layout.tsx` | Single GA4 property ID across all categories | Consider per-category GA4 stream IDs |

---

## Risks to Monitor

- **Silent golf fallback:** A misconfigured pillow registry entry will silently render golf ball results to pillow visitors — no error, no warning.
- **`resolveQuestionnaire()` latent bug:** Currently returns golf ball versions unconditionally regardless of `categoryId`. Admin version toggling for pillow will appear to work but do nothing until this is fixed.
- **GA4 cross-contamination:** All category traffic currently flows into the same Analytics property. Pillow and golf ball conversions will be indistinguishable without per-category stream separation.
- **Questionnaire-config.json persistence:** Runtime writes to this file do not survive Vercel deployments. Any version change made via the admin UI will be lost on next deploy.
