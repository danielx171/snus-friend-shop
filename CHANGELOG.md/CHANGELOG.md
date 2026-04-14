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
