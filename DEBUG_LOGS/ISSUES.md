# Debug Issues Log

Use this file to track implementation issues and resolutions during the Shopify -> Nyehandel rollout.

## Open

- [ ] (none)

## Resolved

- [x] 2026-03-09: Step 02 types sync done manually by updating `src/integrations/supabase/types.ts` to include `orders` and new `product_variants` fields (`shopify_variant_id`, `is_checkout_enabled`).
- [x] 2026-03-09: Step 10 unblocked and completed after adding Shopify env vars and product-level `shopifyVariantId` mappings; removed `/checkout/legacy` route from `src/App.tsx`.
- [x] 2026-03-09: Step 19 unblocked with migration `supabase/migrations/20260309143000_setup_retry_cron.sql` scheduling hourly cron invocation for `retry-failed-nyehandel-orders`.
