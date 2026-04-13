-- Drop Shopify residue columns. Shopify was fully removed from the app
-- during the Nyehandel migration; these columns have had no readers or
-- writers in application code for multiple releases.

ALTER TABLE public.product_variants
  DROP COLUMN IF EXISTS shopify_variant_id;

ALTER TABLE public.sku_mappings
  DROP COLUMN IF EXISTS shopify_sku;
