# Clean Slate Finishing Spec — Phase B pivot + polish

**Created:** 2026-04-13
**Status:** Draft — pending Codex audit + implementation plan
**Context:** Tonight we shipped Phase B stabilize work (quest idempotency, guest-confirmation gate, sitemap dynamic, wishlist heart, VITE cleanup). The original "Phase B ship auto-subscriptions" bet turned out to rest on a wrong assumption — Nyehandel is hosted-checkout only with no merchant-initiated charging. This spec covers the remaining Claude-actionable finishing work so the next session starts from zero debt and can move to strategic planning.

## Scope

Four batches, sequenced, one deploy at the end. Runtime target ~4-5h (revised down after inline audit vs. real repo state).

| # | Batch | Goal | Est |
|---|-------|------|-----|
| 1 | Retire subscriptions surface | No UI exists today — just doc+cron cleanup | 10m |
| 2 | SEO small-fix batch | Close the 5 specific article gaps + drifting brand-count phrases | 1-2h |
| 3 | UX micro-adds | Blog read-time, compare button, review CTAs | 2-3h |
| 4 | Logged-in account perf | Hoist 2 `getUser()` calls to `Astro.locals.user` | 30m |

### Audit reconciliation (Apr 13 inline pass)

- **Batch 1 was scoped against wrong mental model.** No PDP Subscribe component exists. No Astro-visible cron entry. 0 rows in `subscriptions` table. The "removal" is mostly already done at the UI layer.
- **Batch 2 assumptions hold.** All 5 articles exist; `editorial-facts.ts` already exports the helpers.
- **Batch 3 needs 2 small design corrections:** blog cards render inline (not in a `BlogCard.astro` component — locate at implementation time). `product_reviews` has no UNIQUE (user_id, product_id) so the 50-pt reward needs a ledger row, not natural-key dedup.
- **Batch 4 is ~10% the original estimate.** Not a tab-island fan-out — just 2 hooks (`useReviewLikes`, `useUserProfile`) that each call `supabase.auth.getUser()`. Pass `Astro.locals.user` through as a prop or via a shared context provider.

No new DB tables. No new edge functions. No new third-party integrations. Batch 1 is mostly deletes + a config flip. Batches 2-3 touch existing components. Batch 4 is the only one with real logic refactor — scope-limited to `/account`.

## Batch 1 — Retire subscriptions surface (10m)

**Why:** Spec originally assumed a PDP Subscribe UI existed. Audit found none. Cron isn't registered in `supabase/config.toml`. `public.subscriptions` is empty (0 rows). Effectively the feature is "DB scaffolding only" and has never been user-facing. Clean-slate work is near-zero.

**Changes:**
- Search for any stray references: `grep -rn "manage-subscription\|subscriptions.*Insert\|useSubscriptions" src/`. If any islands/hooks/actions reference subscription writes, remove them (likely none based on audit).
- Leave `public.subscriptions` table + its retroactive migration (`20260413000100_subscriptions.sql`) as archival.
- Leave `manage-subscription` + `process-subscriptions` edge functions deployed. They can't be invoked without a client caller and don't cost anything idle.
- Update `BACKLOG.md`: mark subscriptions as "DB + fn scaffolding retained; no UI surface. Revisit with payment-rail decision."
- Update `CLAUDE.md` `Where Things Stand` section if it claims subscriptions are a live feature.
- **No Vercel redeploy needed for Batch 1 alone** — docs-only changes. Included in the end-of-spec deploy.

## Batch 2 — SEO small-fix batch (1-2h)

Five concrete, mechanical fixes. Each either verifiable via view-source or a ≤20-line edit.

### 2.1 `dateModified` on 2 articles

`src/pages/blog/nicotine-pouch-trends-new-brands-2026.astro` and `src/pages/blog/nicotine-pouches-vs-gum-vs-lozenges.astro` don't emit `dateModified` in their JSON-LD. Add it from the registry `getBlogLastmod(slug)` helper we just shipped.

### 2.2 Schema-shape cleanup on 5 flagged articles

Codex Apr 11 coverage map flagged these 5 articles with schema-shape issues:
- `best-nicotine-pouches-no-aftertaste`
- `best-strong-nicotine-pouches`
- `how-much-do-nicotine-pouches-cost`
- `how-to-store-nicotine-pouches`
- `klar-vs-fumi-2026`

Inspect each — likely a wrong `@type`, missing `author`, or orphaned JSON-LD block. Fix inline.

### 2.3 PDP non-descriptive link text

Sampled PDP scored 92 SEO due to "click here" / "learn more" style generic link text. Audit `src/pages/products/[slug].astro` for links with non-descriptive anchor text. Replace with descriptive text (product name, destination clearly stated).

### 2.4 Editorial-facts drift

Replace hardcoded `"700+"`, `"55+ brands"`, `"35+ brands"` across the repo with imports from `src/data/editorial-facts.ts` (which exports dynamic counts from the catalog loader). Known offender sites:
- Homepage meta description
- Blog article intro paragraphs
- Brand page intro blocks

Grep pattern: `700\+\|55\+ brands\|35\+ brands`.

**Files touched:**
- 2 blog `.astro` files for `dateModified`
- 5 blog `.astro` files for schema cleanup
- `src/pages/products/[slug].astro` + related for link text
- Multiple `.astro` files with hardcoded counts

