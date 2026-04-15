# Changelog

## 2026-04-14

- Added repo-owned SEO sync tooling in `scripts/google-search-console-sync.ts`, `scripts/pagespeed-sync.ts`, `scripts/rank-audit.ts`, plus shared helpers in `scripts/supabase-admin.ts`, `scripts/seo-audit-config.ts`, and `scripts/pagespeed-client.ts`.
- Updated `package.json`, `.env.example`, `src/env.d.ts`, and `scripts/pagespeed-audit.ts` so the new audit commands and server-only env expectations are wired consistently.
- Added `src/data/brand-facts.ts` and `src/components/astro/BrandFactCallout.astro` to create a single source of truth for high-risk brand ownership/manufacturer claims.
- Updated `src/pages/index.astro` and `src/pages/blog/index.astro` to strengthen internal linking and replace unsupported homepage superlatives with proof-led copy.
- Reconciled ownership/manufacturer drift in `src/pages/blog/on-nicotine-pouches-complete-guide.astro`, `src/pages/blog/nordic-spirit-nicotine-pouches-complete-guide.astro`, `src/pages/blog/velo-vs-loop-2026.astro`, `src/pages/blog/zyn-vs-skruf-2026.astro`, `src/pages/blog/zyn-vs-nordic-spirit.astro`, and `src/pages/blog/zyn-flavours-complete-guide.astro`.
- Refreshed titles/descriptions for the first CTR sprint in `src/pages/blog/best-nicotine-pouches-netherlands-2026.astro`, `src/pages/blog/best-nicotine-pouches-germany-2026.astro`, `src/pages/blog/best-nicotine-pouches-sensitive-gums.astro`, `src/pages/blog/buying-nicotine-pouches-norway-2026.astro`, and `src/pages/blog/best-nicotine-pouches-2026.astro`.
- Added read-only Google audit tooling with `scripts/google-auth.ts`, `scripts/google-ga4-report.ts`, and `scripts/google-search-console-report.ts`.
- Added Bun audit commands `bun run audit:ga4` and `bun run audit:gsc`, plus the `googleapis` dependency required for GA4/Search Console access.
- Expanded `.env.example` with local-only Google audit configuration keys for credential paths and property identifiers.
- Updated `DEPLOYMENT_CHECKLIST.md` to document the new audit workflow, confirmed credential access, and the remaining GA timezone follow-up.

## 2026-03-10

- Completed Roadmap Step 23 security hardening by locking down internal function surfaces and enforcing fail-closed secrets.
- Hardened `supabase/functions/push-order-to-nyehandel/index.ts` with mandatory `INTERNAL_FUNCTIONS_SECRET` header validation.
- Hardened `supabase/functions/retry-failed-nyehandel-orders/index.ts` to require `RETRY_FAILED_ORDERS_SECRET`, require `INTERNAL_FUNCTIONS_SECRET`, and forward both auth layers when invoking `push-order-to-nyehandel`.
- Hardened `supabase/functions/shopify-webhook/index.ts` with `SHOPIFY_STORE_DOMAIN` allowlist validation and internal secret propagation for downstream push calls.
- Locked internal function JWT policy in `supabase/config.toml` (`push-order-to-nyehandel` and `retry-failed-nyehandel-orders` now `verify_jwt = true`).
- Added migration `supabase/migrations/20260310101500_harden_retry_cron_auth_and_url.sql` to reschedule retry cron without hardcoded project URL and with authenticated headers sourced from Vault secrets.
- Updated `DEPLOYMENT_CHECKLIST.md` and `ROADMAP.md` to reflect the new security requirements and Step 23 completion.
- Updated Shopify/Nyehandel sync behavior so `shopify-webhook` now processes `orders/paid` strictly, writes Nyehandel order id to Shopify order metafield on success, and adds `NYE_SYNC_FAILED` tag on failed sync attempts via Shopify Admin GraphQL API.
- Expanded `supabase/functions/nyehandel-proxy/index.ts` allowlist to include `orders` while keeping Bearer token auth against Nyehandel API.
## 2026-04-15

