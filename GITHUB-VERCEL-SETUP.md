# GitHub + Vercel Setup Guide

This is the one-time setup to make releases safer.

## Goal

After this setup:
- work happens on feature branches
- pull requests go into `main`
- GitHub blocks merges if the blocking gate fails
- Vercel preview deploys appear on PRs and act as the demo environment
- production deploys only come from `main`

## Part 1: GitHub branch protection

Open your GitHub repo.

1. Go to `Settings`.
2. Go to `Branches`.
3. Under branch protection rules, click `Add rule`.
4. Branch name pattern: `main`.

Turn on these settings:

1. `Require a pull request before merging`
2. `Require status checks to pass before merging`
3. `Require branches to be up to date before merging`
4. `Do not allow bypassing the above settings`
5. `Restrict pushes that create files larger than 100 MB` if available

Under required status checks, add the blocking workflow check.

Use the check name shown in GitHub Actions. It will normally appear as one of these:
- `CI - Blocking Gate`
- `CI - Blocking Gate / blocking-gate`

If both appear, require the job-level one.

Strongly recommended:

1. Disable direct pushes to `main`
2. Use squash merge only, if you want a cleaner history
3. Dismiss stale approvals when new commits are pushed

## Part 2: Pull request workflow

Once branch protection is on, use this every time:

1. Create a branch like `feature/fix-results-copy`
2. Push branch
3. Open PR to `main`
4. Fill in the PR checklist from [.github/pull_request_template.md](.github/pull_request_template.md)
5. Wait for GitHub checks
6. Open the Vercel preview URL and treat it as the demo environment
7. Do a quick manual smoke test
8. Merge only when ready

## Part 3: Vercel production and preview settings

Open your Vercel project.

1. Go to `Settings`
2. Go to `Git`
3. Set production branch to `main`
4. Make sure preview deployments are enabled for pull requests

This gives you:
- PR branch -> preview deployment (demo environment)
- `main` -> production deployment

## Part 4: Environment variables

In Vercel, keep environments separated.

Set variables in:
- `Preview`
- `Production`
- `Development` if needed

Minimum important variables:
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_PASSWORD`

Rules:

1. `Production` value of `NEXT_PUBLIC_SITE_URL` must be the real live domain
2. `Preview` can use preview-safe values
3. Do not assume preview and production share the same secrets forever
4. If you change env vars, note it in the PR

## Part 5: Required release habit

Before merging to `main`:

1. Confirm `CI - Blocking Gate` passed
2. Open preview deployment
3. Check homepage
4. Run questionnaire to results
5. Check results cards
6. Check contact page
7. If admin/theme/questionnaire config changed, check admin too

If you want to show the current release candidate to someone before launch, share the Vercel Preview URL rather than a local dev URL.

After merging to `main`:

1. Open production
2. Re-run the same smoke checks
3. Check `/robots.txt`
4. Check `/sitemap.xml`
5. Check the canonical on homepage if SEO-related code changed

## Part 6: Warning workflow meaning

The warning workflow in [.github/workflows/warnings.yml](.github/workflows/warnings.yml) is not meant to block release.

It is there to catch softer issues like:
- missing metadata
- broken robots/sitemap output
- results noindex drift
- contact page regressions

If warning checks fail:
- do not panic
- inspect the warning artifacts in GitHub Actions
- decide whether the issue is safe to defer or should be fixed before merge

## Simple release rule

- Blocking gate fails: no merge
- Blocking gate passes but warning checks fail: review manually and decide
- Blocking gate passes and preview looks good: merge to `main`
