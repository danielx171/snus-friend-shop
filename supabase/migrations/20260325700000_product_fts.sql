-- Full-text search for products
-- Adds a generated tsvector column with GIN index for fast product search

-- 1. Add tsvector column (generated from name + manufacturer + description)
--    Note: brand lives in the brands table via brand_id FK, so we use
--    manufacturer (denormalized on products) for the tsvector column.
--    The RPC function joins brands to return the brand name in results.
alter table public.products
  add column if not exists fts tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(manufacturer, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) stored;

-- 2. Create GIN index for fast full-text queries
create index if not exists idx_products_fts on public.products using gin(fts);

-- 3. RPC function for full-text search with ranking
create or replace function public.search_products(query text, result_limit int default 20)
returns table (
  id uuid,
  name text,
  brand text,
  slug text,
  image_url text,
  description text,
  rank real
)
language sql
stable
as $$
  select
    p.id,
    p.name,
    b.name as brand,
    p.slug,
    p.image_url,
    p.description,
    ts_rank(p.fts, websearch_to_tsquery('english', query)) as rank
  from public.products p
  left join public.brands b on b.id = p.brand_id
  where p.fts @@ websearch_to_tsquery('english', query)
    and p.is_active = true
  order by rank desc
  limit result_limit;
$$;
