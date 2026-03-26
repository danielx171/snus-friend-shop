# Gamification Phase 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 4 gamification features — pill reputation badges, multi-step achievements, pouch character builder, and community hub page — on top of the existing SnusFriend gamification system.

**Architecture:** Each feature is a vertical slice (migration → types → hook → component → page wiring). Features 1-2 are foundations used by 3-4. The pill badge component is used everywhere, so it ships first. Achievements provide unlock conditions for the pouch builder. Community hub reuses existing post/comment/poll infrastructure.

**Tech Stack:** Vite SPA, React 18, TypeScript, Tailwind CSS, shadcn/ui, Supabase PostgreSQL, React Query (TanStack), Framer Motion, Lucide icons, Bun

---

## File Map

### Feature 1: Pill Reputation Badges
| Action | File | Responsibility |
|--------|------|---------------|
| Create | `src/components/gamification/ReputationBadge.tsx` | Pill badge component with tier-based styling |
| Create | `src/test/components/ReputationBadge.test.tsx` | Unit tests for badge rendering |
| Modify | `src/components/community/PostCard.tsx` | Add badge next to author name |
| Modify | `src/pages/LeaderboardPage.tsx` | Add badge next to user names |
| Modify | `src/components/profile/ProfileCard.tsx` | Add badge to profile display |

### Feature 2: Achievement System
| Action | File | Responsibility |
|--------|------|---------------|
| Create | `supabase/migrations/20260325600000_achievements.sql` | achievements + user_achievements tables |
| Modify | `src/integrations/supabase/types.ts` | Add achievements + user_achievements types |
| Create | `src/hooks/useAchievements.ts` | Fetch achievements + user progress |
| Create | `src/components/gamification/AchievementCard.tsx` | Single achievement card (icon, progress, tier) |
| Create | `src/components/gamification/AchievementGrid.tsx` | Grid layout grouping by category |
| Create | `src/components/gamification/AchievementToast.tsx` | Unlock celebration toast |
| Create | `src/test/components/AchievementCard.test.tsx` | Unit tests |
| Create | `src/test/hooks/useAchievements.test.ts` | Hook tests |
| Modify | `src/pages/AccountPage.tsx` | Add achievements section |

### Feature 3: Pouch Character Builder
| Action | File | Responsibility |
|--------|------|---------------|
| Create | `supabase/migrations/20260325600001_pouch_parts.sql` | pouch_parts + user_pouch_avatars tables |
| Modify | `src/integrations/supabase/types.ts` | Add pouch tables types |
| Create | `src/hooks/usePouchBuilder.ts` | Fetch parts, user selection, save avatar |
| Create | `src/components/gamification/PouchAvatar.tsx` | SVG renderer compositing layers |
| Create | `src/components/gamification/PouchBuilder.tsx` | Step-by-step builder UI |
| Create | `src/components/gamification/PouchPartPicker.tsx` | Single category picker grid |
| Create | `src/test/components/PouchAvatar.test.tsx` | Unit tests for SVG rendering |
| Create | `src/test/hooks/usePouchBuilder.test.ts` | Hook tests |
| Modify | `src/components/profile/ProfileCard.tsx` | Show pouch avatar if configured |
| Modify | `src/pages/AccountPage.tsx` | Add "Customize Pouch" button |

### Feature 4: Community Hub Page
| Action | File | Responsibility |
|--------|------|---------------|
| Create | `supabase/migrations/20260325600002_community_questions.sql` | community_questions + community_answers tables |
| Modify | `src/integrations/supabase/types.ts` | Add Q&A types |
| Create | `src/hooks/useCommunityHub.ts` | Fetch global posts + questions with filters |
| Create | `src/hooks/useCommunityAnswers.ts` | Fetch/create/vote answers |
| Create | `src/components/community/QuestionCard.tsx` | Q&A card with voted answers |
| Create | `src/components/community/AnswerCard.tsx` | Single answer with vote buttons |
| Create | `src/components/community/CommunityTabs.tsx` | Category tab navigation |
| Create | `src/pages/CommunityPage.tsx` | Full community hub page |
| Create | `src/test/pages/CommunityPage.test.tsx` | Page integration tests |
| Modify | `src/App.tsx` | Add /community route (lazy) |
| Modify | `src/components/layout/Header.tsx` | Add Community to nav |

---

## Task 1: Pill Reputation Badge Component

**Files:**
- Create: `src/components/gamification/ReputationBadge.tsx`
- Create: `src/test/components/ReputationBadge.test.tsx`

- [ ] **Step 1: Write failing tests for ReputationBadge**

```typescript
// src/test/components/ReputationBadge.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReputationBadge } from '@/components/gamification/ReputationBadge';

describe('ReputationBadge', () => {
  it('renders Newcomer tier as gray pill', () => {
    render(<ReputationBadge levelName="Newcomer" badgeColor="gray" />);
    const badge = screen.getByText('Newcomer');
    expect(badge).toBeInTheDocument();
  });

  it('renders Legend tier with shimmer class', () => {
    const { container } = render(<ReputationBadge levelName="Legend" badgeColor="gold" />);
    expect(container.querySelector('.animate-shimmer')).toBeTruthy();
  });

  it('renders compact size when size="sm"', () => {
    render(<ReputationBadge levelName="Regular" badgeColor="blue" size="sm" />);
    const badge = screen.getByText('Regular');
    expect(badge.closest('[data-testid="rep-badge"]')?.className).toContain('text-xs');
  });

  it('renders nothing when levelName is empty', () => {
    const { container } = render(<ReputationBadge levelName="" badgeColor="gray" />);
    expect(container.firstChild).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test -- src/test/components/ReputationBadge.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Implement ReputationBadge component**

```typescript
// src/components/gamification/ReputationBadge.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { Shield, Star, Crown, Gem, User } from 'lucide-react';

export type BadgeSize = 'sm' | 'md';

interface ReputationBadgeProps {
  levelName: string;
  badgeColor: string;
  size?: BadgeSize;
  className?: string;
}

const TIER_CONFIG: Record<string, {
  icon: React.ElementType;
  bg: string;
  text: string;
  border: string;
  glow?: string;
  animate?: string;
}> = {
  gray: {
    icon: User,
    bg: 'bg-gray-500/10',
    text: 'text-gray-400',
    border: 'border-gray-500/20',
  },
  blue: {
    icon: Shield,
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  green: {
    icon: Star,
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  purple: {
    icon: Gem,
    bg: 'bg-purple-500/15',
    text: 'text-purple-400',
    border: 'border-purple-500/40',
    glow: 'shadow-[0_0_8px_rgba(168,85,247,0.3)]',
  },
  gold: {
    icon: Crown,
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]',
    animate: 'animate-shimmer',
  },
};

const SIZE_CLASSES: Record<BadgeSize, { pill: string; icon: number; text: string }> = {
  sm: { pill: 'px-1.5 py-0.5 gap-1', icon: 10, text: 'text-xs' },
  md: { pill: 'px-2 py-1 gap-1.5', icon: 12, text: 'text-xs' },
};

export const ReputationBadge = React.memo(function ReputationBadge({
  levelName,
  badgeColor,
  size = 'md',
  className,
}: ReputationBadgeProps) {
  if (!levelName) return null;

  const tier = TIER_CONFIG[badgeColor] ?? TIER_CONFIG.gray;
  const sz = SIZE_CLASSES[size];
  const Icon = tier.icon;

  return (
    <span
      data-testid="rep-badge"
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        tier.bg,
        tier.text,
        tier.border,
        tier.glow,
        tier.animate,
        sz.pill,
        sz.text,
        className,
      )}
    >
      <Icon size={sz.icon} />
      {levelName}
    </span>
  );
});
```

- [ ] **Step 4: Add shimmer animation to index.css**

Add to `src/index.css` in the `@layer utilities` section:

```css
@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; filter: brightness(1.2); }
}
.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}
```

- [ ] **Step 5: Run tests and verify they pass**

Run: `bun run test -- src/test/components/ReputationBadge.test.tsx`
Expected: 4 PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/gamification/ReputationBadge.tsx src/test/components/ReputationBadge.test.tsx src/index.css
git commit -m "feat: add pill ReputationBadge component with tier-based styling"
```

---

## Task 2: Wire ReputationBadge into Existing Components

