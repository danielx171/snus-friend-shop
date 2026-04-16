-- Baseline the live SEO audit tables exactly as they exist in production.
-- Notes:
-- - Uniqueness is enforced by indexes with live names, including the *_pkey
--   indexes, rather than by declared PRIMARY KEY constraints.
-- - This migration is forward-only and only creates missing tables, indexes,
--   and policies to preserve repo/live parity without altering live columns.

BEGIN;

CREATE TABLE IF NOT EXISTS public.seo_config (
  key text NOT NULL,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_keywords (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  category text,
  priority integer DEFAULT 5,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_rank_tracking (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  position integer,
  url_found text,
  search_results jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_pagespeed_audits (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  url text NOT NULL,
  device text NOT NULL,
  performance_score integer,
  accessibility_score integer,
  best_practices_score integer,
  seo_score integer,
  lcp_ms numeric,
  fid_ms numeric,
  cls numeric,
  inp_ms numeric,
  ttfb_ms numeric,
  raw_data jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_gsc_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  query text,
  page text,
  clicks integer DEFAULT 0,
  impressions integer DEFAULT 0,
  ctr numeric,
  position numeric,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS seo_config_pkey
  ON public.seo_config USING btree (key);

CREATE UNIQUE INDEX IF NOT EXISTS seo_keywords_pkey
  ON public.seo_keywords USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS seo_keywords_keyword_key
  ON public.seo_keywords USING btree (keyword);

CREATE UNIQUE INDEX IF NOT EXISTS seo_rank_tracking_pkey
  ON public.seo_rank_tracking USING btree (id);
CREATE INDEX IF NOT EXISTS idx_rank_keyword_date
  ON public.seo_rank_tracking USING btree (keyword, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS seo_pagespeed_audits_pkey
  ON public.seo_pagespeed_audits USING btree (id);
CREATE INDEX IF NOT EXISTS idx_pagespeed_url_date
  ON public.seo_pagespeed_audits USING btree (url, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS seo_gsc_stats_pkey
  ON public.seo_gsc_stats USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_gsc_stats_unique
  ON public.seo_gsc_stats USING btree (query, page, date);
CREATE INDEX IF NOT EXISTS idx_gsc_stats_date
  ON public.seo_gsc_stats USING btree (date DESC);

ALTER TABLE public.seo_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_rank_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_pagespeed_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_gsc_stats ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'seo_config'
      AND policyname = 'Admin all config'
  ) THEN
    CREATE POLICY "Admin all config"
      ON public.seo_config
      FOR ALL
      TO public
      USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'seo_keywords'
      AND policyname = 'Admin all keywords'
  ) THEN
    CREATE POLICY "Admin all keywords"
      ON public.seo_keywords
      FOR ALL
      TO public
      USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'seo_rank_tracking'
      AND policyname = 'Admin read rank'
  ) THEN
    CREATE POLICY "Admin read rank"
      ON public.seo_rank_tracking
      FOR SELECT
      TO public
      USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'seo_pagespeed_audits'
      AND policyname = 'Admin read pagespeed'
  ) THEN
    CREATE POLICY "Admin read pagespeed"
      ON public.seo_pagespeed_audits
      FOR SELECT
      TO public
      USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'seo_gsc_stats'
      AND policyname = 'Admin read gsc'
  ) THEN
    CREATE POLICY "Admin read gsc"
      ON public.seo_gsc_stats
      FOR SELECT
      TO public
      USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
  END IF;
END
$$;

COMMIT;
