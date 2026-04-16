---
name: snusfriend-audit-runbook
description: Use when running a deep audit of the SnusFriend site or preparing a next-day focus plan. Provides the repo-specific order of operations for lint/build checks, live browser verification, audit scripts, docs-drift checks, and how to use Codex MCPs like Context7, Sentry, and GitHub during the audit.
---

# SnusFriend Audit Runbook

Use this skill for repo-wide audits, polish sweeps, or tomorrow-planning passes.

## Run order

1. Check repo state first with `git status` and respect the dirty worktree.
2. Read `.cursorrules`, `AGENTS.md`, `ROADMAP.md`, and `SYSTEM_BOUNDARIES.md` before making recommendations.
3. Run:
   - `bun run lint`
   - `bun run check`
   - `bun run build`
4. Audit the live or preview site in a browser on at least:
   - homepage
   - `/nicotine-pouches`
   - one PDP
   - `/community`
5. Run the repo audit scripts that are available:
   - `bun run audit:pagespeed`
   - `bun run audit:rank`
   - any GA4 or GSC surfaces that are configured
6. Compare audit reality against `ROADMAP.md` and `CURRENT_PRIORITIES.md` so tooling or status drift gets called out.

## What to look for

- clustered React islands in shared storefront chrome
- console warnings or hydration mismatches
- unused global preloads
- broken or blocked measurement tooling
- repeated inline scripts and JSON-LD patterns
- trust-sensitive copy or claims that need conservative wording

## Codex workbench helpers

- Use Context7 for current framework or library docs.
- Use Sentry for production error trends before blaming the UI.
- Use GitHub when the audit needs PR, issue, or review context.
- Use Playwright/browser tooling to verify what users actually see.

## Output shape

- Biggest wins
- Highest-priority fixes
- Blockers and external dependencies
- Tomorrow focus: three concrete next actions max
