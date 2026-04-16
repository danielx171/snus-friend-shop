# Wave 3: Community Moat — Design Spec

**Date:** 2026-04-10
**Goal:** Build defensible competitive advantages through a trusted review system, meaningful profile identity, clean leaderboards, and reduction journey support.

---

## 3A. Verified vs Community Reviews

**Problem:** `useProductReviews.ts` computes `verified_buyer` at runtime, but it's not persisted or treated as a first-class review type. All reviews look the same.

**Solution:** Two-lane review model with different trust levels and rewards.

### Data Model

Add `is_verified_purchase` boolean column to `product_reviews` table:
```sql
ALTER TABLE product_reviews ADD COLUMN is_verified_purchase BOOLEAN DEFAULT false;
```

Create a trigger that sets this flag when a review is inserted:
- Check if `user_id` has a completed order containing the `product_id` (via `orders.line_items_snapshot`)
- If yes: `is_verified_purchase = true`
- If no: `is_verified_purchase = false`

### UI Treatment

| Aspect | Verified Purchase | Community |
|--------|------------------|-----------|
| Badge | "Verified Buyer" (green) | "Community Review" (gray) |
| Default sort weight | Higher | Lower |
| Reward | 25 SnusCoins (40 first) | 5 SnusCoins |
| Schema eligibility | Included in aggregateRating | Excluded |
| Moderation priority | Lower (trusted) | Higher |

### Changes

- **Migration:** Add `is_verified_purchase` column + trigger
- **`src/hooks/useProductReviews.ts`:** Read the persisted flag instead of computing at runtime
- **`src/components/product/ProductReviews.tsx`:** Show badge, sort verified first
- **`src/pages/products/[slug].astro`:** Schema aggregateRating uses only verified count (future, once reviews accumulate)
- **`src/config/rewards.ts`:** Already has `verifiedReview: 25` and `communityReview: 5`

---

## 3B. Profile Identity — Earned Titles

**Problem:** `nickname.ts` generates deterministic fantasy names. Fun but not meaningful.

**Solution:** Progressive identity system.

### Display Name Priority
1. User-set display name (from `user_profiles.display_name`)
2. Tier title (e.g., "Connoisseur" at tier 3)
3. Sanitized email local-part (e.g., "daniel" from daniel@example.com)
4. Fantasy nickname (current fallback, kept for fun)

### Earned Titles
Titles unlock at Circle thresholds and appear on:
- Reviews ("Erik L. · Connoisseur")
- Leaderboard entries
- Community posts
- Profile card

The tier names (Explorer, Member, Connoisseur, Specialist, Founder) already exist in `rewards.tiers`. The display logic just needs to read the user's current tier and show it.

### Changes

- **`src/lib/nickname.ts`:** Update fallback chain to check display name → tier title → email → fantasy
- **`src/components/react/LeaderboardIsland.tsx`:** Show tier title next to name
- **`src/components/product/ProductReviews.tsx`:** Show tier title in review byline

---

## 3C. Leaderboard QA & Abuse Controls

**Problem:** Leaderboard has no protection against stale users or point farming.

**Solution:**

### Rules
- **Inactivity filter:** Hide users with no activity in 90 days from the public leaderboard
- **Monthly leaderboard:** Add a "This Month" tab alongside "All Time"
- **Daily earn cap:** Max 200 SnusCoins per day from any single source (prevents spin/review farming)
- **Minimum activity:** Must have at least 1 order to appear on the leaderboard

### Changes

- **Supabase view:** Update `leaderboard_top_users` view to filter inactive users
- **`src/components/react/LeaderboardIsland.tsx`:** Add monthly/all-time toggle
- **Edge function or trigger:** Enforce daily earn cap on points_transactions inserts

---

## 3D. Reduction Journey / Step-Down Guidance

**Problem:** Reduction tools exist (`ReductionAlert.tsx`, beginner mode, reduction articles) but aren't connected into a visible journey.

**Solution:** Surface step-down guidance at key touchpoints.

### PDP Step-Down Suggestion
On product pages for products ≥12mg, show a subtle suggestion:
```
Thinking about stepping down? Try [Product Name] at [lower strength]mg →
```

This links to the same brand's lower-strength variant (if available) or to the strength guide article.

### Reduction Journey Page
The existing `/nicotine-reduction-guide` page becomes the hub. Add:
- Current strength tracker (read from user preferences if set)
- Suggested next step (one strength level down)
- Timeline of recommended progression
- Links to products at each strength level

### Changes

- **`src/pages/products/[slug].astro`:** Add step-down suggestion for high-strength products
- **`src/pages/nicotine-reduction-guide.astro`:** Enhance as reduction journey hub
- **Keep ≤6mg beginner threshold** — do NOT raise it

---

## Files Modified

| File | Change | Wave |
|------|--------|------|
| `product_reviews` table | Add `is_verified_purchase` column + trigger | 3A |
| `src/hooks/useProductReviews.ts` | Read persisted flag, stop runtime computation | 3A |
| `src/components/product/ProductReviews.tsx` | Verified badge, sort order | 3A |
| `src/lib/nickname.ts` | Display name priority chain | 3B |
| `src/components/react/LeaderboardIsland.tsx` | Monthly tab, tier titles, inactivity filter | 3C |
| `leaderboard_top_users` view | Filter inactive, add monthly variant | 3C |
| `src/pages/products/[slug].astro` | Step-down suggestion for high-strength | 3D |
| `src/pages/nicotine-reduction-guide.astro` | Enhance as journey hub | 3D |

## Success Criteria

- Verified reviews show a visible badge and sort first
- Review rewards differ by type (25 vs 5 SnusCoins)
- User names show tier titles on reviews and leaderboard
- Leaderboard has monthly/all-time toggle
- Stale users (90+ days inactive) hidden from leaderboard
- High-strength product pages show step-down suggestions
- Beginner threshold stays at ≤6mg
