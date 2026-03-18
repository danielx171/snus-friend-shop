# Current Priorities

Last updated: 2026-03-18

## What changed this session

- Step 25 ✓ — **UNBLOCKED AND COMPLETE**
  - Nyehandel API read in full (all endpoints, all sections)
  - `NYEHANDEL_API.md` updated: all open questions answered
  - `NYEHANDEL_API_REFERENCE.md` created: full technical reference (485 lines)
  - `NYEHANDEL_API.md` — Step 25 exit criteria all met ✅
  - Both files committed to `dev` branch

- `NYLOGISTIK_REFERENCE.md` created — all 16 help center articles read and documented.
  Key finding: Nylogistik is a desktop warehouse app, not an API. No direct integration
  needed. Connection is via `delivery_callback_url` on `POST /orders/simple`.

- `SYSTEM_BOUNDARIES.md` updated — removed William collaboration references.
  Project is currently solo. Pipedrive/WhatsApp/Cowork are future scope, separate system.

## Active sequence — Steps 26–29 are now unblocked

### Step 26 — Design checkout flow + schema migration
- Remove Shopify-specific columns from `orders` table
  (`shopify_order_id`, `shopify_cart_id`, idempotency fields)
- Add Nyehandel-specific columns: `nyehandel_order_id`, `nyehandel_prefix`,
  `delivery_callback_received_at`, `tracking_id`, `tracking_url`
- Write forward-only migration in `supabase/migrations/`
- Update `src/integrations/supabase/types.ts`

### Step 27 — Write `create-nyehandel-checkout` edge function
- Calls `POST /orders/simple` on Nyehandel API
- Payload: SKUs from cart, customer info, shipping method name (from `GET /shipping-methods`)
- Returns Nyehandel order ID + prefix to frontend
- Persists order row in Supabase with status `pending`
- No payment session — Nyehandel owns payment entirely

### Step 28 — Replace `shopify-webhook` with Nyehandel delivery callback
- New edge function at `/functions/nyehandel-delivery-callback`
- Receives tracking data from Nylogistik when order ships
- Updates order row: `tracking_id`, `tracking_url`, `status → shipped`
- Set as `delivery_callback_url` in `POST /orders/simple`

### Step 29 — Update `push-order-to-nyehandel`
- Remove `external_order_id: order.shopify_order_id ?? order.id` — use internal UUID only
- Fix `line_items` mapping — currently Shopify format, needs Nyehandel format
  (SKU + quantity, no prices — Nyehandel uses its own pricing)
- Fix customer payload — add `firstname`, `lastname` (currently missing)
- Remove CORS `"*"` (internal function only)

## What not to do

- Do not add any Shopify-specific code
- Do not implement Pipedrive, WhatsApp, or Cowork in this repo
- Do not move order or fulfilment logic into the frontend
- Do not edit `src/lib/cart-utils.ts` without explicit permission
- Do not hardcode shipping method names — always fetch from `GET /shipping-methods`

## Key reference files

- `NYEHANDEL_API_REFERENCE.md` — full API reference, every endpoint
- `NYEHANDEL_API.md` — Step 25 investigation answers, checkout flow design
- `NYLOGISTIK_REFERENCE.md` — warehouse/shipping system reference
- `ROADMAP.md` — delivery sequence, Steps 26–40 detail
