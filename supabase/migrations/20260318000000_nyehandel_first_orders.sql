-- Step 26: Nyehandel-first orders schema migration
-- Forward-only migration — do not edit after applying.

-- ============================================================
-- 1. Drop index on shopify_order_id (must come before column drop)
-- ============================================================

DROP INDEX IF EXISTS public.idx_orders_shopify_id;

-- ============================================================
-- 2. Drop Shopify columns from orders
-- ============================================================

ALTER TABLE public.orders
  DROP COLUMN IF EXISTS shopify_order_id,
  DROP COLUMN IF EXISTS shopify_checkout_id;

-- ============================================================
-- 3. Update checkout_status CHECK constraint
--    Old valid values: pending | paid | failed | cancelled
--    New valid values: pending | confirmed | shipped | cancelled
-- ============================================================

-- Migrate any existing rows that use removed values before tightening the constraint
UPDATE public.orders SET checkout_status = 'confirmed' WHERE checkout_status = 'paid';
UPDATE public.orders SET checkout_status = 'cancelled'  WHERE checkout_status = 'failed';

-- Drop the old auto-named constraint
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_checkout_status_check;

-- Add new constraint with Nyehandel-aligned status values
ALTER TABLE public.orders
  ADD CONSTRAINT orders_checkout_status_check
  CHECK (checkout_status IN ('pending', 'confirmed', 'shipped', 'cancelled'));

-- ============================================================
-- 4. Add Nyehandel-specific columns (IF NOT EXISTS — safe to re-run)
--    nyehandel_order_id already exists from an earlier migration; skipped.
-- ============================================================

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS nyehandel_prefix                 text,
  ADD COLUMN IF NOT EXISTS tracking_id                      text,
  ADD COLUMN IF NOT EXISTS tracking_url                     text,
  ADD COLUMN IF NOT EXISTS delivery_callback_received_at    timestamptz;

-- ============================================================
-- 5. Index on nyehandel_order_id for fast lookups
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_orders_nyehandel_order_id
  ON public.orders (nyehandel_order_id)
  WHERE nyehandel_order_id IS NOT NULL;

-- ============================================================
-- 6. Drop source_shopify_order_id from ops_alerts
-- ============================================================

ALTER TABLE public.ops_alerts
  DROP COLUMN IF EXISTS source_shopify_order_id;
