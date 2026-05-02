# Demo And Prod Flow

This is the shortest version of how releases should work.

## Two environments

There are two important URLs:

1. Demo environment
- This is the Vercel Preview URL.
- Use this to review changes before they go live.
- Use this when showing the latest version to someone else before release.

2. Production environment
- This is the real live website.
- Only release here after checks pass and the demo looks right.

## Simple rule

- Preview URL = demo
- Live domain = production
- Production releases are PR-only

## Normal release flow

1. Make changes on a branch.
2. Open a pull request.
3. GitHub checks run.
4. Vercel creates a Preview URL.
5. Review that Preview URL as the demo version.
6. If it looks good, merge to `main`.
7. Vercel deploys production from `main`.

## What not to do

- Do not use your local dev server as the final release decision point.
- Do not merge to `main` if blocking checks failed.
- Do not treat the live site as the place to test unfinished work.

## When to send which URL

Send the Preview URL when:
- you want feedback
- you want to demo changes
- you want someone to review before launch

Send the live production URL when:
- the change is merged
- the production deploy is complete
- you are sharing the public version

## Decision checklist

Before merging:
- Did the blocking checks pass?
- Did the Preview URL look correct?
- Did the main user journey work?

If yes, merge.
If no, fix it first.

## In one sentence

Every change should be reviewed on the Vercel Preview URL first, then released to production only by merging a pull request to `main`.
