# Nyehandel Integration Gaps — Design Spec

> **For:** Claude Code terminal implementation
> **Date:** 2026-03-31
> **Source:** CEO's Railway middleware document cross-referenced against our 28 edge functions
> **Status:** Ready for implementation

---

## Context

The CEO's Shopify–NYE middleware (Railway) handles order lifecycle management that our
Supabase edge functions currently lack. While we use `POST /orders` (simple) for checkout
and `nyehandel-delivery-callback` for tracking, we have no support for post-order operations.

**Already hardened in this session (Cowork):**
- SKU pre-validation against NYE `/products/find?sku=`
- Dynamic shipping method validation against NYE `/shipping-methods`
- 3-layer duplicate prevention (idempotency check → advisory lock → re-check)

**Remaining gaps below — all need Claude Code terminal:**

---

## Gap 1: Order Cancellation

### Problem
If a customer needs to cancel an order, we have no way to do it. There's no edge function
and no UI for it.

### Nyehandel API
```
POST /orders/{order_id}/cancel
  ?refund_payment=true
  ?send_message=true
  ?send_custom_message=true&subject=...&message=...
```

### Implementation Plan

#### 1a. New edge function: `cancel-nyehandel-order/index.ts`
- **Auth:** JWT-protected (ops user or the customer who placed the order)
- **Input:** `{ order_id: string, reason?: string, refund_payment?: boolean }`
- **Flow:**
  1. Look up order in `orders` table by `id` (not nyehandel_order_id)
  2. Verify order belongs to requesting user (if customer) or user has ops role
  3. Verify order status is cancellable (`pending`, `confirmed`, `open`, `approved`)
  4. Call `POST /orders/{nyehandel_order_id}/cancel?refund_payment={bool}` on NYE
  5. Update local `orders` row: `status → 'canceled'`, `canceled_at → now()`, `cancel_reason → reason`
  6. Fire ops alert if cancellation fails on NYE side
- **Error handling:** If NYE returns error, log it and surface to ops. Don't silently swallow.

#### 1b. DB migration
```sql
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS canceled_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancel_reason text;
```

#### 1c. Frontend (ops dashboard)
- Add "Cancel Order" button to ops order detail view
- Confirmation dialog with reason field
- Status badge should show "Canceled" with red styling

#### 1d. Frontend (customer account)
- Add "Request Cancellation" to order detail page
- Only show for orders in `pending`/`confirmed` status
- Show confirmation dialog explaining refund timeline

### Edge Cases
- Order already shipped → reject with clear error
- NYE cancellation succeeds but local DB update fails → log orphan, ops alert
- Concurrent cancel + ship race condition → check NYE order status before canceling

---

## Gap 2: Order Updates / Edits

### Problem
Customers can't change shipping address or item quantities after placing an order.

### Nyehandel API
```
POST /orders/{order_id}  (update)
```

### Critical NYE Quirks (from CEO document)
1. **Company name causes server error** — NEVER include company name in update payload
2. **Shipping VAT inconsistency** — create endpoint treats shipping as VAT-inclusive;
   update endpoint treats it as VAT-exclusive. For changes where exact shipping VAT matters,
   cancel + recreate instead of updating.
3. **Email changes silently ignored** — NYE won't update customer email on existing orders.
   If email must change, cancel + recreate.

### Implementation Plan

#### 2a. New edge function: `update-nyehandel-order/index.ts`
- **Auth:** JWT-protected (ops only for now — customer self-service is Phase 2)
- **Input:** `{ order_id: string, updates: { shipping_address?, items?, warehouse_note? } }`
- **Flow:**
  1. Look up order, verify status is editable (`open`, `approved`)
  2. Build NYE update payload — **MUST omit company name**
  3. If shipping changes involve VAT-sensitive amounts: cancel + recreate instead
  4. Call `POST /orders/{nyehandel_order_id}` with update payload
  5. Update local `orders` row with new snapshot
  6. Log the change in `webhook_inbox` as an audit trail
- **Explicitly NOT supported:** Email changes (NYE ignores them silently)

#### 2b. DB migration
```sql
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS last_updated_at timestamptz,
  ADD COLUMN IF NOT EXISTS update_history jsonb DEFAULT '[]'::jsonb;
```

### Priority
Medium — most address changes happen before shipping. Start with ops-only, add customer
self-service later.

---

## Gap 3: VAT-Safe Discount Distribution

### Problem
When we add coupon/discount functionality, Nyehandel requires discounts to be distributed
proportionally across product line item prices — NOT sent as a separate discount line.
The CEO's middleware implements this; we don't have it yet.

