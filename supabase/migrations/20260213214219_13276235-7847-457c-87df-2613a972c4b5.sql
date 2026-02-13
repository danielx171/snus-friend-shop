-- Add unique index on nyehandel_id for upsert support in sync function
CREATE UNIQUE INDEX idx_products_nyehandel_unique ON public.products (nyehandel_id) WHERE nyehandel_id IS NOT NULL;