-- F6: Social Sharing with Bonus Points
-- Tracks per-user social shares and awards SnusPoints (once per platform per target)

create table if not exists public.social_shares (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  share_type  text not null check (share_type in ('product', 'review', 'referral', 'achievement')),
  target_id   text not null,
  platform    text not null check (platform in ('twitter', 'facebook', 'whatsapp', 'copy_link')),
  points_awarded integer not null default 10,
  created_at  timestamptz not null default now()
);

-- Prevent duplicate point farming: one share per user+type+target+platform
alter table public.social_shares
  add constraint social_shares_unique_share
  unique (user_id, share_type, target_id, platform);

-- Index for user lookups
create index if not exists idx_social_shares_user on public.social_shares (user_id);

-- RLS
alter table public.social_shares enable row level security;

-- Users can read their own shares
create policy "Users can read own shares"
  on public.social_shares for select
  using (auth.uid() = user_id);

-- Users can insert their own shares
create policy "Users can insert own shares"
  on public.social_shares for insert
  with check (auth.uid() = user_id);

-- Award points on share insert
create or replace function public.award_social_share_points()
returns trigger as $$
begin
  -- Upsert points balance
  insert into public.points_balances (user_id, balance, lifetime_earned, updated_at)
  values (NEW.user_id, NEW.points_awarded, NEW.points_awarded, now())
  on conflict (user_id) do update set
    balance = points_balances.balance + NEW.points_awarded,
    lifetime_earned = points_balances.lifetime_earned + NEW.points_awarded,
    updated_at = now();

  -- Record the transaction
  insert into public.points_transactions (user_id, points, reason, created_at)
  values (
    NEW.user_id,
    NEW.points_awarded,
    'Social share: ' || NEW.share_type || ' on ' || NEW.platform,
    now()
  );

  return NEW;
end;
$$ language plpgsql security definer;

create trigger trg_social_share_points
  after insert on public.social_shares
  for each row
  execute function public.award_social_share_points();
