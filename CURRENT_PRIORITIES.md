# Current Priorities

Last updated: 2026-03-19

## Completed today (2026-03-19)

- Steps 26-30 ✅ committed and deployed
- All DB migrations applied to Supabase ✅
- All edge functions deployed ✅
- Supabase secrets updated with NordicPouch API credentials ✅
- Store config env vars set:
    STORE_ORDER_PREFIX = SF
    STORE_CURRENCY = EUR
    STORE_LOCALE = en-gb
    STORE_PAYMENT_METHOD = Nets Easy Checkout
- Shopify fully removed from codebase ✅
- Codebase refactored for multi-brand template ✅
- Catalog fully synced: **734 products, 2,196 variants, 91 brands** across 45 pages ✅
- `useCatalog.ts` wired to Supabase (no mock data) ✅
- Multi-pack pricing model confirmed: pack1/3/5/10/30 computed from base price ✅
- `CheckoutHandoff.tsx` SKU resolution fixed (product_id → SKU, quantity × packCount) ✅
- Shopify dead types removed from src/ (opsMock, SkuMappings, useOpsData, types.ts) ✅
- Build passes clean ✅

## Architecture confirmed

- snus-friend-shop connects to NordicPouch Nyehandel account
- One SKU per product; pack sizes = quantity multipliers (1, 3, 5, 10, 30 cans)
- Volume discounts computed in useCatalog.ts (5%/10%/15%/20% off per-can price)
- Payment = Nets Easy Checkout via Nyehandel
- Warehouse = NordicPouch/Nyehandel (Nylogistik)
- No separate Nyehandel store needed (€250 not required)

## Next steps in order

1. Place one test order end to end (Step 39 UAT)
   - POST create-nyehandel-checkout with a real NordicPouch SKU (e.g. "771")
   - Verify order appears in Nyehandel admin + Supabase orders table
2. Fix any issues found during test order
3. Deploy frontend (Vercel — see DEPLOYMENT_CHECKLIST.md)
4. Merge dev → main
5. Go live

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
