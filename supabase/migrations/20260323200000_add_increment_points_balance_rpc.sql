-- Atomic points balance increment function
-- Avoids race condition where read-then-write can overwrite concurrent updates
-- Already applied to production via Supabase MCP on 2026-03-23
CREATE OR REPLACE FUNCTION increment_points_balance(p_user_id uuid, p_points int)
RETURNS void AS $$
BEGIN
  INSERT INTO points_balances (user_id, balance)
  VALUES (p_user_id, p_points)
  ON CONFLICT (user_id)
  DO UPDATE SET balance = points_balances.balance + p_points;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