## Batch 3 — UX micro-adds (2-3h)

### 3.1 Blog read-time on cards

Blog registry schema already supports `readTime?`. Compute read-time on build from the article's word count (or a manual estimate), add to registry entries, render on blog cards below the title: "6 min read".

### 3.2 Compare button on ProductCard

`src/pages/compare.astro` + `CompareIsland.tsx` exist. Add a "+ Compare" button to `ProductCard.astro` that toggles the slug into a new `$compare` persistent nanostore (similar to `$wishlistIds`). Floating badge in header shows compare count; clicking navigates to `/compare?products=<csv>`.

### 3.3 "Be the first to review" CTA

On PDPs with `reviewCount === 0`, render a prominent CTA below the product info: "Be the first to review this product — earn 50 SnusCoins." Link scrolls to the review form / opens the review modal.

### 3.4 Review incentivization wiring

The 50-pt reward needs idempotency because `product_reviews` has no UNIQUE (user_id, product_id) constraint — users can currently submit multiple reviews per product. Add a `review_rewards` ledger table with `UNIQUE (user_id, product_id)`. On review insert, attempt ledger insert first. On `23505` (duplicate), skip the points award (user already got credit for reviewing this product). On success, award 50 points via `points_transactions` + `increment_points_balance` RPC (same pattern as `update-quest-progress`).

Follow-up reminder email at +14 days if user has purchases but no review — defer to a cron (out of this batch; tracked as P2 follow-up).

New migration: `20260414000000_review_rewards.sql` — table + UNIQUE + RLS (service_role only, users never write directly).

**Files touched:**
- `src/data/blog-registry.ts` — add read-time values
- `src/components/astro/BlogCard.astro` (or similar) — render read-time
- `src/components/astro/ProductCard.astro` — compare button
- `src/stores/compare.ts` (new) — persistent nanostore
- `src/components/astro/Header.astro` — compare count badge
- `src/pages/products/[slug].astro` — "be the first" CTA
- `src/components/product/ProductReviews.tsx` — 50-pt reward on submit
- Migration: `review_rewards` UNIQUE ledger (or reuse quest_progress_events)

## Batch 4 — Logged-in account perf (30m)

### 4.1 Reality (revised after audit)

`/account.astro` is 793 lines but only has 3 `client:visible` islands — not a fan-out. The duplicate-`getUser()` claim narrows to exactly 2 hook call sites: `src/hooks/useReviewLikes.ts:23,43` and `src/hooks/useUserProfile.ts:65`. Each call is a network round-trip for auth that's already been done in middleware.

### 4.2 Changes

- In `/account.astro`, serialize `Astro.locals.user` into a hidden `window.__AUTH_STATE__` global (already partially wired per `src/env.d.ts:35` — confirm pattern, reuse).
- In `useReviewLikes.ts` and `useUserProfile.ts`, read from `window.__AUTH_STATE__` first; fall back to `supabase.auth.getUser()` only if absent. This covers SSR + non-account pages.
- No AccountShell refactor. The 3 islands are fine as-is.

### 4.3 Measurement

- Before: Network tab on `/account` → count calls to `.supabase.co/auth/v1/user`. Expected: 2.
- After: Expected: 0.

**Files touched:**
- `src/pages/account.astro` — serialize user into `window.__AUTH_STATE__` block (may already exist; verify + extend)
- `src/hooks/useReviewLikes.ts` — prefer window state
- `src/hooks/useUserProfile.ts` — prefer window state

## Sequencing + Verification

Order: **1 → 2 → 3 → 4**. Each batch is a separate commit (easier bisect if regressions surface). One Vercel deploy at the end covers all four.

### Per-batch local verification
- 1: `bun run build` green; PDP view-source has no Subscribe block; no active rows in `subscriptions`.
- 2: View-source each of the 7 touched articles; all have expected JSON-LD shape; grep for drifting phrases returns 0 hits.
- 3: Scroll to PDP with 0 reviews → CTA visible. Blog card has read-time line. Compare button adds to nanostore + counter in header.
- 4: Lighthouse `/account` locally via Playwright MCP. Performance ≥ 90.

### End-of-spec verification
- `bun run lint` 0 errors
- `bun run check` 0 errors
- `bun run test` 54/54 green (or more if new tests added)
- `bun run build` 1,152 pages clean
- `bun run smoke` 9/9 pass after deploy
- Codex audit of combined diff — 🔴 blocks, 🟡 inline-fix, 🟢 proceed

### Deploy
Single Vercel deploy via `npx vercel deploy --yes --prebuilt --archive=tgz` (the pattern that worked past the rate limit tonight). Promote. Smoke against production.

## Out of scope (explicit defer)

These stay on BACKLOG as-is:
- Klaviyo flow wiring (blocked on Daniel's keys + UI)
- Trustpilot widget (blocked on Daniel's account)
- Solicitor legal sign-off (blocked external)
- UptimeRobot, Cowork content deliverables, brand logo assets
- Subscriptions auto-order (requires payment-rail decision — Stripe recurring? Adyen? NYE roadmap? Separate design session.)
- Multi-currency, membership tiers, hreflang DE/SV, white-label — strategic features, own design sessions
- Review reminder email at +14d — tracked as P2 follow-up after Batch 3 ships

## Open questions

None blocking — all design decisions resolved in the brainstorm chat. If Codex flags ambiguity, patch inline and re-note here.
