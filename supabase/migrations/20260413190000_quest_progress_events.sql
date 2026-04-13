-- Ledger that guards quest-progress increments against double-counting.
-- Inserts are idempotent via UNIQUE (user_id, quest_id, external_ref).
-- update-quest-progress tries an insert before incrementing counters that
-- aren't already DB-derived (reviews, spins, and a belt-and-braces guard
-- on orders even though orderCount is computed from the orders table).

CREATE TABLE IF NOT EXISTS public.quest_progress_events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id      text NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  external_ref  text NOT NULL,
  action        text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, quest_id, external_ref)
);

CREATE INDEX IF NOT EXISTS idx_quest_progress_events_user_quest
  ON public.quest_progress_events (user_id, quest_id);

ALTER TABLE public.quest_progress_events ENABLE ROW LEVEL SECURITY;

-- Only service_role writes. Users never directly read or write this ledger.
-- No RLS policies means authenticated clients see nothing — which is correct.
