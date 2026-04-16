# Tenant Launch Runbook

Canonical rollout guide for launching a new internal storefront from the shared `snus-friend-shop` codebase.

## Core Rule

Each storefront must have its **own Vercel project and its own Supabase project**.

This repo does **not** implement shared-backend row-level tenant isolation. Do not point multiple storefronts at the same Supabase project.

## 1. Create the Storefront Identity

- Choose the tenant id, brand name, domain, sender mailbox, support mailbox, and storage prefix.
- Confirm the tenant config values you need:
  - `TENANT_ID`
  - `SITE_URL`
  - `SITE_NAME`
  - `STOREFRONT_HOSTS`
  - `TENANT_STORAGE_PREFIX`
  - `LOYALTY_CURRENCY_NAME`
  - `ORDER_PREFIX`
  - `ORDER_LOCALE`
  - legal/editorial overrides if needed:
    - `JURISDICTION`
    - `DPA_NAME`
    - `DPA_URL`
    - `FOUNDER_NAME`
    - `DEFAULT_AUTHOR_*`

## 2. Create the Supabase Project

- Create a brand-new Supabase project for the storefront.
- Run `supabase init` or re-link the repo so `supabase/config.toml` targets the new project id.
- Verify local env points at the new project:
  - `PUBLIC_SUPABASE_URL`
  - `PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Apply schema and migrations:
  - `supabase db push`
  - or the approved migration workflow for the team
- Deploy the edge functions needed for checkout, mail, sync, and callbacks.

## 3. Configure Supabase Auth and Runtime

- Set the storefront auth URLs for the new project:
  - Site URL
  - Redirect URLs
- Confirm the storefront domain and any `www` host variants are allowed.
- Set Supabase function secrets:
  - `TENANT_ID`
  - `SITE_URL`
  - `SITE_NAME`
  - `STOREFRONT_HOSTS`
  - `TENANT_STORAGE_PREFIX`
  - `SUPPORT_EMAIL`
  - `EMAIL_FROM_NAME`
  - `EMAIL_FROM_ADDRESS`
  - `LOYALTY_CURRENCY_NAME`
  - `ORDER_PREFIX`
  - `ORDER_LOCALE`
  - `PAYMENT_METHOD_NAME`
- Set the operational secrets already required by the function layer:
  - `NYEHANDEL_API_TOKEN`
  - `NYEHANDEL_X_IDENTIFIER`
  - `NYEHANDEL_WEBHOOK_SECRET`
  - `DELIVERY_WEBHOOK_SECRET`
  - `SYNC_CRON_SECRET`
  - `INTERNAL_FUNCTIONS_SECRET`
  - `RETRY_FAILED_ORDERS_SECRET`
  - `OPS_ALERTS_CRON_SECRET`
  - `RESEND_API_KEY`
  - optional Discord/review hooks

## 4. Create the Vercel Project

- Create a dedicated Vercel project for the storefront.
- Connect the GitHub repo.
- Set required env vars:
  - `TENANT_ID`
  - `PUBLIC_TENANT_ID`
  - `SITE_URL`
  - `SITE_NAME`
  - `STOREFRONT_HOSTS`
  - `TENANT_STORAGE_PREFIX`
  - `SUPPORT_EMAIL`
  - `EMAIL_FROM_NAME`
  - `EMAIL_FROM_ADDRESS`
  - `LOYALTY_CURRENCY_NAME`
  - `ORDER_PREFIX`
  - `ORDER_LOCALE`
  - `PUBLIC_SUPABASE_URL`
  - `PUBLIC_SUPABASE_ANON_KEY`
  - `PUBLIC_POSTHOG_KEY`
  - `PUBLIC_POSTHOG_HOST`
  - `PUBLIC_SENTRY_DSN`
  - `PUBLIC_GA_MEASUREMENT_ID` if enabled
- Remove or replace any project-specific redirects/rewrites before attaching the new domain.

## 5. Configure Email

- Verify the sending domain in Resend for the storefront domain.
- Verify the sender mailbox matches the verified domain.
- Confirm the customer-facing support inbox is working.
- Send a safe test from the new project before launch.

## 6. Configure Observability

### PostHog
- Create a dedicated PostHog project for the storefront.
- Set:
  - `PUBLIC_POSTHOG_KEY`
  - `PUBLIC_POSTHOG_HOST`
- After deploy, verify:
  - `window.__ANALYTICS_CONFIG__` is populated
  - `window.__POSTHOG_STATUS__` shows `configured: true` and `booted: true` after consent
  - `window.__POSTHOG_LAST_CAPTURE__` updates on first page load and one client-side navigation

### Sentry
- Create a dedicated Sentry project for the storefront.
- Set `PUBLIC_SENTRY_DSN` in Vercel.
- Confirm the browser app initializes cleanly after deploy.

## 7. Configure Nyehandel

- Create or provision the correct Nyehandel merchant/store.
- Set:
  - `NYEHANDEL_API_TOKEN`
  - `NYEHANDEL_X_IDENTIFIER`
  - `ORDER_PREFIX`
  - `ORDER_LOCALE`
  - `PAYMENT_METHOD_NAME`
- Confirm webhook endpoints are registered for the new project:
  - `nyehandel-webhook`
  - `nyehandel-delivery-callback`

## 8. Sync Catalog and Content

- Run the first catalog sync/import for the new project.
- Confirm products, variants, inventory, and category surfaces populate correctly.
- Run `bun run build` locally against the storefront env before opening the domain publicly.

## 9. Launch Smoke Checklist

After the first deploy:

- Homepage loads on the correct domain.
- PDP, cart, checkout handoff, account, rewards, privacy, terms, editorial policy, and author page all render correctly.
- Browser storage keys are tenant-specific:
  - cart
  - compare
  - beginner mode
  - history
  - buy-now
- PostHog and Sentry point at the new project values.
- One checkout produces the correct tenant-branded order payload:
  - prefix
  - currency
  - locale
  - payment method label
- Transactional emails use the correct:
  - sender
  - support inbox
  - tagline
  - loyalty terminology
  - shipping threshold/currency
- `llms.txt`, `llms-full.txt`, `robots.txt`, sitemap, and OG outputs resolve to the new domain.

## 10. Ship Criteria

The storefront is ready when:

- no hardcoded `snusfriend_*` browser-state collisions remain
- no wrong brand/domain appears in the shared runtime surfaces
- checkout payloads use the tenant’s prefix/currency/locale
- analytics and error reporting point to the tenant’s own projects
- the launch smoke sequence passes end-to-end
