-- Ledger that guards the 50-SnusCoin review reward against double-award.
-- UNIQUE (user_id, product_id) blocks a user from earning the reward
-- more than once per product even if they delete + re-submit a review.
-- product_reviews itself has no UNIQUE constraint (users can submit
-- multiple reviews per product) — this ledger is the single source of
-- reward-eligibility truth.

CREATE TABLE IF NOT EXISTS public.review_rewards (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  text NOT NULL,
  points      integer NOT NULL DEFAULT 50,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_review_rewards_user
  ON public.review_rewards (user_id);

ALTER TABLE public.review_rewards ENABLE ROW LEVEL SECURITY;
-- No RLS policies — service_role only. Users never write directly.
