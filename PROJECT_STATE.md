# Project State

Date: 2026-03-24
Branch: `main`

## Status: Domain live, preview mode active — blocked on CEO order flow decision

Site live at **snusfriends.com** and **snus-friend-shop.vercel.app**.
734 real products synced from Nyehandel (NordicPouch catalog).
Frontend reads products from Supabase — no mock data.
Preview mode active (dismissible banner + checkout gate).

Blocked on:
  1. **Step 39 UAT**: CEO must confirm API order flow is ready before placing test order.
     Payment method "NFC Group Payment" and shipping "UPS Standard (J229F1)" are wired.
  2. **Product images**: Need higher quality product photography
  3. **Retail pricing**: Currently wholesale × 1.55 markup — final pricing TBD

## Domain & Infrastructure (2026-03-24)

- **Domain**: snusfriends.com — Cloudflare DNS (A record + CNAME, proxy OFF)
- **Vercel**: Both snusfriends.com and snus-friend-shop.vercel.app verified, SSL active
- **Supabase auth**: Site URL = https://snusfriends.com, redirect URLs updated
- **Webhook**: Nyehandel delivery callback configured, secret = obscure-witness-afraid
- **VITE_SITE_URL**: https://snusfriends.com
- **Edge functions**: All deployed and active (spin-wheel v2, create-nyehandel-checkout v16)
- **Preview mode**: VITE_PREVIEW_MODE=true (ready to disable for go-live)

## Multi-brand template architecture

The codebase is now a reusable template.
To launch a new brand, only 8 Supabase secrets
need changing. See DEPLOYMENT_CHECKLIST.md.

## Catalog snapshot (2026-03-24)

- 734 products synced
- ~2,200 variants
- 91+ brands
- Product badges: popular (310), newPrice (154), new (60), limited (52)
- 8-filter system: brand, strength, flavor, format, nicotine mg, price, stock, category

---

Date: 2026-03-23
Branch: `main`

## Previous Status — Major feature sprint

- Nyehandel checkout wired (NFC Group Payment + UPS Standard J229F1)
- Rewards system fully implemented (daily spin, vouchers, SnusPoints)
- Navigation simplified (7→4 links), quick-filter tabs, brand discovery UX
- WCAG color accessibility fixed, logo redesigned (SF monogram)
- Pre-launch code review: 3 critical + 4 important fixes applied
- Edge functions deployed to Supabase production

---

Date: 2026-03-19

## Previous Status

Feature complete, catalog live — blocked on Nyehandel method names (now resolved).

---

## Completed Steps

- Steps 1–24: Complete (Shopify-era, now superseded by architecture pivot)
- Step 25 ✅ — Nyehandel API fully investigated. `NYEHANDEL_API_REFERENCE.md` created
- Steps 26–38 ✅ — Nyehandel-first checkout, auth, catalog sync, PWA, badges, cron
- Step 39 🟡 — UAT in progress (checkout wired, awaiting CEO for test order)
- Step 40 🟡 — Pre-launch security review partially complete (code review done)

---

## Architecture (current)

```
Customer → snusfriends.com (Vercel CDN)
  → CheckoutHandoff.tsx
  → POST create-nyehandel-checkout (Supabase Edge Function)
  → Nyehandel POST /orders/simple (NFC Group Payment + UPS Standard J229F1)
  → Order row created in Supabase (status: pending)
  → Nyehandel handles payment + fulfilment
  → Nylogistik ships → delivery_callback_url fires
  → POST nyehandel-delivery-callback
  → Order updated (tracking_id, tracking_url, status: shipped)

Product sync:
  Nyehandel webhook → nyehandel-webhook → sync-nyehandel
  → Products upserted in Supabase by nyehandel_id
  → Frontend reads from Supabase (fast, cached)

Rewards:
  POST spin-wheel → weighted random prize → atomic points increment
  → voucher creation → daily_spins unique constraint (one per day)

Retries:
  pg_cron → retry-failed-nyehandel-orders → push-order-to-nyehandel
```

---

## Tiebreaker

When docs disagree: `ROADMAP.md` and `CURRENT_PRIORITIES.md` win.
