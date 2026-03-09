# Debug Issues Log

Use this file to track implementation issues and resolutions during the Shopify -> Nyehandel rollout.

## Open

- [ ] 2026-03-09: Step 10 blocked - cannot remove `/checkout/legacy` yet because end-to-end handoff is not verifiable in current state.
  - Missing Shopify credentials in runtime env for `create-shopify-checkout` (`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`).
  - Frontend cart products currently have no Shopify variant mapping fields in `src/data/products.ts`, so Step 08 fail-fast correctly blocks checkout creation.

## Resolved

- [x] 2026-03-09: Step 02 types sync done manually by updating `src/integrations/supabase/types.ts` to include `orders` and new `product_variants` fields (`shopify_variant_id`, `is_checkout_enabled`).
