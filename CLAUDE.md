# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # Vite dev server
bun run build        # Production build (use to verify TypeScript compiles)
bun run lint         # ESLint
bun run test         # Run all Vitest tests once
# Scoped tests
bun run test -- src/test/example.test.ts
bunx vitest run "src/**/*checkout*.test.ts"
bun run test -- -t "test name substring"
```

Test environment is `jsdom`; setup file is `src/test/setup.ts`. Deno is not installed, so edge function unit tests cannot run locally.

## Architecture

This repo is in an architecture transition.

- Historical flow: Shopify-first checkout and paid webhook handling.
- Current target flow: Nyehandel-first checkout with Supabase Edge Functions owning the server flow.
- Tiebreaker docs: `ROADMAP.md` and `PROJECT_STATE.md`.

### Order Flow (target)

```text
src/pages/CheckoutHandoff.tsx
  -> POST supabase/functions/create-nyehandel-checkout
  -> Nyehandel payment or checkout session
  -> Nyehandel callback or polling confirmation
  -> orders row update
  -> POST supabase/functions/push-order-to-nyehandel
  -> cron: retry-failed-nyehandel-orders
```

### Ops / B2B Alerts Flow

```text
pg_cron 01:15 UTC
  -> supabase/functions/ops-b2b-queues                 (x-cron-secret auth, upserts ops_alerts)
    rules: supabase/functions/ops-b2b-queues/rules.ts  (pure TS, importable by Bun)
  -> src/pages/ops/OpsDashboard.tsx                    (reads ops_alerts via useOpsAlerts hook)
```

### Frontend layers

- Pages: `src/pages/` route-level components; ops pages are under `src/pages/ops/`
- Hooks: `src/hooks/` React Query wrappers; fail closed on DB error
- Context: `src/context/` state providers wrapped in `src/App.tsx`
- API helper: `src/lib/api.ts` for authenticated edge-function calls and Nyehandel proxy access
- Auth guard: `src/components/auth/OpsAuthGuard.tsx` protects ops routes

### Database types

`src/integrations/supabase/types.ts` is manually maintained. When schema migrations change app-facing tables, update `types.ts` in the same task. Treat legacy Shopify fields as transitional until the checkout pivot is complete.

### Edge Function conventions

- All functions live in `supabase/functions/<name>/index.ts`
- Public-facing functions use explicit `verify_jwt = false` in `supabase/config.toml`
- Internal functions use `verify_jwt = true`
- Internal function-to-function calls use `x-internal-function-secret`
- Cron-triggered functions use `x-cron-secret`
- Functions should return structured JSON errors with machine-readable `error` keys and a `requestId`

## Hard Boundaries

- Never edit `src/lib/cart-utils.ts` without explicit permission.
- All order, checkout, and Nyehandel logic must stay in `supabase/functions/`, not in frontend code.
- William's code is a business-logic reference only. Never merge or cherry-pick from his branch into `dev` or `main` without explicit instruction.
- Do not introduce Python or Flask runtime paths into this repo's production flow.
- Never implement or alter Pipedrive, WhatsApp, or Cowork automation code.

## State and Secrets

- Frontend env vars use the `VITE_` prefix.
- Server secrets belong in Supabase secrets only, not frontend env files.
- When adding a new edge-function secret, update `.env.example` and `DEPLOYMENT_CHECKLIST.md` in the same task.

## Project Docs

Read before complex work; update when done:

- `ROADMAP.md`: canonical step-by-step progress tracker
- `PROJECT_STATE.md`: session-level state log
- `CURRENT_PRIORITIES.md`: short list of active workstreams
- `SYSTEM_BOUNDARIES.md`: compact architecture and ownership rules
- `ACTIVE_RISKS.md`: known blockers and drift risks
- `NYEHANDEL_API.md`: Step 25 investigation log
- `DEPLOYMENT_CHECKLIST.md`: required secrets and deploy order
- `AGENTS.md`: extended coding rules and scoped test commands
