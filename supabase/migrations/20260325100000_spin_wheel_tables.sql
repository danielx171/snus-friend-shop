-- ============================================================
-- Spin Wheel tables: daily_spins, vouchers, spin_config
-- These tables were referenced in types.ts and the spin-wheel
-- edge function but never had a migration creating them.
-- ============================================================

-- 1. spin_config — admin-editable prize weights and settings
CREATE TABLE IF NOT EXISTS public.spin_config (
  key   TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.spin_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read spin config"
  ON public.spin_config FOR SELECT
  USING (true);

CREATE POLICY "Admins manage spin config"
  ON public.spin_config FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Seed default prize weights
INSERT INTO public.spin_config (key, value) VALUES
  ('prize_weights', '{"points_5": 35, "points_10": 25, "points_25": 15, "points_5b": 10, "points_50": 5, "voucher_15pct": 5, "free_can": 4, "free_month": 1}'::jsonb),
  ('clearance_sku', 'null'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 2. vouchers — prizes won from spin wheel or redeemed from points
CREATE TABLE IF NOT EXISTS public.vouchers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,          -- discount_pct, free_product, free_month
  value      JSONB NOT NULL,         -- e.g. {"percent": 15} or {"sku": "..."}
  status     TEXT NOT NULL DEFAULT 'active',  -- active, used, expired
  source     TEXT NOT NULL DEFAULT 'spin_wheel',
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own vouchers"
  ON public.vouchers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages vouchers"
  ON public.vouchers FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_vouchers_user_id ON public.vouchers(user_id);
CREATE INDEX idx_vouchers_status ON public.vouchers(status) WHERE status = 'active';

-- 3. daily_spins — one spin per user per day
CREATE TABLE IF NOT EXISTS public.daily_spins (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spin_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  prize_key  TEXT,
  prize_value JSONB,
  spun_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enforce one spin per user per day
ALTER TABLE public.daily_spins
  ADD CONSTRAINT daily_spins_user_date_unique UNIQUE (user_id, spin_date);

ALTER TABLE public.daily_spins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own spins"
  ON public.daily_spins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages spins"
  ON public.daily_spins FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_daily_spins_user_date ON public.daily_spins(user_id, spin_date);
