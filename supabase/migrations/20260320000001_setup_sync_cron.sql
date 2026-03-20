-- =====================================================================
-- Auto-sync: fan-out all Nyehandel pages every 4 hours via pg_cron
-- Requires pg_cron and pg_net extensions (enabled in Supabase by default)
--
-- Before running, set these per-project settings in the Supabase Dashboard
-- (Settings → Database → Configuration → Extra options):
--   ALTER DATABASE postgres SET app.supabase_project_url = 'https://<project-ref>.supabase.co';
--   ALTER DATABASE postgres SET app.sync_cron_secret = '<your-secret>';
-- =====================================================================

-- Enable required extensions
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Helper: fire a single sync-nyehandel page request
create or replace function trigger_nyehandel_sync_page(page_num int)
returns void language plpgsql as $$
declare
  project_url text := current_setting('app.supabase_project_url', true);
  cron_secret  text := current_setting('app.sync_cron_secret', true);
begin
  if project_url is null or cron_secret is null then
    raise notice 'sync-nyehandel: app.supabase_project_url or app.sync_cron_secret not set — skipping page %', page_num;
    return;
  end if;

  perform net.http_post(
    url     := project_url || '/functions/v1/sync-nyehandel?page=' || page_num,
    headers := jsonb_build_object(
      'Content-Type',   'application/json',
      'x-cron-secret',  cron_secret
    ),
    body    := '{}'::jsonb
  );
end;
$$;

-- Main fan-out function: fires pages 1..89 concurrently (non-blocking)
create or replace function trigger_nyehandel_sync_all()
returns void language plpgsql as $$
declare
  i int;
begin
  for i in 1..89 loop
    perform trigger_nyehandel_sync_page(i);
  end loop;
end;
$$;

-- Schedule: every 4 hours at :15 (stagger away from the top of the hour)
select cron.schedule(
  'sync-nyehandel-every-4h',
  '15 */4 * * *',
  'select trigger_nyehandel_sync_all()'
);
