# Gamifiera-Style Engagement System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add user profiles with unlockable avatars, real product reviews, and a quest system to drive engagement and repeat purchases.

**Architecture:** Supabase tables + RLS for data, edge functions for unlock/quest logic, React Query hooks for data fetching, shadcn/ui components for UI. Reviews use direct Supabase inserts (RLS enforces auth). Quests and avatar unlocks use service-role edge functions.

**Tech Stack:** React, TypeScript, Supabase (Postgres + Edge Functions + Storage), React Query, shadcn/ui, Tailwind CSS, framer-motion

**Spec:** `docs/superpowers/specs/2026-03-24-gamifiera-engagement-design.md`

---

## File Structure

### New Files
```
supabase/migrations/20260324200000_user_profiles_avatars.sql
supabase/migrations/20260324200001_product_reviews.sql
supabase/migrations/20260324200002_quests.sql
supabase/functions/check-avatar-unlocks/index.ts
supabase/functions/update-quest-progress/index.ts
src/components/profile/UserAvatar.tsx
src/components/profile/AvatarGallery.tsx
src/components/profile/ProfileCard.tsx
src/components/quests/QuestBoard.tsx
src/components/quests/QuestCard.tsx
src/components/quests/QuestComplete.tsx
src/hooks/useUserProfile.ts
src/hooks/useProductReviews.ts
src/hooks/useQuests.ts
```

### Modified Files
```
src/components/product/ProductReviews.tsx
src/pages/AccountPage.tsx
src/pages/RewardsPage.tsx
src/pages/ProductDetail.tsx
src/integrations/supabase/types.ts
supabase/config.toml
```

---

### Task 1: Database — User Profiles + Avatars

**Files:**
- Create: `supabase/migrations/20260324200000_user_profiles_avatars.sql`

- [ ] **Step 1: Write migration SQL**

Apply via Supabase MCP `apply_migration`:

```sql
-- Avatars catalog
CREATE TABLE public.avatars (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  unlock_type TEXT NOT NULL DEFAULT 'default' CHECK (unlock_type IN ('default','spend','reviews','social','orders')),
  unlock_threshold INT NOT NULL DEFAULT 0,
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common','rare','epic','legendary')),
  sort_order INT NOT NULL DEFAULT 0
);

ALTER TABLE public.avatars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read avatars" ON public.avatars FOR SELECT USING (true);

-- User profiles
CREATE TABLE public.user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_id TEXT NOT NULL DEFAULT 'rookie' REFERENCES public.avatars(id),
  bio TEXT CHECK (char_length(bio) <= 160),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.user_profiles FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- Avatar unlocks junction
CREATE TABLE public.user_avatar_unlocks (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  avatar_id TEXT NOT NULL REFERENCES public.avatars(id),
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, avatar_id)
);

ALTER TABLE public.user_avatar_unlocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own unlocks" ON public.user_avatar_unlocks FOR SELECT USING (user_id = (select auth.uid()));

-- Seed starter avatars (common, unlocked for everyone)
INSERT INTO public.avatars (id, name, image_url, unlock_type, unlock_threshold, rarity, sort_order) VALUES
  ('rookie', 'Rookie', '/avatars/rookie.svg', 'default', 0, 'common', 1),
  ('pouch-fan', 'Pouch Fan', '/avatars/pouch-fan.svg', 'default', 0, 'common', 2),
  ('nicotine-newbie', 'Nicotine Newbie', '/avatars/nicotine-newbie.svg', 'default', 0, 'common', 3);

-- Seed unlockable avatars
INSERT INTO public.avatars (id, name, image_url, unlock_type, unlock_threshold, rarity, sort_order) VALUES
  ('zyn-warrior', 'ZYN Warrior', '/avatars/zyn-warrior.svg', 'orders', 5, 'rare', 10),
  ('cuba-princess', 'Cuba Princess', '/avatars/cuba-princess.svg', 'reviews', 10, 'rare', 11),
  ('velo-viking', 'VELO Viking', '/avatars/velo-viking.svg', 'spend', 1000, 'epic', 20),
  ('mint-master', 'Mint Master', '/avatars/mint-master.svg', 'orders', 3, 'rare', 12),
  ('brand-explorer', 'Brand Explorer', '/avatars/brand-explorer.svg', 'orders', 5, 'epic', 21),
  ('snus-king', 'Snus King', '/avatars/snus-king.svg', 'orders', 50, 'legendary', 30);

-- Auto-create profile on user signup via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'first_name', 'SnusFriend'));
  -- Auto-unlock default avatars
  INSERT INTO public.user_avatar_unlocks (user_id, avatar_id)
  SELECT NEW.id, id FROM public.avatars WHERE unlock_type = 'default';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();
```

