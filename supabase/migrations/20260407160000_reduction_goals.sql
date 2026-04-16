-- Nicotine reduction tracking — users set step-down goals
CREATE TABLE IF NOT EXISTS reduction_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  current_mg NUMERIC(5,1) NOT NULL,
  target_mg NUMERIC(5,1) NOT NULL DEFAULT 0,
  step_interval_days INT NOT NULL DEFAULT 30,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  next_step_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reduction_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own goals"
  ON reduction_goals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
