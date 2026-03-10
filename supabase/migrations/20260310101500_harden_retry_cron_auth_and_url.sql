-- Harden retry cron auth and remove hardcoded project URL.
-- Requires Vault secrets:
--   SUPABASE_FUNCTIONS_BASE_URL (e.g. https://<project-ref>.supabase.co)
--   SUPABASE_SERVICE_ROLE_KEY
--   RETRY_FAILED_ORDERS_SECRET

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;

DO $$
DECLARE
  existing_job_id bigint;
BEGIN
  SELECT jobid INTO existing_job_id
  FROM cron.job
  WHERE jobname = 'retry-failed-nyehandel-orders-hourly'
  LIMIT 1;

  IF existing_job_id IS NOT NULL THEN
    PERFORM cron.unschedule(existing_job_id);
  END IF;
END;
$$;

SELECT cron.schedule(
  'retry-failed-nyehandel-orders-hourly',
  '0 * * * *',
  $$
  WITH cfg AS (
    SELECT
      COALESCE((
        SELECT decrypted_secret
        FROM vault.decrypted_secrets
        WHERE name = 'SUPABASE_FUNCTIONS_BASE_URL'
        ORDER BY created_at DESC
        LIMIT 1
      ), '') AS base_url,
      COALESCE((
        SELECT decrypted_secret
        FROM vault.decrypted_secrets
        WHERE name = 'SUPABASE_SERVICE_ROLE_KEY'
        ORDER BY created_at DESC
        LIMIT 1
      ), '') AS service_role_key,
      COALESCE((
        SELECT decrypted_secret
        FROM vault.decrypted_secrets
        WHERE name = 'RETRY_FAILED_ORDERS_SECRET'
        ORDER BY created_at DESC
        LIMIT 1
      ), '') AS cron_secret
  )
  SELECT net.http_post(
    url := cfg.base_url || '/functions/v1/retry-failed-nyehandel-orders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || cfg.service_role_key,
      'apikey', cfg.service_role_key,
      'x-cron-secret', cfg.cron_secret
    ),
    body := '{}'::jsonb
  )
  FROM cfg
  WHERE cfg.base_url <> '' AND cfg.service_role_key <> '' AND cfg.cron_secret <> '';
  $$
);
