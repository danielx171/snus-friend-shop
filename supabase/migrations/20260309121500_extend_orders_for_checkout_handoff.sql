-- Extend orders to support pre-checkout persistence
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS checkout_status text NOT NULL DEFAULT 'pending' CHECK (checkout_status IN ('pending', 'paid', 'failed', 'cancelled')),
  ADD COLUMN IF NOT EXISTS line_items_snapshot jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS customer_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS shopify_checkout_id text,
  ADD COLUMN IF NOT EXISTS idempotency_key text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_idempotency_key
  ON public.orders (idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_orders_checkout_status
  ON public.orders (checkout_status);
