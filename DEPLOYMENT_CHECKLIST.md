# Deployment Checklist

## Hosting

Frontend: Deploy to Vercel
  - Connect GitHub repo → Vercel auto-deploys on push to main
  - Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
    as Vercel environment variables
  - Set VITE_SITE_URL to your domain

Backend: Supabase (already hosted)
  - Edge functions deploy via: supabase functions deploy
  - Secrets managed in Supabase dashboard

## Per-Store Secrets (set these for each new brand deployment)

| Secret | Example | Description |
|--------|---------|-------------|
| NYEHANDEL_API_TOKEN | from Nyehandel admin | API key for this store |
| NYEHANDEL_X_IDENTIFIER | from Nyehandel admin | Store identifier |
| NYEHANDEL_API_BASE_URL | https://api.nyehandel.se/api/v2 | Always this value |
| NYEHANDEL_WEBHOOK_SECRET | any strong string | Webhook auth token |
| STORE_ORDER_PREFIX | SF | 2-char order number prefix |
| STORE_CURRENCY | EUR | ISO currency code |
| STORE_LOCALE | en-gb | Nyehandel locale string |
| STORE_PAYMENT_METHOD | Nets Easy Checkout | Exact name from Nyehandel admin |

## To spin up a new brand

1. Clone this repo
2. Create new Nyehandel store (contact support@nyehandel.se)
3. Set all Per-Store Secrets above in new Supabase project
4. Run: supabase db push
5. Deploy edge functions: supabase functions deploy
6. Run sync-nyehandel to import catalog
7. Update VITE_SITE_URL with new domain
8. Done — new store is live

## Infrastructure Secrets

- [x] Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for all Edge Functions.
- [x] Set `NYEHANDEL_API_TOKEN` for Nyehandel API calls.
- [x] Set `NYEHANDEL_X_IDENTIFIER` (store/merchant identifier).
- [x] Set `NYEHANDEL_WEBHOOK_SECRET` for `nyehandel-webhook` (`x-api-key` validation).
- [x] Set `INTERNAL_FUNCTIONS_SECRET` for internal function-to-function auth (`push-order-to-nyehandel`, `retry-failed-nyehandel-orders`).
- [x] Set `RETRY_FAILED_ORDERS_SECRET` and pass `x-cron-secret` for retry invocations.
- [ ] Set `OPS_ALERTS_CRON_SECRET` and pass `x-cron-secret` for `ops-b2b-queues` invocations.
- [ ] Store Vault secrets for scheduler: `SUPABASE_FUNCTIONS_BASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `RETRY_FAILED_ORDERS_SECRET`.
- [ ] Store Vault secret for nightly ops queue scheduler: `OPS_ALERTS_CRON_SECRET`.
- [x] Confirm `supabase/config.toml` has explicit entries for all 14 functions.
- [x] Deploy DB migrations in order.
- [x] Deploy Edge Functions.
- [x] Register Nyehandel webhook URL pointing to `/functions/v1/nyehandel-webhook`.
