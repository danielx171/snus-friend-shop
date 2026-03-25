-- Membership tiers & user memberships
-- Tracks lifetime points and auto-upgrades tier on points_transactions insert

-- ─── membership_tiers ───
create table if not exists public.membership_tiers (
  id          text primary key,
  name        text not null,
  min_points_lifetime integer not null default 0,
  benefits    jsonb default '[]'::jsonb,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

alter table public.membership_tiers enable row level security;

create policy "Anyone can read tiers"
  on public.membership_tiers for select
  using (true);

-- ─── user_memberships ───
create table if not exists public.user_memberships (
  user_id         uuid primary key references auth.users on delete cascade,
  tier_id         text not null references public.membership_tiers(id) default 'member',
  lifetime_points integer not null default 0,
  tier_updated_at timestamptz default now(),
  created_at      timestamptz default now()
);

alter table public.user_memberships enable row level security;

create policy "Users can read own membership"
  on public.user_memberships for select
  using (auth.uid() = user_id);

-- Allow the trigger function to insert/update (runs as SECURITY DEFINER)
-- No insert/update policy needed for end users — only the trigger writes.

-- ─── Seed tiers ───
insert into public.membership_tiers (id, name, min_points_lifetime, benefits, sort_order) values
  ('member', 'Member', 0,
   '["5% discount on all orders","Monthly mystery box (5 cans)","Early access to new drops","Member-only flash sales","Free shipping on all orders"]'::jsonb,
   0),
  ('vip', 'VIP', 2000,
   '["10% discount on all orders","Premium mystery box (10 cans)","Exclusive vendor merchandise access","Early access to new drops","VIP-only limited editions","Free shipping on all orders","Priority customer support"]'::jsonb,
   1)
on conflict (id) do nothing;

-- ─── Trigger: update lifetime_points & check tier upgrade ───
create or replace function public.handle_points_transaction_membership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new_lifetime integer;
  v_best_tier    text;
begin
  -- Only act on positive point transactions (earnings, not redemptions)
  if NEW.points <= 0 then
    return NEW;
  end if;

  -- Upsert user_memberships row, adding the new points to lifetime total
  insert into public.user_memberships (user_id, lifetime_points, tier_id, tier_updated_at)
  values (NEW.user_id, NEW.points, 'member', now())
  on conflict (user_id) do update
    set lifetime_points = user_memberships.lifetime_points + NEW.points;

  -- Read back updated lifetime
  select lifetime_points into v_new_lifetime
  from public.user_memberships
  where user_id = NEW.user_id;

  -- Find the best tier the user qualifies for
  select id into v_best_tier
  from public.membership_tiers
  where min_points_lifetime <= v_new_lifetime
  order by min_points_lifetime desc
  limit 1;

  -- Upgrade tier if better one found
  if v_best_tier is not null then
    update public.user_memberships
    set tier_id = v_best_tier,
        tier_updated_at = now()
    where user_id = NEW.user_id
      and tier_id is distinct from v_best_tier;
  end if;

  return NEW;
end;
$$;

create trigger trg_points_transaction_membership
  after insert on public.points_transactions
  for each row
  execute function public.handle_points_transaction_membership();
