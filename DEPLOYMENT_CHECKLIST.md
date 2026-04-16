# Deployment Checklist

## Required Local Tool Versions

- Node: `24.x` only for this repo.
- Bun: `1.3.9` exactly (see `.bun-version` and `packageManager` in `package.json`).
- Vercel CLI: `>= 51.3.0`
- Supabase CLI: `>= 2.75.0`

Before running deploy/build workflows, validate:

- `node -v`
- `bun --version`

Supported machine policy:

- Homebrew `node@24` is the supported default if you want a machine-wide Node install.
- If you use `fnm`/`nvm`, it must still resolve this repo to Node 24.
- Do not let a newer Homebrew/global Node override the repo target.

## GitHub Automation

- GitHub Actions now runs the repo verification gate on every pull request and on pushes to `main`:
  - `bun run lint`
  - `bun run test`
  - `bun run build`
  - `bun run check`
- Treat the CI workflow as the source of truth for merge readiness. If local and CI disagree, fix the repo/toolchain mismatch before merging.
- Dependabot is configured for weekly low-risk maintenance PRs:
  - grouped test/lint tooling updates
  - grouped Astro/Supabase patch/minor updates
  - GitHub Actions dependency updates
- Intentionally deferred from automated update intake:
  - React major upgrades
  - Tailwind minor/major upgrades
  - TypeScript major upgrades
- Before merging any dependency PR, re-run the local preflight:
  - `node -v`
  - `bun --version`
  - `bun run lint`
  - `bun run test`
  - `bun run build`
  - `bun run check`

## Hosting

Frontend: Deploy to Vercel
  - Connect GitHub repo → Vercel auto-deploys on push to main
  - Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
    as Vercel environment variables
  - Set `TENANT_ID` / `PUBLIC_TENANT_ID` for the storefront deployment
  - Set `SITE_URL` to your domain (preferred shared canonical URL)
  - Set `STOREFRONT_HOSTS` to the production hostnames/origins allowed for this deployment
  - Set `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` if this storefront should send PostHog analytics
  - Set `PUBLIC_SITE_URL` / `VITE_SITE_URL` only if a specific frontend integration still expects them

Backend: Supabase (already hosted)
  - Edge functions deploy via: supabase functions deploy
  - Secrets managed in Supabase dashboard

**White-label safety rule:** every storefront must have its own Supabase project.
Shared-backend row-level tenant isolation is not implemented in this repo, so do not point two storefronts at the same Supabase project.

## Per-Store Vercel Environment Blueprint

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| TENANT_ID | yes | snusfriends | Canonical tenant selector for Astro + shared runtime |
| PUBLIC_TENANT_ID | yes | snusfriends | Public tenant selector fallback for browser/runtime surfaces |
| SITE_URL | yes | https://snusfriends.com | Canonical storefront URL |
| SITE_NAME | yes | SnusFriend | Storefront display name |
| STOREFRONT_HOSTS | yes | snusfriends.com,www.snusfriends.com | Allowed storefront hosts/origins |
| TENANT_STORAGE_PREFIX | recommended | snusfriend | Storage prefix if stores may share a browser |
| PUBLIC_POSTHOG_KEY | recommended | phc_xxxxx | Enables PostHog for this storefront |
| PUBLIC_POSTHOG_HOST | recommended | https://eu.i.posthog.com | Host paired with the PostHog project |
| PUBLIC_GA_MEASUREMENT_ID | optional | G-XXXXXXXXXX | GA4 measurement id |
| EMAIL_FROM_NAME | recommended | SnusFriend | Friendly sender name |
| EMAIL_FROM_ADDRESS | recommended | noreply@snusfriends.com | Sender mailbox |
| SUPPORT_EMAIL | recommended | support@snusfriends.com | Customer-facing support inbox |
| LOYALTY_CURRENCY_NAME | recommended | SnusCoins | Customer-facing rewards currency label |
| ORDER_PREFIX | recommended | NB | Checkout/order reference prefix |
| ORDER_LOCALE | recommended | en-gb | Nyehandel locale string |
| JURISDICTION | optional | Sweden | Legal jurisdiction label for policy pages |
| DPA_NAME | optional | Swedish Authority for Privacy Protection (IMY) | Privacy supervisory authority |
| DPA_URL | optional | https://www.imy.se | Supervisory authority URL |
| FOUNDER_NAME | optional | Daniel | Founder identity for /about |
| DEFAULT_AUTHOR_NAME | optional | Erik Lindqvist | Default editorial byline |
| DEFAULT_AUTHOR_JOB_TITLE | optional | Editor & Lead Product Reviewer | Default editorial role |
| DEFAULT_AUTHOR_BIO | optional | Short bio text | Default editorial bio |
| DEFAULT_AUTHOR_SAME_AS | optional | https://linkedin...,https://x.com/... | Comma-separated social/profile URLs |
| DEFAULT_AUTHOR_CREDENTIALS | optional | Master's in...,4+ years... | Comma-separated editorial credentials |

