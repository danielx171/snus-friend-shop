# Daily Spin & Rewards System — Design Spec

## Context

SnusFriend needs a gamification layer to drive daily return visits, account creation, and engagement. The spin wheel gives users a free daily spin with modest rewards (SnusPoints, discount vouchers, clearance product giveaways). Guests can spin but must create an account to claim prizes.

## Scope

**Phase 1 (this spec):**
1. Daily spin wheel component with animation
2. Prize reveal overlay with particle/confetti effects
3. Voucher system (database + UI + cart integration)
4. `/rewards` page
5. Supabase backend (tables, RLS policies, edge function)

**Phase 2 (separate spec, later):**
- Social login (Google + Apple) via Supabase Auth
- Auth context refactor
- Push notification for daily spin reminder

---

## 1. Prize Structure

8 segments. Points are modest — engagement, not a loyalty overhaul. Weights sum to exactly 100%.

| Segment | Prize | Weight | Type | VIP Bonus |
|---------|-------|--------|------|-----------|
| 1 | 5 SnusPoints | 30 | points | 10 pts |
| 2 | 10 SnusPoints | 25 | points | 20 pts |
| 3 | 15% Off Voucher | 5 | voucher | 20% Off |
| 4 | 25 SnusPoints | 15 | points | 50 pts |
| 5 | 5 SnusPoints | 16.8 | points | 10 pts |
| 6 | Free Can (clearance SKU) | 3 | voucher | same |
| 7 | 50 SnusPoints | 5 | points | 100 pts |
| 8 | Free Month Sub | 0.2 | jackpot | same |

**Key rules:**
- One spin per user per 24 hours (server-enforced via `daily_spins` table)
- Guests can spin (visual only), must sign up to claim — see Guest Flow below
- "Free Can" prizes link to a specific clearance SKU set in `spin_config` (admin-updatable)
- "Free Month" creates a voucher marked "Contact us to redeem" — placeholder until subscription system exists
- All vouchers expire after 30 days
- VIP members get doubled point values and +5% on discount vouchers
- Edge function normalizes weights at runtime (no assumption they sum to 100)

---

## 2. Database Schema

### Table: `daily_spins`

```sql
create table daily_spins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prize_key text not null,
  prize_value jsonb not null,
  spun_at timestamptz not null default now(),
  constraint one_spin_per_day unique (user_id, (spun_at::date))
);

alter table daily_spins enable row level security;
create policy "Users read own spins" on daily_spins
  for select using (auth.uid() = user_id);
-- No client INSERT/UPDATE — all writes via edge function with service role
```

### Table: `vouchers`

```sql
create table vouchers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,               -- 'discount_pct', 'free_product', 'free_month'
  value jsonb not null,             -- { "percent": 15 } or { "sku": "abc", "product_name": "..." }
  status text not null default 'active',  -- 'active', 'used', 'expired'
  source text not null default 'spin',    -- 'spin', 'referral', 'promo', 'admin'
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

alter table vouchers enable row level security;
create policy "Users read own vouchers" on vouchers
  for select using (auth.uid() = user_id);
-- No client UPDATE/INSERT — all mutations via edge function with service role
-- This prevents users from modifying status, value, or expiry

create index idx_vouchers_user_status on vouchers (user_id, status);
create index idx_vouchers_expiry on vouchers (status, expires_at) where status = 'active';
```

### Table: `spin_config`

```sql
create table spin_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Seed data
insert into spin_config values
  ('clearance_sku', '{"sku": null, "product_name": "TBD", "note": "Set to a real SKU"}'),
  ('prize_weights', '{"points_5":30,"points_10":25,"voucher_15pct":5,"points_25":15,"points_5b":16.8,"free_can":3,"points_50":5,"free_month":0.2}'),
  ('vip_multiplier', '{"points_multiplier":2,"discount_boost":5}');

alter table spin_config enable row level security;
create policy "Authenticated read spin config" on spin_config
  for select using (auth.uid() is not null);

-- Auto-update timestamp trigger
create or replace function update_spin_config_timestamp()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger spin_config_updated before update on spin_config
  for each row execute function update_spin_config_timestamp();
```

### Voucher expiry cron

```sql
select cron.schedule(
  'expire-vouchers',
  '0 2 * * *',  -- daily at 02:00 UTC
  $$update public.vouchers set status = 'expired' where status = 'active' and expires_at < now()$$
);
```

---

## 3. Edge Function: `spin-wheel`

**Path:** `supabase/functions/spin-wheel/index.ts`
**Config:** `verify_jwt = true` in `supabase/config.toml`

**Flow (all within a single Postgres transaction):**
1. Verify JWT → get `user_id`
2. INSERT into `daily_spins` first (unique constraint acts as a lock — if duplicate, returns 409)
3. Read `spin_config` for weights + clearance SKU
4. Server-side weighted random pick (normalize weights, never trust client)
5. Award prize:
   - Points → insert `points_transactions`, upsert `points_balances`
   - Discount voucher → insert `vouchers` with 30-day expiry
   - Free can → insert `vouchers` with clearance SKU from config (if SKU is null, fall back to 25 pts)
   - Free month → insert `vouchers` with type `free_month`
6. Return `{ prize_key, prize_display, voucher_id?, points_awarded? }`
7. On any error, transaction rolls back (spin record + prize both reverted)

**Error responses:**
- 409: Already spun today
- 401: Not authenticated
- 500: Internal error (with `requestId`)
- If `clearance_sku` is null: fall back to 25 SnusPoints instead of erroring