**Files:**
- Modify: `src/components/community/PostCard.tsx`
- Modify: `src/pages/LeaderboardPage.tsx`
- Modify: `src/components/profile/ProfileCard.tsx`

- [ ] **Step 1: Add badge to PostCard**

In `src/components/community/PostCard.tsx`, import and add after author name display:

```typescript
import { ReputationBadge } from '@/components/gamification/ReputationBadge';
```

Find the author name section and add the badge inline. The exact location depends on the existing markup — look for where `display_name` or author name is rendered and add:

```tsx
<ReputationBadge
  levelName={post.author_reputation_level ?? ''}
  badgeColor={post.author_badge_color ?? 'gray'}
  size="sm"
/>
```

Note: The community_posts query in `useCommunityPosts.ts` will need to join user_reputation view. For now, add the prop but pass empty string — Task 8 (Community Hub) will wire the data.

- [ ] **Step 2: Add badge to LeaderboardPage**

In `src/pages/LeaderboardPage.tsx`, import ReputationBadge and add after the display name in `LeaderboardRow`:

```typescript
import { ReputationBadge } from '@/components/gamification/ReputationBadge';
```

Add after the name display inside `LeaderboardRow`:
```tsx
<ReputationBadge levelName={entry.level_name ?? ''} badgeColor={entry.badge_color ?? 'gray'} size="sm" />
```

The leaderboard view (`leaderboard_top_users`) already joins `user_profiles` — it needs to also join `user_reputation`. We'll update the view in the achievements migration.

- [ ] **Step 3: Add badge to ProfileCard**

In `src/components/profile/ProfileCard.tsx`, import and add below the user display name:

```typescript
import { ReputationBadge } from '@/components/gamification/ReputationBadge';
import { useReputation } from '@/hooks/useReputation';
```

Inside the component, use the existing reputation data:
```tsx
const { data: reputation } = useReputation(userId);
// ...
<ReputationBadge
  levelName={reputation?.levelName ?? ''}
  badgeColor={reputation?.badgeColor ?? 'gray'}
/>
```

- [ ] **Step 4: Run build to verify no TypeScript errors**

Run: `bun run build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/components/community/PostCard.tsx src/pages/LeaderboardPage.tsx src/components/profile/ProfileCard.tsx
git commit -m "feat: wire ReputationBadge into PostCard, Leaderboard, ProfileCard"
```

---

## Task 3: Achievement System — Database Migration

**Files:**
- Create: `supabase/migrations/20260325600000_achievements.sql`

- [ ] **Step 1: Write migration**

```sql
-- F5: Multi-step Achievement System
-- Bronze → Silver → Gold → Diamond tiers for core actions
-- Plus single-badge achievements for milestones

-- Achievement categories enum
DO $$ BEGIN
  CREATE TYPE achievement_category AS ENUM ('reviews', 'orders', 'community', 'referrals', 'milestone');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Achievement tiers enum
DO $$ BEGIN
  CREATE TYPE achievement_tier AS ENUM ('bronze', 'silver', 'gold', 'diamond', 'single');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Achievements catalog
CREATE TABLE IF NOT EXISTS public.achievements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  category    achievement_category NOT NULL,
  tier        achievement_tier NOT NULL,
  title       text NOT NULL,
  description text NOT NULL,
  icon        text NOT NULL DEFAULT 'trophy',
  threshold   integer NOT NULL,
  points_reward integer NOT NULL DEFAULT 0,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "achievements_public_read"
  ON public.achievements FOR SELECT
  USING (true);

-- User achievement progress
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  progress       integer NOT NULL DEFAULT 0,
  unlocked_at    timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_achievements_own_read"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_achievements_own_insert"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_achievements_own_update"
  ON public.user_achievements FOR UPDATE
  USING (auth.uid() = user_id);

-- Seed: Core 4 tiered achievements
INSERT INTO public.achievements (slug, category, tier, title, description, icon, threshold, points_reward, sort_order) VALUES
  -- Reviews
  ('review_bronze',   'reviews',   'bronze',  'First Review',     'Write your first product review',          'pencil',  1,   25,  10),
  ('review_silver',   'reviews',   'silver',  'Review Regular',   'Write 10 product reviews',                 'pencil',  10,  75,  11),
  ('review_gold',     'reviews',   'gold',    'Review Expert',    'Write 25 product reviews',                 'pencil',  25,  200, 12),
  ('review_diamond',  'reviews',   'diamond', 'Review Legend',    'Write 50 product reviews',                 'pencil',  50,  500, 13),
  -- Orders
  ('order_bronze',    'orders',    'bronze',  'First Order',      'Place your first order',                   'package', 1,   25,  20),
  ('order_silver',    'orders',    'silver',  'Loyal Customer',   'Place 10 orders',                          'package', 10,  75,  21),
  ('order_gold',      'orders',    'gold',    'Super Shopper',    'Place 25 orders',                          'package', 25,  200, 22),
  ('order_diamond',   'orders',    'diamond', 'Diamond Buyer',    'Place 50 orders',                          'package', 50,  500, 23),
  -- Community
  ('community_bronze','community', 'bronze',  'First Post',       'Make your first community post',           'message-circle', 1,   25,  30),
  ('community_silver','community', 'silver',  'Active Member',    'Make 10 community posts',                  'message-circle', 10,  75,  31),
  ('community_gold',  'community', 'gold',    'Community Star',   'Make 25 community posts',                  'message-circle', 25,  200, 32),
  ('community_diamond','community','diamond', 'Community Legend',  'Make 50 community posts',                  'message-circle', 50,  500, 33),
  -- Referrals
  ('referral_bronze', 'referrals', 'bronze',  'First Referral',   'Refer your first friend',                  'users',   1,   50,  40),
  ('referral_silver', 'referrals', 'silver',  'Networker',        'Refer 5 friends',                          'users',   5,   150, 41),
  ('referral_gold',   'referrals', 'gold',    'Ambassador',       'Refer 15 friends',                         'users',   15,  400, 42),
  ('referral_diamond','referrals', 'diamond', 'Mega Referrer',    'Refer 30 friends',                         'users',   30,  1000,43),
  -- Milestones (single badges)
  ('first_spin',      'milestone', 'single',  'Lucky Spinner',    'Complete your first daily spin',           'disc',    1,   10,  50),
  ('quiz_complete',   'milestone', 'single',  'Flavor Explorer',  'Complete the flavor quiz',                 'clipboard-check', 1, 25, 51),
  ('profile_setup',   'milestone', 'single',  'Identity Set',     'Set up your profile and avatar',           'user-check', 1, 15, 52),
  ('streak_7',        'milestone', 'single',  'Week Warrior',     'Maintain a 7-day login streak',            'flame',   7,   50,  53)
ON CONFLICT (slug) DO NOTHING;

-- Update leaderboard view to include reputation
CREATE OR REPLACE VIEW public.leaderboard_top_users AS
SELECT
  pb.user_id,
  pb.balance AS total_points,
  up.display_name,
  a.image_url AS avatar_url,
  rl.name AS level_name,
  rl.badge_color
FROM public.points_balances pb
LEFT JOIN public.user_profiles up ON up.user_id = pb.user_id
LEFT JOIN public.avatars a ON a.id = up.avatar_id
LEFT JOIN public.user_reputation ur ON ur.user_id = pb.user_id
LEFT JOIN public.reputation_levels rl ON rl.level = ur.level
ORDER BY pb.balance DESC
LIMIT 50;

GRANT SELECT ON public.leaderboard_top_users TO authenticated, anon;
```

- [ ] **Step 2: Apply migration via Supabase MCP**

Run: Apply via `mcp__e6f5d921-a1df-492d-926a-b6bc7c7eb282__apply_migration`
Name: `achievements`
SQL: contents of the migration file above

- [ ] **Step 3: Verify tables created**