## Reference Alternate Tenant Profile (docs only)

Use this as a planning template for the first internal second storefront:

| Variable | Example |
|----------|---------|
| TENANT_ID | nordicplus |
| PUBLIC_TENANT_ID | nordicplus |
| SITE_URL | https://nordicplus.eu |
| SITE_NAME | NordicPlus |
| STOREFRONT_HOSTS | nordicplus.eu,www.nordicplus.eu |
| TENANT_STORAGE_PREFIX | nordicplus |
| PUBLIC_POSTHOG_KEY | phc_live_nordicplus |
| PUBLIC_POSTHOG_HOST | https://eu.i.posthog.com |
| EMAIL_FROM_NAME | NordicPlus |
| EMAIL_FROM_ADDRESS | noreply@nordicplus.eu |
| SUPPORT_EMAIL | support@nordicplus.eu |

## Per-Store Secrets (set these for each new brand deployment)

| Secret | Example | Description |
|--------|---------|-------------|
| NYEHANDEL_API_TOKEN | from Nyehandel admin | API key for this store |
| NYEHANDEL_X_IDENTIFIER | from Nyehandel admin | Store identifier |
| NYEHANDEL_API_BASE_URL | https://api.nyehandel.se/api/v2 | Always this value |
| NYEHANDEL_WEBHOOK_SECRET | any strong string | Webhook auth token |
| ORDER_PREFIX | NB | 2-char order number prefix |
| ORDER_LOCALE | en-gb | Nyehandel locale string |
| PAYMENT_METHOD_NAME | Nets Easy Checkout | Exact name from Nyehandel admin |
| SYNC_CRON_SECRET | any strong string | Auth for pg_cron auto-sync invocations |
| DELIVERY_WEBHOOK_SECRET | any strong string | Auth for delivery callback webhook |
| TENANT_ID | snusfriends | Canonical tenant selector for Astro + Supabase functions |
| PUBLIC_TENANT_ID | snusfriends | Public storefront tenant selector fallback |
| SITE_URL | https://yourdomain.com | Shared canonical storefront URL for frontend + Supabase functions |
| SITE_NAME | Your Brand | Shared storefront name for transactional emails + ops hooks |
| STOREFRONT_HOSTS | yourdomain.com,www.yourdomain.com | Canonical storefront host/origin allowlist |
| ALLOWED_ORIGINS | https://yourdomain.com,https://www.yourdomain.com | Preferred CORS allowlist for checkout/discount |
| ALLOWED_ORIGIN | https://yourdomain.com | Legacy single-origin fallback for checkout CORS |
| TENANT_STORAGE_PREFIX | yourbrand | Optional browser-storage prefix when multiple stores share a browser |
| EMAIL_FROM_NAME | Your Brand | Friendly sender name for Resend mail |
| EMAIL_FROM_ADDRESS | noreply@yourdomain.com | Sender mailbox for Resend mail |
| SUPPORT_EMAIL | support@yourdomain.com | Customer-facing support inbox |
| LOYALTY_CURRENCY_NAME | YourCoins | Customer-facing rewards currency label |
| RESEND_API_KEY | from Resend dashboard | Transactional email (order confirmations, shipping) |
| DEEPSEEK_API_KEY | from DeepSeek dashboard | AI review summary generation (optional) |
| PAYMENT_METHOD_NAME | Your checkout label | Exact name from Nyehandel admin |

## To spin up a new brand

1. Create a brand-new Supabase project for the storefront.
2. Re-run `supabase init` / bind the project so `supabase/config.toml` points at the new project ID.
3. Apply schema/migrations (`supabase db push` or the approved migration flow) and deploy edge functions.
4. Create the Vercel project, add the env surface above, and point the storefront domain at that project.
5. Create the Nyehandel merchant/store and set `NYEHANDEL_*`, `ORDER_PREFIX`, `ORDER_LOCALE`, and `PAYMENT_METHOD_NAME`.
6. Verify the Resend sending domain and sender mailbox for the new storefront.
7. Create the PostHog and Sentry projects, then set the matching frontend env vars.
8. Run the first catalog/content sync and then the smoke sequence in `TENANT_LAUNCH_RUNBOOK.md`.

For the full step-by-step rollout, use `TENANT_LAUNCH_RUNBOOK.md` as the canonical launch document.

## Infrastructure Secrets

