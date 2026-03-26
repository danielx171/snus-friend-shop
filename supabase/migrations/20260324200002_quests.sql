CREATE TABLE public.quests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  quest_type TEXT NOT NULL CHECK (quest_type IN ('orders','reviews','spend','brands','products','spins')),
  target_value INT NOT NULL,
  time_limit_days INT,
  reward_points INT NOT NULL DEFAULT 0,
  reward_avatar_id TEXT REFERENCES public.avatars(id),
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0
);

ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active quests" ON public.quests FOR SELECT USING (active);

CREATE TABLE public.user_quest_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL REFERENCES public.quests(id),
  current_value INT NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE (user_id, quest_id)
);

CREATE INDEX idx_quest_progress_user ON public.user_quest_progress(user_id) WHERE NOT completed;

ALTER TABLE public.user_quest_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own quest progress" ON public.user_quest_progress
  FOR SELECT USING (user_id = (select auth.uid()));

INSERT INTO public.quests (id, title, description, quest_type, target_value, reward_points, reward_avatar_id, sort_order) VALUES
  ('first-order', 'First Order', 'Place your first order', 'orders', 1, 25, 'pouch-fan', 1),
  ('brand-explorer', 'Brand Explorer', 'Order from 3 different brands', 'brands', 3, 100, NULL, 2),
  ('review-champion', 'Review Champion', 'Write 5 product reviews', 'reviews', 5, 150, 'cuba-princess', 3),
  ('mint-master', 'Mint Master', 'Buy 3 different mint products', 'products', 3, 75, 'mint-master', 4),
  ('big-spender', 'Big Spender', 'Spend over 1000 SEK', 'spend', 1000, 200, 'velo-viking', 5),
  ('daily-devotee', 'Daily Devotee', 'Spin the wheel 7 days in a row', 'spins', 7, 50, NULL, 6);
