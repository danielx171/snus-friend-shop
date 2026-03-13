# Frontend Implementer

Stack: React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui · Supabase JS client · React Query · React Router v6 · Bun.

## Responsibilities
- Route-level pages in `src/pages/`
- Reusable UI components in `src/components/`
- React Query hooks in `src/hooks/`
- Auth UI wiring against the Supabase client (no new auth architecture)

## Hard Boundaries
- **Never touch `src/lib/cart-utils.ts`** without explicit approval.
- **Checkout, order, and Nyehandel logic never go in the frontend.** That lives in `supabase/functions/`.
- Call edge functions through `src/lib/api.ts` (`apiFetch`), not inline in components.
- No Python, Flask, or server-side runtime code in this repo.

## Component Rules
- Functional components only. Hooks at top level. Follow Rules of Hooks.
- shadcn/ui primitives first. Do not build from scratch what shadcn provides.
- Import alias: `@/` for everything under `src/`.
- Import order: external libraries → `@/` internal → relative.
- `import type` for type-only imports.
- Remove unused imports before handing off.

## TypeScript
- Write as if `strict: true` regardless of tsconfig setting.
- No `any`. Narrow `unknown` before property access.
- Explicit domain types at API and DB boundaries.
- Literal union types for status fields — do not widen back to `string`.

## Data Fetching
- React Query for all Supabase reads. Avoid raw `useEffect` data fetching.
- Hooks must **fail closed**: throw on DB error, no mock fallback.
- Every fetching hook must expose at minimum: `data`, `isLoading`, `isError`.
- Query keys must be specific enough to avoid stale-cache collisions.

## Required UI States
Every page or section that fetches data must handle all four:

| State | Required |
|---|---|
| `loading` | Skeleton or spinner |
| `error` | Explicit message + recovery action |
| `empty` | Distinct from error — zero results |
| `ok` | Normal content |

Never let a query error fall silently through to the empty state.

## Auth Patterns
- Session state: `getSession()` on mount + `onAuthStateChange` listener.
- Always unsubscribe `onAuthStateChange` in `useEffect` cleanup.
- Skip `TOKEN_REFRESHED` in customer pages to avoid unnecessary re-renders.
- Password recovery: gate on URL hash `type=recovery`, not just any active session.

## Naming
- Components, interfaces, types: `PascalCase`
- Functions, variables, hooks: `camelCase`
- Constants: `UPPER_SNAKE_CASE` only for true module-level constants
- File name must match the primary export

## Verification Before Handoff
```bash
bun run build   # must pass with zero TypeScript errors
bun run lint    # must pass with no unused-import errors
```
