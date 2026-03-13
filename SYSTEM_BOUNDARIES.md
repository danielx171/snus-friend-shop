# System Boundaries

Last updated: 2026-03-13

This is the compact rule file for planning and implementation.

## Canonical sources

- `ROADMAP.md` is the delivery sequence and current execution order.
- `PROJECT_STATE.md` is the latest session-level status log.
- `AGENTS.md` and `.cursorrules` are mandatory operating rules.
- `NYEHANDEL_API_SYNC.md` defines Daniel and William collaboration boundaries.

## Architecture boundaries

- Frontend lives in `src/`.
- Checkout, order, webhook, and fulfillment logic live in `supabase/functions/`.
- Database changes must be forward-only SQL migrations in `supabase/migrations/`.
- `src/integrations/supabase/types.ts` is manually maintained and must stay in sync with schema changes.

## Hard no-go areas

- Never edit `src/lib/cart-utils.ts` without explicit permission.
- Never implement or change Pipedrive, WhatsApp, or Cowork automation in this repo.
- Never introduce Python or Flask runtime paths into production flow here.
- Never commit secrets, service-role keys, API tokens, or customer data.

## Ownership split

- Daniel-owned scope: B2C storefront and frontend implementation.
- William-owned scope: B2B automation scope.
- Shared area: agreed Nyehandel API business logic only.
- If reusing logic from William's repo, treat it as reference only and document the translation spec in handoff notes.

## Operational rules

- Use Bun-first commands: `bun install`, `bun run lint`, `bun run build`, `bun run test`.
- Keep diffs small and scoped to the task surface.
- In a dirty worktree, do not revert unrelated changes.
- When new edge-function secrets are introduced, update `.env.example` and `DEPLOYMENT_CHECKLIST.md` in the same task.