- [x] Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for all Edge Functions.
- [x] Set `NYEHANDEL_API_TOKEN` for Nyehandel API calls.
- [x] Set `NYEHANDEL_X_IDENTIFIER` (store/merchant identifier).
- [x] Set `NYEHANDEL_WEBHOOK_SECRET` for `nyehandel-webhook` (`x-api-key` validation).
- [x] Set `INTERNAL_FUNCTIONS_SECRET` for internal function-to-function auth (`push-order-to-nyehandel`, `retry-failed-nyehandel-orders`).
- [x] Set `RETRY_FAILED_ORDERS_SECRET` and pass `x-cron-secret` for retry invocations.
- [x] Set `SYNC_CRON_SECRET` for pg_cron auto-sync authentication.
- [x] Set `DELIVERY_WEBHOOK_SECRET` for delivery callback webhook auth.
- [ ] Set `TENANT_ID` / `PUBLIC_TENANT_ID` for the active storefront deployment.
- [ ] Set `STOREFRONT_HOSTS` so the runtime and shared functions agree on the allowed storefront hostnames.
- [x] Set `ALLOWED_ORIGIN` to production domain for checkout CORS lock.
- [ ] Set `SITE_URL` for Supabase functions so transactional emails, review links, and cart recovery links point at the active storefront.
- [ ] Set `SITE_NAME` / `EMAIL_FROM_NAME` / `EMAIL_FROM_ADDRESS` / `SUPPORT_EMAIL` / `TENANT_STORAGE_PREFIX` so transactional mail and browser storage are branded per storefront.
- [x] Set `OPS_ALERTS_CRON_SECRET` and pass `x-cron-secret` for `ops-b2b-queues` invocations.
- [x] Store Vault secrets for scheduler: `SUPABASE_FUNCTIONS_BASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `RETRY_FAILED_ORDERS_SECRET`.
- [x] Store Vault secret for nightly ops queue scheduler: `OPS_ALERTS_CRON_SECRET`.
- [ ] Set `RESEND_API_KEY` for transactional email via Resend (`send-email`).
- [ ] Set `DEEPSEEK_API_KEY` for AI-powered review summary generation (`generate-review-summary`).
- [ ] Set `DISCORD_WEBHOOK_REVIEWS` — Discord webhook URL for #reviews channel (`discord-webhook`).
- [ ] Set `DISCORD_WEBHOOK_ACHIEVEMENTS` — Discord webhook URL for #achievements channel (`discord-webhook`).
- [x] Store Vault secret `INTERNAL_FUNCTIONS_SECRET` for welcome email trigger (pg_net calls `send-welcome-email`).
- [x] Confirm `supabase/config.toml` has explicit entries for all edge functions.
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

- [x] `src/pages/robots.txt.ts` — AI crawler permissions, disallow private routes, sitemap pointer.
- [x] `src/pages/llms.txt.ts` and `src/pages/llms-full.txt.ts` — deployment-aware GEO/LLM text outputs.
- [x] `public/sitemap.xml` — dynamic generation via `bun run sitemap` using the active storefront runtime.

## Observability / Audit Access

- [x] Enable Vercel Speed Insights in the Vercel Dashboard for `snus-friend-shop`.
- [ ] If we intentionally want dual analytics again later, enable Vercel Web Analytics in the dashboard before reintroducing `@vercel/analytics`.
      Current production ownership is: PostHog for pageview/product analytics, Vercel Speed Insights for Core Web Vitals.
- [x] Set `PUBLIC_GA_MEASUREMENT_ID` in Vercel once the GA4 web stream is created.
- [ ] Set `PUBLIC_GOOGLE_SITE_VERIFICATION` if using Search Console URL-prefix verification.
      Not required while the active Search Console property is the domain property `sc-domain:snusfriends.com`.
- [ ] Set `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` in Vercel for every storefront that should send PostHog analytics.
      The storefront now exposes `window.__POSTHOG_STATUS__` in production so deploy smoke can distinguish “missing config” from “consent denied” and “booted successfully”.
- [x] Add `PAGESPEED_API_KEY` to Vercel so `bun run audit:pagespeed` can run without anonymous PSI quota limits when the key is exported locally.
- [x] Replace the current `PAGESPEED_API_KEY` with a server-safe key for CLI usage.
      The live CLI smoke now passes with the unrestricted PageSpeed key in local env plus Vercel `production` / `development`, and the repo audit scripts now load `.env.local` explicitly so local runs do not depend on stale inherited shell exports.
- [x] Grant Google Search Console read access to the property used for `https://snusfriends.com`.
- [x] Grant GA4 read access to the SnusFriend property and web stream.
- [x] Add local read-only Google audit scripts: `bun run audit:ga4` and `bun run audit:gsc`.
- [x] Add repo-owned sync scripts for GSC/PageSpeed/rank capture:
      `bun run audit:gsc:sync`, `bun run audit:pagespeed:sync`, `bun run audit:rank`
- [x] Add measurement rollout helpers:
      `bun run audit:preflight` to verify the env surface and `bun run audit:measurement:smoke` to run the first PageSpeed + rank smoke pass once keys are ready.
