# SnusFriend Engagement Platform — Complete Claude Code Prompt
## Based on: Gamifiera.com + Apohem.se (live) + Cervera.se (live) + Your Repo

---

## CONTEXT FOR CLAUDE CODE

You are extending SnusFriend (snusfriends.com), a B2C nicotine pouch e-commerce site.
Read CLAUDE.md first — it has all conventions, hard boundaries, and architecture rules.
Read docs/superpowers/plans/2026-03-24-gamifiera-engagement-plan.md — there's already a 10-task plan for Phase 2.

This prompt EXTENDS that plan with features observed on Gamifiera partner sites (Cervera, Apohem) that are NOT yet in the existing plan.

Stack: React + TypeScript + Vite + Supabase (Postgres + Edge Functions + Storage) + TanStack Query + shadcn/ui + Tailwind + Bun.

---

## WHAT ALREADY EXISTS IN THE PLAN (Tasks 1–10)
- User profiles + avatars (Task 1)
- Product reviews with ratings (Task 2)
- Quests system (Task 3)
- Types update (Task 4)
- Profile hook + UserAvatar component (Task 5)
- Avatar gallery + profile tab (Task 6)
- Wire reviews to real data (Task 7)
- Quest board UI + rewards page (Task 8)
- Edge functions for unlock/quest logic (Task 9)
- Cross-wiring triggers (Task 10)

## WHAT'S MISSING (observed on Cervera.se + Apohem.se production)

These are the features I saw live on Gamifiera partner sites that your current plan doesn't cover. Implement these as Tasks 11–20.

---

## TASK 11: Customer Attribute Tags (Cervera pattern)

### What I saw on Cervera:
Each reviewer has colored pill badges showing their interests/attributes:
- "Vardagskocken" (everyday cook), "50-59 år" (age range), "Le Creuset", "Mumin Arabia", "Global", "Iittala", "Orrefors", "Rörstrand"
- These are brand preferences and personal attributes the user chose
- On Apohem: "Torr hud" (dry skin), "Hudvård" (skincare), "Mat, dryck & recept" (food & drink)

### For SnusFriend (nicotine pouches):
Attributes should be: favorite flavor (mint, citrus, berry, etc.), preferred strength (normal, strong, extra strong), favorite brand (ZYN, VELO, etc.), usage frequency (daily, occasional), format preference (slim, mini, original)

### Implementation:
1. `user_attributes` table: user_id, attribute_key, attribute_value, created_at
2. Predefined attribute categories in a `attribute_categories` table: key, label, options[], sort_order
3. Seed categories: flavor_preference, strength_preference, brand_preference, usage_frequency, format_preference
4. Profile edit form: multi-select pill interface to pick attributes
5. Display as colored pills next to username in reviews and community posts
6. RLS: users can read all, update own

---

## TASK 12: Review Pros & Cons (Cervera pattern)

### What I saw:
- Reviews have explicit "pros" items marked with ✓ icon
- "Passar med alla färger ljus" (matches all candle colors)
- Structured data, not free text

### For SnusFriend:
- Add `pros` text[] and `cons` text[] columns to product_reviews table
- Review submission form: add "+ Add a pro" / "+ Add a con" fields
- Display with ✓ green icon for pros, ✗ red icon for cons
- Each pro/con is a short phrase (max 100 chars)

---

## TASK 13: Review Photo Uploads (Cervera pattern)

### What I saw:
- Reviewers upload product photos in their reviews
- Photos shown inline in the review card
- Community tab on PDP shows a grid gallery of all customer photos for that product

### Implementation:
- Use Supabase Storage bucket: `review-media`
- `review_media` table already in plan (Task 2) — wire it to UI
- Upload component in review form (max 3 images, 5MB each)
- Display thumbnails in review card, click to expand
- Community tab on PDP: grid gallery of all photos for this product

---

## TASK 14: AI Review Summaries (Gamifiera headline feature)

### What I saw on Gamifiera.com:
- "Vad tycker våra kunder?" (What do our customers think?) section
- AI-generated paragraph summarizing all reviews for a product
- Shown at top of review section or near the buy button
- "Sammanfattat med AI av GAMIFIERA ®" (Summarized by AI by GAMIFIERA)

### Implementation:
1. Edge function: `generate-review-summary`
   - Input: product_id
   - Reads all approved reviews for product
   - Calls Anthropic API (Claude Haiku for cost) with prompt: "Summarize these customer reviews into 2-3 sentences covering main pros, cons, and overall sentiment"
   - Stores result in `review_summaries` table: product_id, summary_text, review_count_at_generation, generated_at
   - Only regenerates when review count changes by 3+ since last generation
2. UI: Card above review list showing AI summary
3. Also show near buy button on PDP (Gamifiera "closer to purchase button" pattern)
4. Badge: "Summarized by AI" with sparkle icon

---

## TASK 15: Community Boards (Apohem pattern)

### What I saw on Apohem live:
Left sidebar with boards:
- Alla inlägg (All posts)
- Alla bildinlägg (All image posts)
- Omröstningar (Polls)
- Fråga hudterapeuten (Ask the dermatologist — staff Q&A)
- Hudvård, Baby & barn, Ritualer, Hälsa & träning, Djur, Smink, Hårvård, Graviditet, Tävlingar (Competitions)
- Recensioner (Reviews)
- Frågor & svar (Q&A)

