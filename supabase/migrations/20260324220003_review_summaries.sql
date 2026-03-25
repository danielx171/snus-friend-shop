CREATE TABLE public.review_summaries (
  product_id UUID PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
  summary_text TEXT NOT NULL,
  review_count_at_generation INT NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.review_summaries ENABLE ROW LEVEL SECURITY;

-- Public read (displayed on product pages)
CREATE POLICY "Public read review summaries" ON public.review_summaries
  FOR SELECT USING (true);

-- Only edge functions (service role) can write summaries
-- No INSERT/UPDATE/DELETE policies for anon/authenticated by design
