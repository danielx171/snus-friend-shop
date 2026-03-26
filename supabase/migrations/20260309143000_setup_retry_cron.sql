-- Schedule hourly retries for failed Nyehandel pushes.
-- Uses pg_cron + pg_net and local authorization via x-cron-secret header.

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;

-- Ensure idempotent migration: remove existing job with same name if present.
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

-- Requires a Vault secret named RETRY_FAILED_ORDERS_SECRET.
-- Create/update it out-of-band, e.g.:
--   SELECT vault.create_secret('your-secret', 'RETRY_FAILED_ORDERS_SECRET');
SELECT cron.schedule(
  'retry-failed-nyehandel-orders-hourly',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://bozdnoctcszbhemdjsek.supabase.co/functions/v1/retry-failed-nyehandel-orders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', COALESCE(
        (
          SELECT decrypted_secret
          FROM vault.decrypted_secrets
          WHERE name = 'RETRY_FAILED_ORDERS_SECRET'
          ORDER BY created_at DESC
          LIMIT 1
        ),
        ''
      )
    ),
    body := '{}'::jsonb
  );
  $$
);
