# SnusFriend Roadmap

> Migrated from Vite SPA to Astro 6 (March 2026). Steps 1-56 done.
> Original checkout migrated Shopify → Nyehandel (Steps 25-40). Shopify fully removed.
> Launch Polish Sprint (Apr 8-12) complete: all waves shipped. See `CURRENT_PRIORITIES.md` for the active punch list.

## Astro Consolidation + Codex Workbench (2026-04-15)

- [x] Consolidated shared storefront hydration clusters:
  - `src/components/astro/ProductCard.astro` now hydrates a single controls island for wishlist + compare + add-to-cart.
  - `src/components/astro/Header.astro` now hydrates a single utility island for compare, rewards, and cart state.
- [x] Removed stale ProductCard mouse-tracking tilt JS and replaced inline brand navigation with a native brand link.
- [x] Tightened global font preload behavior in `src/layouts/Base.astro` so the layout preloads the default sans font instead of unused global Inter/Space Grotesk preloads.
- [x] Added repo-local Codex MCP config in `.codex/config.toml` for Context7, Sentry, and GitHub.
- [x] Updated the skill layer:
  - updated `snusfriend-design-system`
  - updated `web-quality-audit`
  - added `astro-island-budget`
  - added `snusfriend-audit-runbook`
  - added `trust-sensitive-editorial`
- [x] Added a shared `src/components/astro/JsonLd.astro` helper and migrated key storefront/info pages away from repeated inline JSON-LD blocks.
- [x] Removed `pagefind` entirely from the repo.
  Search remains JSON-driven, so the extra dependency and indexing scripts are gone.
- [x] Migrated the long-tail JSON-LD pages to the shared helper.
  The main sweep plus the standalone `src/pages/blog/index.astro` follow-up are now shipped.
- [x] Extracted a shared waitlist/newsletter form handler for the footer, blog CTA, and deals signup.
- [x] Replaced the remaining inline form handlers on contact, login, and order confirmation with shared Astro-first script helpers.
- [x] Hardened the homepage’s low-priority personalization path.
  `src/pages/index.astro` now points the personalized rows at `/data/products.json` instead of inlining a large product blob, and the mobile hero strip now uses the lighter animation/filter path.
- [ ] Next Astro pass:
  - keep trimming clustered islands from high-traffic storefront chrome
  - keep profiling remaining high-impact client-side scripts before the next polish sprint, even though the 2026-04-15 production homepage PSI median already clears the current target (mobile 92 / LCP 2.4s, desktop 100 / LCP 0.6s)

## Audit-Driven Growth + Trust Stabilization (2026-04-14)

- [x] Added repo-owned SEO script surfaces in `scripts/`:
  - `bun run audit:gsc:sync`
  - `bun run audit:pagespeed:sync`
  - `bun run audit:rank`
- [x] Added shared helpers for script-side Supabase admin access, PageSpeed fetch/summarize logic, and fixed PageSpeed target URL configuration.
- [x] Added a shared brand-facts layer under `src/data/brand-facts.ts` plus a reusable attribution callout for high-risk brand/editorial pages.
- [x] Reconciled the homepage hero + guide grid away from unsupported superlatives and toward proof-led copy based on catalog size, shipping, and rewards.
- [x] Reconciled the highest-risk ownership/manufacturer drift on:
  - `src/pages/blog/on-nicotine-pouches-complete-guide.astro`
  - `src/pages/blog/nordic-spirit-nicotine-pouches-complete-guide.astro`
  - `src/pages/blog/velo-vs-loop-2026.astro`
  - `src/pages/blog/zyn-vs-skruf-2026.astro`
  - `src/pages/blog/zyn-vs-nordic-spirit.astro`
  - `src/pages/blog/zyn-flavours-complete-guide.astro`
- [x] Shipped the first CTR refresh on the six target pages by updating titles/descriptions and strengthening internal linking from the homepage/blog hub.
- [x] Fix the PageSpeed CLI auth path.
  `bun run audit:measurement:smoke` now passes locally with the server-safe PageSpeed key, and the audit scripts now load `.env.local` explicitly so stale inherited shell exports do not override local audit keys.
- [x] Ship the DataForSEO-based proactive rank-tracking backend in code.
  `scripts/rank-audit.ts` is now wired to DataForSEO live organic results for keyword snapshots while GSC remains the primary historical ranking source.
- [x] Run the first live DataForSEO snapshots after credential setup.
  `bun run audit:measurement:smoke` and a curated `bun run audit:rank --limit=5` batch both wrote real `seo_rank_tracking` rows, including a confirmed `snusfriends` match-path hit at organic position `1`.
