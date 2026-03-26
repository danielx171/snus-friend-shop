-- Add Shopify variant mapping to product variant source of truth
ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS shopify_variant_id text,
  ADD COLUMN IF NOT EXISTS is_checkout_enabled boolean NOT NULL DEFAULT false;

-- Backfill all currently sellable variants (active product + positive price)
-- Priority: existing Shopify ID -> SKU -> deterministic placeholder
UPDATE public.product_variants pv
SET
  shopify_variant_id = COALESCE(
    NULLIF(trim(pv.shopify_variant_id), ''),
    NULLIF(trim(pv.sku), ''),
    'pending-' || pv.id::text
  ),
  is_checkout_enabled = true
FROM public.products p
WHERE p.id = pv.product_id
  AND p.is_active = true
  AND pv.price > 0;

-- Enforce non-null/blank Shopify variant ID for checkout-enabled variants
ALTER TABLE public.product_variants
  DROP CONSTRAINT IF EXISTS product_variants_checkout_requires_shopify_variant_id;

ALTER TABLE public.product_variants
  ADD CONSTRAINT product_variants_checkout_requires_shopify_variant_id
  CHECK (
    is_checkout_enabled = false
    OR (
      shopify_variant_id IS NOT NULL
      AND length(trim(shopify_variant_id)) > 0
    )
  );

-- Keep mapped Shopify variant IDs unique when present
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_variants_shopify_variant_id
  ON public.product_variants (shopify_variant_id)
  WHERE shopify_variant_id IS NOT NULL;
