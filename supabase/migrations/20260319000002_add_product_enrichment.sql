-- Add catalog enrichment columns sourced from Nyehandel API
-- Forward-only migration — do not edit after applying.

-- 1. Real product description (short_description / meta_description from Nyehandel)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS description text;

-- 2. Wholesale compare/MSRP price per can (frontend applies retail markup before display)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS compare_price numeric;
