-- Nicotine reduction gamification: quests + achievements
-- Safe to re-run (ON CONFLICT DO NOTHING / IF NOT EXISTS)

-- 1. Expand quest_type CHECK to include reduction-related types
ALTER TABLE public.quests
  DROP CONSTRAINT IF EXISTS quests_quest_type_check;

ALTER TABLE public.quests
  ADD CONSTRAINT quests_quest_type_check
  CHECK (quest_type IN ('orders','reviews','spend','brands','products','spins','reduction','nicotine_free'));

-- 2. Add 'reduction' to achievement_category enum (safe if already exists)
DO $$ BEGIN
  ALTER TYPE public.achievement_category ADD VALUE IF NOT EXISTS 'reduction';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. Seed reduction quests
INSERT INTO public.quests (id, title, description, quest_type, target_value, reward_points, sort_order) VALUES
  ('step-down',           'Step Down',            'Order products at a lower strength tier than your usual',  'reduction',     1, 100, 10),
  ('nicotine-free-explorer', 'Nicotine-Free Explorer', 'Try a nicotine-free pouch',                          'nicotine_free', 1,  50, 11)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed reduction achievements (tiered)
INSERT INTO public.achievements (slug, category, tier, title, description, icon, threshold, points_reward, sort_order) VALUES
  ('reduction_bronze', 'reduction', 'bronze', 'Reduction Champion', '1 month on a reduction plan',  'trending-down', 1, 50,  60),
  ('reduction_silver', 'reduction', 'silver', 'Reduction Champion', '3 months on a reduction plan', 'trending-down', 3, 150, 61),
  ('reduction_gold',   'reduction', 'gold',   'Reduction Champion', '6 months on a reduction plan', 'trending-down', 6, 300, 62)
ON CONFLICT (slug) DO NOTHING;

-- 5. Seed "Pioneer" achievement (community / single tier)
INSERT INTO public.achievements (slug, category, tier, title, description, icon, threshold, points_reward, sort_order) VALUES
  ('pioneer_suggestion', 'community', 'single', 'Pioneer', 'Have a feature suggestion shipped', 'lightbulb', 1, 200, 34)
ON CONFLICT (slug) DO NOTHING;
