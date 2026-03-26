-- Create a SECURITY DEFINER function for flagging reviews.
-- This avoids needing a broad UPDATE RLS policy on product_reviews
-- that could allow users to modify rating/title/body columns.
CREATE OR REPLACE FUNCTION public.flag_review(review_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.product_reviews SET flagged = true WHERE id = review_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
