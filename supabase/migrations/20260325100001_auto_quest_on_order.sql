-- ============================================================
-- Migration: Auto-trigger quest progress when order is confirmed
-- Fires update-quest-progress edge function via pg_net
-- ============================================================

-- Ensure required extensions
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;

CREATE OR REPLACE FUNCTION trigger_quest_on_order_confirmed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  base_url     text;
  internal_key text;
BEGIN
  -- Only fire when checkout_status transitions to 'confirmed'
  IF NEW.checkout_status = 'confirmed'
     AND (OLD.checkout_status IS DISTINCT FROM 'confirmed')
     AND NEW.user_id IS NOT NULL
  THEN
    -- Read secrets from Supabase Vault
    SELECT decrypted_secret INTO base_url
      FROM vault.decrypted_secrets
     WHERE name = 'SUPABASE_FUNCTIONS_BASE_URL'
     ORDER BY created_at DESC
     LIMIT 1;

    SELECT decrypted_secret INTO internal_key
      FROM vault.decrypted_secrets
     WHERE name = 'INTERNAL_FUNCTIONS_SECRET'
     ORDER BY created_at DESC
     LIMIT 1;

    IF base_url IS NULL OR internal_key IS NULL THEN
      RAISE NOTICE 'trigger_quest_on_order_confirmed: missing vault secrets SUPABASE_FUNCTIONS_BASE_URL or INTERNAL_FUNCTIONS_SECRET — skipping for order %', NEW.id;
      RETURN NEW;
    END IF;

    -- Fire-and-forget HTTP call to update-quest-progress
    PERFORM net.http_post(
      url     := base_url || '/functions/v1/update-quest-progress',
      headers := jsonb_build_object(
        'Content-Type',                'application/json',
        'x-internal-function-secret',  internal_key
      ),
      body    := jsonb_build_object(
        'user_id', NEW.user_id::text,
        'action',  'order_placed'
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger on orders table
DROP TRIGGER IF EXISTS trg_quest_on_order_confirmed ON orders;
CREATE TRIGGER trg_quest_on_order_confirmed
  AFTER UPDATE ON orders
  FOR EACH ROW
  WHEN (NEW.checkout_status = 'confirmed')
  EXECUTE FUNCTION trigger_quest_on_order_confirmed();
