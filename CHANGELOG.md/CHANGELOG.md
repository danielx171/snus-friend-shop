# Changelog

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
