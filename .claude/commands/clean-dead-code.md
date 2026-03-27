# Clean Dead Code

Find and remove orphaned files not imported by any active Astro page or component.

## Steps

1. **List all source files:**
   ```
   find src/components src/hooks src/context src/lib -name '*.tsx' -o -name '*.ts' | sort
   ```

2. **For each file, check if imported:**
   - Grep for the filename (without extension) across `src/pages/`, `src/layouts/`, `src/components/`, `src/stores/`
   - Check both named imports and default imports
   - Check Astro imports (frontmatter `import` statements)

3. **Classify:**
   - **Active** — imported by at least one .astro page or active component chain
   - **Orphaned** — not imported anywhere
   - **Indirect** — only imported by other orphaned files (dead chain)

4. **Safe deletion:**
   - Delete orphaned files in batches of max 10
   - Run `bun run build` after each batch
   - If build fails: undo last batch and investigate

5. **Report:**
   | Status | Count | Files |
   |--------|-------|-------|
   | Active | N | ... |
   | Deleted | N | ... |
   | Kept (uncertain) | N | ... |

## Safety Rules
- NEVER delete files in `src/stores/` (nanostores are imported dynamically)
- NEVER delete files in `src/integrations/` (framework integration code)
- NEVER delete `src/lib/api.ts` or `src/lib/cart-utils.ts` (core utilities)
- NEVER delete files in `supabase/` (edge functions are deployed separately)
- NEVER delete `src/content.config.ts` (Content Layer config)
- Ask before deleting anything in `src/config/`
