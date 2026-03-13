# Current Priorities

Last updated: 2026-03-13

This file is the short "what matters right now" view for AI tools and humans.
Use it together with `ROADMAP.md` and `PROJECT_STATE.md`.

## Completed this session (2026-03-13)

- Step 31 ✓ — `LoginPage.tsx` and `RegisterPage.tsx` wired to real Supabase auth (`signInWithPassword`, `signUp`, redirect on success, email confirmation state)
- Step 32 ✓ — `AccountPage.tsx` wired to real session (`getSession` + `onAuthStateChange`), real orders query by `customer_email`, real sign-out via `useNavigate`
- Step 33 ✓ — `OrderConfirmation.tsx` reads real order from DB by `orderId` URL param + session email guard; `clearCart()` on success; discriminated union states; defensive JSON normalisers
- Step 34 ✓ — `UpdatePasswordPage` at `/update-password` handles Supabase recovery callback; recovery context gated on URL hash; `updateUser({ password })` called only after confirmed recovery state; manually verified end-to-end
- Shopify cleanup ✓ — deleted `create-shopify-checkout`, `shopify-webhook`, `simulate-shopify-order.ts`; removed dead `opsWebhookInbox` edge-function call; `WebhookInbox.tsx` now queries `webhook_inbox` table directly; `config.toml`, `DEPLOYMENT_CHECKLIST.md`, `.env.example` all updated
- Nyehandel secrets ✓ — `NYEHANDEL_API_TOKEN` and `NYEHANDEL_X_IDENTIFIER` set in Supabase
- `vite.config.ts` ✓ — `lovable-tagger` removed (was causing dev-server stack overflow)
- Step 35 ✓ — `ProductListing.tsx` now distinguishes loading / query error / zero filtered results; error state shown explicitly instead of falling through to empty-state
- Step 36 ✓ — `ProductDetail.tsx` now distinguishes loading / query error / not found; unused `mockProducts` import removed; hardcoded star score removed (neutral `★ {ratings}` display); related-products heading fixed (`detail.aboutBrand` key → `"More from {brand}"`)
- Step 37 ✓ — `DbProduct` moved from `useCatalog.ts` to `src/integrations/supabase/types.ts`; re-exported from hook for backwards compat; build clean
- Step 38 ✓ — `manualChunks` added to `vite.config.ts`; single 874 kB chunk split into vendor (301 kB), entry (270 kB), supabase (167 kB), radix (111 kB), icons (25 kB); chunk-size warning gone
- Step 38b ✓ — `window.location.origin/href` removed from `ProductListing.tsx` render; replaced with `SITE_URL`/`listingUrl` constants derived from `VITE_SITE_URL`; canonical and breadcrumb `item` fields omitted when env var is absent (no invalid empty-string URLs emitted); build clean

## Active sequence

1. **Step 25** (BLOCKED) — Waiting for Nyehandel API reply from CEO. Findings go in `NYEHANDEL_API.md`.

## What not to do

- Do not build the new checkout flow (Steps 27–29) until Step 25 is answered.
- Do not add new Shopify-first checkout behavior.
- Do not move order or fulfillment logic into the frontend.
- Do not edit `src/lib/cart-utils.ts` without explicit permission.
- Do not touch Pipedrive, WhatsApp, or Cowork automation.

## Done signals for the current phase

- Nyehandel payment capabilities documented with endpoints, auth model, and callback strategy.
