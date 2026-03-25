import { describe, it, expect } from 'vitest';
import { TIER_ORDER, groupByCategory } from '@/hooks/useAchievements';
import type { AchievementWithProgress } from '@/hooks/useAchievements';

/* ------------------------------------------------------------------ */
/*  Fixtures                                                            */
/* ------------------------------------------------------------------ */

function makeAchievement(
  overrides: Partial<AchievementWithProgress>
): AchievementWithProgress {
  return {
    id: 'a1',
    slug: 'test-achievement',
    category: 'reviews',
    tier: 'bronze',
    title: 'Test',
    description: 'A test achievement',
    icon: 'star',
    threshold: 1,
    points_reward: 10,
    sort_order: 0,
    created_at: '2024-01-01T00:00:00Z',
    progress: 0,
    unlocked: false,
    unlocked_at: null,
    ...overrides,
  };
}

/* ------------------------------------------------------------------ */
/*  TIER_ORDER                                                          */
/* ------------------------------------------------------------------ */

describe('TIER_ORDER', () => {
  it('has bronze as the lowest tier', () => {
    expect(TIER_ORDER.bronze).toBe(0);
  });

  it('orders tiers correctly: bronze < silver < gold < diamond < single', () => {
    expect(TIER_ORDER.bronze).toBeLessThan(TIER_ORDER.silver);
    expect(TIER_ORDER.silver).toBeLessThan(TIER_ORDER.gold);
    expect(TIER_ORDER.gold).toBeLessThan(TIER_ORDER.diamond);
    expect(TIER_ORDER.diamond).toBeLessThan(TIER_ORDER.single);
  });

  it('defines all 5 tiers', () => {
    const tiers = Object.keys(TIER_ORDER);
    expect(tiers).toContain('bronze');
    expect(tiers).toContain('silver');
    expect(tiers).toContain('gold');
    expect(tiers).toContain('diamond');
    expect(tiers).toContain('single');
    expect(tiers).toHaveLength(5);
  });
});

/* ------------------------------------------------------------------ */
/*  groupByCategory                                                     */
/* ------------------------------------------------------------------ */

describe('groupByCategory', () => {
  it('groups achievements by category', () => {
    const achievements = [
      makeAchievement({ id: 'r1', category: 'reviews', sort_order: 0 }),
      makeAchievement({ id: 'o1', category: 'orders', sort_order: 0 }),
      makeAchievement({ id: 'r2', category: 'reviews', sort_order: 1 }),
    ];

    const grouped = groupByCategory(achievements);

    expect(Object.keys(grouped)).toHaveLength(2);
    expect(grouped['reviews']).toHaveLength(2);
    expect(grouped['orders']).toHaveLength(1);
  });

  it('sorts achievements within each category by sort_order ascending', () => {
    const achievements = [
      makeAchievement({ id: 'r3', category: 'reviews', sort_order: 2 }),
      makeAchievement({ id: 'r1', category: 'reviews', sort_order: 0 }),
      makeAchievement({ id: 'r2', category: 'reviews', sort_order: 1 }),
    ];

    const grouped = groupByCategory(achievements);

    expect(grouped['reviews'][0].id).toBe('r1');
    expect(grouped['reviews'][1].id).toBe('r2');
    expect(grouped['reviews'][2].id).toBe('r3');
  });

  it('returns an empty object for an empty input array', () => {
    expect(groupByCategory([])).toEqual({});
  });

  it('handles all supported categories', () => {
    const categories = ['reviews', 'orders', 'community', 'referrals', 'milestone'];
    const achievements = categories.map((category, i) =>
      makeAchievement({ id: `a${i}`, category, sort_order: i })
    );

    const grouped = groupByCategory(achievements);

    for (const category of categories) {
      expect(grouped[category]).toHaveLength(1);
    }
  });
});
