-- ============================================================
-- Migration: SnusPoints loyalty system + Supabase audit fixes
-- ============================================================

-- --------------------------------------------------------
-- Part A: Add user_id to orders (required for SnusPoints)
-- --------------------------------------------------------
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- --------------------------------------------------------
-- Part B: SnusPoints tables
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS points_balances (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INT NOT NULL DEFAULT 0 CHECK (balance >= 0),
  lifetime_earned INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE points_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own balance"
  ON points_balances FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE TABLE IF NOT EXISTS points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  points INT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_points_tx_user ON points_transactions(user_id);
CREATE UNIQUE INDEX idx_points_tx_order ON points_transactions(order_id)
  WHERE reason = 'order_confirmed';

ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own transactions"
  ON points_transactions FOR SELECT
  USING ((select auth.uid()) = user_id);

-- --------------------------------------------------------
-- Part C: Award points trigger (fires on 'confirmed')
-- --------------------------------------------------------

CREATE OR REPLACE FUNCTION award_points_for_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  pts INT;
BEGIN
  IF NEW.checkout_status = 'confirmed'
     AND (OLD.checkout_status IS DISTINCT FROM 'confirmed')
     AND NEW.user_id IS NOT NULL
  THEN
    pts := floor(NEW.total_price * 10);  -- 10 points per €1

    -- Insert transaction (unique index prevents duplicates)
    INSERT INTO points_transactions (user_id, order_id, points, reason)
    VALUES (NEW.user_id, NEW.id, pts, 'order_confirmed')
    ON CONFLICT DO NOTHING;

    -- Upsert balance
    INSERT INTO points_balances (user_id, balance, lifetime_earned)
    VALUES (NEW.user_id, pts, pts)
    ON CONFLICT (user_id) DO UPDATE
      SET balance = points_balances.balance + EXCLUDED.balance,
          lifetime_earned = points_balances.lifetime_earned + EXCLUDED.lifetime_earned,
          updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_award_points
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION award_points_for_order();

-- --------------------------------------------------------
-- Part D: Audit fixes — RLS policy performance
-- Fix all admin policies to use (select auth.uid()) wrapper
-- Also drop redundant read policies where ALL already covers SELECT
-- --------------------------------------------------------

-- 1. orders: replace old raw_user_meta_data policy with has_role()
DROP POLICY IF EXISTS "Admins have full access to orders" ON orders;
CREATE POLICY "Admins have full access to orders"
  ON orders FOR ALL
  USING (has_role((select auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

-- Add user self-read policy on orders
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING ((select auth.uid()) = user_id);

-- 2. brands
DROP POLICY IF EXISTS "Admins can manage brands" ON brands;
CREATE POLICY "Admins can manage brands"
  ON brands FOR ALL
  USING (has_role((select auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

-- 3. products
DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (has_role((select auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

-- 4. product_variants
DROP POLICY IF EXISTS "Admins can manage variants" ON product_variants;
CREATE POLICY "Admins can manage variants"
  ON product_variants FOR ALL
  USING (has_role((select auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

-- 5. inventory
DROP POLICY IF EXISTS "Admins can manage inventory" ON inventory;
CREATE POLICY "Admins can manage inventory"
  ON inventory FOR ALL
  USING (has_role((select auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

-- 6. user_roles: fix admin policy + own-roles policy
DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;
CREATE POLICY "Admins can manage roles"
  ON user_roles FOR ALL
  USING (has_role((select auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
-- (redundant: ALL policy already covers SELECT for admins)

DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
CREATE POLICY "Users can view own roles"
  ON user_roles FOR SELECT
  USING ((select auth.uid()) = user_id);

-- 7. ops_alerts: fix admin policy, drop redundant read
DROP POLICY IF EXISTS "Admins can manage ops_alerts" ON ops_alerts;
CREATE POLICY "Admins can manage ops_alerts"
  ON ops_alerts FOR ALL
  USING (has_role((select auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can read ops_alerts" ON ops_alerts;

-- 8. sku_mappings: fix admin policy, drop redundant read
DROP POLICY IF EXISTS "Admins can manage sku_mappings" ON sku_mappings;
CREATE POLICY "Admins can manage sku_mappings"
  ON sku_mappings FOR ALL
  USING (has_role((select auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can read sku_mappings" ON sku_mappings;

-- 9. sync_runs: fix admin policy, drop redundant read
DROP POLICY IF EXISTS "Admins can manage sync_runs" ON sync_runs;
CREATE POLICY "Admins can manage sync_runs"
  ON sync_runs FOR ALL
  USING (has_role((select auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can read sync_runs" ON sync_runs;

-- 10. webhook_inbox: fix admin policy, drop redundant read
DROP POLICY IF EXISTS "Admins can manage webhook_inbox" ON webhook_inbox;
CREATE POLICY "Admins can manage webhook_inbox"
  ON webhook_inbox FOR ALL
  USING (has_role((select auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can read webhook_inbox" ON webhook_inbox;

-- --------------------------------------------------------
-- Part E: Audit fixes — duplicate/unused indexes
-- --------------------------------------------------------

-- Drop duplicate indexes
DROP INDEX IF EXISTS idx_products_nyehandel_unique;
DROP INDEX IF EXISTS webhook_inbox_received_at_idx;

-- Add missing FK index
CREATE INDEX IF NOT EXISTS idx_ops_alerts_source_order ON ops_alerts(source_order_id);
