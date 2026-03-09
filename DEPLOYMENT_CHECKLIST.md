# Deployment Checklist

- [ ] Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for all Edge Functions.
- [ ] Set `SHOPIFY_STORE_DOMAIN` (e.g. `your-shop.myshopify.com`).
- [ ] Set `SHOPIFY_STOREFRONT_ACCESS_TOKEN` for `create-shopify-checkout`.
- [ ] Set `SHOPIFY_WEBHOOK_SECRET` for `shopify-webhook` HMAC validation.
- [ ] Set `NYEHANDEL_API_URL` and `NYEHANDEL_API_TOKEN` for `push-order-to-nyehandel`.
- [ ] (Optional) Set `RETRY_FAILED_ORDERS_SECRET` and pass `x-cron-secret` for retry invocations.
- [ ] Confirm `supabase/config.toml` has explicit entries for:
  - `create-shopify-checkout`
  - `shopify-webhook`
  - `push-order-to-nyehandel`
  - `retry-failed-nyehandel-orders`
- [ ] Deploy DB migrations in order.
- [ ] Deploy Edge Functions.
- [ ] Create Shopify webhook subscription for `orders/paid` pointing to `/functions/v1/shopify-webhook`.