Run: `mcp__e6f5d921-a1df-492d-926a-b6bc7c7eb282__execute_sql`
Query: `SELECT count(*) FROM achievements;`
Expected: 20 rows

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260325600000_achievements.sql
git commit -m "feat: add achievements + user_achievements tables with 20 seeded achievements"
```

---

## Task 4: Achievement System — Types + Hook

**Files:**
- Modify: `src/integrations/supabase/types.ts`
- Create: `src/hooks/useAchievements.ts`
- Create: `src/test/hooks/useAchievements.test.ts`

- [ ] **Step 1: Add types to types.ts**

Add to the `Tables` section of `src/integrations/supabase/types.ts`:

```typescript
achievements: {
  Row: {
    id: string
    slug: string
    category: Database["public"]["Enums"]["achievement_category"]
    tier: Database["public"]["Enums"]["achievement_tier"]
    title: string
    description: string
    icon: string
    threshold: number
    points_reward: number
    sort_order: number
    created_at: string
  }
  Insert: {
    id?: string
    slug: string
    category: Database["public"]["Enums"]["achievement_category"]
    tier: Database["public"]["Enums"]["achievement_tier"]
    title: string
    description: string
    icon?: string
    threshold: number
    points_reward?: number
    sort_order?: number
    created_at?: string
  }
  Update: {
    id?: string
    slug?: string
    category?: Database["public"]["Enums"]["achievement_category"]
    tier?: Database["public"]["Enums"]["achievement_tier"]
    title?: string
    description?: string
    icon?: string
    threshold?: number
    points_reward?: number
    sort_order?: number
    created_at?: string
  }
  Relationships: []
}
user_achievements: {
  Row: {
    id: string
    user_id: string
    achievement_id: string
    progress: number
    unlocked_at: string | null
    created_at: string
  }
  Insert: {
    id?: string
    user_id: string
    achievement_id: string
    progress?: number
    unlocked_at?: string | null
    created_at?: string
  }
  Update: {
    id?: string
    user_id?: string
    achievement_id?: string
    progress?: number
    unlocked_at?: string | null
    created_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "user_achievements_achievement_id_fkey"
      columns: ["achievement_id"]
      isOneToOne: false
      referencedRelation: "achievements"
      referencedColumns: ["id"]
    }
  ]
}
```

Add to `Enums` section:
```typescript
achievement_category: "reviews" | "orders" | "community" | "referrals" | "milestone"
achievement_tier: "bronze" | "silver" | "gold" | "diamond" | "single"
```

- [ ] **Step 2: Write hook test**

```typescript
// src/test/hooks/useAchievements.test.ts
import { describe, it, expect, vi } from 'vitest';

// We test the helper functions, not the hook itself (requires full provider setup)
import { groupByCategory, TIER_ORDER } from '@/hooks/useAchievements';

describe('useAchievements helpers', () => {
  it('TIER_ORDER sorts bronze < silver < gold < diamond', () => {
    expect(TIER_ORDER.bronze).toBeLessThan(TIER_ORDER.silver);
    expect(TIER_ORDER.silver).toBeLessThan(TIER_ORDER.gold);
    expect(TIER_ORDER.gold).toBeLessThan(TIER_ORDER.diamond);
  });

  it('groupByCategory groups achievements correctly', () => {
    const achievements = [
      { id: '1', category: 'reviews', tier: 'bronze', title: 'First Review' },
      { id: '2', category: 'reviews', tier: 'silver', title: 'Review Regular' },
      { id: '3', category: 'orders', tier: 'bronze', title: 'First Order' },
    ];
    const grouped = groupByCategory(achievements as any);
    expect(grouped.reviews).toHaveLength(2);
    expect(grouped.orders).toHaveLength(1);
  });
});
```

- [ ] **Step 3: Implement useAchievements hook**

```typescript
// src/hooks/useAchievements.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AchievementWithProgress {
  id: string;
  slug: string;
  category: string;
  tier: string;
  title: string;
  description: string;
  icon: string;
  threshold: number;
  points_reward: number;
  sort_order: number;
  progress: number;
  unlocked: boolean;
  unlocked_at: string | null;
}

export const TIER_ORDER: Record<string, number> = {
  bronze: 0,
  silver: 1,
  gold: 2,
  diamond: 3,
  single: 4,
};

export const TIER_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  bronze:  { bg: 'bg-orange-900/20', border: 'border-orange-700/30', text: 'text-orange-400' },
  silver:  { bg: 'bg-slate-400/15', border: 'border-slate-400/30', text: 'text-slate-300' },
  gold:    { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400' },
  diamond: { bg: 'bg-cyan-400/15', border: 'border-cyan-400/30', text: 'text-cyan-300' },
  single:  { bg: 'bg-violet-500/15', border: 'border-violet-500/30', text: 'text-violet-400' },
};

export function groupByCategory(
  achievements: AchievementWithProgress[]
): Record<string, AchievementWithProgress[]> {
  const groups: Record<string, AchievementWithProgress[]> = {};
  for (const a of achievements) {
    if (!groups[a.category]) groups[a.category] = [];
    groups[a.category].push(a);
  }
  // Sort within each category by sort_order
  for (const cat of Object.keys(groups)) {
    groups[cat].sort((a, b) => a.sort_order - b.sort_order);
  }
  return groups;
}

const CATEGORY_ORDER = ['reviews', 'orders', 'community', 'referrals', 'milestone'];

export function useAchievements(userId: string | null) {
  return useQuery<{
    achievements: AchievementWithProgress[];
    grouped: Record<string, AchievementWithProgress[]>;
    unlockedCount: number;
    totalCount: number;
  }>({
    queryKey: ['achievements', userId],
    queryFn: async () => {
      // Fetch all achievements
      const { data: allAchievements, error: achError } = await supabase
        .from('achievements')
        .select('*')
        .order('sort_order', { ascending: true });

      if (achError) {
        console.error('achievements query failed', achError);
        return { achievements: [], grouped: {}, unlockedCount: 0, totalCount: 0 };
      }

      // Fetch user progress if logged in
      let userProgress: Record<string, { progress: number; unlocked_at: string | null }> = {};

      if (userId) {
        const { data: progressRows, error: progError } = await supabase
          .from('user_achievements')
          .select('achievement_id, progress, unlocked_at')
          .eq('user_id', userId);

        if (!progError && progressRows) {
          for (const row of progressRows) {
            userProgress[row.achievement_id] = {
              progress: row.progress,
              unlocked_at: row.unlocked_at,
            };
          }
        }
      }

      const achievements: AchievementWithProgress[] = (allAchievements ?? []).map((a) => {
        const up = userProgress[a.id];
        return {
          ...a,
          progress: up?.progress ?? 0,
          unlocked: !!up?.unlocked_at,
          unlocked_at: up?.unlocked_at ?? null,
        };
      });

      const grouped = groupByCategory(achievements);
      const unlockedCount = achievements.filter((a) => a.unlocked).length;

      return { achievements, grouped, unlockedCount, totalCount: achievements.length };
    },
    staleTime: 60_000,
  });
}
```

- [ ] **Step 4: Run tests**

Run: `bun run test -- src/test/hooks/useAchievements.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/integrations/supabase/types.ts src/hooks/useAchievements.ts src/test/hooks/useAchievements.test.ts
git commit -m "feat: add useAchievements hook with tier ordering and category grouping"
```

---

## Task 5: Achievement UI Components

**Files:**
- Create: `src/components/gamification/AchievementCard.tsx`
- Create: `src/components/gamification/AchievementGrid.tsx`
- Create: `src/components/gamification/AchievementToast.tsx`
- Create: `src/test/components/AchievementCard.test.tsx`

- [ ] **Step 1: Write AchievementCard test**

```typescript
// src/test/components/AchievementCard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AchievementCard } from '@/components/gamification/AchievementCard';

