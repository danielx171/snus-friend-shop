# Codex Review Report

Date: 2026-04-02
Repo: `snus-friend-shop`
Branch observed: `astro-migration-clean`
Reviewer: Codex

## Purpose

This report is a handoff note for a second-opinion review in Claude.
It summarizes what appears to be live in the repo, what was verified locally, and the highest-signal findings that should be challenged or confirmed.

## Context Snapshot

- Frontend: Astro 6 + React islands + TypeScript + Tailwind v4 + shadcn/ui
- Backend: Supabase Edge Functions
- Commerce: Nyehandel-first
- Current codebase shape observed:
  - `src/pages`: 106 files
  - `supabase/functions`: 37 function directories
  - `supabase/migrations`: 69 files
  - tests found: 3 files
- Important repo constraints confirmed from docs:
  - checkout/order/Nyehandel logic belongs in `supabase/functions/`
  - do not touch `src/lib/cart-utils.ts` without explicit permission
  - do not implement Pipedrive/WhatsApp/Cowork automation here

## Verification Run

Commands run:

- `bun run lint`
- `bun run test`
- `bun run check`

Observed result:

- `lint`: failed
- `test`: failed
- `check`: failed

Notes:

- `astro check` also attempted to fetch live content from Supabase and hit `fetch failed` in this environment, but several TypeScript/code issues are independent of that network failure.

## Highest-Signal Findings

### 1. Repo is not currently in a green, trustworthy verification state

This is the broadest finding and likely the first thing to confirm.

Evidence:

- `bun run lint` failed with 96 errors
- `bun run check` failed with 68 errors
- `bun run test` failed with 1 failing test and 1 unhandled error

Concrete examples:

- Undefined variable in checkout tracking:
  - `src/components/react/CheckoutForm.tsx:203`
- Prop mismatch between blog page and shared component:
  - `src/pages/blog/nicotine-pouch-side-effects.astro:55-60`
  - `src/components/astro/BlogHero.astro:6-15`
- Hook signature mismatch in rewards:
  - `src/components/react/PointsRedemptionIsland.tsx:12`
  - `src/hooks/useSnusPoints.ts:17`

Question for Claude:

- Does Claude agree the first priority should be restoring green `lint` / `check` / `test` before more feature work?

### 2. Order quest progress appears replayable and not idempotent

The current quest trigger for `order_placed` looks vulnerable to duplicate increments from revisits or reloads.

Evidence:

- Client trigger only sends the action:
  - `src/components/react/OrderQuestTrigger.tsx:15-19`
- Server increments `orders` quests by `+1` without an order-level dedupe key:
  - `supabase/functions/update-quest-progress/index.ts:247-252`

Why this matters:

- Visiting order confirmation multiple times may award order progress multiple times
- This undermines loyalty data integrity

Question for Claude:

- Should this be fixed by passing `orderId` and storing a processed-event record, or by deriving progress from orders table state instead of trusting client-triggered increments?

### 3. Recommendations and “Buy Again” likely do not work as intended

The data contract between order snapshots and recommendation logic appears inconsistent.

Evidence:

- Checkout snapshot stores `sku`, `product_name`, `pack_label`, `unit_price`:
  - `src/components/react/CheckoutForm.tsx:206-212`
  - `supabase/functions/create-nyehandel-checkout/index.ts:812-818`
- Orders hook only looks at `checkout_status = 'completed'`:
  - `src/hooks/useOrders.ts:25-31`
- Orders hook expects `slug` or `product_slug`, but falls back to raw `sku`:
  - `src/hooks/useOrders.ts:44-49`
- Recommendation lookup expects product `slug` equality and also has a hook-order violation:
  - `src/components/react/RecommendationsIsland.tsx:26-31`
  - `src/components/react/RecommendationsIsland.tsx:43-59`

Why this matters:

- If orders are typically `confirmed` or `shipped` rather than `completed`, nothing is returned
- If snapshot items only contain SKU-shaped identifiers, recommendation lookups will miss most products

Question for Claude:

