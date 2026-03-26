-- ============================================================
-- Migration: Scaled review points — fewer reviews = more points
-- ============================================================

-- Unique index on points_transactions to prevent duplicate review awards.
-- One points award per review (keyed on reason prefix + review id).
CREATE UNIQUE INDEX IF NOT EXISTS idx_points_tx_review
  ON points_transactions (user_id, reason)
  WHERE reason LIKE 'review_%pts';

-- --------------------------------------------------------
-- Trigger function: award scaled SnusPoints after review insert
-- Mirrors the pattern from trg_award_points on orders.
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION public.award_review_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_review_count integer;
  v_points integer;
  v_reason text;
BEGIN
  -- Count existing reviews for this product (excluding the one just inserted)
  SELECT count(*) INTO v_review_count
    FROM public.product_reviews
   WHERE product_id = NEW.product_id
     AND id != NEW.id
     AND flagged = false;

  -- Scaling formula:
  -- 0 reviews (first!)  = 50 points
  -- 1-2 reviews         = 35 points
  -- 3-5 reviews         = 25 points
  -- 6-10 reviews        = 15 points
  -- 11+ reviews         = 10 points (base)
  v_points := CASE
    WHEN v_review_count = 0  THEN 50
    WHEN v_review_count <= 2 THEN 35
    WHEN v_review_count <= 5 THEN 25
    WHEN v_review_count <= 10 THEN 15
    ELSE 10
  END;

  v_reason := 'review_' || v_points || 'pts';

  -- Insert transaction (unique index prevents duplicate awards)
  INSERT INTO public.points_transactions (user_id, points, reason)
  VALUES (NEW.user_id, v_points, v_reason)
  ON CONFLICT DO NOTHING;

  -- Upsert balance (same pattern as award_points_for_order)
  INSERT INTO public.points_balances (user_id, balance, lifetime_earned)
  VALUES (NEW.user_id, v_points, v_points)
  ON CONFLICT (user_id) DO UPDATE
    SET balance         = points_balances.balance + EXCLUDED.balance,
        lifetime_earned = points_balances.lifetime_earned + EXCLUDED.lifetime_earned,
        updated_at      = now();

  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER trg_award_review_points
  AFTER INSERT ON public.product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.award_review_points();
