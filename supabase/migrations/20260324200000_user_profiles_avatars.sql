-- Avatars catalog
CREATE TABLE public.avatars (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  unlock_type TEXT NOT NULL DEFAULT 'default' CHECK (unlock_type IN ('default','spend','reviews','social','orders')),
  unlock_threshold INT NOT NULL DEFAULT 0,
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common','rare','epic','legendary')),
  sort_order INT NOT NULL DEFAULT 0
);

ALTER TABLE public.avatars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read avatars" ON public.avatars FOR SELECT USING (true);

-- User profiles
CREATE TABLE public.user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_id TEXT NOT NULL DEFAULT 'rookie' REFERENCES public.avatars(id),
  bio TEXT CHECK (char_length(bio) <= 160),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.user_profiles FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- Avatar unlocks junction
CREATE TABLE public.user_avatar_unlocks (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  avatar_id TEXT NOT NULL REFERENCES public.avatars(id),
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, avatar_id)
);

ALTER TABLE public.user_avatar_unlocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own unlocks" ON public.user_avatar_unlocks FOR SELECT USING (user_id = (select auth.uid()));

-- Seed starter avatars
INSERT INTO public.avatars (id, name, image_url, unlock_type, unlock_threshold, rarity, sort_order) VALUES
  ('rookie', 'Rookie', '/avatars/rookie.svg', 'default', 0, 'common', 1),
  ('pouch-fan', 'Pouch Fan', '/avatars/pouch-fan.svg', 'default', 0, 'common', 2),
  ('nicotine-newbie', 'Nicotine Newbie', '/avatars/nicotine-newbie.svg', 'default', 0, 'common', 3);

-- Seed unlockable avatars
INSERT INTO public.avatars (id, name, image_url, unlock_type, unlock_threshold, rarity, sort_order) VALUES
  ('zyn-warrior', 'ZYN Warrior', '/avatars/zyn-warrior.svg', 'orders', 5, 'rare', 10),
  ('cuba-princess', 'Cuba Princess', '/avatars/cuba-princess.svg', 'reviews', 10, 'rare', 11),
  ('velo-viking', 'VELO Viking', '/avatars/velo-viking.svg', 'spend', 1000, 'epic', 20),
  ('mint-master', 'Mint Master', '/avatars/mint-master.svg', 'orders', 3, 'rare', 12),
  ('brand-explorer', 'Brand Explorer', '/avatars/brand-explorer.svg', 'orders', 5, 'epic', 21),
  ('snus-king', 'Snus King', '/avatars/snus-king.svg', 'orders', 50, 'legendary', 30);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'first_name', 'SnusFriend'));
  INSERT INTO public.user_avatar_unlocks (user_id, avatar_id)
  SELECT NEW.id, id FROM public.avatars WHERE unlock_type = 'default';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();
