-- Add cancellation tracking columns to orders
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS canceled_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancel_reason text;

-- Index for finding canceled orders
CREATE INDEX IF NOT EXISTS idx_orders_canceled_at
  ON orders (canceled_at) WHERE canceled_at IS NOT NULL;
