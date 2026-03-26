-- Points redemption table and atomic RPC
-- =============================================================================

create table if not exists public.points_redemptions (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id),
  points_spent integer    not null check (points_spent > 0),
  reward_type text        not null,
  reward_value numeric,
  voucher_id  uuid        references public.vouchers(id),
  status      text        not null default 'completed',
  created_at  timestamptz not null default now()
);

-- Index for user lookups
create index if not exists idx_points_redemptions_user
  on public.points_redemptions(user_id);

-- RLS: users can read their own redemptions
alter table public.points_redemptions enable row level security;

create policy "Users can read own redemptions"
  on public.points_redemptions for select
  using (auth.uid() = user_id);

-- Atomic RPC: validates balance, deducts, records transaction + redemption
-- SECURITY DEFINER so it runs with full privileges (bypasses RLS)
create or replace function public.redeem_points(
  p_user_id     uuid,
  p_points      integer,
  p_reward_type text,
  p_reward_value numeric default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_balance    integer;
  v_redemption_id uuid;
begin
  -- Lock the balance row to prevent concurrent redemptions
  select balance into v_balance
    from public.points_balances
   where user_id = p_user_id
     for update;

  if v_balance is null then
    raise exception 'no_balance_row' using errcode = 'P0001';
  end if;

  if v_balance < p_points then
    raise exception 'insufficient_points' using errcode = 'P0002';
  end if;

  -- Deduct points
  update public.points_balances
     set balance = balance - p_points,
         updated_at = now()
   where user_id = p_user_id;

  -- Record the negative transaction
  insert into public.points_transactions (user_id, points, reason)
  values (p_user_id, -p_points, 'redeem:' || p_reward_type);

  -- Record the redemption
  insert into public.points_redemptions (user_id, points_spent, reward_type, reward_value)
  values (p_user_id, p_points, p_reward_type, p_reward_value)
  returning id into v_redemption_id;

  return v_redemption_id;
end;
$$;