- [x] Add measurement rollout helpers for the next live audit pass.
  `bun run audit:preflight` now checks the env/dependency surface first, and `bun run audit:measurement:smoke` runs the first PageSpeed + rank smoke flow once keys are in place.
- [x] Sync the first live Search Console history after the audit rollout.
  `bun run audit:gsc:sync --days=7` synced 672 rows into `seo_gsc_stats` for `2026-04-08` through `2026-04-14`.
- [x] Run the default full DataForSEO rank batch after the curated validation pass.
  `bun run audit:rank` now saves the wider 20-keyword snapshot locally, preserving strictly sequential organic positions and a confirmed `snusfriends.com` match-path row.
- [ ] Remove the fully legacy Google CSE env/config after the transition window.
  `GOOGLE_CUSTOM_SEARCH_API_KEY` and `seo_config.google_cse_cx` are no longer needed by `audit:rank`; clean them up after the first successful DataForSEO runs.
- [x] Make `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` available in the local audit environment so the new sync jobs and Astro content-layer checks can run end-to-end outside Vercel.
- [x] Baseline the SEO audit tables in code.
  Added `supabase/migrations/20260415180000_baseline_live_seo_audit_tables.sql` and synced `src/integrations/supabase/types.ts` to the live table shapes, defaults, indexes, RLS state, and policy names for `seo_config`, `seo_keywords`, `seo_rank_tracking`, `seo_pagespeed_audits`, and `seo_gsc_stats`.
- [x] Verify deployed guest-account creation on `/order-confirmation` with a real guest order fixture.
  Fixed a production `create-nyehandel-checkout` persistence bug first so guest orders stop failing on `orders.total_price NOT NULL`, then verified on production that a fresh guest order row persists, `/order-confirmation?order=...&email=...` renders the happy path, wrong-email access falls back safely, and guest-account creation succeeds without creating duplicate auth users on repeat attempts.
- [ ] Continue the second trust pass:
  - deeper ON! product-line cleanup
  - country/legal reconciliation with external review
  - medical/YMYL review workflow before stronger health claims ship

## UX & Infrastructure (completed 2026-03-20)

- [x] Compact ProductCard variant (`variant: 'compact'`) — 3:2 image, icon-only CTA, denser grid
- [x] Enhanced SearchResults — full filter sidebar, mobile Sheet, pagination (20/page), sort options
- [x] Shared search scoring (`src/lib/search.ts`) — tiered relevance + OOS penalty
- [x] Header SnusPoints badge — auth detection, desktop + mobile, links to /membership
- [x] Account Settings form — wired to Supabase auth (first name, last name, phone)
- [x] Real info page content — FAQ, Contact, Shipping, Returns, About (inline JSX)
- [x] SEO: robots.txt (AI crawlers + private route blocks), llms.txt (GEO), dynamic sitemap (731 products, 139 brands)
- [x] types.ts synced — added ops_alerts, waitlist_emails, sync_config + product description/compare_price
- [x] .env.example updated with all secrets and sync_config seed instructions
- [x] Supabase Vault secrets configured, sync_config populated, delivery webhook registered

