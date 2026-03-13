# Current Priorities

Last updated: 2026-03-13

This file is the short "what matters right now" view for AI tools and humans.
Use it together with `ROADMAP.md` and `PROJECT_STATE.md`.

## Completed this session (2026-03-13)

- Step 31 ✓ — `LoginPage.tsx` and `RegisterPage.tsx` wired to real Supabase auth (`signInWithPassword`, `signUp`, redirect on success, email confirmation state)
- Step 32 ✓ — `AccountPage.tsx` wired to real session (`getSession` + `onAuthStateChange`), real orders query by `customer_email`, real sign-out via `useNavigate`
- Shopify cleanup ✓ — deleted `create-shopify-checkout`, `shopify-webhook`, `simulate-shopify-order.ts`; removed dead `opsWebhookInbox` edge-function call; `WebhookInbox.tsx` now queries `webhook_inbox` table directly; `config.toml`, `DEPLOYMENT_CHECKLIST.md`, `.env.example` all updated
- Nyehandel secrets ✓ — `NYEHANDEL_API_TOKEN` and `NYEHANDEL_X_IDENTIFIER` set in Supabase

## Active sequence

1. **Step 25** (BLOCKED) — Waiting for Nyehandel API reply from CEO. Findings go in `NYEHANDEL_API.md`.
2. **Step 33** — Wire `src/pages/OrderConfirmation.tsx` to real order data (read `orderId` from URL, fetch from DB, call `clearCart()`).
3. **Step 34** — Add `UpdatePasswordPage` at `/update-password` to handle Supabase password-reset callback.
4. **Steps 35–36** — Fix `ProductListing.tsx` silent error state; fix `ProductDetail.tsx` hardcoded star rating and wrong i18n key on related products.

## What not to do

- Do not build the new checkout flow (Steps 27–29) until Step 25 is answered.
- Do not add new Shopify-first checkout behavior.
- Do not move order or fulfillment logic into the frontend.
- Do not edit `src/lib/cart-utils.ts` without explicit permission.
- Do not touch Pipedrive, WhatsApp, or Cowork automation.

## Done signals for the current phase

- Nyehandel payment capabilities documented with endpoints, auth model, and callback strategy.
- `OrderConfirmation.tsx` reads real order from DB and clears cart.
- `UpdatePasswordPage` handles Supabase auth callback and password update.
- Product listing and detail pages handle errors visibly.
