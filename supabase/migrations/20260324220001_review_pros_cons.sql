ALTER TABLE public.product_reviews
  ADD COLUMN pros TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN cons TEXT[] NOT NULL DEFAULT '{}';

ALTER TABLE public.product_reviews
  ADD CONSTRAINT check_pros_length CHECK (array_length(pros, 1) IS NULL OR array_length(pros, 1) <= 5),
  ADD CONSTRAINT check_cons_length CHECK (array_length(cons, 1) IS NULL OR array_length(cons, 1) <= 5);
