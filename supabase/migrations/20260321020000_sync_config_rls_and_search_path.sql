-- Enable RLS on sync_config (was exposed to PostgREST with no protection)
ALTER TABLE public.sync_config ENABLE ROW LEVEL SECURITY;
-- No public policies needed — only service_role (edge functions) accesses this table

-- Fix mutable search_path on sync trigger functions (security advisory)
ALTER FUNCTION public.trigger_nyehandel_sync_page SET search_path = public;
ALTER FUNCTION public.trigger_nyehandel_sync_all SET search_path = public;
