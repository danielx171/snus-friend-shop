-- Achievements System
-- Multi-step achievement badges with progress tracking and points rewards

-- 1. Enum types (safe creation with DO/EXCEPTION blocks)
do $$ begin
  create type public.achievement_category as enum (
    'reviews', 'orders', 'community', 'referrals', 'milestone'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.achievement_tier as enum (
    'bronze', 'silver', 'gold', 'diamond', 'single'
  );
exception when duplicate_object then null;
end $$;

-- 2. achievements table
create table if not exists public.achievements (
  id            uuid        primary key default gen_random_uuid(),
  slug          text        unique not null,
  category      public.achievement_category not null,
  tier          public.achievement_tier     not null,
  title         text        not null,
  description   text        not null,
  icon          text        not null default 'trophy',
  threshold     integer     not null,
  points_reward integer     not null default 0,
  sort_order    integer     not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.achievements enable row level security;

create policy "achievements_public_read"
  on public.achievements for select
  using (true);

-- 3. user_achievements table
create table if not exists public.user_achievements (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users(id) on delete cascade,
  achievement_id uuid        not null references public.achievements(id) on delete cascade,
  progress       integer     not null default 0,
  unlocked_at    timestamptz,
  created_at     timestamptz not null default now(),
  unique (user_id, achievement_id)
);

alter table public.user_achievements enable row level security;

create policy "user_achievements_own_read"
  on public.user_achievements for select
  using (auth.uid() = user_id);

create policy "user_achievements_own_insert"
  on public.user_achievements for insert
  with check (auth.uid() = user_id);

create policy "user_achievements_own_update"
  on public.user_achievements for update
  using (auth.uid() = user_id);

-- 4. Seed 20 achievements
insert into public.achievements (slug, category, tier, title, description, icon, threshold, points_reward, sort_order) values
  -- Reviews (4)
  ('reviews_bronze',  'reviews', 'bronze',  'First Review',       'Write your first product review',                     'pencil', 1,  25,  10),
  ('reviews_silver',  'reviews', 'silver',  'Review Regular',     'Write 10 product reviews',                            'pencil', 10, 75,  11),
  ('reviews_gold',    'reviews', 'gold',    'Review Expert',      'Write 25 product reviews',                            'pencil', 25, 200, 12),
  ('reviews_diamond', 'reviews', 'diamond', 'Review Legend',      'Write 50 product reviews',                            'pencil', 50, 500, 13),

  -- Orders (4)
  ('orders_bronze',   'orders',  'bronze',  'First Order',        'Place your first order',                              'package', 1,  25,  20),
  ('orders_silver',   'orders',  'silver',  'Regular Buyer',      'Place 10 orders',                                     'package', 10, 75,  21),
  ('orders_gold',     'orders',  'gold',    'Loyal Customer',     'Place 25 orders',                                     'package', 25, 200, 22),
  ('orders_diamond',  'orders',  'diamond', 'VIP Shopper',        'Place 50 orders',                                     'package', 50, 500, 23),

  -- Community (4)
  ('community_bronze',  'community', 'bronze',  'Newcomer',       'Make your first community post or comment',           'message-circle', 1,  25,  30),
  ('community_silver',  'community', 'silver',  'Active Member',  'Make 10 community posts or comments',                 'message-circle', 10, 75,  31),
  ('community_gold',    'community', 'gold',    'Community Star', 'Make 25 community posts or comments',                 'message-circle', 25, 200, 32),
  ('community_diamond', 'community', 'diamond', 'Community Icon', 'Make 50 community posts or comments',                 'message-circle', 50, 500, 33),

  -- Referrals (4)
  ('referrals_bronze',  'referrals', 'bronze',  'First Referral',   'Refer your first friend',                          'users', 1,  50,  40),
  ('referrals_silver',  'referrals', 'silver',  'Referral Pro',     'Refer 5 friends',                                  'users', 5,  150, 41),
  ('referrals_gold',    'referrals', 'gold',    'Referral Expert',  'Refer 15 friends',                                 'users', 15, 400, 42),
  ('referrals_diamond', 'referrals', 'diamond', 'Referral Legend',  'Refer 30 friends',                                 'users', 30, 1000, 43),

  -- Milestones (4)
  ('milestone_first_spin',    'milestone', 'single', 'Lucky Spinner',    'Spin the wheel for the first time',           'disc',           1, 10, 50),
  ('milestone_quiz_complete', 'milestone', 'single', 'Quiz Master',      'Complete the flavour profile quiz',           'clipboard-check', 1, 25, 51),
  ('milestone_profile_setup', 'milestone', 'single', 'All Set Up',       'Complete your profile setup',                 'user-check',     1, 15, 52),
  ('milestone_streak_7',      'milestone', 'single', 'Week Streak',      'Log in 7 days in a row',                     'flame',          7, 50, 53)

on conflict (slug) do nothing;

-- 5. Update leaderboard view to include reputation data
create or replace view public.leaderboard_top_users as
select
  pb.user_id,
  pb.balance as total_points,
  up.display_name,
  a.image_url as avatar_url,
  rl.name     as level_name,
  rl.badge_color
from public.points_balances pb
left join public.user_profiles up on up.user_id = pb.user_id
left join public.avatars a on a.id = up.avatar_id
left join public.user_reputation ur on ur.user_id = pb.user_id
left join public.reputation_levels rl on rl.level = ur.level
order by pb.balance desc
limit 50;

grant select on public.leaderboard_top_users to authenticated, anon;
