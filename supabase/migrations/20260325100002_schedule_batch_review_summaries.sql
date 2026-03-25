-- ============================================================
-- Schedule nightly batch review summary regeneration at 03:00 UTC
-- Uses pg_cron + pg_net to call batch-review-summaries edge function
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;

-- Remove existing job if present (idempotent)
SELECT cron.unschedule(jobid)
  FROM cron.job
 WHERE jobname = 'batch-review-summaries-nightly';

-- Schedule: every day at 03:00 UTC
SELECT cron.schedule(
  'batch-review-summaries-nightly',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'SUPABASE_FUNCTIONS_BASE_URL' ORDER BY created_at DESC LIMIT 1) || '/functions/v1/batch-review-summaries',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'CRON_SECRET' ORDER BY created_at DESC LIMIT 1)
    ),
    body := '{}'::jsonb
  );
  $$
);
