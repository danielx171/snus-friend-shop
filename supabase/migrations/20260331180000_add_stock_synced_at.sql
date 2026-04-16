-- Track when each variant's stock was last synced from Nyehandel
ALTER TABLE product_variants
  ADD COLUMN IF NOT EXISTS stock_synced_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_product_variants_stock_synced_at
  ON product_variants (stock_synced_at);
