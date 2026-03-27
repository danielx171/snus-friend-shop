# SnusFriend Roadmap

> Migrated from Vite SPA to Astro 6 (March 2026). Steps 1-55 complete. Astro migration live.
> Original checkout migrated Shopify → Nyehandel (Steps 25-40). Shopify fully removed.

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
- [ ] Step 53: Password strength meter on RegisterPage. Confetti prefers-reduced-motion check.

### Tech Debt
- [x] Step 54: Centralize SITE_URL config (3 pages → import from config/brand). Review photo upload limits already in place (3 photos, 5MB, jpeg/png/webp).
- [ ] Step 55: Critical path tests — checkout validation, cart operations, email regex, auth flow.

### Go-Live
- [x] Step 56: Remove preview mode (VITE_PREVIEW_MODE deleted — was dead code, never used). Site live on snusfriends.com.
