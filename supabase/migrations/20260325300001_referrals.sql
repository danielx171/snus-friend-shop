-- Referral system: codes + redemptions
-- =====================================================================

-- 1. referral_codes
create table if not exists public.referral_codes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  code       text unique not null,
  uses       integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_referral_codes_user on public.referral_codes(user_id);
create index idx_referral_codes_code on public.referral_codes(code);

alter table public.referral_codes enable row level security;

create policy "Users can read own referral codes"
  on public.referral_codes for select
  using (auth.uid() = user_id);

-- 2. referral_redemptions
create table if not exists public.referral_redemptions (
  id               uuid primary key default gen_random_uuid(),
  referral_code_id uuid not null references public.referral_codes(id) on delete cascade,
  referred_user_id uuid not null references auth.users(id) on delete cascade unique,
  points_awarded   integer not null default 100,
  created_at       timestamptz not null default now()
);

alter table public.referral_redemptions enable row level security;

create policy "Users can read own referral redemptions"
  on public.referral_redemptions for select
  using (auth.uid() = referred_user_id);

-- 3. get_or_create_referral_code(p_user_id uuid) returns text
create or replace function public.get_or_create_referral_code(p_user_id uuid)
returns text
language plpgsql
security definer
as $$
declare
  v_code text;
begin
  select code into v_code
    from public.referral_codes
   where user_id = p_user_id
   limit 1;

  if v_code is not null then
    return v_code;
  end if;

  v_code := 'SF-' || upper(left(replace(gen_random_uuid()::text, '-', ''), 8));

  insert into public.referral_codes (user_id, code)
  values (p_user_id, v_code)
  on conflict (user_id) do nothing;

  -- Re-read in case of race condition
  select code into v_code
    from public.referral_codes
   where user_id = p_user_id
   limit 1;

  return v_code;
end;
$$;

-- 4. redeem_referral_code(p_code text, p_new_user_id uuid)
create or replace function public.redeem_referral_code(p_code text, p_new_user_id uuid)
returns json
language plpgsql
security definer
as $$
declare
  v_referral_code_id uuid;
  v_referrer_id      uuid;
begin
  -- Look up the code
  select id, user_id into v_referral_code_id, v_referrer_id
    from public.referral_codes
   where code = upper(trim(p_code));

  if v_referral_code_id is null then
    return json_build_object('success', false, 'error', 'invalid_code');
  end if;

  -- Cannot redeem own code
  if v_referrer_id = p_new_user_id then
    return json_build_object('success', false, 'error', 'self_referral');
  end if;

  -- Check if already redeemed (unique constraint on referred_user_id)
  if exists (select 1 from public.referral_redemptions where referred_user_id = p_new_user_id) then
    return json_build_object('success', false, 'error', 'already_redeemed');
  end if;

  -- Record the redemption
  insert into public.referral_redemptions (referral_code_id, referred_user_id, points_awarded)
  values (v_referral_code_id, p_new_user_id, 100);

  -- Bump uses counter
  update public.referral_codes
     set uses = uses + 1
   where id = v_referral_code_id;

  -- Award 100 points to referrer
  insert into public.points_transactions (user_id, points, reason)
  values (v_referrer_id, 100, 'referral_bonus');

  -- Award 50 points to new user
  insert into public.points_transactions (user_id, points, reason)
  values (p_new_user_id, 50, 'referral_welcome');

  return json_build_object('success', true, 'referrer_points', 100, 'new_user_points', 50);
end;
$$;