- [ ] **Step 2: Apply migration via Supabase MCP**

Run: `apply_migration` with project_id `bozdnoctcszbhemdjsek`

- [ ] **Step 3: Verify tables exist**

Run: `execute_sql` — `SELECT count(*) FROM public.avatars;` (expect 9)

- [ ] **Step 4: Commit migration file**

```bash
git add supabase/migrations/20260324200000_user_profiles_avatars.sql
git commit -m "feat: add user_profiles, avatars, user_avatar_unlocks tables"
```

---

### Task 2: Database — Product Reviews

**Files:**
- Create: `supabase/migrations/20260324200001_product_reviews.sql`

- [ ] **Step 1: Write migration SQL**

```sql
CREATE TABLE public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL CHECK (char_length(title) <= 100),
  body TEXT NOT NULL CHECK (char_length(body) <= 1000),
  helpful_count INT NOT NULL DEFAULT 0,
  flagged BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, user_id)
);

CREATE INDEX idx_reviews_product ON public.product_reviews(product_id) WHERE NOT flagged;
CREATE INDEX idx_reviews_user ON public.product_reviews(user_id);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read non-flagged reviews" ON public.product_reviews
  FOR SELECT USING (NOT flagged);
CREATE POLICY "Authenticated insert own review" ON public.product_reviews
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
```

- [ ] **Step 2: Apply migration via Supabase MCP**
- [ ] **Step 3: Verify table exists**
- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260324200001_product_reviews.sql
git commit -m "feat: add product_reviews table with RLS"
```

---

### Task 3: Database — Quests

**Files:**
- Create: `supabase/migrations/20260324200002_quests.sql`

- [ ] **Step 1: Write migration SQL**

```sql
CREATE TABLE public.quests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  quest_type TEXT NOT NULL CHECK (quest_type IN ('orders','reviews','spend','brands','products','spins')),
  target_value INT NOT NULL,
  time_limit_days INT,
  reward_points INT NOT NULL DEFAULT 0,
  reward_avatar_id TEXT REFERENCES public.avatars(id),
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0
);

ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active quests" ON public.quests FOR SELECT USING (active);

CREATE TABLE public.user_quest_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL REFERENCES public.quests(id),
  current_value INT NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE (user_id, quest_id)
);

CREATE INDEX idx_quest_progress_user ON public.user_quest_progress(user_id) WHERE NOT completed;

ALTER TABLE public.user_quest_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own quest progress" ON public.user_quest_progress
  FOR SELECT USING (user_id = (select auth.uid()));

-- Seed quests
INSERT INTO public.quests (id, title, description, quest_type, target_value, reward_points, reward_avatar_id, sort_order) VALUES
  ('first-order', 'First Order', 'Place your first order', 'orders', 1, 25, 'pouch-fan', 1),
  ('brand-explorer', 'Brand Explorer', 'Order from 3 different brands', 'brands', 3, 100, NULL, 2),
  ('review-champion', 'Review Champion', 'Write 5 product reviews', 'reviews', 5, 150, 'cuba-princess', 3),
  ('mint-master', 'Mint Master', 'Buy 3 different mint products', 'products', 3, 75, 'mint-master', 4),
  ('big-spender', 'Big Spender', 'Spend over 1000 SEK', 'spend', 1000, 200, 'velo-viking', 5),
  ('daily-devotee', 'Daily Devotee', 'Spin the wheel 7 days in a row', 'spins', 7, 50, NULL, 6);
```

- [ ] **Step 2: Apply migration via Supabase MCP**
- [ ] **Step 3: Verify tables and seed data**
- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260324200002_quests.sql
git commit -m "feat: add quests and user_quest_progress tables"
```

