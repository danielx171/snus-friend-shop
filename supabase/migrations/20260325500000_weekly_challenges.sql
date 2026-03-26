-- Weekly Challenges: time-limited group goals for the gamification system
-- F3 feature — adds weekly_challenges + challenge_participants tables

/* ------------------------------------------------------------------ */
/*  Enum                                                               */
/* ------------------------------------------------------------------ */

CREATE TYPE public.challenge_type AS ENUM (
  'review_count',
  'order_count',
  'community_posts',
  'referral_count'
);

/* ------------------------------------------------------------------ */
/*  weekly_challenges                                                   */
/* ------------------------------------------------------------------ */

CREATE TABLE public.weekly_challenges (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text NOT NULL DEFAULT '',
  challenge_type public.challenge_type NOT NULL,
  target_value   int NOT NULL CHECK (target_value > 0),
  reward_points  int NOT NULL DEFAULT 0 CHECK (reward_points >= 0),
  starts_at   timestamptz NOT NULL,
  ends_at     timestamptz NOT NULL,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ends_after_starts CHECK (ends_at > starts_at)
);

ALTER TABLE public.weekly_challenges ENABLE ROW LEVEL SECURITY;

-- Anyone can read challenges
CREATE POLICY "Anyone can read weekly challenges"
  ON public.weekly_challenges FOR SELECT
  USING (true);

/* ------------------------------------------------------------------ */
/*  challenge_participants                                              */
/* ------------------------------------------------------------------ */

CREATE TABLE public.challenge_participants (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES public.weekly_challenges(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progress     int NOT NULL DEFAULT 0 CHECK (progress >= 0),
  completed_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (challenge_id, user_id)
);

ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read their own participation
CREATE POLICY "Users can read own challenge participation"
  ON public.challenge_participants FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can join challenges (insert)
CREATE POLICY "Users can join challenges"
  ON public.challenge_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own progress
CREATE POLICY "Users can update own challenge progress"
  ON public.challenge_participants FOR UPDATE
  USING (auth.uid() = user_id);

/* ------------------------------------------------------------------ */
/*  Indexes                                                            */
/* ------------------------------------------------------------------ */

CREATE INDEX idx_weekly_challenges_active
  ON public.weekly_challenges (is_active, starts_at, ends_at);

CREATE INDEX idx_challenge_participants_user
  ON public.challenge_participants (user_id, challenge_id);

/* ------------------------------------------------------------------ */
/*  Seed data: two example challenges                                   */
/* ------------------------------------------------------------------ */

INSERT INTO public.weekly_challenges (title, description, challenge_type, target_value, reward_points, starts_at, ends_at, is_active)
VALUES
  (
    'Review Rush',
    'Write 5 product reviews this week and earn bonus SnusPoints!',
    'review_count',
    5,
    150,
    date_trunc('week', now()),
    date_trunc('week', now()) + interval '7 days',
    true
  ),
  (
    'Community Champion',
    'Post 3 times on the community board to earn bonus SnusPoints!',
    'community_posts',
    3,
    100,
    date_trunc('week', now()),
    date_trunc('week', now()) + interval '7 days',
    true
  );
