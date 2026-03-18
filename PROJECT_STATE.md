# Project State

Date: 2026-03-18
Branch: `dev`

## Current Status

The store is **not yet live**. Checkout is intentionally disabled while the 
Nyehandel-first checkout flow is built. All other pages (auth, product listing, 
account, order confirmation) are wired to real data.

Full audit completed 2026-03-18. See `PROJECT_AUDIT_2026_03_18.md` for detail.

---

## Completed Steps

- Steps 1–24: Complete (Shopify-era, now superseded by architecture pivot)
- Step 25 ✅ — Nyehandel API fully investigated. `NYEHANDEL_API_REFERENCE.md` + `NYLOGISTIK_REFERENCE.md` created
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

## Active Next Steps

**Before Step 26 — Quick pre-fixes (do first):**
1. Fix `NYEHANDEL_API_URL` secret to `https://api.nyehandel.se/api/v2` (currently wrong)
2. Add `X-identifier` header to all Nyehandel API calls in 3 functions
3. Fix `nyehandel-webhook` to actually call `sync-nyehandel` (currently just fakes it)
4. Move `ops-webhook-inbox` to correct path (currently nested wrong)
5. `git rm bun.lockb review_mvp/ DEBUG_LOGS/ opencode.json.save`

**Step 26** — Orders schema migration: drop Shopify columns, add Nyehandel columns
**Step 27** — Write `create-nyehandel-checkout` edge function
**Step 28** — Write `nyehandel-delivery-callback` edge function (tracking webhook)
**Step 29** — Rewrite `push-order-to-nyehandel` payload + remove Shopify references
**Step 30** — Wire `CheckoutHandoff.tsx` to call real `create-nyehandel-checkout`
**Step 39** — Full UAT end-to-end
**Step 40** — Security review

---

## Known Bugs (from 2026-03-18 audit)

| Severity | File | Issue |
|----------|------|-------|
| 🔴 | All functions | Wrong API base URL (`/v1` should be `/api/v2`) |
| 🔴 | `push-order-to-nyehandel` | Wrong payload format (Shopify-era) |
| 🔴 | `push-order-to-nyehandel` | `checkout_status === "paid"` guard will block all orders |
| 🔴 | `CheckoutHandoff.tsx` | Button disabled, `create-nyehandel-checkout` doesn't exist |
| 🟠 | `nyehandel-webhook` | Sync trigger is faked — never actually calls sync-nyehandel |
| 🟠 | All functions | Missing `X-identifier` header on Nyehandel calls |
| 🟠 | `ops-webhook-inbox` | File at wrong nested path, not in config.toml |
| 🟠 | `push-order-to-nyehandel` | Still accepts/queries `shopifyOrderId` |
| 🟠 | `push-order-to-nyehandel` | CORS wildcard `*` on internal function |
| 🟡 | `orders` table | Shopify columns: `shopify_order_id`, `shopify_checkout_id` |
| 🟡 | `sync-nyehandel` | Product field mapping likely doesn't match real API response |
| 🟡 | Root | `bun.lockb`, `review_mvp/`, `DEBUG_LOGS/`, `opencode.json.save` |

---

## Architecture (current target)

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

When docs disagree: `ROADMAP.md` and `PROJECT_STATE.md` win.
