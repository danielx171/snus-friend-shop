-- Flavor DNA quiz profiles
create type strength_preference as enum ('light', 'regular', 'strong', 'extra_strong');

create table flavor_profiles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  mint_score smallint not null default 0 check (mint_score between 0 and 100),
  fruit_score smallint not null default 0 check (fruit_score between 0 and 100),
  sweet_score smallint not null default 0 check (sweet_score between 0 and 100),
  bold_score  smallint not null default 0 check (bold_score between 0 and 100),
  strength_pref strength_preference not null default 'regular',
  profile_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint flavor_profiles_user_unique unique (user_id)
);

-- Updated-at trigger
create or replace function update_flavor_profiles_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_flavor_profiles_updated_at
  before update on flavor_profiles
  for each row execute function update_flavor_profiles_updated_at();

-- RLS
alter table flavor_profiles enable row level security;

create policy "Users can read own flavor profile"
  on flavor_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own flavor profile"
  on flavor_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own flavor profile"
  on flavor_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
