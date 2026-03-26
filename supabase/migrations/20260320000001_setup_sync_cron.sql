-- =====================================================================
-- Auto-sync: fan-out all Nyehandel pages every 4 hours via pg_cron
-- Requires pg_cron and pg_net extensions (enabled in Supabase by default)
--
-- After running this migration, insert config values:
--   INSERT INTO sync_config (key, value) VALUES
--     ('supabase_project_url', 'https://<project-ref>.supabase.co'),
--     ('sync_cron_secret', '<your-secret>');
-- =====================================================================

-- Enable required extensions
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Config table for sync settings (Supabase doesn't allow ALTER DATABASE SET)
create table if not exists sync_config (
  key   text primary key,
  value text not null
);

-- Helper: fire a single sync-nyehandel page request
create or replace function trigger_nyehandel_sync_page(page_num int)
returns void language plpgsql as $$
declare
  project_url text;
  cron_secret text;
begin
  select value into project_url from sync_config where key = 'supabase_project_url';
  select value into cron_secret from sync_config where key = 'sync_cron_secret';

  if project_url is null or cron_secret is null then
    raise notice 'sync-nyehandel: sync_config missing supabase_project_url or sync_cron_secret — skipping page %', page_num;
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