- [x] Step 01: Add `shopify_variant_id` to the product variant source of truth (DB column in `product_variants` or dedicated mapping table), backfill all sellable variants, and enforce non-null for variants that can be checked out.
- [x] Step 02: Regenerate Supabase types so `src/integrations/supabase/types.ts` includes the latest schema (`orders` and variant Shopify mapping fields).
- [x] Step 03: Add `[functions.create-shopify-checkout]` in `supabase/config.toml` with explicit `verify_jwt` policy (keep public checkout callable while still validating payload server-side).
- [x] Step 04: Extend `supabase/functions/create-shopify-checkout/index.ts` to persist a pre-checkout record in `orders` before redirect (status `pending`, line items snapshot, currency, amount, customer metadata stub).
- [x] Step 05: Replace mock checkout URL creation with real Shopify checkout/session creation (Storefront API `cartCreate` + `checkoutUrl` or equivalent strategy), using server-side Shopify credentials from Edge Function env vars.
- [x] Step 06: Save idempotency key + Shopify cart/checkout ID in `orders` when checkout is created so the payment webhook can safely correlate and deduplicate.
- [x] Step 07: Update `src/pages/CheckoutHandoff.tsx` to call `apiFetch('create-shopify-checkout', { method: 'POST', body: { items } })` instead of linking to `/checkout/legacy`.
- [x] Step 08: Build checkout payload mapping in `CheckoutHandoff` from cart items to `{ shopifyVariantId, quantity }`, fail fast in UI if a cart item lacks `shopifyVariantId`.
- [x] Step 09: Add `isRedirectingToCheckout` and error UI states in `CheckoutHandoff`; disable button during request and perform `window.location.assign(checkoutUrl)` only after successful response.
- [x] Step 10: Remove legacy fallback path from the primary flow (`/checkout/legacy`) once handoff is verified end-to-end.
- [x] Step 11: Create a new Edge Function `supabase/functions/shopify-webhook/index.ts` to receive Shopify webhooks for successful payment events (`orders/paid` at minimum).
- [x] Step 12: Implement raw-body HMAC verification in `shopify-webhook` using Shopify webhook secret (reject invalid signatures with `401`, do not parse JSON before verification).
- [x] Step 13: Persist all inbound Shopify webhook events in `webhook_inbox` (provider `shopify`, topic, payload, received timestamp, processing status) before business logic runs.
- [x] Step 14: In `shopify-webhook`, upsert `orders` by `shopify_order_id` and set payment-confirmed fields (customer email, totals, currency, paid timestamp, shipping address, line items snapshot).
- [x] Step 15: Add idempotent processing guard for paid events (if the same `shopify_order_id` is already processed, return `200` without re-pushing to 3PL).
- [x] Step 16: Create a dedicated Edge Function `supabase/functions/push-order-to-nyehandel/index.ts` that reads an order, transforms payload to Nyehandel format, and posts to Nyehandel Orders API.
- [x] Step 17: In `push-order-to-nyehandel`, update `orders.nyehandel_sync_status` (`pending` -> `synced`/`failed`), save `nyehandel_order_id`, and write `last_sync_error` on failure.
- [x] Step 18: Trigger `push-order-to-nyehandel` from `shopify-webhook` immediately after a valid paid event is saved, with retry-safe behavior and bounded retries.
- [x] Step 19: Wire real scheduler/cron for `retry-failed-nyehandel-orders` (the retry function is implemented, but scheduled invocation + secret wiring is still pending).
- [x] Step 20: Add structured observability: request IDs, order IDs, webhook IDs, and external response codes in all three functions (`create-shopify-checkout`, `shopify-webhook`, `push-order-to-nyehandel`).
- [x] Step 21: Add integration tests (or script-based smoke tests) for: checkout creation, webhook signature validation, idempotent paid processing, and Nyehandel push success/failure branches.
- [x] Step 22: Add deployment/env checklist: Shopify API token, Shopify webhook secret, Nyehandel API token/base URL, Supabase service role key, and function-level JWT policies.
- [x] Step 23: Security hardening pass before go-live: lock down internal function auth (`push-order-to-nyehandel`, `retry-failed-nyehandel-orders`), enforce webhook shop-domain allowlist, and remove any unnecessary public surface.
- [x] Step 24: Run end-to-end UAT in this order: create checkout from frontend -> complete payment -> verify `orders` row -> verify Nyehandel order push -> verify status transition to `synced`. Full UAT re-run required as Step 39 once Nyehandel-first flow is live.
- [x] Step 25: ~~Remove remaining mock/placeholder checkout code paths~~ Nyehandel API investigated — documented in `NYEHANDEL_API.md`.

---

## ARKITEKTURSKIFTE — Ta bort Shopify (beslutat 2026-03-12)

### Nuvarande flöde (utgår)
```
React → create-shopify-checkout (Edge Fn) → Shopify checkout → orders/paid webhook → push-order-to-nyehandel → Nyehandel
```

### Nytt flöde (mål)
```
React → create-nyehandel-checkout (Edge Fn) → Nyehandel payment API → callback/webhook → orders row → Nyehandel fulfillment
```

### Edge functions som berörs
| Funktion | Status |
|---|---|
| `create-shopify-checkout` | Skrivs om → `create-nyehandel-checkout` |
| `shopify-webhook` | Tas bort → ersätts med Nyehandel callback/polling |
| `push-order-to-nyehandel` | Behålls med justeringar (ta bort Shopify-beroenden) |
| `retry-failed-nyehandel-orders` | Behålls oförändrad |

### Blockerare
- Nyehandel payment API måste undersökas innan steg 25–28 kan påbörjas.
- Okänt: stöder Nyehandel inbyggd betalning? Vilka endpoints? Hur ser callback-mekanismen ut?

---

## Steg 25–40: Nyehandel-first checkout + real auth

