-- Retroactive migration for public.subscriptions.
--
-- This table was originally created via Supabase Studio UI and has been live
-- since the rewards/subscription launch. Adding the migration so the schema
-- is reproducible in fresh environments (e.g. preview branches, local dev).
-- All DDL is IF NOT EXISTS / idempotent so applying this to the existing
-- production database is a no-op.

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_slug    text NOT NULL,
  product_name    text NOT NULL DEFAULT '',
  pack_size       text NOT NULL DEFAULT 'pack1',
  quantity        integer NOT NULL DEFAULT 1,
  interval        text NOT NULL CHECK (interval IN ('monthly', '6monthly')),
  discount_pct    integer NOT NULL DEFAULT 10,
  status          text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  next_order_at   timestamptz NOT NULL,
  last_order_at   timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user
  ON public.subscriptions (user_id);

-- Partial index: the cron sweep only scans active rows that are due.
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_order
  ON public.subscriptions (next_order_at)
  WHERE status = 'active';

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can read own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can insert own subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can update own subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (auth.uid() = user_id);
