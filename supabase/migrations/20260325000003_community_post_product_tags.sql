-- Product tags on community posts (mention other products in a post)
CREATE TABLE public.community_post_product_tags (
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, product_id)
);

-- Max 3 product tags per post
CREATE OR REPLACE FUNCTION public.check_max_product_tags()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_count INT;
BEGIN
  SELECT COUNT(*) INTO v_count
    FROM public.community_post_product_tags
    WHERE post_id = NEW.post_id;
  IF v_count >= 3 THEN
    RAISE EXCEPTION 'Maximum 3 product tags per post';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_check_max_product_tags
  BEFORE INSERT ON public.community_post_product_tags
  FOR EACH ROW EXECUTE FUNCTION public.check_max_product_tags();

CREATE INDEX idx_community_post_product_tags_product ON public.community_post_product_tags(product_id);

ALTER TABLE public.community_post_product_tags ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read community post product tags"
  ON public.community_post_product_tags FOR SELECT
  USING (true);

-- Only the post author can tag products (check via the parent post)
CREATE POLICY "Post author insert community post product tags"
  ON public.community_post_product_tags FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.community_posts
      WHERE id = post_id AND user_id = auth.uid()
    )
  );

-- Post author can remove tags
CREATE POLICY "Post author delete community post product tags"
  ON public.community_post_product_tags FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.community_posts
      WHERE id = post_id AND user_id = auth.uid()
    )
  );
