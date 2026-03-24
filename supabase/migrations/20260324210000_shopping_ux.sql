CREATE TABLE public.user_wishlists (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

ALTER TABLE public.user_wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own wishlist" ON public.user_wishlists FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users insert own wishlist" ON public.user_wishlists FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users delete own wishlist" ON public.user_wishlists FOR DELETE USING (user_id = (select auth.uid()));

CREATE TABLE public.checkout_upsells (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL,
  display_name TEXT NOT NULL,
  price_override NUMERIC NOT NULL DEFAULT 0.99,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0
);

ALTER TABLE public.checkout_upsells ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active upsells" ON public.checkout_upsells FOR SELECT USING (active);

INSERT INTO public.checkout_upsells (sku, display_name, price_override, sort_order) VALUES
  ('stng16', 'STNG Berry Seltzer', 0.99, 1),
  ('xr01', 'XR Catch Mint', 0.99, 2),
  ('vel01', 'VELO Freeze Max', 0.99, 3),
  ('zyn01', 'ZYN Cool Mint', 0.99, 4),
  ('loop01', 'LOOP Mint Mania', 0.99, 5),
  ('cuba01', 'Cuba Banana', 0.99, 6);
