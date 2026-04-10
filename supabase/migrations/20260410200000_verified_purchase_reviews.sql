-- Verified Purchase Reviews — April 10, 2026
-- Adds is_verified_purchase column to product_reviews and a trigger
-- that automatically checks if the reviewer has a completed order
-- containing the reviewed product.

-- 1. Add column
ALTER TABLE public.product_reviews
ADD COLUMN IF NOT EXISTS is_verified_purchase BOOLEAN DEFAULT false;

-- 2. Trigger function: checks orders.line_items_snapshot for product slug
CREATE OR REPLACE FUNCTION public.set_verified_purchase()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  has_purchase BOOLEAN := false;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.orders o
    WHERE o.user_id = NEW.user_id
      AND o.checkout_status IN ('confirmed', 'shipped')
      AND o.line_items_snapshot::jsonb @> ('[{"slug":"' || NEW.product_id || '"}]')::jsonb
  ) INTO has_purchase;

  NEW.is_verified_purchase := has_purchase;
  RETURN NEW;
END;
$$;

-- 3. Trigger on insert
DROP TRIGGER IF EXISTS trg_set_verified_purchase ON public.product_reviews;
CREATE TRIGGER trg_set_verified_purchase
  BEFORE INSERT ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_verified_purchase();

-- 4. Backfill existing reviews
UPDATE public.product_reviews r
SET is_verified_purchase = EXISTS(
  SELECT 1 FROM public.orders o
  WHERE o.user_id = r.user_id
    AND o.checkout_status IN ('confirmed', 'shipped')
    AND o.line_items_snapshot::jsonb @> ('[{"slug":"' || r.product_id || '"}]')::jsonb
);