- [x] Configure local Google credentials via `GOOGLE_APPLICATION_CREDENTIALS` or `GOOGLE_SERVICE_ACCOUNT_KEY_PATH`.
- [x] Set local audit envs: `GA4_PROPERTY_ID` and `SEARCH_CONSOLE_PROPERTY`.
- [x] Grant the local read-only Google credential access to the GA4 property and Search Console property.
- [x] Replace the current Google CSE-based rank audit with DataForSEO in code.
      `bun run audit:rank` is wired to DataForSEO live organic results for proactive keyword snapshots while Search Console remains the primary historical ranking source.
- [x] Add `DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD` locally and in Vercel before relying on `bun run audit:rank`.
- [x] Run the first live DataForSEO snapshot after the credentials are in place.
- [x] Run a curated 5-keyword DataForSEO validation batch before the full default rank run.
      The batch now proves both the tracked-domain match path (`snusfriends` at organic position `1`) and the no-match path while keeping `search_results.position` strictly sequential.
- [x] Run the default full `bun run audit:rank` batch after the curated validation pass.
      The wider 20-keyword snapshot now completes locally and keeps the same organic-only sequential position semantics in `seo_rank_tracking`.
- [ ] Optional: set `DATAFORSEO_LOCATION_CODE` + `DATAFORSEO_LANGUAGE_CODE` if the default Sweden/en SERP snapshot should be overridden.
- [x] After the new PageSpeed key and DataForSEO creds are in place, run `bun run audit:preflight` and then `bun run audit:measurement:smoke`.
- [x] Run `bun run audit:gsc:sync --days=7` once the smoke pass is green.
      The current local sync wrote 672 rows into `seo_gsc_stats` for `2026-04-08` through `2026-04-14`.
- [x] Expose local `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` when running sync jobs or Astro content-layer checks outside Vercel.
- [ ] In GA4 Admin, change the remaining SnusFriend property default from `America/Los_Angeles` to `Europe/Stockholm`.
      Currency has already been updated to `SEK`, but the current property only exposes U.S. timezone options in the GA admin UI.
- [ ] Optional deeper data access: provide a dedicated read-only Supabase credential or a read-only audit endpoint for non-public tables.

## PostHog Deploy Smoke

After every storefront deploy:

1. Open the homepage in a fresh browser session and accept analytics cookies.
2. In the console, inspect `window.__POSTHOG_STATUS__`.
   Expected after consent: `configured: true`, `consentGranted: true`, `booted: true`, `disabledReason: null`.
3. Confirm `window.__POSTHOG_LAST_CAPTURE__` appears after the first pageview and updates after a client-side navigation. This gives a deterministic “capture was invoked” breadcrumb even when the network panel is noisy.
4. Confirm one PostHog network flow appears after consent and one additional pageview appears after a client-side navigation.
5. Confirm `window.__ANALYTICS_CONFIG__` includes the expected `posthogHost` and a non-empty `posthogKey`.
6. Confirm there are no unexpected `/_vercel/insights/...` regressions and `/_vercel/speed-insights/script.js` still returns `200`.

## Tenant Launch Runbook

- [ ] Follow `TENANT_LAUNCH_RUNBOOK.md` for every new internal storefront rollout.
- [ ] Do not reuse the active Supabase project for a second storefront.
- [ ] Strip or replace any storefront-specific Vercel rewrites/redirects before enabling the new domain.

## Uptime Monitoring

- [ ] Sign up for UptimeRobot (free tier) or similar
- [ ] Add monitor: Supabase healthcheck endpoint (5-min interval)
- [ ] Add monitor: Vercel production URL (10-min interval)
- [ ] Configure email alerts to ops team
- [ ] Verify alerts fire on test outage

## Auth Security

- [ ] Enable "Leaked Password Protection" in Supabase Dashboard → Auth → Settings.
      This checks passwords against HaveIBeenPwned and blocks compromised passwords at registration.
- [ ] Set `app_metadata.role = 'admin'` for ops dashboard users. Do this via the Supabase
      Dashboard (Authentication → Users → select user → Edit User JSON) or via a service-role
      query: `SELECT auth.update_user_metadata('<user-id>', '{"role":"admin"}'::jsonb, 'app_metadata');`

## Pre-Launch (remaining)

- [x] Set `ALLOWED_ORIGIN` to production domain (`https://snusfriends.com`).
- [x] CEO names shipping + payment methods in Nyehandel admin (NFC Group Payment + UPS Standard J229F1).
- [ ] Solicitor sign-off on Terms, Privacy, Cookie pages.
- [x] Place and verify test order end-to-end (Step 39 UAT — order #479 confirmed).
- [x] Security review: sync_config RLS enabled, function search_path fixed, CORS locked.
- [x] Deploy frontend to Vercel, configure env vars, go live.
