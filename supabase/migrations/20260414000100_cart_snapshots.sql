-- Reproduced from live DB 2026-04-14 — NOT applied via MCP, table already exists.
-- Purpose: make cart_snapshots schema reproducible from code for staging/forks.
-- Powers the Abandoned Cart flow: save-cart-snapshot + check-abandoned-carts (daily cron).

CREATE TABLE IF NOT EXISTS public.cart_snapshots (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_email text,
  cart_data   jsonb NOT NULL,
  cart_total  numeric NOT NULL DEFAULT 0,
  item_count  integer NOT NULL DEFAULT 0,
  recovered   boolean NOT NULL DEFAULT false,
  email_sent  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cart_snapshots_user
  ON public.cart_snapshots (user_id)
  WHERE user_id IS NOT NULL;

-- Drives the nightly abandoned-cart scan: only rows that are un-recovered and
-- have no outbound email yet, ordered by staleness.
CREATE INDEX IF NOT EXISTS idx_cart_snapshots_abandoned
  ON public.cart_snapshots (updated_at, email_sent)
  WHERE recovered = false AND email_sent = false;

ALTER TABLE public.cart_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
  ON public.cart_snapshots FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Users can manage own cart snapshots"
  ON public.cart_snapshots FOR ALL
  USING (auth.uid() = user_id);
