# snus-friend-shop

Headless storefront with a React/Vite frontend and Supabase backend.

## Current architecture status

- Frontend: React + Vite + TypeScript + Tailwind + shadcn/ui
- Backend: Supabase Postgres + Edge Functions
- Core rule: checkout, order, and Nyehandel logic belong in `supabase/functions/`
- Current roadmap status: Nyehandel-first checkout flow is implemented; Shopify has been fully removed

When docs disagree, treat `ROADMAP.md` and `CURRENT_PRIORITIES.md` as the source of truth.

## Critical boundaries

- Never edit `src/lib/cart-utils.ts` without explicit permission.
- Do not implement or modify Pipedrive, WhatsApp, or Cowork automation.
- Follow `SYSTEM_BOUNDARIES.md` collaboration boundaries.
- Never commit secrets or customer data.

## Package manager policy

Use Bun as the default workflow.

- Install dependencies: `bun install`
- Run scripts: `bun run <script>`
- Avoid mixing Bun and npm lockfile changes in the same task unless required

## Development commands

```sh
bun install
bun run dev
bun run lint
bun run build
bun run test
```

## Project structure

- `src/`: frontend app
- `src/pages/`: route pages wired in `src/App.tsx`
- `src/components/ui/`: shadcn UI primitives
- `src/lib/`: utilities and API helpers
- `supabase/functions/`: checkout, order, webhook, and fulfillment logic
- `supabase/migrations/`: SQL migrations

## Context pack

These files are the recommended AI and collaborator context pack:

- `ROADMAP.md`: canonical execution order
- `PROJECT_STATE.md`: latest session status
- `CURRENT_PRIORITIES.md`: short list of what matters now
- `SYSTEM_BOUNDARIES.md`: compact rule summary
- `NYEHANDEL_API.md`: Step 25 research log
- `NYEHANDEL_API_REFERENCE.md`: full Nyehandel API reference
- `DEPLOYMENT_CHECKLIST.md`: env and deploy requirements

## Notes for contributors

- Keep diffs scoped and avoid unrelated refactors.
- Use TypeScript and functional React components.
- For major features or refactors, update `ROADMAP.md` and `CURRENT_PRIORITIES.md`.
