# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # Vite dev server
bun run build        # Production build (use to verify TypeScript compiles)
bun run lint         # ESLint
bun run test         # Run all Vitest tests once
bun run simulate     # Step 24 UAT: full order-flow simulator (no DB required)

# Scoped tests
bun run test -- src/test/example.test.ts
bunx vitest run "src/**/*checkout*.test.ts"
bun run test -- -t "test name substring"
```

Test environment is `jsdom`; setup file is `src/test/setup.ts`. Deno is **not** installed — edge function unit tests cannot run locally.

## Architecture

**Headless Shopify storefront** → checkout handed off to Shopify → paid event triggers backend flow → Nyehandel (3PL) fulfillment.

### Order Flow (the critical path)

```
src/pages/CheckoutHandoff.tsx
  → POST supabase/functions/create-shopify-checkout   (creates pending orders row, returns Shopify checkoutUrl)
  → [user pays in Shopify]
  → POST supabase/functions/shopify-webhook            (HMAC-verified, upserts order to paid, writes webhook_inbox)
  → POST supabase/functions/push-order-to-nyehandel   (3 retries, sets nyehandel_sync_status=synced|failed)
  → cron: retry-failed-nyehandel-orders               (pg_cron → pg_net → edge function, nightly)
```

### Ops / B2B Alerts Flow

```
pg_cron 01:15 UTC
  → supabase/functions/ops-b2b-queues                 (x-cron-secret auth, upserts ops_alerts)
    rules: supabase/functions/ops-b2b-queues/rules.ts  (pure TS, importable by Bun)
  → src/pages/ops/OpsDashboard.tsx                    (reads ops_alerts via useOpsAlerts hook)
```

### Frontend layers

- **Pages** (`src/pages/`): route-level components; ops pages are under `src/pages/ops/`
- **Hooks** (`src/hooks/`): React Query wrappers — `useOpsData.ts`, `useOpsAlerts.ts`; all ops hooks **fail closed** (throw on DB error, no mock fallback)
- **Context** (`src/context/`): `CartContext`, `LanguageContext` — wrapped at root in `App.tsx`
- **API helper** (`src/lib/api.ts`): `apiFetch()` attaches Supabase auth token; `fetchNyehandel()` for proxy calls
- **Auth guard** (`src/components/auth/OpsAuthGuard.tsx`): wraps all `/ops/*` routes; calls `verify-admin` edge function; dependency on `userId` (not `session`) to avoid re-checking on token refresh

### Database types

`src/integrations/supabase/types.ts` is **manually maintained** (not auto-generated). When schema migrations are added, update types.ts manually to match. The `orders` table type includes: `checkout_status`, `paid_at`, `shipping_address`, `line_items_snapshot`, `customer_metadata`, `shopify_checkout_id`, `idempotency_key`, `nyehandel_order_status`. Status fields use literal union types throughout — do not widen back to `string`.

### Edge Function conventions

- All functions live in `supabase/functions/<name>/index.ts`
- Auth in `supabase/config.toml`: public-facing functions have `verify_jwt = false`; internal functions (`push-order-to-nyehandel`, `retry-failed-nyehandel-orders`, `ops-b2b-queues`) have `verify_jwt = true`
- Internal function-to-function calls use `x-internal-function-secret` header
- Cron-triggered functions use `x-cron-secret` header
- All functions return structured JSON errors with a machine-readable `error` key and a `requestId`

## Hard Boundaries

- **Never edit `src/lib/cart-utils.ts`** without explicit permission.
- All order/checkout/Nyehandel logic must stay in `supabase/functions/` — not in frontend code.
- **William's code** (`william-automation/`) is a business-logic reference only. Never merge or cherry-pick from his branch into `dev`/`main` without explicit user instruction. Code review of his repo must happen on an isolated `granskning-*` branch. Do not introduce Python/Flask runtime paths into this repo.
- Never implement or alter Pipedrive, WhatsApp, or Cowork automation code.

## State and Secrets

- Frontend env vars use `VITE_` prefix (see `.env.example`). Server secrets belong in Supabase Edge Function secrets only — not in `.env`.
- When adding a new secret to an edge function, update `.env.example` and `DEPLOYMENT_CHECKLIST.md` in the same task.
- Vault secrets power the pg_cron schedulers; see `DEPLOYMENT_CHECKLIST.md` for the full list.

## Project Docs

Read before complex work; update when done:
- `ROADMAP.md` — canonical step-by-step progress tracker (currently on Step 25)
- `PROJECT_STATE.md` — session-level state log
- `DEPLOYMENT_CHECKLIST.md` — required secrets and deploy order
- `AGENTS.md` — extended coding rules and scoped test commands
