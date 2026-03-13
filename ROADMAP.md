# Headless Shopify -> Nyehandel Roadmap

Next session start order: Step 25.

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
- [x] Step 24: Run end-to-end UAT in this order: create checkout from frontend -> complete payment in Shopify test mode -> verify `orders` row -> verify Nyehandel order push -> verify status transition to `synced`.
- [ ] Step 25: ~~Remove remaining mock/placeholder checkout code paths~~ **BLOCKED — see Architecture Shift below.**

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

- [ ] Step 25: **BLOCKED** Undersök Nyehandel payment API — endpoints, auth, betalningsflöde, callback/webhook-mekanism. Dokumentera i `NYEHANDEL_API.md`.
- [ ] Step 26: Design nytt checkout-flöde baserat på Nyehandel API-fynd. Uppdatera `orders`-schema om nya fält behövs.
- [ ] Step 27: Skriv om `create-shopify-checkout` → ny edge function `create-nyehandel-checkout`. Ta bort Shopify Storefront API-anropet, ersätt med Nyehandel payment session-skapande.
- [ ] Step 28: Ta bort `shopify-webhook` edge function. Implementera Nyehandel callback/webhook-handler om Nyehandel stöder det, annars polling via cron.
- [ ] Step 29: Uppdatera `push-order-to-nyehandel`: byt `external_order_id` från `shopify_order_id` till intern UUID. Rensa Shopify-specifika fält ur payload.
- [ ] Step 30: Uppdatera `CheckoutHandoff.tsx`: ta bort `resolveShopifyVariantId` 3-vägs-fallback. Ersätt med direkt access på `product.shopifyVariantIds[packSize]` (nu korrekt populerat från DB).
- [x] Step 31: Implementera riktig Supabase-auth i `LoginPage.tsx` (`signInWithPassword`) och `RegisterPage.tsx` (`signUp`). Lägg till `useNavigate`-redirect efter lyckad auth.
- [x] Step 32: Koppla `AccountPage.tsx` till riktig data: ta bort `isLoggedIn = useState(true)`, hämta session via `supabase.auth.getUser()`, hämta orders från `orders`-tabellen per `customer_email`.
- [x] Step 33: Koppla `OrderConfirmation.tsx` till riktig data: läs `orderId` från URL-param, hämta order från DB, rensa kundvagnen via `clearCart()` efter bekräftad order.
- [x] Step 34: Koppla `ForgotPasswordPage.tsx` return URL till en riktig `UpdatePasswordPage` (`/update-password`) som hanterar Supabase auth callback och `updateUser({ password })`.
- [ ] Step 35: Fixa `ProductListing.tsx` — hantera `isError`-state från `useCatalogProducts` (visa felmeddelande, inte tyst tomvy). Ta bort `window.location.origin/href` från render.
- [ ] Step 36: Fixa `ProductDetail.tsx` — hantera `isError`, ta bort oanvänd `mockProducts`-import, fixa "related products"-rubrik (fel i18n-nyckel), rätta stjärnbetyg till att använda `product.ratings`.
- [ ] Step 37: Flytta `DbProduct`-typen från `useCatalog.ts` till `src/integrations/supabase/types.ts` för konsistens med manuellt underhållna typer.
- [ ] Step 38: Lös chunk size-varning (865 kB JS bundle) — code splitting med `manualChunks` eller dynamic imports för tunga routes.
- [ ] Step 39: UAT av komplett Nyehandel-first checkout-flöde: frontend → Nyehandel payment → order row → fulfillment-push → status `synced`.
- [ ] Step 40: Pre-launch security review: CORS-lås på edge functions (ta bort wildcard `*` på interna funktioner), verifiera RLS-policies, kör OWASP top-10 check.
