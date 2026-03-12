# Project State

Date: 2026-03-12
Branch: `dev`

## What Was Done Today

This session locked the backend contract for B2B operational alerts and prepared the repo for cross-repo collaboration with William.

### Files Added

- `supabase/migrations/20260312110000_create_ops_alerts_and_extend_orders.sql`
- `supabase/migrations/20260312111000_schedule_ops_b2b_queues_nightly.sql`
- `supabase/functions/ops-b2b-queues/index.ts`
- `supabase/functions/ops-b2b-queues/rules.ts`
- `supabase/functions/ops-b2b-queues/rules.test.ts`
- `WILLIAM_START_HERE.md`
- `PROJECT_STATE.md`

### Files Updated

- `.cursorrules`
- `AGENTS.md`
- `.env.example`
- `DEPLOYMENT_CHECKLIST.md`
- `supabase/config.toml`

## Database State (Current Contract)

### `public.orders` (extended)

- Added nullable column:
  - `nyehandel_order_status text`

This enables future 1:1 parity with William's order status semantics from B2B flows.

### `public.ops_alerts` (new table)

Core fields:

- `id uuid primary key`
- `alert_date date`
- `rule_key text` (`unpaid_deadline` | `deliverable_delay`)
- `severity text` (`low` | `medium` | `high` | `critical`)
- `source_order_id uuid` (FK -> `public.orders.id`)
- `source_shopify_order_id text`
- `title text`
- `message text`
- `context jsonb`
- `status text` (`open` | `resolved`)
- `resolved_at timestamptz`
- `created_at timestamptz`
- `updated_at timestamptz`

Indexes and constraints:

- Unique idempotency index on `(alert_date, rule_key, source_order_id)`
- Read-performance index on `(status, alert_date desc)`

RLS and policies:

- RLS enabled
- Admin read policy
- Admin manage policy

Trigger:

- `update_ops_alerts_updated_at` uses `public.update_updated_at_column()`.

## Backend Runtime State

### New Edge Function

- `supabase/functions/ops-b2b-queues/index.ts`
- Security:
  - `verify_jwt = true` in `supabase/config.toml`
  - Requires `x-cron-secret` matching `OPS_ALERTS_CRON_SECRET`
- Rule execution:
  - `unpaid_deadline`: pending checkout orders nearing day-7 deadline (last 3 days)
  - `deliverable_delay`: paid orders with failed/pending Nyehandel sync waiting >= 2 days
- Behavior:
  - Upserts daily alerts into `ops_alerts`
  - Resolves stale no-longer-active alerts

### Scheduler

- Nightly cron migration created:
  - `supabase/migrations/20260312111000_schedule_ops_b2b_queues_nightly.sql`
- Schedule:
  - `15 1 * * *` (01:15 UTC)
- Vault secrets expected:
  - `SUPABASE_FUNCTIONS_BASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `OPS_ALERTS_CRON_SECRET`

## Verification Notes

- `deno test` could not run in this environment (`deno: command not found`).
- Rule logic was runtime-verified via Bun for delayed-order detection and passed.

## Next Step (Next Coding Session)

Build the UI layer in `src/pages/ops/OpsDashboard.tsx` to display `ops_alerts`:

1. Show open alert KPIs by rule and severity.
2. Render a prioritized action queue table (order, rule, severity, message).
3. Add simple resolve/filter UX over the new backend contract.
