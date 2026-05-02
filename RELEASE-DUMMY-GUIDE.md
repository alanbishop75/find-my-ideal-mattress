# Release Dummy Guide (Phase 1)

This is the simple, no-jargon release process after Phase 1 controls are in place.

If you want the shortest non-technical version, read [DEMO-AND-PROD-FLOW.md](DEMO-AND-PROD-FLOW.md).

## What Phase 1 changed

Before:
- You could push code and accidentally go straight toward production with weak guardrails.
- E2E tests were unreliable.
- Type checks could fail for generated dev artifacts instead of real code issues.

Now:
- There is a blocking CI gate in [.github/workflows/ci.yml](.github/workflows/ci.yml).
- There is a non-blocking warning workflow in [.github/workflows/warnings.yml](.github/workflows/warnings.yml).
- E2E runs from [playwright.config.ts](playwright.config.ts) and only tests [tests](tests).
- Required checks are explicit: typecheck, lint, unit, config validation, build, E2E.
- Config sanity checks now run in [lib/config-validation.test.ts](lib/config-validation.test.ts).
- Pull requests now use [.github/pull_request_template.md](.github/pull_request_template.md).

## What this means for production releases

Production should only happen from main after all checks pass.

Non-negotiable rule:
- Production releases are PR-only.
- Do not deploy production directly from a local branch or unreviewed commit.

If checks fail:
- Do not merge.
- Fix issues on your branch.
- Push again and re-run checks.

If checks pass:
- Merge to main.
- Vercel production deploy runs from main.
- Run a 2-minute post-release smoke check.

Treat the Vercel Preview URL as the demo environment before production release.

## Day-to-day workflow (solo founder version)

1. Create a feature branch.
2. Make changes.
3. Run local checks:
   - npm run typecheck
   - npm run lint
   - npm run test:unit
   - npm run validate:config
   - npm run build
   - npm run test:e2e
4. Push branch and open PR to main.
5. Check GitHub Actions are green.
6. Review the Vercel Preview URL as the demo environment.
7. Merge PR to main.
8. Verify production quickly.

Use [GITHUB-VERCEL-SETUP.md](GITHUB-VERCEL-SETUP.md) for the one-time GitHub and Vercel setup.

## Local commands cheat sheet

- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Unit tests: `npm run test:unit`
- Config/data validation: `npm run validate:config`
- Build: `npm run build`
- E2E tests: `npm run test:e2e`

## Preview URL E2E testing (optional but recommended)

Use this when you want to test against a deployed Vercel preview URL instead of a local server.

This preview URL is the recommended demo/staging environment for sign-off before production.

PowerShell example:

```powershell
$env:PLAYWRIGHT_BASE_URL="https://your-preview-url.vercel.app"; npm run test:e2e
```

When `PLAYWRIGHT_BASE_URL` is set, Playwright will not start a local app server.

## 2-minute production smoke checklist

1. Homepage loads.
2. Start fitting button opens questionnaire.
3. Complete questionnaire and reach results.
4. Best Match, Strong Alternative, and Best Value cards show.
5. Contact page opens.
6. Admin route opens (login page or admin hub depending on auth state).

## One-time GitHub settings you still need to do manually

Code cannot enforce these from inside this repo. Set them in GitHub UI:

1. Protect main branch.
2. Require pull request before merge.
3. Block direct pushes to main.
4. Require status check `CI - Blocking Gate` to pass.

Use [GITHUB-VERCEL-SETUP.md](GITHUB-VERCEL-SETUP.md) for the exact click-by-click steps.

## One-time Vercel settings you still need to do manually

1. Production branch = main.
2. Preview deployments enabled for PRs.
3. Keep preview and production env vars separate.
4. Ensure `NEXT_PUBLIC_SITE_URL` is the live production domain in production env.

## If CI fails, how to diagnose quickly

1. Typecheck failed: run `npm run typecheck` and fix TS errors.
2. Lint failed: run `npm run lint` and fix lint errors.
3. Unit failed: run `npm run test:unit` and inspect failing test.
4. Config failed: run `npm run validate:config` and fix data/config file issues.
5. Build failed: run `npm run build` and fix runtime/build errors.
6. E2E failed: run `npm run test:e2e` and inspect test output.

## Release decision rule

- All blocking checks pass + preview looks correct = safe to merge to main.
- Any blocking check fails = no merge, no production release.
