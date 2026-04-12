/**
 * Canonical rewards configuration — single source of truth.
 *
 * Every page, component, and DB trigger that references reward values
 * MUST import from here. Never hardcode SnusCoin amounts elsewhere.
 */
export const rewards = {
  // ── Earning ──
  // 10 SnusCoins per €1. Must match the `pts := floor(NEW.total_price * 10)`
  // calculation in supabase/migrations/20260320000002_snuspoints_and_audit_fixes.sql
  // (trg_award_points on orders). Any change here should be paired with a new
  // migration updating the trigger.
  earnRatePerEur: 10,

  // ── Reviews ──
  verifiedReviewFirst: 40,   // First verified review on a product
  verifiedReview: 25,        // Subsequent verified reviews
  communityReview: 5,        // Review without verified purchase

  // ── Referral ──
  referralSelf: 75,
  referralFriend: 25,

  // ── Daily ──
  dailyDropMin: 5,
  dailyDropMax: 50,

  // ── Missions ──
  missionMin: 10,
  missionMax: 100,

  // ── Bonuses ──
  welcomeBonus: 25,
  birthdayBonus: 50,
  dailyLogin: 5,

  // ── Tiers (lifetime earned, not balance) ──
  tiers: [
    { name: 'Explorer', threshold: 0, color: 'gray' },
    { name: 'Member', threshold: 100, color: 'blue' },
    { name: 'Connoisseur', threshold: 500, color: 'green' },
    { name: 'Specialist', threshold: 2000, color: 'purple' },
    { name: 'Founder', threshold: 5000, color: 'gold' },
  ],

  // ── Redemption catalog ──
  redemption: [
    { name: 'Free Shipping', cost: 150 },
    { name: '€5 Off', cost: 200 },
    { name: '€10 Off', cost: 350 },
    { name: 'Mystery Box', cost: 500 },
  ],

  // ── Subscribe & Save ──
  // Keep in sync with supabase/functions/manage-subscription/index.ts
  // and supabase/functions/process-subscriptions/index.ts
  subscriptions: {
    monthly:    { discountPct: 10, pointsMultiplier: 2 },
    sixMonthly: { discountPct: 15, pointsMultiplier: 2 },
  },
} as const;
