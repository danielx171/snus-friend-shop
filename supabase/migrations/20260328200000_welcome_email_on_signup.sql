-- ============================================================
-- Migration: Send welcome email when a new user signs up
-- Fires send-welcome-email edge function via pg_net
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;

CREATE OR REPLACE FUNCTION public.trigger_welcome_email_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  base_url     text;
  internal_key text;
  display_name text;
BEGIN
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
    RAISE NOTICE 'trigger_welcome_email_on_signup: missing vault secrets — skipping for user %', NEW.id;
    RETURN NEW;
  END IF;

  -- Extract display name from user metadata
  display_name := COALESCE(
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'full_name',
    'Friend'
  );

  -- Fire-and-forget HTTP call to send-welcome-email
  PERFORM net.http_post(
    url     := base_url || '/functions/v1/send-welcome-email',
    headers := jsonb_build_object(
      'Content-Type',                'application/json',
      'x-internal-function-secret',  internal_key
    ),
    body    := jsonb_build_object(
      'email',       NEW.email,
      'displayName', display_name
    )
  );

  RETURN NEW;
END;
$$;

-- Create trigger on auth.users — fires on INSERT only (new signups)
DROP TRIGGER IF EXISTS trg_welcome_email_on_signup ON auth.users;
CREATE TRIGGER trg_welcome_email_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_welcome_email_on_signup();
