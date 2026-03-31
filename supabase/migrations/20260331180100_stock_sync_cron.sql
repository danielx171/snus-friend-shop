-- Schedule lightweight stock sync every 10 minutes
-- Uses same SYNC_CRON_SECRET as the full sync-nyehandel function
DO $$
DECLARE
  project_url text;
  cron_secret text;
BEGIN
  SELECT value INTO project_url FROM sync_config WHERE key = 'supabase_project_url';
  SELECT value INTO cron_secret FROM sync_config WHERE key = 'sync_cron_secret';

  IF project_url IS NULL OR cron_secret IS NULL THEN
    RAISE NOTICE 'sync_config missing supabase_project_url or sync_cron_secret — skipping stock sync cron setup';
    RETURN;
  END IF;

  -- Remove existing job if any
  BEGIN
    PERFORM cron.unschedule('sync-nye-stock-10min');
  EXCEPTION WHEN OTHERS THEN
    NULL; -- Job doesn't exist yet, that's fine
  END;

  PERFORM cron.schedule(
    'sync-nye-stock-10min',
    '*/10 * * * *',
    format(
      'SELECT net.http_post(url := %L, headers := %L::jsonb)',
      project_url || '/functions/v1/sync-nyehandel-stock',
      json_build_object('Content-Type', 'application/json', 'x-cron-secret', cron_secret)::text
    )
  );

  RAISE NOTICE 'Stock sync cron scheduled: every 10 minutes';
END $$;