---

## 4. Guest Flow

**Problem:** Showing a fake result then giving a different real result feels like bait-and-switch.

**Solution:** Guests see the wheel spin but it stops blurred/obscured before revealing the segment. The reveal overlay shows:

> "You won a prize! Create an account to reveal and claim it."
> [Sign up with Email] button → redirects to `/register?redirect=/rewards&claim=true`

After signup, the user is redirected back to `/rewards`. The page detects `claim=true`, calls the `spin-wheel` edge function, runs the real spin animation to the server-determined result, and shows the prize reveal.

**This ensures:**
- No deception (guest never sees a specific prize that changes)
- Server determines the real result (anti-cheat)
- Signup is incentivized by curiosity
- The real spin animation plays after signup for full engagement

---

## 5. Frontend Components

### `/rewards` page — `src/pages/RewardsPage.tsx`

Layout (top to bottom):
1. **Points balance strip** — current SnusPoints + streak badge
2. **Spin wheel** — the main interactive element
3. **Voucher list** — active vouchers with Apply/Claim buttons + expiry countdown
4. **Spin history** — last 7 days (compact list)

### `src/components/rewards/SpinWheel.tsx`

SVG-based wheel with 8 segments:
- Framer Motion for spin animation (`animate` with spring easing, ~6s duration)
- LED ring (CSS `repeating-conic-gradient` with rotation animation)
- Ambient pulsing glow behind wheel
- 3D raised center hub button
- Pointer triangle at top
- States: `idle` | `spinning` | `revealing` | `claimed` | `exhausted` | `error`
- Error state: "Something went wrong — tap to retry" with retry button
- Exhausted state: "Come back tomorrow!" with countdown timer

### `src/components/rewards/PrizeReveal.tsx`

Full-screen overlay:
- 3D card entrance (scale + rotateY spring)
- Shine sweep across card surface
- Prize icon with pulsing glow ring (cyan for points, purple for voucher, gold for jackpot)
- Icon pop with spring physics + rotation
- Particle burst (24 particles, color-matched)
- Confetti rain for voucher/jackpot wins (80 pieces)
- Staggered text reveal (tag → title → badge → description → CTA)
- "Collect" button

### `src/components/rewards/VoucherList.tsx`

- Cards: voucher name, icon, expiry countdown ("Expires in 28 days")
- "Apply" button for discount vouchers (adds discount to cart)
- "Claim" button for free product vouchers (adds item to cart at €0)
- Used/expired states (dimmed, no action)

---

## 6. Cart Integration for Vouchers

**Note:** Modifying `cart-utils.ts` requires explicit permission per CLAUDE.md. The implementation plan must flag this.

### Discount vouchers (`voucher_15pct`)

- CartContext gets a new `activeVoucher` state (voucher ID + percent)
- `getCartTotals()` in `cart-utils.ts` needs a new `voucherDiscount` parameter alongside existing `discountCode`
- Voucher discount takes priority over WELCOME10 (only one discount active at a time)
- On successful checkout, edge function marks voucher as `used`

### Free product vouchers (`free_can`)

- "Claim" adds the clearance SKU to cart at €0, flagged as `{ source: 'voucher', voucher_id: '...' }`
- Voucher is marked `used` on checkout completion (not on claim) — if they remove the item, the voucher returns to `active`
- If clearance SKU is out of stock, show "This item is currently unavailable" and keep voucher active

---

## 7. What Daniel Needs To Do

| Action | Where | When |
|--------|-------|------|
| Set clearance SKU | Tell me which product → I update `spin_config` via SQL | After tables are created |

**Phase 2 (later, separate spec):**
| Action | Where |
|--------|-------|
| Google OAuth credentials | Google Cloud Console → Supabase Dashboard → Auth → Providers |
| Apple Sign-In credentials | Apple Developer → Supabase Dashboard → Auth → Providers |

**What I do via code/MCP:**
- Create all tables via migrations
- Set up RLS policies + indexes
- Deploy `spin-wheel` edge function
- Add `verify_jwt = true` to `supabase/config.toml`
- Build all frontend components
- Wire voucher system into cart
- Set up voucher expiry cron
- Add types to `types.ts`

---

## 8. Files to Create/Modify

| Action | File |
|--------|------|
| Create | `supabase/migrations/20260322_daily_spins.sql` |
| Create | `supabase/migrations/20260322_vouchers.sql` |
| Create | `supabase/migrations/20260322_spin_config.sql` |
| Create | `supabase/functions/spin-wheel/index.ts` |
| Create | `src/pages/RewardsPage.tsx` |
| Create | `src/components/rewards/SpinWheel.tsx` |
| Create | `src/components/rewards/PrizeReveal.tsx` |
| Create | `src/components/rewards/VoucherList.tsx` |
| Create | `src/hooks/useSpinWheel.ts` |
| Create | `src/hooks/useVouchers.ts` |
| Modify | `src/App.tsx` — add `/rewards` route |
| Modify | `src/context/CartContext.tsx` — add `activeVoucher` state |
| Modify | `src/lib/cart-utils.ts` — add voucher discount param (requires permission) |
| Modify | `src/components/layout/Header.tsx` — add rewards icon link |
| Modify | `src/integrations/supabase/types.ts` — add `daily_spins`, `vouchers`, `spin_config` |
| Modify | `supabase/config.toml` — add `[functions.spin-wheel]` |
| Modify | `DEPLOYMENT_CHECKLIST.md` — note new edge function + cron |
