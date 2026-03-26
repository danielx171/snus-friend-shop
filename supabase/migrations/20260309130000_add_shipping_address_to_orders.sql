-- Add structured shipping address storage for paid Shopify orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipping_address jsonb NOT NULL DEFAULT '{}'::jsonb;