- Verified the audit rollout end-to-end: `bun run audit:preflight`, `bun run audit:measurement:smoke`, `bun run audit:rank --limit=5`, and `bun run audit:gsc:sync --days=7` now all pass locally with live data.
- Updated `ROADMAP.md`, `CURRENT_PRIORITIES.md`, and `DEPLOYMENT_CHECKLIST.md` so they reflect the real measurement status instead of the earlier PageSpeed/DataForSEO blockers.
- Added `.playwright-cli/` to `.gitignore` so local browser automation scratch files stop polluting the worktree.
- Added clearer failure handling in `scripts/rank-audit.ts` for Google Custom Search JSON API `403` responses, including guidance to use a grandfathered project or another SERP provider.
- Finished the remaining audit-tooling pass in code and docs: `GOOGLE_CUSTOM_SEARCH_API_KEY` is wired locally and in Vercel, rank tracking now reports the Google `403` blocker clearly, and the roadmap/current-priorities docs now reflect that PageSpeed CLI auth is still blocked locally while Google rank tracking remains externally blocked.
- Consolidated storefront hydration by adding `src/components/react/ProductCardControlsIsland.tsx` and `src/components/react/HeaderUtilityBar.tsx`, then wiring them into `src/components/astro/ProductCard.astro` and `src/components/astro/Header.astro`.
- Removed the stale ProductCard mouse-tracking tilt script, replaced inline brand navigation with a real brand link, and tightened the shared preload in `src/layouts/Base.astro` to the actual default sans font.
- Added repo-local Codex MCP config in `.codex/config.toml` for Context7, Sentry, and GitHub, plus updated `ROADMAP.md` and `CURRENT_PRIORITIES.md` to reflect the current measurement blockers accurately.
- Updated `.agents/skills/snusfriend-design-system/SKILL.md` and `.agents/skills/web-quality-audit/SKILL.md`, and added `.agents/skills/astro-island-budget/SKILL.md`, `.agents/skills/snusfriend-audit-runbook/SKILL.md`, and `.agents/skills/trust-sensitive-editorial/SKILL.md`.
- Added `src/components/astro/JsonLd.astro` and migrated shared schema usage in `src/components/astro/Breadcrumb.astro`, `src/pages/index.astro`, `src/pages/products/index.astro`, `src/pages/products/[slug].astro`, `src/pages/brands/index.astro`, `src/pages/brands/[slug].astro`, `src/pages/nicotine-pouches.astro`, `src/pages/rewards.astro`, `src/pages/about.astro`, and `src/pages/community.astro`.
- Removed `pagefind` entirely from the repo because search remains JSON-driven, and synced `.env.example`, `ROADMAP.md`, `CURRENT_PRIORITIES.md`, `DEPLOYMENT_CHECKLIST.md`, and `src/env.d.ts` so the audit/docs story matches the current build path.
- Closed the JSON-LD helper migration by moving `src/pages/blog/index.astro` to `src/components/astro/JsonLd.astro` while preserving the page’s split schema placement.
- Added `src/scripts/waitlist-form.ts` and rewired `src/components/astro/BlogNewsletterCta.astro`, `src/components/astro/Footer.astro`, and `src/pages/deals.astro` to share the same waitlist/newsletter submission flow.
- Added `scripts/dataforseo-client.ts` and rewrote `scripts/rank-audit.ts` to use DataForSEO for proactive keyword snapshots, then updated `.env.example`, `src/env.d.ts`, `ROADMAP.md`, `CURRENT_PRIORITIES.md`, and `DEPLOYMENT_CHECKLIST.md` so `GOOGLE_CUSTOM_SEARCH_API_KEY` is now documented as legacy.
- Added `scripts/measurement-preflight.ts` and `scripts/measurement-smoke.ts`, plus `bun run audit:preflight` / `bun run audit:measurement:smoke`, so the next live measurement rollout has a single preflight and smoke path after the new keys are added.
- Fixed the DataForSEO normalization to store organic-only sequential positions in `seo_rank_tracking` instead of absolute feature-heavy SERP offsets, and tightened the rollout docs so they distinguish code-shipped rank tracking from the still-pending first live snapshot.
