-- Predefined attribute categories (admin-seeded)
CREATE TABLE public.attribute_categories (
  key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  options TEXT[] NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

ALTER TABLE public.attribute_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read attribute categories" ON public.attribute_categories
  FOR SELECT USING (true);

-- User attribute selections
CREATE TABLE public.user_attributes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  attribute_key TEXT NOT NULL REFERENCES public.attribute_categories(key) ON DELETE CASCADE,
  attribute_value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, attribute_key, attribute_value)
);

CREATE INDEX idx_user_attributes_user ON public.user_attributes(user_id);

ALTER TABLE public.user_attributes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read user attributes" ON public.user_attributes
  FOR SELECT USING (true);
CREATE POLICY "Authenticated insert own attributes" ON public.user_attributes
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Authenticated delete own attributes" ON public.user_attributes
  FOR DELETE USING (user_id = (select auth.uid()));

-- Write access to attribute_categories: migration-only (no INSERT/UPDATE/DELETE policies by design)

-- Atomic replace: delete all values for a category then insert new ones in one transaction
CREATE OR REPLACE FUNCTION public.replace_user_attributes(
  p_user_id UUID,
  p_attribute_key TEXT,
  p_values TEXT[]
) RETURNS void AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  DELETE FROM public.user_attributes
  WHERE user_id = p_user_id AND attribute_key = p_attribute_key;

  IF array_length(p_values, 1) > 0 THEN
    INSERT INTO public.user_attributes (user_id, attribute_key, attribute_value)
    SELECT p_user_id, p_attribute_key, unnest(p_values);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Seed attribute categories for nicotine pouches
INSERT INTO public.attribute_categories (key, label, options, sort_order) VALUES
  ('flavor_preference', 'Favorite Flavor', ARRAY['Mint', 'Citrus', 'Berry', 'Coffee', 'Tropical', 'Tobacco', 'Menthol', 'Other'], 1),
  ('strength_preference', 'Preferred Strength', ARRAY['Light', 'Normal', 'Strong', 'Extra Strong'], 2),
  ('brand_preference', 'Favorite Brand', ARRAY['ZYN', 'VELO', 'LOOP', 'ON!', 'ACE', 'XQS', 'VOLT', 'Helwit', 'Pablo', 'Killa', 'Other'], 3),
  ('usage_frequency', 'Usage Frequency', ARRAY['Daily', 'A few times a week', 'Occasional', 'New to pouches'], 4),
  ('format_preference', 'Format Preference', ARRAY['Slim', 'Mini', 'Regular', 'No preference'], 5);
