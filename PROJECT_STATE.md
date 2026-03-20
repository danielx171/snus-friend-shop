# Project State

Date: 2026-03-19 (evening)
Branch: `dev` (in sync with `main`)

## Status: Feature complete, catalog live — blocked on Nyehandel method names

All Steps 26-40 code is written and deployed.
734 real products synced from Nyehandel (NordicPouch catalog).
Frontend reads products from Supabase — no mock data.
Preview mode live (dismissible banner + checkout gate).

Blocked on:
  1. **Step 39 UAT**: Nyehandel account (NordicPouch) has ALL shipping and payment
     method names set to blank (""). The API rejects every non-empty name.
     CEO must either: (a) name the methods in Nyehandel admin, or (b) confirm
     the store will use Nyehandel hosted checkout (redirect) instead of API orders.
  2. Frontend deploy to Vercel (can be done in parallel)

## Multi-brand template architecture

The codebase is now a reusable template.
To launch a new brand, only 8 Supabase secrets
need changing. See DEPLOYMENT_CHECKLIST.md.

## Catalog snapshot (2026-03-19)

- 734 products synced
- 2,196 variants (one per product)
- 91 brands
- 45 pages @ 50 products/page
- ~17 minor API errors (products missing name/id on Nyehandel side)

---

Date: 2026-03-18
Branch: `dev`

## Previous Status

The store is **not yet live**. Checkout is intentionally disabled while the
Nyehandel-first checkout flow is built. All other pages (auth, product listing,
account, order confirmation) are wired to real data.

Full audit completed 2026-03-18. See `PROJECT_AUDIT_2026_03_18.md` for detail.

---

## Completed Steps

- Steps 1–24: Complete (Shopify-era, now superseded by architecture pivot)
- Step 25 ✅ — Nyehandel API fully investigated. `NYEHANDEL_API_REFERENCE.md` created (includes logistics)
- Steps 26–30 ✅ — Nyehandel-first checkout flow built, deployed, and env-driven
- Step 31 ✅ — Real Supabase auth in `LoginPage.tsx` + `RegisterPage.tsx`
- Step 32 ✅ — `AccountPage.tsx` wired to real session + real orders query
- Step 33 ✅ — `OrderConfirmation.tsx` reads real order from DB, clears cart
- Step 34 ✅ — `UpdatePasswordPage.tsx` handles Supabase recovery flow end-to-end
- Step 35 ✅ — `ProductListing.tsx` error states handled
- Step 36 ✅ — `ProductDetail.tsx` error states, mock imports removed
- Step 37 ✅ — `DbProduct` type moved to `src/integrations/supabase/types.ts`
- Step 38 ✅ — Bundle split (874kB → 301kB largest chunk)
- Step 38b ✅ — `window.location.origin` removed from ProductListing render

---

## Architecture (current)

```
Customer → CheckoutHandoff.tsx
  → POST create-nyehandel-checkout
  → Nyehandel POST /orders/simple
  → Order row created in Supabase (status: pending)
  → Nyehandel handles payment + fulfilment
  → Nylogistik ships → delivery_callback_url fires
  → POST nyehandel-delivery-callback
  → Order updated (tracking_id, tracking_url, status: shipped)

Product sync:
  Nyehandel webhook → nyehandel-webhook → sync-nyehandel
  → Products upserted in Supabase by nyehandel_id
  → Frontend reads from Supabase (fast, cached)

Retries:
  pg_cron → retry-failed-nyehandel-orders → push-order-to-nyehandel
```

---

## Tiebreaker

When docs disagree: `ROADMAP.md` and `CURRENT_PRIORITIES.md` win.
