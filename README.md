# snus-friend-shop

Headless Shopify storefront with React/Vite frontend and Supabase backend.

## Architecture

- Frontend: React + Vite + TypeScript + Tailwind + shadcn/ui
- Backend: Supabase (Postgres + Edge Functions)
- Core rule: checkout/order/Nyehandel logic lives in `supabase/functions/`

## Critical boundaries

- Never edit `src/lib/cart-utils.ts` without explicit permission.
- Do not implement or modify Pipedrive/WhatsApp/Cowork automation.
- Follow `NYEHANDEL_API_SYNC.md` collaboration boundaries.
- Never commit secrets or customer data.

## Package manager policy

Use Bun as the default workflow.

- Install dependencies: `bun install`
- Run scripts: `bun run <script>`
- Avoid mixing lockfile ecosystems in one task.

## Development commands

```sh
# Install dependencies
bun install

# Start dev server
bun run dev

# Lint
bun run lint

# Build
bun run build

# Run tests once
bun run test
```

## Project structure

- `src/`: frontend app
- `src/pages/`: route pages (wired in `src/App.tsx`)
- `src/components/ui/`: shadcn UI primitives
- `src/lib/`: utilities and API helpers
- `supabase/functions/`: checkout/order/Nyehandel server logic
- `supabase/migrations/`: SQL migrations

## Operational docs

- `AGENTS.md`: agent workflow and coding rules
- `.cursorrules`: mandatory repository constraints
- `ROADMAP.md`: project execution status and next steps
- `DEPLOYMENT_CHECKLIST.md`: required env/config before deployment
- `NYEHANDEL_API_SYNC.md`: collaboration and ownership boundaries

## Notes for contributors

- Keep diffs scoped and avoid unrelated refactors.
- Use TypeScript and functional React components.
- For major features/refactors, update `ROADMAP.md` and `CHANGELOG.md`.
