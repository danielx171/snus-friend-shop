-- Login streaks table
create table if not exists public.login_streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_login_date date not null default current_date,
  total_login_days integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.login_streaks enable row level security;

create policy "Users can read own streak"
  on public.login_streaks for select
  using (auth.uid() = user_id);

-- RPC to record daily login and calculate streak
create or replace function public.record_daily_login(p_user_id uuid)
returns json
language plpgsql
security definer
as $$
declare
  v_streak login_streaks%rowtype;
  v_today date := current_date;
  v_points integer := 0;
  v_bonus integer := 0;
  v_new_streak integer;
  v_is_new_day boolean := false;
begin
  -- Get or create streak record
  insert into public.login_streaks (user_id, current_streak, last_login_date, total_login_days)
  values (p_user_id, 1, v_today, 1)
  on conflict (user_id) do nothing;

  select * into v_streak from public.login_streaks where user_id = p_user_id;

  -- Already logged in today
  if v_streak.last_login_date = v_today then
    return json_build_object('streak', v_streak.current_streak, 'points', 0, 'bonus', 0, 'already_claimed', true);
  end if;

  v_is_new_day := true;

  -- Calculate streak
  if v_streak.last_login_date = v_today - interval '1 day' then
    -- Consecutive day
    v_new_streak := v_streak.current_streak + 1;
  else
    -- Streak broken
    v_new_streak := 1;
  end if;

  -- Base daily points
  v_points := 5;

  -- Milestone bonuses
  if v_new_streak = 7 then
    v_bonus := 50;
  elsif v_new_streak = 30 then
    v_bonus := 200;
  elsif v_new_streak = 14 then
    v_bonus := 75;
  elsif v_new_streak = 60 then
    v_bonus := 500;
  end if;

  -- Update streak record
  update public.login_streaks
  set current_streak = v_new_streak,
      longest_streak = greatest(longest_streak, v_new_streak),
      last_login_date = v_today,
      total_login_days = total_login_days + 1,
      updated_at = now()
  where user_id = p_user_id;

  -- Award base points
  insert into public.points_transactions (user_id, points, reason)
  values (p_user_id, v_points, 'daily_login');

  -- Award bonus points if milestone
  if v_bonus > 0 then
    insert into public.points_transactions (user_id, points, reason)
    values (p_user_id, v_bonus, 'streak_bonus_' || v_new_streak || 'd');
  end if;

  -- Update balance
  insert into public.points_balances (user_id, balance, lifetime_earned)
  values (p_user_id, v_points + v_bonus, v_points + v_bonus)
  on conflict (user_id) do update
  set balance = points_balances.balance + (v_points + v_bonus),
      lifetime_earned = points_balances.lifetime_earned + (v_points + v_bonus),
      updated_at = now();

  return json_build_object(
    'streak', v_new_streak,
    'points', v_points,
    'bonus', v_bonus,
    'already_claimed', false,
    'longest', greatest(v_streak.longest_streak, v_new_streak),
    'total_days', v_streak.total_login_days + 1
  );
end;
$$;