Right content area: post feed with author avatar, attribute tags, post text, tagged products, Like/Comment/More actions, timestamp

### For SnusFriend implementation:
Boards: General Discussion, Product Reviews, New Flavors, Strength Talk, Tips & Tricks, Photo Sharing, Polls, Q&A, Competitions

### Database:
```sql
CREATE TABLE public.community_boards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id TEXT NOT NULL REFERENCES public.community_boards(id),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  body TEXT NOT NULL CHECK (char_length(body) <= 2000),
  post_type TEXT NOT NULL DEFAULT 'discussion' CHECK (post_type IN ('discussion','image','poll','question')),
  pinned BOOLEAN NOT NULL DEFAULT false,
  flagged BOOLEAN NOT NULL DEFAULT false,
  like_count INT NOT NULL DEFAULT 0,
  comment_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) <= 1000),
  like_count INT NOT NULL DEFAULT 0,
  flagged BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.community_likes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post','comment','review')),
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, target_type, target_id)
);
```

### UI Components:
- `src/pages/CommunityPage.tsx` — board sidebar + post feed
- `src/components/community/BoardSidebar.tsx`
- `src/components/community/PostFeed.tsx`
- `src/components/community/PostCard.tsx` — avatar, attribute tags, body, tagged products, like/comment/more
- `src/components/community/CreatePostForm.tsx`
- `src/components/community/CommentThread.tsx`
- `src/hooks/useCommunity.ts` — posts, comments, likes, boards

### Route:
Add `/community` and `/community/:boardId` routes to App.tsx
Add "Community" to MainNav (like Apohem has "Apohem Community" in header)

---

## TASK 16: Product Tagging in Posts (Apohem pattern)

### What I saw:
- "Taggade produkter" section in community posts
- Product image + name, clickable link to PDP
- Users search and select from the full catalog when creating a post

### Implementation:
```sql
CREATE TABLE public.post_product_tags (
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  PRIMARY KEY (post_id, product_id)
);
```
- Product search/select component in CreatePostForm (typeahead search against Supabase products table)
- Display tagged products as horizontal cards with image + name in PostCard

---

## TASK 17: Community Polls (Apohem pattern)

### What I saw:
- Staff-posted polls under "Omröstningar" board
- Question text + multiple options with percentage bars
- "Rösta här nedan" (Vote below)
- Options show percentage after voting

### Implementation:
```sql
CREATE TABLE public.poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  vote_count INT NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE public.poll_votes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, option_id)
);
```
- Poll creation in CreatePostForm (when post_type = 'poll')
- Poll display: options as horizontal bars with percentage, animate on vote
- Can only vote once per poll

---

## TASK 18: Tabs on PDP — Reviews + Community (Cervera pattern)

### What I saw on Cervera:
Product detail page has TWO tabs below buy section:
1. **"Recensioner (13)"** — full review widget with aggregate, distribution, reviews
2. **"Community"** — UGC photo gallery of all customer photos for this product

### Implementation:
- Modify ProductDetail.tsx to add tabbed section
- Tab 1: Existing ProductReviews component (wired to real data)
- Tab 2: ProductCommunity component — shows:
  - Grid of customer-submitted photos from reviews + community posts tagged to this product
  - "Visa fler bilder" (Show more) button
  - Links to full community posts
- Use shadcn/ui Tabs component

---

## TASK 19: Review Sort & Filter (Cervera pattern)

### What I saw:
- "Relevans" dropdown for sorting reviews
- Options visible: Relevans (relevance), date, rating

### Implementation:
- Add sort dropdown to ProductReviews: "Most Relevant", "Newest", "Highest Rated", "Most Helpful"
- Relevance = weighted combo of helpfulness + recency
- "Most Helpful" = sort by helpful_count DESC
- Server-side sorting via Supabase query

---

## TASK 20: Review Likes / Helpful Votes (Cervera pattern)

### What I saw:
- Heart icon + "6 likes" on each review
- Single-click toggle

### Implementation:
- Reuse `community_likes` table (target_type = 'review')
- Heart button on each review card
- Optimistic update with React Query
- Increment/decrement helpful_count on product_reviews table via RPC
- Auth-gated: must be logged in to like

---

## IMPLEMENTATION ORDER

The existing plan (Tasks 1–10) should be done first. Then:

**Batch A (extend reviews):** Tasks 11, 12, 13, 14, 19, 20 — these all enhance the review system
**Batch B (community):** Tasks 15, 16, 17 — these build the community from scratch
**Batch C (wire together):** Task 18 — connects reviews + community on PDP

Each task follows the pattern: Migration SQL → types.ts → hooks → UI → tests → commit.

---

## CONVENTIONS REMINDER
- Bun only, never npm
- Vite SPA, NOT Next.js
- RLS on every table
- TanStack Query for data fetching
- shadcn/ui components only
- i18n for all user text
- Dark mode must work (CSS variables)
- Mobile-first (70%+ mobile traffic)
- Run `bun run build` to verify TypeScript before pushing
