# Gamifiera-Style Engagement System — Design Spec

**Date:** 2026-03-24
**Status:** Approved
**Inspiration:** [Gamifiera](https://gamifiera.com) — pillars 1 (Reviews) + 3 (Gamification)

## Goal

Add a Gamifiera-inspired engagement system to snusfriends.com: user profiles with unlockable preset avatars, real product reviews replacing mock data, and a quest/mission system that rewards users for interacting with the site.

## Scope

**In scope (Phase 2):**
- User profiles with display name, bio, avatar
- Preset avatar catalog with rarity tiers (common/rare/epic/legendary)
- Avatar unlocking via engagement thresholds (orders, reviews, spend, brands)
- Real product reviews stored in Supabase (replacing mock data in ProductReviews.tsx)
- Verified buyer badges on reviews
- Quest/mission system with progress tracking
- Points + avatar rewards for quest completion

**Out of scope (Phase 3):**
- Community social feed (posts, photos, likes, comments)
- Social media UGC (Instagram hashtag integration)
- Leaderboards
- Referral program

## Architecture Decisions

1. **Avatars are presets, not uploads** — users pick from a catalog of snus-themed avatars. New avatars unlock through engagement (orders, reviews, spending). This gamifies the profile instead of just letting users upload photos.

2. **Reviews go directly to Supabase** — no edge function needed for writes. RLS enforces that authenticated users can only insert reviews with their own user_id. Reads are public (good for SEO).

3. **Quest progress via edge function** — `update-quest-progress` runs after key actions (order placed, review submitted, spin completed). It's called from the frontend after the action succeeds, not via database triggers, to keep the logic visible and testable.

4. **Instant reviews with flag system** — reviews appear immediately. Users can report inappropriate content. Flagged reviews appear in ops dashboard for admin action.

## Database Schema

### user_profiles
| Column | Type | Notes |
|--------|------|-------|
| user_id | UUID PK | FK → auth.users |
| display_name | TEXT | Defaults to first name from auth metadata |
| avatar_id | TEXT | FK → avatars, defaults to "rookie" |
| bio | TEXT | Max 160 chars, nullable |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### avatars
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | e.g. "zyn-warrior" |
| name | TEXT | Display: "ZYN Warrior" |
| image_url | TEXT | SVG/PNG path |
| unlock_type | TEXT | default, spend, reviews, social, orders |
| unlock_threshold | INT | e.g. 500 for spend, 5 for reviews |
| rarity | TEXT | common, rare, epic, legendary |
| sort_order | INT | |

### user_avatar_unlocks
| Column | Type | Notes |
|--------|------|-------|
| user_id | UUID | Composite PK with avatar_id |
| avatar_id | TEXT | Composite PK with user_id |
| unlocked_at | TIMESTAMPTZ | |

### product_reviews
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| product_id | UUID | FK → products |
| user_id | UUID | FK → auth.users |
| rating | INT | 1-5, CHECK constraint |
| title | TEXT | Max 100 chars |
| body | TEXT | Max 1000 chars |
| helpful_count | INT | Default 0 |
| flagged | BOOLEAN | Default false |
| created_at | TIMESTAMPTZ | |
| UNIQUE | | (product_id, user_id) |

### quests
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | e.g. "try-3-brands" |
| title | TEXT | "Brand Explorer" |
| description | TEXT | "Order from 3 different brands" |
| quest_type | TEXT | orders, reviews, spend, brands, products |
| target_value | INT | e.g. 3, 5, 1000 |
| time_limit_days | INT | Nullable (null = no deadline) |
| reward_points | INT | Points on completion |
| reward_avatar_id | TEXT | Nullable FK → avatars |
| active | BOOLEAN | Default true |
| sort_order | INT | |

### user_quest_progress
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID | FK → auth.users |
| quest_id | TEXT | FK → quests |
| current_value | INT | Default 0 |
| completed | BOOLEAN | Default false |
| started_at | TIMESTAMPTZ | |
| completed_at | TIMESTAMPTZ | Nullable |
| UNIQUE | | (user_id, quest_id) |

## RLS Policies

- **user_profiles**: Public read all. Authenticated update own (user_id = auth.uid()).
- **avatars**: Public read all. No client writes.
- **user_avatar_unlocks**: Users read own. Insert via edge function (service role).
- **product_reviews**: Public read where flagged = false. Authenticated insert own.
- **quests**: Public read where active = true. No client writes.
- **user_quest_progress**: Users read own. Updates via edge function (service role).

## Seed Data

### Starter Avatars (common, default unlock)
- rookie: "Rookie" — default
- pouch-fan: "Pouch Fan" — basic snus can
- nicotine-newbie: "Nicotine Newbie" — beginner

### Unlockable Avatars
- zyn-warrior: "ZYN Warrior" — 5 orders (rare)
- cuba-princess: "Cuba Princess" — 10 reviews (rare)
- velo-viking: "VELO Viking" — spend 1000 SEK (epic)
- mint-master: "Mint Master" — 3 mint products (rare)
- brand-explorer: "Brand Explorer" — 5 brands (epic)
- snus-king: "Snus King" — 50 orders + 25 reviews (legendary)

### Seed Quests
- first-order: "First Order" — 1 order → 25 pts + pouch-fan avatar
- brand-explorer: "Brand Explorer" — 3 brands → 100 pts
- review-champion: "Review Champion" — 5 reviews → 150 pts + cuba-princess avatar
- mint-master: "Mint Master" — 3 mint products → 75 pts
- big-spender: "Big Spender" — 1000 SEK → 200 pts + velo-viking avatar
- daily-devotee: "Daily Devotee" — 7 spins → 50 pts

## Edge Functions

### check-avatar-unlocks
- Auth: JWT (user must be logged in)
- Reads user stats from orders, product_reviews, points_balances
- Compares against all avatars not yet unlocked
- Inserts new unlocks
- Returns: `{ newly_unlocked: [{ id, name, rarity }] }`

### update-quest-progress
- Auth: JWT
- Input: `{ action: "order" | "review" | "spin", metadata?: {} }`
- Auto-starts applicable quests user hasn't started
- Increments progress
- Awards points + avatar on completion
- Returns: `{ updated: [...], completed: [...] }`

## Frontend Components

### New
- UserAvatar — avatar with rarity border glow
- AvatarGallery — full catalog, locked/unlocked states
- ProfileCard — summary card with stats
- QuestBoard — all quests with progress bars
- QuestCard — individual quest display
- QuestComplete — celebration modal

### Modified
- ProductReviews.tsx — wire to real data
- AccountPage.tsx — add Profile tab
- RewardsPage.tsx — add Quests section
- ProductDetail.tsx — pass product.id to reviews

## Success Criteria

1. Users can set display name and pick avatar from unlocked options
2. Locked avatars show progress toward unlocking
3. Reviews are persisted in Supabase and display with user avatar
4. Verified buyer badge appears on reviews from users who ordered the product
5. Quest board shows available quests with real progress
6. Completing a quest awards points and/or unlocks avatar
7. AggregateRating appears in product page JSON-LD
