-- F4: Reputation / Trust Levels
-- Visible reputation indicator based on lifetime SnusPoints earned

-- 1. reputation_levels table
create table if not exists public.reputation_levels (
  level   integer primary key,
  name    text    not null,
  min_points integer not null,
  badge_color text not null,
  perks   jsonb   not null default '[]'::jsonb
);

-- Enable RLS
alter table public.reputation_levels enable row level security;

-- Public read access
create policy "reputation_levels_public_read"
  on public.reputation_levels for select
  using (true);

-- 2. Seed levels
insert into public.reputation_levels (level, name, min_points, badge_color, perks) values
  (1, 'Newcomer',   0,    'gray',   '["Welcome spin bonus"]'::jsonb),
  (2, 'Regular',    100,  'blue',   '["Community posting", "Review reactions"]'::jsonb),
  (3, 'Enthusiast', 500,  'green',  '["Custom avatar border", "Early sale access"]'::jsonb),
  (4, 'Expert',     2000, 'purple', '["Double quest rewards", "Exclusive polls"]'::jsonb),
  (5, 'Legend',     5000, 'gold',   '["Gold badge", "VIP support", "Legend-only vouchers"]'::jsonb)
on conflict (level) do nothing;

-- 3. View: user_reputation
-- Joins points_balances with reputation_levels to determine current level
create or replace view public.user_reputation as
select
  pb.user_id,
  pb.lifetime_earned,
  rl.level,
  rl.name        as level_name,
  rl.badge_color,
  rl.perks,
  -- next level info (null for max level)
  nl.level       as next_level,
  nl.name        as next_level_name,
  nl.min_points  as next_level_min_points
from public.points_balances pb
join public.reputation_levels rl
  on rl.level = (
    select max(r2.level)
    from public.reputation_levels r2
    where r2.min_points <= pb.lifetime_earned
  )
left join public.reputation_levels nl
  on nl.level = rl.level + 1;

-- RLS not applicable to views directly; secure via underlying table RLS.
-- Grant authenticated read on the view.
grant select on public.user_reputation to authenticated;
