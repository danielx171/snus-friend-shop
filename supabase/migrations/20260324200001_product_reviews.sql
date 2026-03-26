CREATE TABLE public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL CHECK (char_length(title) <= 100),
  body TEXT NOT NULL CHECK (char_length(body) <= 1000),
  helpful_count INT NOT NULL DEFAULT 0,
  flagged BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, user_id)
);

CREATE INDEX idx_reviews_product ON public.product_reviews(product_id) WHERE NOT flagged;
CREATE INDEX idx_reviews_user ON public.product_reviews(user_id);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read non-flagged reviews" ON public.product_reviews
  FOR SELECT USING (NOT flagged);
CREATE POLICY "Authenticated insert own review" ON public.product_reviews
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
