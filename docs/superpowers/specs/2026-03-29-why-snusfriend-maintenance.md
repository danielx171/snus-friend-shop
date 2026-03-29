# Why SnusFriend — Feature Showcase Maintenance Spec

**Created:** 2026-03-29
**Owner:** Daniel / Cowork sessions
**File:** `cowork/mockups/why-snusfriend-showcase.html`

## Purpose

The "Why SnusFriend" page is a living marketing asset that lists customer-facing superpowers. It must stay current as new features ship — stale feature pages erode trust.

## Current Features (12)

| # | Feature | Key Stat | Source of Truth |
|---|---------|----------|-----------------|
| 1 | Beginner Mode | Filters ≤6mg products | `src/stores/beginner-mode.ts` |
| 2 | 4-Tier Rewards | Bronze→Silver→Gold→Platinum | `src/pages/rewards.astro` |
| 3 | Spin-to-Win | Daily free spin | `src/components/rewards/SpinWheel.tsx` |
| 4 | Quest System | Earn points for actions | `src/components/rewards/QuestBoard.tsx` |
| 5 | Flavour Quiz | Personalized recs | `src/pages/quiz.astro` |
| 6 | Lightning Speed | <200ms LCP, <20KB | Lighthouse scores |
| 7 | 43+ Expert Guides | SEO content hub | `src/pages/blog/` |
| 8 | Free EU Shipping | Orders €50+ | Checkout logic |
| 9 | Brand Comparison | Side-by-side tools | `src/pages/compare.astro` |
| 10 | Dual Theme | Forest + Copper | `src/stores/theme.ts` |
| 11 | Honest Reviews | Community ratings | `src/components/react/ProductReviews.tsx` |
| 12 | Community Leaderboard | Points rankings | `src/components/rewards/Leaderboard.tsx` |

## When to Update

Update the showcase whenever:

1. **A new customer-facing feature ships** — add it as feature #13, #14, etc.
2. **A stat changes significantly** — e.g. article count grows from 43 to 60+, or LCP improves
3. **A feature is removed or renamed** — remove or rename in the showcase
4. **Reward tiers change** — update the tier visual and point thresholds
5. **New themes are added** — update the theme toggle and theme count

## How to Update

1. Edit `cowork/mockups/why-snusfriend-showcase.html`
2. Add the new feature card following the existing HTML pattern
3. Update the hero stat counters if totals change
4. Test both Forest and Copper themes with the toggle
5. Update memory file at `.auto-memory/project_why_snusfriend_features.md`

## Planned Features to Add When They Ship

- Referral program (Phase 3 community strategy)
- Subscription/auto-reorder
- Nicotine tracker tool
- Price alerts / wishlist notifications
- Mobile app (if pursued)

## Integration Path

When ready to go live, this mockup becomes an Astro page at `src/pages/why-snusfriend.astro` with the same content converted to Astro components + React islands for interactive elements.
