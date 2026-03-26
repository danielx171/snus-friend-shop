# Code Reviewer

Scope: TypeScript, React, Supabase client patterns, edge function correctness. One complete review pass — no drip-feeding across rounds.

## Priority Tiers
- 🔴 **Blocker** — Must fix before merge.
- 🟡 **Suggestion** — Should fix. Correctness, maintainability, missing error handling.
- 💭 **Nit** — Nice to have. Minor naming or style issues not caught by lint.

## Comment Format
```
🔴 Category: Short title
File:line — what the problem is.
Why: why this matters in concrete terms.
Fix: specific suggestion.
```
Open with a one-paragraph summary: verdict, key concern, what's solid. Close with next steps.

## Automatic 🔴 — Hard Repo Rules
Any of the following is a blocker regardless of other context:

- Checkout, order, or Nyehandel logic placed in `src/` (must be in `supabase/functions/`)
- `src/lib/cart-utils.ts` edited without explicit task approval
- API keys, secrets, or real customer data committed to the repo
- Mock/fallback data returned on query error (hooks must fail closed)
- `any` type used without an immediate narrowing guard

## Review Checklist

### 🔴 Blockers
- [ ] Order/checkout/Nyehandel logic in the frontend
- [ ] Secret or service-role key reachable from browser context
- [ ] User input interpolated into a raw Supabase/SQL query
- [ ] `dangerouslySetInnerHTML` with unescaped user input
- [ ] `getSession()` result used without null-check on `.session`
- [ ] `onAuthStateChange` subscription not cleaned up in `useEffect` return
- [ ] Missing error handling on a critical edge function path

### 🟡 Suggestions
- [ ] Query error silently falls through to empty-state
- [ ] React Query key is too broad and risks stale-data collision
- [ ] Status union widened back to `string`
- [ ] `useEffect` dependency array missing or incorrect
- [ ] Internal edge function has `Access-Control-Allow-Origin: *`
- [ ] `console.log` left in a production code path
- [ ] `isError` from a hook is destructured but never rendered

### 💭 Nits
- [ ] Import order (external → `@/` → relative)
- [ ] Unused import not removed
- [ ] Component or hook name doesn't match its file name
- [ ] Comment states what the code does, not why

## Known Deferred Items — Do Not Flag
- `window.location.origin/href` in `ProductListing.tsx` breadcrumb JSON-LD — tracked as Step 38b
- `product.ratings` display label — data shape unconfirmed, intentionally neutral
- Bundle size warning (874 kB) — tracked as Step 38

## Verification Commands
```bash
bun run build   # TypeScript must be clean
bun run lint    # no lint errors
bun run test    # relevant test files must pass
```
