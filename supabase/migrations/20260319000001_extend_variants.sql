-- Extend product_variants for real Nyehandel variant data
-- Forward-only migration — do not edit after applying.

-- 1. Add Nyehandel-specific columns to product_variants
ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS gtin text,
  ADD COLUMN IF NOT EXISTS nyehandel_variant_id text;

-- 2. Index on nyehandel_variant_id for sync upsert lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_variants_nyehandel_variant_id
  ON public.product_variants (nyehandel_variant_id)
  WHERE nyehandel_variant_id IS NOT NULL;

-- 3. Drop the Shopify checkout constraint (no longer relevant)
ALTER TABLE public.product_variants
  DROP CONSTRAINT IF EXISTS product_variants_checkout_requires_shopify_variant_id;

-- 4. Add unique constraint on nyehandel_id for products (if not already unique)
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_nyehandel_id_unique
  ON public.products (nyehandel_id)
  WHERE nyehandel_id IS NOT NULL;