---

### Task 4: Update types.ts

**Files:**
- Modify: `src/integrations/supabase/types.ts`

- [ ] **Step 1: Add type definitions for all 6 new tables**

Add Row/Insert/Update interfaces for: `avatars`, `user_profiles`, `user_avatar_unlocks`, `product_reviews`, `quests`, `user_quest_progress`

- [ ] **Step 2: Run `bun run build` to verify types compile**
- [ ] **Step 3: Commit**

```bash
git add src/integrations/supabase/types.ts
git commit -m "feat: add types for profiles, reviews, quests tables"
```

---

### Task 5: Profile Hook + UserAvatar Component

**Files:**
- Create: `src/hooks/useUserProfile.ts`
- Create: `src/components/profile/UserAvatar.tsx`

- [ ] **Step 1: Create useUserProfile hook**

React Query hook that:
- Fetches user profile + avatar data
- Provides `updateProfile` mutation (display_name, avatar_id, bio)
- Auto-creates profile on first access if missing
- Returns: `{ profile, avatars, unlockedAvatarIds, isLoading, updateProfile }`

- [ ] **Step 2: Create UserAvatar component**

Displays avatar image with rarity-colored border glow:
- common: gray border
- rare: blue glow
- epic: purple glow
- legendary: gold animated glow

Props: `avatarId`, `size` (sm/md/lg), `showBorder`

- [ ] **Step 3: Run `bun run build`**
- [ ] **Step 4: Commit**

```bash
git add src/hooks/useUserProfile.ts src/components/profile/UserAvatar.tsx
git commit -m "feat: add useUserProfile hook and UserAvatar component"
```

---

### Task 6: Avatar Gallery + Profile Tab on Account Page

**Files:**
- Create: `src/components/profile/AvatarGallery.tsx`
- Create: `src/components/profile/ProfileCard.tsx`
- Modify: `src/pages/AccountPage.tsx`

- [ ] **Step 1: Create AvatarGallery**

Grid of all avatars. Unlocked ones are selectable (click to equip). Locked ones show:
- Greyed out image
- Progress bar toward unlock threshold
- Lock icon overlay
- Rarity border color

- [ ] **Step 2: Create ProfileCard**

Shows: avatar (UserAvatar component), display name, bio, stats (order count, review count, SnusPoints)

- [ ] **Step 3: Add "Profile" tab to AccountPage**

New tab alongside Orders, Membership, Addresses, Settings. Contains:
- ProfileCard at top
- Display name + bio edit form
- AvatarGallery below

- [ ] **Step 4: Run `bun run build`**
- [ ] **Step 5: Commit**

```bash
git add src/components/profile/ src/pages/AccountPage.tsx
git commit -m "feat: add avatar gallery and profile tab to account page"
```

---

### Task 7: Product Reviews Hook + Wire to Real Data

**Files:**
- Create: `src/hooks/useProductReviews.ts`
- Modify: `src/components/product/ProductReviews.tsx`
- Modify: `src/pages/ProductDetail.tsx`

- [ ] **Step 1: Create useProductReviews hook**

```typescript
// Fetches reviews for a product with user profile data
// Returns: { reviews, avgRating, totalCount, distribution, submitReview, isLoading }
// submitReview: mutation that inserts a new review
```

Joins `product_reviews` with `user_profiles` and `avatars` to get display_name + avatar for each reviewer.

- [ ] **Step 2: Wire ProductReviews.tsx to real data**