describe('AchievementCard', () => {
  const baseAchievement = {
    id: '1', slug: 'review_bronze', category: 'reviews', tier: 'bronze',
    title: 'First Review', description: 'Write your first review',
    icon: 'pencil', threshold: 1, points_reward: 25, sort_order: 10,
    progress: 0, unlocked: false, unlocked_at: null,
  };

  it('shows locked state when not unlocked', () => {
    render(<AchievementCard achievement={baseAchievement} />);
    expect(screen.getByText('First Review')).toBeInTheDocument();
    expect(screen.getByText('0 / 1')).toBeInTheDocument();
  });

  it('shows unlocked state with checkmark', () => {
    render(<AchievementCard achievement={{ ...baseAchievement, unlocked: true, progress: 1 }} />);
    expect(screen.getByText('First Review')).toBeInTheDocument();
    expect(screen.getByLabelText('Unlocked')).toBeInTheDocument();
  });

  it('shows progress bar for partial progress', () => {
    render(<AchievementCard achievement={{ ...baseAchievement, progress: 5, threshold: 10 }} />);
    expect(screen.getByText('5 / 10')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement AchievementCard**

```typescript
// src/components/gamification/AchievementCard.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Lock } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { type AchievementWithProgress, TIER_COLORS } from '@/hooks/useAchievements';

interface AchievementCardProps {
  achievement: AchievementWithProgress;
  className?: string;
}

function getIcon(name: string): React.ElementType {
  const icons = LucideIcons as Record<string, React.ElementType>;
  // Convert kebab-case to PascalCase
  const pascalName = name
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
  return icons[pascalName] ?? LucideIcons.Trophy;
}

export const AchievementCard = React.memo(function AchievementCard({
  achievement,
  className,
}: AchievementCardProps) {
  const { title, description, icon, tier, threshold, progress, unlocked, points_reward } = achievement;
  const tierStyle = TIER_COLORS[tier] ?? TIER_COLORS.bronze;
  const Icon = getIcon(icon);
  const pct = Math.min((progress / threshold) * 100, 100);

  return (
    <div
      className={cn(
        'relative rounded-xl border p-3 transition-all',
        tierStyle.bg,
        tierStyle.border,
        unlocked ? 'opacity-100' : 'opacity-70 hover:opacity-90',
        className,
      )}
    >
      {/* Unlocked check */}
      {unlocked && (
        <div
          aria-label="Unlocked"
          className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white"
        >
          <Check size={12} />
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', tierStyle.bg)}>
          {unlocked ? (
            <Icon size={20} className={tierStyle.text} />
          ) : (
            <Lock size={16} className="text-muted-foreground/50" />
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className={cn('text-sm font-semibold', unlocked ? tierStyle.text : 'text-muted-foreground')}>
            {title}
          </p>
          <p className="text-xs text-muted-foreground/70 line-clamp-1">{description}</p>

          {/* Progress bar */}
          {!unlocked && (
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-white/5">
                <div
                  className={cn('h-full rounded-full transition-all', unlocked ? 'bg-emerald-500' : 'bg-primary/60')}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground/60">
                {progress} / {threshold}
              </span>
            </div>
          )}

          {/* Points reward */}
          {points_reward > 0 && (
            <p className="mt-1 text-xs text-muted-foreground/50">+{points_reward} pts</p>
          )}
        </div>
      </div>
    </div>
  );
});
```

- [ ] **Step 3: Implement AchievementGrid**

```typescript
// src/components/gamification/AchievementGrid.tsx
import React from 'react';
import { AchievementCard } from './AchievementCard';
import { type AchievementWithProgress } from '@/hooks/useAchievements';
import { motion } from 'framer-motion';

const CATEGORY_LABELS: Record<string, string> = {
  reviews: 'Reviews',
  orders: 'Orders',
  community: 'Community',
  referrals: 'Referrals',
  milestone: 'Milestones',
};

const CATEGORY_ORDER = ['reviews', 'orders', 'community', 'referrals', 'milestone'];

interface AchievementGridProps {
  grouped: Record<string, AchievementWithProgress[]>;
  unlockedCount: number;
  totalCount: number;
}

export const AchievementGrid = React.memo(function AchievementGrid({
  grouped,
  unlockedCount,
  totalCount,
}: AchievementGridProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Achievements</h2>
        <span className="text-sm text-muted-foreground">
          {unlockedCount} / {totalCount} unlocked
        </span>
      </div>

      {/* Categories */}
      {CATEGORY_ORDER.map((cat) => {
        const items = grouped[cat];
        if (!items?.length) return null;
        return (
          <div key={cat}>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {CATEGORY_LABELS[cat] ?? cat}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.4) }}
                >
                  <AchievementCard achievement={a} />
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
});
```

- [ ] **Step 4: Implement AchievementToast**

```typescript
// src/components/gamification/AchievementToast.tsx
import React from 'react';
import { Trophy } from 'lucide-react';
import { TIER_COLORS, type AchievementWithProgress } from '@/hooks/useAchievements';

interface AchievementToastProps {
  achievement: AchievementWithProgress;
}

export function AchievementToast({ achievement }: AchievementToastProps) {
  const tier = TIER_COLORS[achievement.tier] ?? TIER_COLORS.bronze;
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tier.bg}`}>
        <Trophy size={20} className={tier.text} />
      </div>
      <div>
        <p className="text-sm font-bold">Achievement Unlocked!</p>
        <p className={`text-sm ${tier.text}`}>{achievement.title}</p>
        {achievement.points_reward > 0 && (
          <p className="text-xs text-muted-foreground">+{achievement.points_reward} SnusPoints</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run tests**

Run: `bun run test -- src/test/components/AchievementCard.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/gamification/AchievementCard.tsx src/components/gamification/AchievementGrid.tsx src/components/gamification/AchievementToast.tsx src/test/components/AchievementCard.test.tsx
git commit -m "feat: add AchievementCard, AchievementGrid, and AchievementToast components"
```

---

## Task 6: Wire Achievements into Account Page

**Files:**
- Modify: `src/pages/AccountPage.tsx`

- [ ] **Step 1: Import and add AchievementGrid to AccountPage**

Read `src/pages/AccountPage.tsx` to find the existing sections. Add achievements section after the existing profile/avatar section:

```typescript
import { useAchievements } from '@/hooks/useAchievements';
import { AchievementGrid } from '@/components/gamification/AchievementGrid';
```

Inside the component, add:
```tsx
const { data: achievementData } = useAchievements(user?.id ?? null);
```

In the JSX, add a section:
```tsx
{achievementData && (
  <section className="mt-8">
    <AchievementGrid
      grouped={achievementData.grouped}
      unlockedCount={achievementData.unlockedCount}
      totalCount={achievementData.totalCount}
    />
  </section>
)}
```

- [ ] **Step 2: Run build**

Run: `bun run build`
Expected: Succeeds

- [ ] **Step 3: Commit**

```bash
git add src/pages/AccountPage.tsx
git commit -m "feat: add achievements grid to account page"
```

---

## Task 7: Pouch Character Builder — Database + Types

**Files:**
- Create: `supabase/migrations/20260325600001_pouch_parts.sql`
- Modify: `src/integrations/supabase/types.ts`

- [ ] **Step 1: Write migration**

```sql
-- F6: Pouch Character Builder
-- Users build a custom nicotine pouch avatar from layered SVG parts

CREATE TABLE IF NOT EXISTS public.pouch_parts (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category       text NOT NULL CHECK (category IN ('shape', 'color', 'expression', 'accessory', 'background')),
  name           text NOT NULL,
  svg_data       text NOT NULL,
  unlock_condition text NOT NULL DEFAULT 'default',
  unlock_value   integer NOT NULL DEFAULT 0,
  rarity         text NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  sort_order     integer NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pouch_parts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pouch_parts_public_read"
  ON public.pouch_parts FOR SELECT
  USING (true);

CREATE TABLE IF NOT EXISTS public.user_pouch_avatars (
  user_id        uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  shape_id       uuid REFERENCES public.pouch_parts(id),
  color_id       uuid REFERENCES public.pouch_parts(id),
  expression_id  uuid REFERENCES public.pouch_parts(id),
  accessory_id   uuid REFERENCES public.pouch_parts(id),
  background_id  uuid REFERENCES public.pouch_parts(id),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_pouch_avatars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_pouch_avatars_own_read"
  ON public.user_pouch_avatars FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_pouch_avatars_own_upsert"
  ON public.user_pouch_avatars FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_pouch_avatars_own_update"
  ON public.user_pouch_avatars FOR UPDATE
  USING (auth.uid() = user_id);

-- Seed: Base parts (SVG inline data)
-- Shapes: the pouch body silhouette
INSERT INTO public.pouch_parts (category, name, svg_data, unlock_condition, rarity, sort_order) VALUES
  ('shape', 'Classic Pouch', '<ellipse cx="50" cy="40" rx="40" ry="28" fill="currentColor" />', 'default', 'common', 1),
  ('shape', 'Round Pouch', '<circle cx="50" cy="40" r="35" fill="currentColor" />', 'default', 'common', 2),
  ('shape', 'Slim Pouch', '<rect x="15" y="22" width="70" height="36" rx="18" fill="currentColor" />', 'default', 'common', 3),
  ('shape', 'Star Pouch', '<polygon points="50,8 61,35 90,35 67,52 76,80 50,62 24,80 33,52 10,35 39,35" fill="currentColor" />', 'reputation:3', 'rare', 4),
  ('shape', 'Diamond Pouch', '<polygon points="50,5 85,40 50,75 15,40" fill="currentColor" />', 'achievement:order_gold', 'epic', 5);

-- Colors: the fill color for the pouch
INSERT INTO public.pouch_parts (category, name, svg_data, unlock_condition, rarity, sort_order) VALUES
  ('color', 'Mint Green', '#22c55e', 'default', 'common', 1),
  ('color', 'Berry Purple', '#a855f7', 'default', 'common', 2),
  ('color', 'Citrus Orange', '#f97316', 'default', 'common', 3),
  ('color', 'Ice Blue', '#38bdf8', 'reputation:2', 'rare', 4),
  ('color', 'Royal Gold', '#eab308', 'reputation:4', 'epic', 5);

-- Expressions: the face on the pouch
INSERT INTO public.pouch_parts (category, name, svg_data, unlock_condition, rarity, sort_order) VALUES
  ('expression', 'Happy', '<circle cx="38" cy="36" r="3" fill="white"/><circle cx="62" cy="36" r="3" fill="white"/><path d="M35 48 Q50 58 65 48" stroke="white" fill="none" stroke-width="2" stroke-linecap="round"/>', 'default', 'common', 1),
  ('expression', 'Cool', '<rect x="30" y="33" width="16" height="6" rx="3" fill="white"/><rect x="54" y="33" width="16" height="6" rx="3" fill="white"/><path d="M38 50 L50 50 L62 50" stroke="white" fill="none" stroke-width="2" stroke-linecap="round"/>', 'default', 'common', 2),
  ('expression', 'Wink', '<circle cx="38" cy="36" r="3" fill="white"/><path d="M56 36 Q62 32 68 36" stroke="white" fill="none" stroke-width="2"/><path d="M35 48 Q50 58 65 48" stroke="white" fill="none" stroke-width="2" stroke-linecap="round"/>', 'default', 'common', 3),
  ('expression', 'Star Eyes', '<text x="32" y="42" font-size="14" fill="white">&#9733;</text><text x="56" y="42" font-size="14" fill="white">&#9733;</text><circle cx="50" cy="54" r="5" fill="white"/>', 'reputation:3', 'rare', 4),
  ('expression', 'Fire', '<text x="30" y="42" font-size="16">&#128293;</text><text x="54" y="42" font-size="16">&#128293;</text><path d="M35 52 Q50 60 65 52" stroke="white" fill="none" stroke-width="2.5" stroke-linecap="round"/>', 'achievement:streak_7', 'epic', 5);

-- Accessories: hats, glasses, etc. positioned above/on the pouch
INSERT INTO public.pouch_parts (category, name, svg_data, unlock_condition, rarity, sort_order) VALUES
  ('accessory', 'None', '', 'default', 'common', 0),
  ('accessory', 'Party Hat', '<polygon points="50,0 40,18 60,18" fill="#f472b6"/><circle cx="50" cy="0" r="3" fill="#fbbf24"/>', 'default', 'common', 1),
  ('accessory', 'Crown', '<path d="M30,12 L35,4 L42,10 L50,2 L58,10 L65,4 L70,12 Z" fill="#eab308"/>', 'reputation:5', 'legendary', 2),
  ('accessory', 'Headphones', '<path d="M28,28 Q28,10 50,10 Q72,10 72,28" stroke="#64748b" fill="none" stroke-width="3"/><circle cx="28" cy="30" r="6" fill="#64748b"/><circle cx="72" cy="30" r="6" fill="#64748b"/>', 'achievement:community_silver', 'rare', 3),
  ('accessory', 'Viking Helmet', '<path d="M25,20 Q50,5 75,20 L70,30 Q50,22 30,30 Z" fill="#94a3b8"/><path d="M28,18 Q20,5 15,0" stroke="#94a3b8" fill="none" stroke-width="3"/><path d="M72,18 Q80,5 85,0" stroke="#94a3b8" fill="none" stroke-width="3"/>', 'achievement:order_diamond', 'legendary', 4);

-- Backgrounds: behind the pouch
INSERT INTO public.pouch_parts (category, name, svg_data, unlock_condition, rarity, sort_order) VALUES
  ('background', 'None', '', 'default', 'common', 0),
  ('background', 'Mint Burst', '<radial-gradient id="bg-mint"><stop offset="0%" stop-color="#22c55e" stop-opacity="0.2"/><stop offset="100%" stop-color="transparent"/></radial-gradient><circle cx="50" cy="45" r="48" fill="url(#bg-mint)"/>', 'default', 'common', 1),
  ('background', 'Arctic Glow', '<radial-gradient id="bg-ice"><stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25"/><stop offset="100%" stop-color="transparent"/></radial-gradient><circle cx="50" cy="45" r="48" fill="url(#bg-ice)"/>', 'reputation:2', 'rare', 2),
  ('background', 'Fire Ring', '<circle cx="50" cy="45" r="44" stroke="#f97316" stroke-width="2" fill="none" opacity="0.4"/><circle cx="50" cy="45" r="48" stroke="#ef4444" stroke-width="1" fill="none" opacity="0.2"/>', 'achievement:streak_7', 'epic', 3),
  ('background', 'Legend Aura', '<radial-gradient id="bg-legend"><stop offset="0%" stop-color="#eab308" stop-opacity="0.3"/><stop offset="50%" stop-color="#a855f7" stop-opacity="0.15"/><stop offset="100%" stop-color="transparent"/></radial-gradient><circle cx="50" cy="45" r="48" fill="url(#bg-legend)"/>', 'reputation:5', 'legendary', 4);
```

- [ ] **Step 2: Apply migration via Supabase MCP**

- [ ] **Step 3: Verify**

Run SQL: `SELECT category, count(*) FROM pouch_parts GROUP BY category ORDER BY category;`
Expected: accessory=5, background=5, color=5, expression=5, shape=5

- [ ] **Step 4: Add types to types.ts**

Add to `Tables` section:

```typescript
pouch_parts: {
  Row: {
    id: string
    category: string
    name: string
    svg_data: string
    unlock_condition: string
    unlock_value: number
    rarity: string
    sort_order: number
    created_at: string
  }
  Insert: {
    id?: string
    category: string
    name: string
    svg_data: string
    unlock_condition?: string
    unlock_value?: number
    rarity?: string
    sort_order?: number
    created_at?: string
  }
  Update: {
    id?: string
    category?: string
    name?: string
    svg_data?: string
    unlock_condition?: string
    unlock_value?: number
    rarity?: string
    sort_order?: number
    created_at?: string
  }
  Relationships: []
}
user_pouch_avatars: {
  Row: {
    user_id: string
    shape_id: string | null
    color_id: string | null
    expression_id: string | null
    accessory_id: string | null
    background_id: string | null
    updated_at: string
  }
  Insert: {
    user_id: string
    shape_id?: string | null
    color_id?: string | null
    expression_id?: string | null
    accessory_id?: string | null
    background_id?: string | null
    updated_at?: string
  }
  Update: {
    user_id?: string
    shape_id?: string | null
    color_id?: string | null
    expression_id?: string | null
    accessory_id?: string | null
    background_id?: string | null
    updated_at?: string
  }
  Relationships: []
}
```

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260325600001_pouch_parts.sql src/integrations/supabase/types.ts
git commit -m "feat: add pouch_parts + user_pouch_avatars tables with 25 seeded SVG parts"
```

---

## Task 8: Pouch Builder — Hook + Components

**Files:**
- Create: `src/hooks/usePouchBuilder.ts`
- Create: `src/components/gamification/PouchAvatar.tsx`
- Create: `src/components/gamification/PouchBuilder.tsx`
- Create: `src/components/gamification/PouchPartPicker.tsx`

- [ ] **Step 1: Implement usePouchBuilder hook**

```typescript
// src/hooks/usePouchBuilder.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PouchPart {
  id: string;
  category: string;
  name: string;
  svg_data: string;
  unlock_condition: string;
  unlock_value: number;
  rarity: string;
  sort_order: number;
}

export interface PouchSelection {
  shape_id: string | null;
  color_id: string | null;
  expression_id: string | null;
  accessory_id: string | null;
  background_id: string | null;
}

const CATEGORIES = ['shape', 'color', 'expression', 'accessory', 'background'] as const;

export function usePouchParts() {
  return useQuery<Record<string, PouchPart[]>>({
    queryKey: ['pouch_parts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pouch_parts')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('pouch_parts query failed', error);
        return {};
      }

      const grouped: Record<string, PouchPart[]> = {};
      for (const cat of CATEGORIES) grouped[cat] = [];
      for (const part of data ?? []) {
        if (grouped[part.category]) grouped[part.category].push(part);
      }
      return grouped;
    },
    staleTime: 5 * 60_000,
  });
}

export function usePouchAvatar(userId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery<PouchSelection>({
    queryKey: ['pouch_avatar', userId],
    queryFn: async () => {
      if (!userId) return { shape_id: null, color_id: null, expression_id: null, accessory_id: null, background_id: null };

      const { data, error } = await supabase
        .from('user_pouch_avatars')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('user_pouch_avatars query failed', error);
      }

      return {
        shape_id: data?.shape_id ?? null,
        color_id: data?.color_id ?? null,
        expression_id: data?.expression_id ?? null,
        accessory_id: data?.accessory_id ?? null,
        background_id: data?.background_id ?? null,
      };
    },
    enabled: !!userId,
    staleTime: 60_000,
  });

  const saveMutation = useMutation({
    mutationFn: async (selection: PouchSelection) => {
      if (!userId) throw new Error('Not logged in');

      const { error } = await supabase
        .from('user_pouch_avatars')
        .upsert({
          user_id: userId,
          ...selection,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pouch_avatar', userId] });
    },
  });

  return { selection: query.data, isLoading: query.isLoading, saveAvatar: saveMutation.mutate, isSaving: saveMutation.isPending };
}
```

- [ ] **Step 2: Implement PouchAvatar renderer**

```typescript
// src/components/gamification/PouchAvatar.tsx
import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { PouchPart } from '@/hooks/usePouchBuilder';

interface PouchAvatarProps {
  shape?: PouchPart | null;
  color?: PouchPart | null;
  expression?: PouchPart | null;
  accessory?: PouchPart | null;
  background?: PouchPart | null;
  size?: number;
  className?: string;
}

export const PouchAvatar = React.memo(function PouchAvatar({
  shape,
  color,
  expression,
  accessory,
  background,
  size = 80,
  className,
}: PouchAvatarProps) {
  const fillColor = color?.svg_data ?? '#22c55e';

  const svgContent = useMemo(() => {
    const parts: string[] = [];

    // Background (behind everything)
    if (background?.svg_data) {
      // Inject defs for gradients
      const hasDefs = background.svg_data.includes('<radial-gradient') || background.svg_data.includes('<linear-gradient');
      if (hasDefs) {
        const defsMatch = background.svg_data.match(/(<(?:radial|linear)-gradient[^]*?<\/(?:radial|linear)-gradient>)/);
        if (defsMatch) {
          const gradientDef = defsMatch[1];
          const rest = background.svg_data.replace(defsMatch[0], '');
          parts.push(`<defs>${gradientDef}</defs>`);
          parts.push(rest);
        }
      } else {
        parts.push(background.svg_data);
      }
    }

    // Shape with fill color
    if (shape?.svg_data) {
      parts.push(`<g style="color:${fillColor}">${shape.svg_data}</g>`);
    }

    // Expression (face)
    if (expression?.svg_data) {
      parts.push(expression.svg_data);
    }

    // Accessory (on top)
    if (accessory?.svg_data) {
      parts.push(accessory.svg_data);
    }

    return parts.join('\n');
  }, [shape, color, expression, accessory, background, fillColor]);

  return (
    <div
      className={cn('inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 80"
        width={size}
        height={size * 0.8}
        xmlns="http://www.w3.org/2000/svg"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
});
```

- [ ] **Step 3: Implement PouchPartPicker**

```typescript
// src/components/gamification/PouchPartPicker.tsx
import React, { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import type { PouchPart } from '@/hooks/usePouchBuilder';

interface PouchPartPickerProps {
  parts: PouchPart[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  category: string;
}

const RARITY_BORDER: Record<string, string> = {
  common: 'border-white/10 hover:border-white/30',
  rare: 'border-blue-500/30 hover:border-blue-500/50',
  epic: 'border-purple-500/30 hover:border-purple-500/50',
  legendary: 'border-amber-500/30 hover:border-amber-500/50',
};

export const PouchPartPicker = React.memo(function PouchPartPicker({
  parts,
  selectedId,
  onSelect,
  category,
}: PouchPartPickerProps) {
  const handleSelect = useCallback(
    (id: string) => { onSelect(id); },
    [onSelect],
  );

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {parts.map((part) => {
        const isSelected = part.id === selectedId;
        const isLocked = part.unlock_condition !== 'default';
        // TODO: check actual unlock status against user data

        return (
          <button
            key={part.id}
            onClick={() => !isLocked && handleSelect(part.id)}
            disabled={isLocked}
            aria-label={`Select ${part.name}`}
            className={cn(
              'relative flex flex-col items-center gap-1 rounded-lg border p-2 transition-all',
              RARITY_BORDER[part.rarity] ?? RARITY_BORDER.common,
              isSelected && 'ring-2 ring-primary border-primary/50 bg-primary/10',
              isLocked && 'opacity-40 cursor-not-allowed',
            )}
          >
            {category === 'color' ? (
              <div
                className="h-8 w-8 rounded-full border border-white/10"
                style={{ backgroundColor: part.svg_data }}
              />
            ) : (
              <div className="h-8 w-8 flex items-center justify-center">
                {part.svg_data ? (
                  <svg viewBox="0 0 100 80" width={32} height={26}>
                    <g dangerouslySetInnerHTML={{ __html: part.svg_data }} />
                  </svg>
                ) : (
                  <span className="text-xs text-muted-foreground">None</span>
                )}
              </div>
            )}
            <span className="text-[10px] text-center leading-tight text-muted-foreground line-clamp-1">
              {part.name}
            </span>
            {isLocked && (
              <Lock size={12} className="absolute top-1 right-1 text-muted-foreground/50" />
            )}
          </button>
        );
      })}
    </div>
  );
});
```

- [ ] **Step 4: Implement PouchBuilder**

```typescript
// src/components/gamification/PouchBuilder.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PouchAvatar } from './PouchAvatar';
import { PouchPartPicker } from './PouchPartPicker';
import { usePouchParts, usePouchAvatar, type PouchSelection, type PouchPart } from '@/hooks/usePouchBuilder';
import { Save, Palette, Smile, Sparkles, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TABS = [
  { key: 'shape', label: 'Shape', icon: Sparkles },
  { key: 'color', label: 'Color', icon: Palette },
  { key: 'expression', label: 'Face', icon: Smile },
  { key: 'accessory', label: 'Gear', icon: Sparkles },
  { key: 'background', label: 'BG', icon: Image },
] as const;

interface PouchBuilderProps {
  userId: string;
}

export function PouchBuilder({ userId }: PouchBuilderProps) {
  const { data: parts = {} } = usePouchParts();
  const { selection, saveAvatar, isSaving } = usePouchAvatar(userId);
  const { toast } = useToast();

  const [local, setLocal] = useState<PouchSelection>({
    shape_id: null,
    color_id: null,
    expression_id: null,
    accessory_id: null,
    background_id: null,
  });

  // Sync from server when loaded
  React.useEffect(() => {
    if (selection) setLocal(selection);
  }, [selection]);

  const handleSelect = useCallback((category: string, partId: string) => {
    setLocal((prev) => ({ ...prev, [`${category}_id`]: partId }));
  }, []);

  const handleSave = useCallback(() => {
    saveAvatar(local, {
      onSuccess: () => toast({ title: 'Pouch avatar saved!' }),
      onError: () => toast({ title: 'Failed to save', variant: 'destructive' }),
    });
  }, [local, saveAvatar, toast]);

  // Resolve selected parts for preview
  const resolvedParts = useMemo(() => {
    const find = (cat: string, id: string | null): PouchPart | null => {
      if (!id) return null;
      return (parts[cat] ?? []).find((p) => p.id === id) ?? null;
    };
    return {
      shape: find('shape', local.shape_id),
      color: find('color', local.color_id),
      expression: find('expression', local.expression_id),
      accessory: find('accessory', local.accessory_id),
      background: find('background', local.background_id),
    };
  }, [parts, local]);

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="flex justify-center">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <PouchAvatar {...resolvedParts} size={120} />
        </div>
      </div>

      {/* Part pickers */}
      <Tabs defaultValue="shape">
        <TabsList className="w-full grid grid-cols-5">
          {TABS.map(({ key, label, icon: Icon }) => (
            <TabsTrigger key={key} value={key} className="flex items-center gap-1 text-xs">
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map(({ key }) => (
          <TabsContent key={key} value={key} className="mt-3">
            <PouchPartPicker
              parts={parts[key] ?? []}
              selectedId={local[`${key}_id` as keyof PouchSelection]}
              onSelect={(id) => handleSelect(key, id)}
              category={key}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Save */}
      <Button onClick={handleSave} disabled={isSaving} className="w-full">
        <Save size={16} className="mr-2" />
        {isSaving ? 'Saving...' : 'Save My Pouch'}
      </Button>
    </div>
  );
}
```

- [ ] **Step 5: Run build**

Run: `bun run build`
Expected: Succeeds

- [ ] **Step 6: Commit**

```bash
git add src/hooks/usePouchBuilder.ts src/components/gamification/PouchAvatar.tsx src/components/gamification/PouchBuilder.tsx src/components/gamification/PouchPartPicker.tsx
git commit -m "feat: add Pouch Character Builder with SVG layering and 25 parts"
```

---

## Task 9: Wire Pouch Builder into Account Page

**Files:**
- Modify: `src/pages/AccountPage.tsx`
- Modify: `src/components/profile/ProfileCard.tsx`

- [ ] **Step 1: Add PouchBuilder to AccountPage**

```typescript
import { PouchBuilder } from '@/components/gamification/PouchBuilder';
```

Add a section (e.g., in a tab or collapsible area):
```tsx
{user && (
  <section className="mt-8">
    <h2 className="text-lg font-bold mb-4">Customize Your Pouch Avatar</h2>
    <PouchBuilder userId={user.id} />
  </section>
)}
```

- [ ] **Step 2: Show PouchAvatar in ProfileCard if configured**

Import and conditionally render:
```typescript
import { PouchAvatar } from '@/components/gamification/PouchAvatar';
import { usePouchAvatar, usePouchParts } from '@/hooks/usePouchBuilder';
```

If user has a pouch avatar configured (`selection.shape_id` is not null), render `PouchAvatar` instead of the current `UserAvatar`.

- [ ] **Step 3: Run build and verify**

Run: `bun run build`
Expected: Succeeds

- [ ] **Step 4: Commit**

```bash
git add src/pages/AccountPage.tsx src/components/profile/ProfileCard.tsx
git commit -m "feat: wire PouchBuilder into AccountPage and ProfileCard"
```

---

## Task 10: Community Hub — Database + Hook

**Files:**
- Create: `supabase/migrations/20260325600002_community_questions.sql`
- Modify: `src/integrations/supabase/types.ts`
- Create: `src/hooks/useCommunityHub.ts`
- Create: `src/hooks/useCommunityAnswers.ts`

- [ ] **Step 1: Write migration for Q&A tables**

```sql
-- F7: Community Hub — Q&A Section
-- Questions with voted answers, category tagging

CREATE TABLE IF NOT EXISTS public.community_questions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title         text NOT NULL CHECK (char_length(title) BETWEEN 5 AND 200),
  body          text CHECK (char_length(body) <= 2000),
  category      text NOT NULL DEFAULT 'general' CHECK (category IN ('reviews', 'flavor-talk', 'new-releases', 'tips', 'general')),
  votes         integer NOT NULL DEFAULT 0,
  answers_count integer NOT NULL DEFAULT 0,
  accepted_answer_id uuid,
  is_resolved   boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.community_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "questions_public_read" ON public.community_questions FOR SELECT USING (true);
CREATE POLICY "questions_auth_insert" ON public.community_questions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "questions_own_update" ON public.community_questions FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.community_answers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.community_questions(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body        text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  votes       integer NOT NULL DEFAULT 0,
  is_accepted boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.community_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "answers_public_read" ON public.community_answers FOR SELECT USING (true);
CREATE POLICY "answers_auth_insert" ON public.community_answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "answers_own_update" ON public.community_answers FOR UPDATE USING (auth.uid() = user_id);

-- Answer vote tracking
CREATE TABLE IF NOT EXISTS public.community_answer_votes (
  user_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answer_id uuid NOT NULL REFERENCES public.community_answers(id) ON DELETE CASCADE,
  vote      smallint NOT NULL CHECK (vote IN (-1, 1)),
  PRIMARY KEY (user_id, answer_id)
);

ALTER TABLE public.community_answer_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "answer_votes_public_read" ON public.community_answer_votes FOR SELECT USING (true);
CREATE POLICY "answer_votes_auth_upsert" ON public.community_answer_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "answer_votes_own_update" ON public.community_answer_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "answer_votes_own_delete" ON public.community_answer_votes FOR DELETE USING (auth.uid() = user_id);

-- Auto-update answers_count on insert/delete
CREATE OR REPLACE FUNCTION update_question_answers_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_questions SET answers_count = answers_count + 1 WHERE id = NEW.question_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_questions SET answers_count = answers_count - 1 WHERE id = OLD.question_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_answers_count
  AFTER INSERT OR DELETE ON public.community_answers
  FOR EACH ROW EXECUTE FUNCTION update_question_answers_count();

-- Grant permissions
GRANT SELECT ON public.community_questions TO anon;
GRANT SELECT ON public.community_answers TO anon;
GRANT SELECT ON public.community_answer_votes TO anon;
```

- [ ] **Step 2: Apply migration and add types**

Apply via Supabase MCP. Add `community_questions`, `community_answers`, `community_answer_votes` to `types.ts`.

- [ ] **Step 3: Implement useCommunityHub hook**

```typescript
// src/hooks/useCommunityHub.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CommunityQuestion {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  category: string;
  votes: number;
  answers_count: number;
  is_resolved: boolean;
  created_at: string;
  author_name: string | null;
}

export type CommunityCategory = 'all' | 'reviews' | 'flavor-talk' | 'new-releases' | 'tips' | 'general';
export type SortOption = 'newest' | 'most_liked' | 'most_discussed';

export function useCommunityHub(category: CommunityCategory = 'all', sort: SortOption = 'newest') {
  // Global feed (reuses community_posts with no product_id filter)
  const postsQuery = useQuery({
    queryKey: ['community_hub_posts', category, sort],
    queryFn: async () => {
      let query = supabase
        .from('community_posts')
        .select('*, user_profiles!community_posts_user_id_fkey(display_name)')
        .is('product_id', null);  // Global posts (not product-scoped)

      if (sort === 'newest') query = query.order('created_at', { ascending: false });
      else if (sort === 'most_liked') query = query.order('likes_count', { ascending: false });
      else if (sort === 'most_discussed') query = query.order('comments_count', { ascending: false });

      query = query.limit(50);

      const { data, error } = await query;
      if (error) { console.error('community hub posts failed', error); return []; }
      return data ?? [];
    },
    staleTime: 30_000,
  });

  // Questions
  const questionsQuery = useQuery({
    queryKey: ['community_questions', category, sort],
    queryFn: async () => {
      let query = supabase
        .from('community_questions')
        .select('*');

      if (category !== 'all') query = query.eq('category', category);

      if (sort === 'newest') query = query.order('created_at', { ascending: false });
      else if (sort === 'most_liked') query = query.order('votes', { ascending: false });
      else if (sort === 'most_discussed') query = query.order('answers_count', { ascending: false });

      query = query.limit(50);

      const { data, error } = await query;
      if (error) { console.error('community questions failed', error); return []; }
      return (data ?? []) as CommunityQuestion[];
    },
    staleTime: 30_000,
  });

  return {
    posts: postsQuery.data ?? [],
    questions: questionsQuery.data ?? [],
    isLoading: postsQuery.isLoading || questionsQuery.isLoading,
  };
}
```

- [ ] **Step 4: Implement useCommunityAnswers hook**

```typescript
// src/hooks/useCommunityAnswers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CommunityAnswer {
  id: string;
  question_id: string;
  user_id: string;
  body: string;
  votes: number;
  is_accepted: boolean;
  created_at: string;
  author_name?: string | null;
}

export function useCommunityAnswers(questionId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery<CommunityAnswer[]>({
    queryKey: ['community_answers', questionId],
    queryFn: async () => {
      if (!questionId) return [];

      const { data, error } = await supabase
        .from('community_answers')
        .select('*')
        .eq('question_id', questionId)
        .order('is_accepted', { ascending: false })
        .order('votes', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) { console.error('answers query failed', error); return []; }
      return (data ?? []) as CommunityAnswer[];
    },
    enabled: !!questionId,
    staleTime: 30_000,
  });

  const createAnswer = useMutation({
    mutationFn: async ({ body }: { body: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      const { error } = await supabase
        .from('community_answers')
        .insert({ question_id: questionId!, user_id: user.id, body });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community_answers', questionId] });
      queryClient.invalidateQueries({ queryKey: ['community_questions'] });
    },
  });

  return {
    answers: query.data ?? [],
    isLoading: query.isLoading,
    submitAnswer: createAnswer.mutate,
    isSubmitting: createAnswer.isPending,
  };
}
```

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260325600002_community_questions.sql src/integrations/supabase/types.ts src/hooks/useCommunityHub.ts src/hooks/useCommunityAnswers.ts
git commit -m "feat: add community Q&A tables and hooks"
```

---

## Task 11: Community Hub — Page + Components

**Files:**
- Create: `src/components/community/QuestionCard.tsx`
- Create: `src/components/community/AnswerCard.tsx`
- Create: `src/components/community/CommunityTabs.tsx`
- Create: `src/pages/CommunityPage.tsx`

- [ ] **Step 1: Implement QuestionCard**

```typescript
// src/components/community/QuestionCard.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { MessageCircle, CheckCircle2 } from 'lucide-react';
import { type CommunityQuestion } from '@/hooks/useCommunityHub';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: CommunityQuestion;
  onClick: (id: string) => void;
}

export const QuestionCard = React.memo(function QuestionCard({
  question,
  onClick,
}: QuestionCardProps) {
  return (
    <motion.button
      onClick={() => onClick(question.id)}
      className="w-full text-left rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/8 transition-colors"
      whileHover={{ scale: 1.005 }}
    >
      <div className="flex items-start gap-3">
        {/* Vote count */}
        <div className="flex flex-col items-center gap-0.5 text-center min-w-[40px]">
          <span className="text-lg font-bold">{question.votes}</span>
          <span className="text-[10px] text-muted-foreground">votes</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold line-clamp-1">{question.title}</h3>
            {question.is_resolved && (
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            )}
          </div>
          {question.body && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{question.body}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground/60">
            <span className="flex items-center gap-1">
              <MessageCircle size={12} />
              {question.answers_count} answer{question.answers_count !== 1 ? 's' : ''}
            </span>
            <span>{new Date(question.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
});
```

- [ ] **Step 2: Implement CommunityTabs**

```typescript
// src/components/community/CommunityTabs.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import type { CommunityCategory } from '@/hooks/useCommunityHub';

const CATEGORIES: { key: CommunityCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'flavor-talk', label: 'Flavor Talk' },
  { key: 'new-releases', label: 'New Releases' },
  { key: 'tips', label: 'Tips & Tricks' },
  { key: 'general', label: 'General' },
];

interface CommunityTabsProps {
  active: CommunityCategory;
  onChange: (cat: CommunityCategory) => void;
}

export const CommunityTabs = React.memo(function CommunityTabs({
  active,
  onChange,
}: CommunityTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
      {CATEGORIES.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          aria-label={`Filter by ${label}`}
          className={cn(
            'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium border transition-colors',
            active === key
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
});
```

- [ ] **Step 3: Implement CommunityPage**

```typescript
// src/pages/CommunityPage.tsx
import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunityTabs } from '@/components/community/CommunityTabs';
import { QuestionCard } from '@/components/community/QuestionCard';
import { useCommunityHub, type CommunityCategory, type SortOption } from '@/hooks/useCommunityHub';
import { MessageSquare, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Reuse existing components
import { PostCard } from '@/components/community/PostCard';

export default function CommunityPage() {
  const [category, setCategory] = useState<CommunityCategory>('all');
  const [sort, setSort] = useState<SortOption>('newest');
  const { posts, questions, isLoading } = useCommunityHub(category, sort);

  const handleCategoryChange = useCallback((cat: CommunityCategory) => setCategory(cat), []);

  return (
    <Layout>
      <SEO title="Community" description="Join the SnusFriend community — share tips, ask questions, and connect with fellow pouch enthusiasts." />

      <div className="container max-w-4xl py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-1">Community Hub</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Share tips, ask questions, and connect with fellow pouch enthusiasts
          </p>
        </motion.div>

        {/* Category filter */}
        <CommunityTabs active={category} onChange={handleCategoryChange} />

        {/* Sort */}
        <div className="flex gap-2 mt-4 mb-6">
          {(['newest', 'most_liked', 'most_discussed'] as SortOption[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`text-xs px-2 py-1 rounded ${sort === s ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {s === 'newest' ? 'Newest' : s === 'most_liked' ? 'Most Liked' : 'Most Discussed'}
            </button>
          ))}
        </div>

        {/* Feed / Q&A tabs */}
        <Tabs defaultValue="feed">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="feed" className="flex items-center gap-1.5">
              <MessageSquare size={14} /> Feed
            </TabsTrigger>
            <TabsTrigger value="qa" className="flex items-center gap-1.5">
              <HelpCircle size={14} /> Ask the Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-4 space-y-3">
            {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
            {!isLoading && posts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No posts yet. Be the first to share something!
              </p>
            )}
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </TabsContent>

          <TabsContent value="qa" className="mt-4 space-y-3">
            {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
            {!isLoading && questions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No questions yet. Ask the community something!
              </p>
            )}
            {questions.map((q) => (
              <QuestionCard key={q.id} question={q} onClick={() => {}} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
```

- [ ] **Step 4: Add route and nav link**

In `src/App.tsx`, add lazy import:
```typescript
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
```

Add route:
```tsx
<Route path="/community" element={<CommunityPage />} />
```

In `src/components/layout/Header.tsx`, add to the nav links array:
```typescript
{ href: '/community', label: 'Community' },
```

Also add Leaderboard and Flavor Quiz links if not present:
```typescript
{ href: '/leaderboard', label: 'Leaderboard' },
```

- [ ] **Step 5: Run build**

Run: `bun run build`
Expected: Succeeds

- [ ] **Step 6: Commit**

```bash
git add src/components/community/QuestionCard.tsx src/components/community/CommunityTabs.tsx src/pages/CommunityPage.tsx src/App.tsx src/components/layout/Header.tsx
git commit -m "feat: add Community Hub page with feed + Q&A tabs and category filtering"
```

---

## Task 12: Final Integration + Build Verification

- [ ] **Step 1: Run full test suite**

Run: `bun run test`
Expected: All tests pass

- [ ] **Step 2: Run production build**

Run: `bun run build`
Expected: Build succeeds with no TypeScript errors

- [ ] **Step 3: Run lint**

Run: `bun run lint`
Expected: No errors (warnings acceptable)

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: gamification phase 3 — reputation badges, achievements, pouch builder, community hub"
```

---

## Summary

| Task | Feature | Est. Time |
|------|---------|-----------|
| 1 | ReputationBadge component + tests | 5 min |
| 2 | Wire badge into PostCard, Leaderboard, ProfileCard | 5 min |
| 3 | Achievement DB migration | 3 min |
| 4 | Achievement types + hook | 5 min |
| 5 | AchievementCard, Grid, Toast components | 8 min |
| 6 | Wire achievements into AccountPage | 3 min |
| 7 | Pouch parts DB + types | 5 min |
| 8 | Pouch builder hook + components | 10 min |
| 9 | Wire pouch builder into AccountPage | 3 min |
| 10 | Community Q&A DB + hooks | 5 min |
| 11 | Community page + components | 8 min |
| 12 | Final integration + build check | 3 min |
| **Total** | | **~63 min** |
