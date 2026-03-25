-- F8: Seasonal Events
-- Time-limited themed events with special rewards and points multipliers

/* ------------------------------------------------------------------ */
/*  seasonal_events                                                     */
/* ------------------------------------------------------------------ */

create table if not exists public.seasonal_events (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  description   text not null default '',
  theme_color   text not null default '#22c55e',
  banner_image_url text,
  starts_at     timestamptz not null,
  ends_at       timestamptz not null,
  is_active     boolean not null default false,
  bonus_multiplier numeric not null default 1.0,
  rewards       jsonb not null default '[]'::jsonb,
  created_at    timestamptz not null default now()
);

alter table public.seasonal_events enable row level security;

create policy "Anyone can read seasonal events"
  on public.seasonal_events for select
  using (true);

/* ------------------------------------------------------------------ */
/*  event_participants                                                  */
/* ------------------------------------------------------------------ */

create table if not exists public.event_participants (
  id                uuid primary key default gen_random_uuid(),
  event_id          uuid not null references public.seasonal_events(id) on delete cascade,
  user_id           uuid not null references auth.users(id) on delete cascade,
  points_earned     integer not null default 0,
  milestones_reached jsonb not null default '[]'::jsonb,
  joined_at         timestamptz not null default now(),
  unique (event_id, user_id)
);

alter table public.event_participants enable row level security;

create policy "Users can read own participation"
  on public.event_participants for select
  using (auth.uid() = user_id);

create policy "Users can join events"
  on public.event_participants for insert
  with check (auth.uid() = user_id);

/* ------------------------------------------------------------------ */
/*  Seed: Spring Pouch Festival                                         */
/* ------------------------------------------------------------------ */

insert into public.seasonal_events (name, slug, description, theme_color, starts_at, ends_at, is_active, bonus_multiplier, rewards)
values (
  'Spring Pouch Festival',
  'spring-pouch-festival',
  'Celebrate spring with double SnusPoints on every purchase! Complete special milestones to unlock exclusive rewards.',
  '#22c55e',
  now(),
  now() + interval '30 days',
  true,
  2.0,
  '[{"type":"badge","name":"Spring Pioneer","description":"Joined the Spring Festival"},{"type":"points","name":"Festival Bonus","amount":500,"milestone":"Earn 1000 points during the event"}]'::jsonb
);