- [x] Step 25: Undersök Nyehandel payment API — endpoints, auth, betalningsflöde, callback/webhook-mekanism. Dokumenterat i `NYEHANDEL_API.md`.
- [x] Step 26: Design nytt checkout-flöde baserat på Nyehandel API-fynd. `orders`-schema uppdaterat med Nyehandel-fält.
- [x] Step 27: `create-nyehandel-checkout` edge function implementerad. Shopify Storefront API borttaget.
- [x] Step 28: `shopify-webhook` borttagen. `nyehandel-delivery-callback` och `nyehandel-webhook` implementerade.
- [x] Step 29: `push-order-to-nyehandel` uppdaterad — Shopify-beroenden borttagna, använder intern UUID.
- [x] Step 30: `CheckoutHandoff.tsx` omskriven — SKU-resolution direkt från Supabase, inga Shopify-varianter.
- [x] Step 31: Implementera riktig Supabase-auth i `LoginPage.tsx` (`signInWithPassword`) och `RegisterPage.tsx` (`signUp`). Lägg till `useNavigate`-redirect efter lyckad auth.
- [x] Step 32: Koppla `AccountPage.tsx` till riktig data: ta bort `isLoggedIn = useState(true)`, hämta session via `supabase.auth.getUser()`, hämta orders från `orders`-tabellen per `customer_email`.
- [x] Step 33: Koppla `OrderConfirmation.tsx` till riktig data: läs `orderId` från URL-param, hämta order från DB, rensa kundvagnen via `clearCart()` efter bekräftad order.
- [x] Step 34: Koppla `ForgotPasswordPage.tsx` return URL till en riktig `UpdatePasswordPage` (`/update-password`) som hanterar Supabase auth callback och `updateUser({ password })`.
- [x] Step 35: Fixa `ProductListing.tsx` — hantera `isError`-state från `useCatalogProducts` (visa felmeddelande, inte tyst tomvy).
- [x] Step 36: Fixa `ProductDetail.tsx` — hantera `isError`, ta bort oanvänd `mockProducts`-import, fixa "related products"-rubrik (fel i18n-nyckel), rätta stjärnbetyg till att använda `product.ratings`.
- [x] Step 37: Flytta `DbProduct`-typen från `useCatalog.ts` till `src/integrations/supabase/types.ts` för konsistens med manuellt underhållna typer.
- [x] Step 38: Lös chunk size-varning (874 kB JS bundle) — code splitting med `manualChunks` eller dynamic imports för tunga routes.
- [x] Step 38b: Ta bort `window.location.origin/href` från `ProductListing.tsx` render (breadcrumb JSON-LD och canonical-prop). Ersätt med konstanta sökvägar eller `VITE_SITE_URL`.
- [x] Step 39: UAT av komplett Nyehandel-first checkout-flöde: frontend → Nyehandel payment → order row → fulfillment-push → status `synced`. ✅ Test order #479 confirmed.
- [x] Step 40: Pre-launch security review: XSS sanitization, auth on edge functions, CORS fail-closed, stack trace removal, translation cleanup. 50-finding audit completed.

---

## Steps 41–55: Go-Live Sprint + UX Polish (from 5-agent site audit, 2026-03-25)

### Pre-Launch Blockers
- [x] Step 41: Full-screen age gate on site entry (localStorage remember, proper deny page).
- [x] Step 42: Set `ALLOWED_ORIGIN=https://snusfriends.com` in Supabase Vault.
- [x] Step 43: Document + set `DEEPSEEK_API_KEY` in .env.example and DEPLOYMENT_CHECKLIST.md.
- [x] Step 44: Draft legal page content (Terms, Privacy, Cookie) — pending solicitor sign-off.
- [x] Step 45: Fix PWA install prompt (global beforeinstallprompt capture in main.tsx).

### UX Quick Wins
- [x] Step 46: Cart toast notifications via Sonner (add/remove/update).
- [x] Step 47: Order tracking display — shipping card on confirmation + tracking in account history.
- [x] Step 48: Touch target compliance — icon buttons 44px, pack-size button padding.
- [x] Step 49: Checkout UX — specific SKU error listing, Continue Shopping, recommendations.
- [x] Step 50: Continue Shopping on CartPage + post-purchase recommendations on OrderConfirmation.

### Design Polish
- [x] Step 51: Establish flagship brand color across all 4 themes. Extract semantic colors to CSS vars.
- [x] Step 52: FAQ search filter for 80+ questions. Improved blog empty state.
- [x] Step 53: Password strength meter on RegisterPage. Confetti prefers-reduced-motion check.

### Tech Debt
- [x] Step 54: Centralize SITE_URL config (3 pages → import from config/brand). Review photo upload limits already in place (3 photos, 5MB, jpeg/png/webp).
- [x] Step 55: Critical path tests — 43 new tests across cart, email regex, checkout/NYE line items, auth schemas. 54/54 green.

### Go-Live
- [x] Step 56: Remove preview mode (VITE_PREVIEW_MODE deleted — was dead code, never used). Site live on snusfriends.com.
