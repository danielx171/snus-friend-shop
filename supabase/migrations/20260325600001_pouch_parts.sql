-- Pouch Character Builder
-- Parts library and per-user avatar composition table

-- 1. pouch_parts table
create table if not exists public.pouch_parts (
  id               uuid        primary key default gen_random_uuid(),
  category         text        not null check (category in ('shape', 'color', 'expression', 'accessory', 'background')),
  name             text        not null,
  svg_data         text        not null,
  unlock_condition text        not null default 'default',
  unlock_value     integer     not null default 0,
  rarity           text        not null default 'common' check (rarity in ('common', 'rare', 'epic', 'legendary')),
  sort_order       integer     not null default 0,
  created_at       timestamptz not null default now()
);

alter table public.pouch_parts enable row level security;

create policy "pouch_parts_public_read"
  on public.pouch_parts for select
  using (true);

-- 2. user_pouch_avatars table
create table if not exists public.user_pouch_avatars (
  user_id       uuid        primary key references auth.users(id) on delete cascade,
  shape_id      uuid        references public.pouch_parts(id),
  color_id      uuid        references public.pouch_parts(id),
  expression_id uuid        references public.pouch_parts(id),
  accessory_id  uuid        references public.pouch_parts(id),
  background_id uuid        references public.pouch_parts(id),
  updated_at    timestamptz not null default now()
);

alter table public.user_pouch_avatars enable row level security;

create policy "user_pouch_avatars_own_read"
  on public.user_pouch_avatars for select
  using (auth.uid() = user_id);

create policy "user_pouch_avatars_own_insert"
  on public.user_pouch_avatars for insert
  with check (auth.uid() = user_id);

create policy "user_pouch_avatars_own_update"
  on public.user_pouch_avatars for update
  using (auth.uid() = user_id);

