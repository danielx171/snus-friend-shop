# Stock Sync — Lightweight Real-Time Inventory

**Date:** 2026-03-31
**Source:** Nyehandel Gaps spec (Gap 4), CEO Railway middleware pattern

## Problem
Product stock levels only sync every 4 hours via `sync-nyehandel` (full product sync). Customers can add out-of-stock items to cart. The CEO's middleware syncs stock every 10 minutes.

## Design

### New edge function: `sync-nyehandel-stock/index.ts`
- **Auth:** `x-cron-secret` (cron-triggered, same pattern as other cron functions)
- **Purpose:** Sync ONLY stock quantities from Nyehandel — no prices, descriptions, or images
- **Flow:**
  1. Fetch all published products from NYE: `GET /products?status=published&per_page=100` with pagination
  2. For each product variant, extract `sku` and `stock`
  3. Batch upsert into `inventory` table: `UPDATE SET quantity = nye_stock, updated_at = now() WHERE variant_id = (SELECT id FROM product_variants WHERE sku = nye_sku)`
  4. Update `product_variants.stock_synced_at` for tracking
  5. Log: total synced, errors, duration
  6. If any SKU in our DB doesn't exist in NYE → insert ops_alert

### Cron schedule: every 10 minutes
- pg_cron job calling the edge function via pg_net
- Same pattern as existing sync-nyehandel cron in `20260320000001_setup_sync_cron.sql`

### DB migration
```sql
ALTER TABLE product_variants
  ADD COLUMN IF NOT EXISTS stock_synced_at timestamptz;
```

### NYE API details
- Endpoint: `GET /products?status=published&per_page=100&page={n}`
- Auth: `X-API-KEY` header (existing `NYEHANDEL_API_KEY` secret)
- Must include `X-Language: en` header
- Response: `{ data: [{ variants: [{ sku, stock }] }], meta: { last_page } }`
- Pagination: follow `meta.last_page`

### What NOT to do
- Don't touch prices or descriptions — that's the full sync's job
- Don't rebuild the product JSON — just update inventory table
- Don't trigger a site rebuild — stock is checked at runtime via cart validation

### Edge cases
- NYE returns null stock → treat as 0
- NYE pagination fails mid-way → log partial sync, alert ops, don't overwrite good data
- Variant exists in our DB but not in NYE → flag as ops_alert, don't delete

### Files
- Create: `supabase/functions/sync-nyehandel-stock/index.ts`
- Create: `supabase/migrations/XXXXXX_add_stock_synced_at.sql`
- Modify: `supabase/config.toml` — add function config
- Modify: `src/integrations/supabase/types.ts` — add stock_synced_at column type

### Verification
- Deploy function, trigger manually, check inventory table updates
- Verify pg_cron fires every 10 minutes
- Check ops_alerts for any SKU mismatches