- What should the canonical order snapshot shape be for confirmation, email, reorder, analytics, and recommendations?

### 4. Guest order confirmation is partly unsafe and partly reading the wrong fields

There is already a safer confirmation endpoint, but the page is not using it.

Evidence:

- Guest confirmation page fetches by raw order UUID when no user is logged in:
  - `src/pages/order-confirmation.astro:19-25`
- Safer public endpoint exists and requires `orderId + email`:
  - `supabase/functions/get-order-confirmation/index.ts:32-33`
  - `supabase/functions/get-order-confirmation/index.ts:89-97`
- Confirmation page reads shipping address from `customer_metadata`
  - `src/pages/order-confirmation.astro:46-56`
- Checkout persists shipping address to `shipping_address`
  - `supabase/functions/create-nyehandel-checkout/index.ts:819-823`

Why this matters:

- UUID-only access is better than sequential IDs, but still weaker than using the existing email-gated flow
- Shipping address block can be blank even when the data exists

Question for Claude:

- Should guest confirmation move entirely to the email-verified edge function, or should the page use a signed token flow instead?

### 5. Discount validation endpoint is too open for a service-role-backed public function

Evidence:

- CORS is `*`:
  - `supabase/functions/validate-discount/index.ts:4-8`
- Endpoint uses service role to query discounts:
  - `supabase/functions/validate-discount/index.ts:32-35`

Why this matters:

- Makes discount code enumeration and abuse easier from any origin
- Conflicts with the repo’s general “fail closed / lock origin” posture elsewhere

Question for Claude:

- Should this endpoint be same-origin only, rate-limited, or moved behind a server action boundary?

### 6. RBAC appears inconsistent across backend surfaces

Different endpoints use different role sources.

Evidence:

- `sync-nyehandel` checks `user_roles`:
  - `supabase/functions/sync-nyehandel/index.ts:187-195`
- `cancel-nyehandel-order` checks `profiles.role`:
  - `supabase/functions/cancel-nyehandel-order/index.ts:87-94`
- `update-nyehandel-order` checks `profiles.role`:
  - `supabase/functions/update-nyehandel-order/index.ts:80-87`

Why this matters:

- Same user can be treated as admin in one surface and non-admin in another
- Increases ops/debugging confusion and access drift

Question for Claude:

- Which table should be the sole authority for admin/ops roles in this repo?

## Lower-Level Tooling and Code Health Signals

These are not all product bugs, but they indicate maintenance debt:

- Many lint failures from `any`, hook-order issues, and Deno comment style
- `src/env.d.ts` clearly augments `App.Locals`, but `astro check` still reports locals typing failures:
  - `src/env.d.ts:40-45`
- Supabase auth test setup is noisy and likely incomplete:
  - `src/test/setup.ts:4-14`
- Reputation badge test appears stale relative to implementation:
  - `src/test/components/ReputationBadge.test.tsx:6-11`
  - `src/components/gamification/ReputationBadge.tsx:17-44`

## Suggested Review Questions For Claude

Please challenge these assumptions and rank them by actual user/business risk:

1. Is the repo-baseline issue the top priority, or are there hidden P1 runtime risks that matter more?
2. Is the order quest replay issue real in production, and what is the safest idempotency design?
3. Does the recommendation system currently work for real paid/shipped orders, or is it effectively dormant?
4. Is guest order confirmation secure enough as-is, or should it be changed before broader rollout?
5. Should discount validation be tightened immediately?
6. Which role model should be canonical: `user_roles` or `profiles.role`?

## My Suggested Priority Order

1. Restore a green baseline for `lint`, `check`, and tests
2. Fix order/rewards idempotency and snapshot contract
3. Fix guest confirmation authorization and field usage
4. Unify RBAC across edge functions
5. Tighten discount endpoint exposure
6. Expand regression coverage around orders, rewards, and guest access

## Notes

- Checkout was intentionally not exercised end-to-end in this review because the user has closed it to avoid dummy orders.
- This report is intentionally focused on runtime integrity and maintainability, not on visual polish or content strategy.