### How the Middleware Does It
1. Calculate total cart value (sum of all line items)
2. For each line item, calculate its share: `(item_total / cart_total) * discount_amount`
3. Subtract share from item's `price_inc_vat` and recalculate `price_ex_vat` using VAT rate
4. Round each item independently (NYE truncates — up to €0.01 variance is expected)
5. Assign any rounding remainder to the highest-value item

### Implementation Plan

#### 3a. Shared utility: `_shared/discount-distribution.ts`
```typescript
interface DiscountableItem {
  sku: string;
  quantity: number;
  priceIncVat: number;  // in lowest currency unit (cents)
  vatRate: number;       // e.g., 2500 for 25%
}

interface DistributedItem extends DiscountableItem {
  discountedPriceIncVat: number;
  discountedPriceExVat: number;
  discountApplied: number;
}

function distributeDiscount(
  items: DiscountableItem[],
  discountAmount: number,  // in lowest currency unit
): DistributedItem[];
```

#### 3b. Integration point
- Modify `create-nyehandel-checkout` to accept optional `discount_code` field
- Look up discount in a new `discounts` table (code, type, amount, min_order, max_uses, etc.)
- Apply `distributeDiscount()` before building the NYE payload
- The NYE payload items already have `price_ex_vat` and `price_inc_vat` — just use the
  distributed values instead of the raw prices

#### 3c. DB migration
```sql
CREATE TABLE IF NOT EXISTS discounts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('percentage', 'fixed_amount')),
  value numeric NOT NULL,
  currency text DEFAULT 'EUR',
  min_order_value numeric DEFAULT 0,
  max_uses integer,
  used_count integer DEFAULT 0,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

### Priority
Medium-high — needed before any marketing campaigns or coupon codes go live.

---

## Gap 4: Real-Time Stock Sync

### Problem
Our product catalog syncs at build time via Astro's Content Layer (Supabase loader in
`src/content.config.ts`). Stock levels are stale between builds. The CEO's middleware
syncs stock every 10 minutes.

### Implementation Plan

#### 4a. New edge function: `sync-nyehandel-stock/index.ts`
- **Auth:** Cron-triggered (`x-cron-secret`)
- **Flow:**
  1. Fetch all published products from NYE: `GET /products?status=published&per_page=100`
  2. Paginate through all pages
  3. For each product, extract each variant's `sku` and `stock` value
  4. Batch upsert into `product_variants` table: `UPDATE SET stock = nye_stock WHERE sku = nye_sku`
  5. Log sync results (updated count, errors, duration)
  6. If any SKU in our DB doesn't exist in NYE → flag as ops alert

#### 4b. Cron schedule
```toml
# In supabase/config.toml — add to existing cron jobs
[functions.sync-nyehandel-stock]
verify_jwt = true
# pg_cron: every 10 minutes
```

Add pg_cron job:
```sql
SELECT cron.schedule(
  'sync-nye-stock',
  '*/10 * * * *',
  $$SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/sync-nyehandel-stock',
    headers := jsonb_build_object('x-cron-secret', current_setting('app.settings.cron_secret'))
  );$$
);
```

#### 4c. DB migration
```sql
-- Ensure product_variants has a stock column (it may already exist)
ALTER TABLE product_variants
  ADD COLUMN IF NOT EXISTS stock integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stock_synced_at timestamptz;
```

#### 4d. Frontend impact
- `FilterableProductGrid` should show "Out of Stock" badge when `stock <= 0`
- "Add to Cart" button should be disabled for out-of-stock items
- Cart should validate stock on checkout initiation (edge case: stock drops while browsing)

### Priority
High — customers can currently add out-of-stock items to cart without knowing.

---

## Implementation Order (recommended for Claude Code)

1. **Stock sync** (Gap 4) — highest user-facing impact, prevents bad orders
2. **Order cancellation** (Gap 1) — most common post-order need
3. **Discount distribution** (Gap 3) — blocks marketing campaigns
4. **Order updates** (Gap 2) — lower frequency, ops-only initially

---

## Files to Update After Implementation

- `CLAUDE.md` — add new edge functions to architecture section
- `CURRENT_PRIORITIES.md` — move completed items, add new workstreams
- `DEPLOYMENT_CHECKLIST.md` — add any new secrets
- `src/integrations/supabase/types.ts` — add new table types (discounts, new columns)
- `supabase/config.toml` — add new function configs + verify_jwt settings