Replace mock reviews array with hook data. Wire submit handler to `submitReview` mutation. Show UserAvatar + display_name next to each review. Add "Verified Buyer" badge (check if reviewer's user_id has an order containing this product_id). Add "Flag" button.

- [ ] **Step 3: Pass product.id in ProductDetail.tsx**

Ensure `<ProductReviews productId={product.id} />` receives the real product ID.

- [ ] **Step 4: Run `bun run build`**
- [ ] **Step 5: Commit**

```bash
git add src/hooks/useProductReviews.ts src/components/product/ProductReviews.tsx src/pages/ProductDetail.tsx
git commit -m "feat: wire product reviews to Supabase, add verified buyer badge"
```

---

### Task 8: Quest Components + Rewards Page Integration

**Files:**
- Create: `src/hooks/useQuests.ts`
- Create: `src/components/quests/QuestBoard.tsx`
- Create: `src/components/quests/QuestCard.tsx`
- Create: `src/components/quests/QuestComplete.tsx`
- Modify: `src/pages/RewardsPage.tsx`

- [ ] **Step 1: Create useQuests hook**

Fetches all active quests + user's progress. Returns: `{ quests, userProgress, isLoading }`

- [ ] **Step 2: Create QuestCard component**

Shows: quest icon, title, description, progress bar (current/target), reward preview (points + avatar if applicable), completion state.

- [ ] **Step 3: Create QuestBoard component**

Grid of QuestCards. Separates into "Active" (in progress) and "Available" (not started) sections. Completed quests shown with checkmark.

- [ ] **Step 4: Create QuestComplete celebration modal**

Confetti animation + reward display when quest completes. Uses framer-motion for entrance.

- [ ] **Step 5: Add Quests section to RewardsPage**

Add QuestBoard below the spin wheel section. Tab or section layout.

- [ ] **Step 6: Run `bun run build`**
- [ ] **Step 7: Commit**

```bash
git add src/hooks/useQuests.ts src/components/quests/ src/pages/RewardsPage.tsx
git commit -m "feat: add quest board with progress tracking to rewards page"
```

---

### Task 9: Edge Functions — Avatar Unlocks + Quest Progress

**Files:**
- Create: `supabase/functions/check-avatar-unlocks/index.ts`
- Create: `supabase/functions/update-quest-progress/index.ts`
- Modify: `supabase/config.toml`

- [ ] **Step 1: Create check-avatar-unlocks edge function**

JWT auth. Reads user stats (order count, review count, total spend, distinct brands). Compares against all avatars not yet unlocked by user. Inserts new unlocks. Returns `{ newly_unlocked: [...] }`.

- [ ] **Step 2: Create update-quest-progress edge function**

JWT auth. Input: `{ action: "order" | "review" | "spin", metadata?: {} }`. Auto-starts applicable quests. Increments progress. Awards points + avatar on completion via `increment_points_balance` RPC. Returns `{ updated: [...], completed: [...] }`.

- [ ] **Step 3: Add to config.toml**

```toml
[functions.check-avatar-unlocks]
verify_jwt = false

[functions.update-quest-progress]
verify_jwt = false
```

- [ ] **Step 4: Deploy both edge functions via Supabase MCP**
- [ ] **Step 5: Commit**

```bash
git add supabase/functions/check-avatar-unlocks/ supabase/functions/update-quest-progress/ supabase/config.toml
git commit -m "feat: add check-avatar-unlocks and update-quest-progress edge functions"
```

---

### Task 10: Cross-Wiring + Final Verification

**Files:**
- Modify: `src/pages/OrderConfirmation.tsx` (call quest progress after order)
- Modify: `src/components/product/ProductReviews.tsx` (call quest progress after review)
- Modify: `src/components/rewards/SpinWheel.tsx` (call quest progress after spin)

- [ ] **Step 1: Wire quest progress calls**

After successful order → call `update-quest-progress` with `{ action: "order" }`
After successful review → call `update-quest-progress` with `{ action: "review" }`
After successful spin → call `update-quest-progress` with `{ action: "spin" }`

Each call also triggers `check-avatar-unlocks` to see if new avatars unlocked.

- [ ] **Step 2: Run `bun run build`**

Verify zero TypeScript errors.

- [ ] **Step 3: Run `bun run lint`**
- [ ] **Step 4: Full commit + push**

```bash
git add -A
git commit -m "feat: cross-wire quest progress triggers on order/review/spin"
git push
```

- [ ] **Step 5: Verify on live site**

1. Log in → check Profile tab → see starter avatar
2. View avatar gallery → locked avatars have progress
3. Write a review → appears with avatar + name
4. Check quest board → progress updates
5. Check JSON-LD on product page for AggregateRating

- [ ] **Step 6: Check Vercel runtime logs for errors**
