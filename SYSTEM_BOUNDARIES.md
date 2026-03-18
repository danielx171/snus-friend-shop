# System Boundaries

Last updated: 2026-03-18

This is the compact rule file for planning and implementation.

## Canonical sources

- `ROADMAP.md` is the delivery sequence and current execution order.
- `PROJECT_STATE.md` is the latest session-level status log.
- `AGENTS.md` and `.cursorrules` are mandatory operating rules.

## Architecture

This is a **headless B2C nicotine pouch shop** built on:
- **Frontend:** React + TypeScript + Vite + shadcn/ui + Tailwind (in `src/`)
- **Backend:** Supabase Edge Functions (in `supabase/functions/`)
- **Database:** Supabase PostgreSQL (migrations in `supabase/migrations/`)
- **Commerce:** Nyehandel (platform + payment + fulfilment)
- **Logistics:** Nylogistik (built into Nyehandel — no separate integration needed)
- **Package manager:** Bun (always use `bun` not `npm`)

## Architecture boundaries

- Frontend lives in `src/`.
- Checkout, order, webhook, and fulfilment logic live in `supabase/functions/`.
- Database changes must be forward-only SQL migrations in `supabase/migrations/`.
- `src/integrations/supabase/types.ts` is manually maintained and must stay in sync
  with schema changes.

## Hard no-go areas

- Never edit `src/lib/cart-utils.ts` without explicit permission.
- Never commit secrets, service-role keys, API tokens, or customer data.
- Never introduce Python or Flask runtime paths into production flow here.
- Never add Shopify-specific code — Shopify has been removed from this project.

## External systems — current scope

| System | Role | Integration status |
|--------|------|--------------------|
| Nyehandel | Commerce platform, payment, order management | Active — see `NYEHANDEL_API_REFERENCE.md` |
| Nylogistik | Warehouse + shipping (built into Nyehandel) | Active — see `NYLOGISTIK_REFERENCE.md` |
| Supabase | Database + Edge Functions + Auth | Active |

## External systems — future scope (not started)

| System | Role | Notes |
|--------|------|--------------------|
| Pipedrive | CRM — B2B pipeline tracking | William is building this separately. When ready, we can pull relevant data (customer history, deal data) into our system. Do not implement in this repo until that integration is defined. |
| WhatsApp | Customer messaging automation | Future — William's domain |
| Cowork | Desktop automation | Future — William's domain |

## Operational rules

- Use Bun-first commands: `bun install`, `bun run lint`, `bun run build`, `bun run test`.
- Keep diffs small and scoped to the task surface.
- In a dirty worktree, do not revert unrelated changes.
- When new edge-function secrets are introduced, update `.env.example` and
  `DEPLOYMENT_CHECKLIST.md` in the same task.
- API reference docs: `NYEHANDEL_API_REFERENCE.md` and `NYEHANDEL_API.md` are the
  source of truth for all Nyehandel integration work. Read them before touching
  any order/checkout/fulfilment code.

## Where things stand (as of 2026-03-18)

**Step 25 is complete** — Nyehandel payment API fully investigated and documented.

**Next steps are 26–29:**
- Step 26: Design Nyehandel-first checkout flow, update `orders` schema
- Step 27: Write `create-nyehandel-checkout` edge function
- Step 28: Replace `shopify-webhook` with Nyehandel delivery callback handler
- Step 29: Update `push-order-to-nyehandel` to remove Shopify references
