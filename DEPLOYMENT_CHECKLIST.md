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
| SYNC_CRON_SECRET | any strong string | Auth for pg_cron auto-sync invocations |
| DELIVERY_WEBHOOK_SECRET | any strong string | Auth for delivery callback webhook |
| ALLOWED_ORIGIN | https://yourdomain.com | CORS lock for checkout (production domain) |
| DEEPSEEK_API_KEY | from DeepSeek dashboard | AI review summary generation (optional) |

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
- [x] Set `SYNC_CRON_SECRET` for pg_cron auto-sync authentication.
- [x] Set `DELIVERY_WEBHOOK_SECRET` for delivery callback webhook auth.
- [x] Set `ALLOWED_ORIGIN` to production domain for checkout CORS lock.
- [x] Set `OPS_ALERTS_CRON_SECRET` and pass `x-cron-secret` for `ops-b2b-queues` invocations.
- [x] Store Vault secrets for scheduler: `SUPABASE_FUNCTIONS_BASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `RETRY_FAILED_ORDERS_SECRET`.
- [x] Store Vault secret for nightly ops queue scheduler: `OPS_ALERTS_CRON_SECRET`.
- [ ] Set `DEEPSEEK_API_KEY` for AI-powered review summary generation (`generate-review-summary`).
- [x] Confirm `supabase/config.toml` has explicit entries for all 14 functions.
- [x] Deploy DB migrations in order.
- [x] Deploy Edge Functions.
- [x] Register Nyehandel webhook URL pointing to `/functions/v1/nyehandel-webhook`.

## Database Configuration

- [x] Populate the `sync_config` table with `supabase_project_url` (your Supabase project URL)
  and `sync_cron_secret` (must match the `SYNC_CRON_SECRET` secret above). This table drives
  pg_cron auto-sync scheduling.

## Nyehandel Webhooks

- [x] Register delivery callback URL in NordicPouch admin pointing to
  `/functions/v1/nyehandel-delivery-callback` with `DELIVERY_WEBHOOK_SECRET` as auth token.

## SEO / Indexing

- [x] `public/robots.txt` — AI crawler permissions, disallow private routes, sitemap pointer.
- [x] `public/llms.txt` — GEO file for AI/LLM indexing.
- [x] `public/sitemap.xml` — dynamic generation via `bun run sitemap` (731 products, 139 brands).

## Uptime Monitoring

- [ ] Sign up for UptimeRobot (free tier) or similar
- [ ] Add monitor: Supabase healthcheck endpoint (5-min interval)
- [ ] Add monitor: Vercel production URL (10-min interval)
- [ ] Configure email alerts to ops team
- [ ] Verify alerts fire on test outage

## Auth Security

- [ ] Enable "Leaked Password Protection" in Supabase Dashboard → Auth → Settings.
      This checks passwords against HaveIBeenPwned and blocks compromised passwords at registration.

## Pre-Launch (remaining)

- [x] Set `ALLOWED_ORIGIN` to production domain (`https://snusfriends.com`).
- [x] CEO names shipping + payment methods in Nyehandel admin (NFC Group Payment + UPS Standard J229F1).
- [ ] Solicitor sign-off on Terms, Privacy, Cookie pages.
- [x] Place and verify test order end-to-end (Step 39 UAT — order #479 confirmed).
- [x] Security review: sync_config RLS enabled, function search_path fixed, CORS locked.
- [ ] Deploy frontend to Vercel, configure env vars, go live.
