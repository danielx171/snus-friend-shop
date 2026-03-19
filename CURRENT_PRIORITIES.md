# Current Priorities

Last updated: 2026-03-18

## Completed today (2026-03-18)

- Steps 26-30 ✅ committed and deployed
- All 11 DB migrations applied to Supabase ✅
- All edge functions deployed (14 total) ✅
- Supabase secrets updated with NordicPouch API credentials ✅
- Store config env vars added:
    STORE_ORDER_PREFIX = SF
    STORE_CURRENCY = EUR
    STORE_LOCALE = en-gb
    STORE_PAYMENT_METHOD = Nets Easy Checkout
- Shopify fully removed from codebase ✅
- Codebase refactored for multi-brand template ✅

## Architecture confirmed

- snus-friend-shop connects to NordicPouch Nyehandel account
- SKU numbers must match NordicPouch's Nyehandel SKUs exactly
- Payment = Nets Easy Checkout via Nyehandel
- Warehouse = NordicPouch/Nyehandel
- No separate Nyehandel store needed (€250 not required)

## What's blocking UAT right now

1. Catalog sync not yet run — 0 products in DB
   → Run sync-nyehandel once API token is confirmed working
2. API token returns 401 — needs correct NordicPouch token
   → Update NYEHANDEL_API_TOKEN in Supabase secrets

## Next steps in order

1. Confirm NYEHANDEL_API_TOKEN works (test with healthcheck)
2. Run sync-nyehandel to populate products
3. Place one test order end to end (Step 39 UAT)
4. Fix any issues found
5. Deploy frontend (see hosting section)
6. Merge dev → main
7. Go live

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
