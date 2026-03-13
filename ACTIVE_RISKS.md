# Active Risks

Last updated: 2026-03-13

## Current risks

- Checkout architecture is mid-pivot from Shopify-first to Nyehandel-first. Legacy names and code paths may still exist in the repo while target design has changed.
- Step 25 is blocked until Nyehandel payment API capabilities are confirmed. Building checkout logic before that risks another rewrite.
- `NYEHANDEL_X_IDENTIFIER` secret is set in Supabase but not yet used in any edge function — we don't know what it maps to until Nyehandel confirms their auth model.
- `src/integrations/supabase/types.ts` is manually maintained, so schema and type drift is a recurring risk after migrations.

## Mitigations

- Treat `ROADMAP.md` and `PROJECT_STATE.md` as the tiebreaker when docs disagree.
- Finish Step 25 documentation before committing to new payment-session implementation.
- Keep frontend auth work isolated from checkout-function rewrites when possible.
- Run at least `bun run lint` and `bun run build` after meaningful code changes.
- Update the context pack whenever the active step or architecture direction changes.
