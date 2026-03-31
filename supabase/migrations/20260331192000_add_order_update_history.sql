-- Track order edit history for audit trail
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS last_updated_at timestamptz,
  ADD COLUMN IF NOT EXISTS update_history jsonb DEFAULT '[]'::jsonb;
