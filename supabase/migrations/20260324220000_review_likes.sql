-- Review likes table — tracks which users liked which reviews
CREATE TABLE public.review_likes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  review_id UUID NOT NULL REFERENCES public.product_reviews(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, review_id)
);

CREATE INDEX idx_review_likes_review ON public.review_likes(review_id);

ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can see likes (needed for count display)
CREATE POLICY "Public read review likes" ON public.review_likes
  FOR SELECT USING (true);

-- Authenticated users can insert their own likes
CREATE POLICY "Authenticated insert own like" ON public.review_likes
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- Authenticated users can delete their own likes
CREATE POLICY "Authenticated delete own like" ON public.review_likes
  FOR DELETE USING (user_id = (select auth.uid()));

-- Atomic toggle using DELETE-first pattern to avoid TOCTOU race condition.
-- DELETE acquires a row lock, and INSERT ON CONFLICT handles concurrent inserts.
CREATE OR REPLACE FUNCTION public.toggle_review_like(p_review_id UUID)
RETURNS boolean AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  DELETE FROM public.review_likes
  WHERE user_id = v_user_id AND review_id = p_review_id;

  IF FOUND THEN
    UPDATE public.product_reviews
    SET helpful_count = GREATEST(helpful_count - 1, 0)
    WHERE id = p_review_id;
    RETURN false;  -- unliked
  ELSE
    INSERT INTO public.review_likes (user_id, review_id)
    VALUES (v_user_id, p_review_id)
    ON CONFLICT (user_id, review_id) DO NOTHING;

    IF FOUND THEN
      UPDATE public.product_reviews
      SET helpful_count = helpful_count + 1
      WHERE id = p_review_id;
    END IF;
    RETURN true;  -- liked
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
