# FindMyIdeal Theme System

A practical guide for copying and extending the theme system across all
FindMyIdeal standalone product sites (FindMyIdealGolfBall, FindMyIdealPillow,
FindMyIdealMattress, FindMyIdealHeadphones, etc.).

---

## Architecture overview

```
core/theme/
  tokens.ts        — ThemeTokens type + themeNames constant
  themes.ts        — All theme definitions (one object per theme)
  ThemeProvider.tsx — React context; reads config/global-theme.json at import
  index.ts         — Re-exports everything

config/
  global-theme.json — Active theme selection, persisted to disk by the admin API
                      { "themes": { "default": "light-green", "golf-ball": "light-green" } }

pages/api/
  set-theme.ts     — POST endpoint that writes to global-theme.json
                      Body: { theme: ThemeName, category?: string }

app/admin/
  theme-admin.tsx  — Standalone reusable theme selector component (hub/generic use)

app/admin/golf-ball/page.tsx — Product-specific admin; has its own ThemeTab that
                               calls set-theme with { category: "golf-ball" }
```

All public-facing components consume tokens exclusively via `useTheme()`. No
raw colour values are allowed inside component files. Shadows may use neutral
`rgba(0,0,0,0.03)` values — these are decorative and theme-agnostic.

---

## Available themes

| ID | Display name | Primary accent | Suited for |
|----|-------------|---------------|------------|
| `white` | White — Clean | `#2563eb` (blue) | Hub, generic, SaaS |
| `light-green` | Light Green — Golf | `#3bb273` (green) | Golf balls, sports |
| `blue` | Blue — Tech | `#2563eb` (blue) | Headphones, electronics |
| `classic-navy` | Classic Navy — US Premium | `#1b3a6e` (deep navy) | US-facing affiliate sites |

---

## Adding a new theme

1. Open `core/theme/themes.ts` and add a new entry to the `themes` object.
   Copy an existing theme and adjust the values. Every key in `ThemeTokens`
   must be present.

2. Open `core/theme/tokens.ts` and add the new theme ID to `themeNames`.

3. Open `app/admin/theme-admin.tsx` and add a `label` + `description` entry to
   `themeInfo`. This is what users see in every product admin panel.

4. If this theme is specific to a product admin, also add it to the local
   `themeInfo` inside that product's `ThemeTab`.

**Do not** hardcode any colour inside a component. If a component needs a new
visual state, add a token to `ThemeTokens` first, populate it in every theme,
then reference it via `tokens.<tokenName>`.

---

## Copying the theme system to a new product site

### Required files

Copy these files verbatim into the new repo:

```
core/theme/tokens.ts
core/theme/themes.ts
core/theme/ThemeProvider.tsx
core/theme/index.ts
config/global-theme.json
pages/api/set-theme.ts
app/admin/theme-admin.tsx
components/icons/FindMyIdealIcon.tsx
```

### Required dependencies

The theme system has no external dependencies beyond React and Next.js.
`global-theme.json` is imported statically — no database needed.

### Product-specific wiring

1. Set the default theme in `config/global-theme.json`:
   ```json
   { "themes": { "default": "white", "my-product": "white" } }
   ```

2. In `config/registry.ts`, set the `theme` field on your `CategoryConfig`:
   ```ts
   theme: 'classic-navy',
   ```

3. In `app/layout.tsx`, pass the category's theme to `ThemeProvider`:
   ```tsx
   <ThemeProvider themeName={config?.theme}>
   ```

4. In the product admin page, add a `ThemeTab` component that calls
   `POST /api/set-theme` with `{ theme, category: "my-product" }`.

---

## How icons consume theme tokens

All icons in `components/icons/FindMyIdealIcon.tsx` use the `color` prop which
defaults to `currentColor`. This means:

- In most layout contexts the icon inherits the text colour automatically.
- For accent-coloured icons (Header, Footer, badges) pass `color={tokens.accent}`
  from `useTheme()`.
- **Never** hardcode a hex value inside an icon component.

### Recommended icon usage by context

| Context | Recommended value |
|---------|------------------|
| Header logo | `color={tokens.accent}` |
| Footer "Powered by" | `color={tokens.textSecondary}` |
| Inline with text | `color="currentColor"` (default) |
| CTA button icon | `color={tokens.accentForeground}` |

### Adding a new product icon

1. Add a new export to `FindMyIdealIcon.tsx` following the existing pattern.
2. Use `IconProps`, call `makeId(title)` for accessibility, default `color="currentColor"`.
3. In the new product's `Header`/`Footer`, import the icon and pass `color={tokens.accent}`.

---

## Selecting a theme from product admin

Each standalone product site has its own admin page. The recommended pattern:

```tsx
// In your product's admin ThemeTab:
await fetch("/api/set-theme", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ theme: selectedTheme, category: "my-product" }),
});
```

This writes both:
- `themes.default` — used when no category-specific theme is found
- `themes["my-product"]` — used when the site loads under that product's domain

The `ThemeProvider` in `app/layout.tsx` reads the category-specific key first,
falling back to `default`. The product registry (`config/registry.ts`) supplies
the initial theme before the first admin save.

---

## What not to hardcode

| What | Use instead |
|------|------------|
| `#fff` on a coloured button | `tokens.accentForeground` |
| Any hex colour in a component | A `ThemeTokens` field |
| A Tailwind colour class on a themed surface | Inline style with `tokens.*` |
| A fixed `background` in Header/Footer | `tokens.surface` / `tokens.surfaceAlt` |

The only safe hardcoded colour in a component is a neutral shadow like
`rgba(0,0,0,0.03)` — these are intentionally theme-agnostic.

---

## How to test a new theme

### TypeScript
```
npx tsc --noEmit
```
A missing token on any theme will produce a TypeScript error because
`ThemeTokens` is a fully typed object.

### Lint
```
npx next lint
```

### Build
```
npx next build
```

### Visual / contrast
1. In the product admin, select the new theme and reload.
2. Manually check: homepage, questionnaire, results page, header, footer.
3. Use browser devtools or [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
   to verify text-on-background ratios meet WCAG AA (≥ 4.5:1 for body text,
   ≥ 3:1 for large/bold text).

### Target contrast ratios for Classic Navy

| Pair | Ratio (approx) | Pass |
|------|---------------|------|
| `textPrimary` #1c2340 on `background` #f8f9fc | ~14:1 | ✅ AAA |
| `textSecondary` #4b5275 on `background` #f8f9fc | ~7:1 | ✅ AA |
| `accentForeground` #fff on `accent` #1b3a6e | ~12:1 | ✅ AAA |
| `accent` #1b3a6e on `accentSoft` #dce5f5 | ~5.8:1 | ✅ AA |

### Mobile
Resize to 375 px wide and verify: hero, questionnaire step card, results cards,
header icon + brand name, footer layout.

---

## FindMyIdealXXX multi-product strategy

Each standalone site is a **copy** of the base repo, not a shared dependency.
This keeps deployment independent and avoids cross-product coupling. The theme
system is designed to be copied, not imported.

When copying:
1. Replace `config/domain-map.ts` with the new product's domain.
2. Replace `config/registry.ts` entry with the new product's metadata.
3. Set the initial theme in `config/global-theme.json`.
4. Add product-specific content under `config/<product>/`.
5. The `core/theme/` and `components/icons/` directories copy unchanged.

The family identity is maintained by:
- The `FindMyIdealIcon` base mark appearing consistently in Header + Footer
- A product-specific icon (`GolfBallIcon`, `PillowIcon`, etc.) alongside it
- Theme selection giving each site a distinct but coherent colour identity
- The same font stack (Geist) and component shapes across all sites