-- 3. Seed 25 parts (5 per category)
insert into public.pouch_parts (category, name, svg_data, unlock_condition, unlock_value, rarity, sort_order) values

  -- Shapes
  ('shape', 'Classic Pouch', '<ellipse cx="50" cy="40" rx="40" ry="28" fill="currentColor" />', 'default', 0, 'common', 10),
  ('shape', 'Round Pouch',   '<circle cx="50" cy="40" r="35" fill="currentColor" />',             'default', 0, 'common', 11),
  ('shape', 'Slim Pouch',    '<rect x="15" y="22" width="70" height="36" rx="18" fill="currentColor" />', 'default', 0, 'common', 12),
  ('shape', 'Star Pouch',    '<polygon points="50,8 61,35 90,35 67,52 76,80 50,62 24,80 33,52 10,35 39,35" fill="currentColor" />', 'reputation:3', 3, 'rare', 13),
  ('shape', 'Diamond Pouch', '<polygon points="50,5 85,40 50,75 15,40" fill="currentColor" />',   'achievement:order_gold', 0, 'epic', 14),

  -- Colors (svg_data holds the hex value)
  ('color', 'Mint Green',    '#22c55e', 'default',       0, 'common',    20),
  ('color', 'Berry Purple',  '#a855f7', 'default',       0, 'common',    21),
  ('color', 'Citrus Orange', '#f97316', 'default',       0, 'common',    22),
  ('color', 'Ice Blue',      '#38bdf8', 'reputation:2',  2, 'rare',      23),
  ('color', 'Royal Gold',    '#eab308', 'reputation:4',  4, 'epic',      24),

  -- Expressions
  ('expression', 'Happy',
   '<circle cx="38" cy="36" r="4" fill="#1e293b" /><circle cx="62" cy="36" r="4" fill="#1e293b" /><path d="M36 52 Q50 62 64 52" stroke="#1e293b" stroke-width="3" fill="none" stroke-linecap="round" />',
   'default', 0, 'common', 30),

  ('expression', 'Cool',
   '<rect x="28" y="32" width="16" height="8" rx="2" fill="#1e293b" /><rect x="56" y="32" width="16" height="8" rx="2" fill="#1e293b" /><line x1="36" y1="56" x2="64" y2="56" stroke="#1e293b" stroke-width="3" stroke-linecap="round" />',
   'default', 0, 'common', 31),

  ('expression', 'Wink',
   '<circle cx="38" cy="36" r="4" fill="#1e293b" /><path d="M56 36 Q62 30 68 36" stroke="#1e293b" stroke-width="3" fill="none" stroke-linecap="round" /><path d="M36 52 Q50 62 64 52" stroke="#1e293b" stroke-width="3" fill="none" stroke-linecap="round" />',
   'default', 0, 'common', 32),

  ('expression', 'Star Eyes',
   '<text x="30" y="42" font-size="14" text-anchor="middle">★</text><text x="70" y="42" font-size="14" text-anchor="middle">★</text><circle cx="50" cy="58" r="5" fill="#1e293b" />',
   'reputation:3', 3, 'rare', 33),

  ('expression', 'Fire',
   '<text x="50" y="42" font-size="18" text-anchor="middle">🔥</text><path d="M34 58 Q50 70 66 58" stroke="#1e293b" stroke-width="3" fill="none" stroke-linecap="round" />',
   'achievement:streak_7', 0, 'epic', 34),

  -- Accessories
  ('accessory', 'None',       '', 'default', 0, 'common', 40),

  ('accessory', 'Party Hat',
   '<polygon points="50,5 38,30 62,30" fill="#f97316" /><circle cx="50" cy="5" r="4" fill="#fbbf24" />',
   'default', 0, 'common', 41),

  ('accessory', 'Crown',
   '<path d="M28 22 L28 10 L38 18 L50 6 L62 18 L72 10 L72 22 Z" fill="#eab308" stroke="#ca8a04" stroke-width="1.5" />',
   'reputation:5', 5, 'legendary', 42),

  ('accessory', 'Headphones',
   '<path d="M26 40 Q26 14 50 14 Q74 14 74 40" stroke="#475569" stroke-width="4" fill="none" /><circle cx="24" cy="42" r="7" fill="#475569" /><circle cx="76" cy="42" r="7" fill="#475569" />',
   'achievement:community_silver', 0, 'rare', 43),

  ('accessory', 'Viking Helmet',
   '<path d="M22 28 L22 14 L36 14 L36 28 M64 28 L64 14 L78 14 L78 28 M18 28 Q50 16 82 28 L80 40 Q50 32 20 40 Z" fill="#94a3b8" stroke="#64748b" stroke-width="1.5" />',
   'achievement:order_diamond', 0, 'legendary', 44),

  -- Backgrounds
  ('background', 'None',       '', 'default', 0, 'common', 50),

  ('background', 'Mint Burst',
   '<radialGradient id="bg_mint" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#22c55e" stop-opacity="0.4" /><stop offset="100%" stop-color="#22c55e" stop-opacity="0" /></radialGradient><circle cx="50" cy="50" r="50" fill="url(#bg_mint)" />',
   'default', 0, 'common', 51),

  ('background', 'Arctic Glow',
   '<radialGradient id="bg_arctic" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#38bdf8" stop-opacity="0.45" /><stop offset="100%" stop-color="#38bdf8" stop-opacity="0" /></radialGradient><circle cx="50" cy="50" r="50" fill="url(#bg_arctic)" />',
   'reputation:2', 2, 'rare', 52),

  ('background', 'Fire Ring',
   '<circle cx="50" cy="50" r="46" stroke="#f97316" stroke-width="4" fill="none" opacity="0.7" /><circle cx="50" cy="50" r="38" stroke="#ef4444" stroke-width="2.5" fill="none" opacity="0.5" />',
   'achievement:streak_7', 0, 'epic', 53),

  ('background', 'Legend Aura',
   '<radialGradient id="bg_legend" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#eab308" stop-opacity="0.5" /><stop offset="60%" stop-color="#a855f7" stop-opacity="0.3" /><stop offset="100%" stop-color="#a855f7" stop-opacity="0" /></radialGradient><circle cx="50" cy="50" r="50" fill="url(#bg_legend)" />',
   'reputation:5', 5, 'legendary', 54)

on conflict do nothing;
