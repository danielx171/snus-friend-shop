# Current Priorities

Last updated: 2026-03-19 evening

## Completed today (2026-03-19)

- Steps 26-30 ✅ committed and deployed
- All DB migrations applied to Supabase ✅
- All edge functions deployed ✅
- Supabase secrets updated with NordicPouch API credentials ✅
- Shopify fully removed from codebase (incl. `src/lib/shopify.ts` deleted) ✅
- Codebase refactored for multi-brand template ✅
- Catalog fully synced: **734 products, 2,196 variants, 91 brands** across 45 pages ✅
- `useCatalog.ts` wired to Supabase (no mock data) ✅
- Multi-pack pricing model confirmed: pack1/3/5/10/30 computed from base price ✅
- `CheckoutHandoff.tsx` SKU resolution fixed (product_id → SKU, quantity × packCount) ✅
- Preview mode: dismissible amber banner + checkout gate (`VITE_PREVIEW_MODE=true`) ✅
- Two Lovable publishes merged into dev (animations + light hero/bestsellers fix) ✅
- Flavor-based gradient image fallback in `ProductCard.tsx` + `ProductDetail.tsx` ✅
- Shipping method names updated to NordicPouch account names ✅
- `vercel.json` SPA rewrite created ✅
- `OrderConfirmation.tsx` already wired to real Supabase data ✅
- Build passes clean ✅
- `dev` and `main` in sync ✅

## Architecture confirmed

- snus-friend-shop connects to NordicPouch Nyehandel account
- One SKU per product; pack sizes = quantity multipliers (1, 3, 5, 10, 30 cans)
- Volume discounts computed in useCatalog.ts (5%/10%/15%/20% off per-can price)
- Payment = Nets Easy Checkout via Nyehandel
- Warehouse = NordicPouch/Nyehandel (Nylogistik)

## BLOCKER — CEO decision required

Nyehandel account has all shipping/payment method names blank ("").
API-based orders (`POST /orders/simple`) fail with 422 for every name tried.
Two options:
  A. Name the shipping + payment methods in Nyehandel admin → unblocks current checkout flow
  B. Switch to Nyehandel hosted checkout (redirect to Nyehandel-hosted payment page)

## Next steps in order

1. **CEO decides**: API order flow vs hosted checkout (see BLOCKER above)
2. If (A): name methods in Nyehandel admin → place test order → verify in admin + Supabase
3. If (B): build hosted checkout redirect in `CheckoutHandoff.tsx`
4. Deploy frontend to Vercel (can happen in parallel — see DEPLOYMENT_CHECKLIST.md)
5. UAT sign-off → go live

## What not to do

- Do not add any Shopify-specific code
- Do not implement Pipedrive, WhatsApp, or Cowork in this repo
- Do not move order or fulfilment logic into the frontend
- Do not edit `src/lib/cart-utils.ts` without explicit permission

## Key reference files

- `NYEHANDEL_API_REFERENCE.md` — full API reference, every endpoint
- `NYEHANDEL_API.md` — Step 25 investigation answers, checkout flow design
- `NYLOGISTIK_REFERENCE.md` — warehouse/shipping system reference
- `ROADMAP.md` — delivery sequence, Steps 26–40 detail
