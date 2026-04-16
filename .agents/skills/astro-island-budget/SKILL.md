---
name: astro-island-budget
description: Use when deciding whether a SnusFriend UI surface should stay an Astro component, become a React island, or be consolidated into a larger island. Covers hydration budgeting, island clustering, preload discipline, and the common storefront hotspots that tend to bloat JS.
---

# Astro Island Budget

Use this skill when the task involves:
- Astrofication or hydration cleanup
- deciding whether a UI feature needs React at all
- reducing JS on product cards, headers, drawers, or merchandising sections

## Decision rule

1. Start with Astro markup and native HTML behavior.
2. Promote to an island only if the feature needs client state, auth state, localStorage, animations tied to runtime state, or browser-only APIs.
3. If multiple tiny islands sit in one visual cluster, merge them unless they have a clear lifecycle reason to stay separate.

## Storefront hotspots

- `src/components/astro/ProductCard.astro`: wishlist, compare, pack selection, add-to-cart
- `src/components/astro/Header.astro`: compare count, rewards state, cart state
- `src/pages/search.astro` and product grids: initial render vs client filtering
- inline JSON-LD or page scripts that can move into reusable Astro components

## Budget heuristics

- One cluster, one island is usually better than three tiny sibling islands.
- Avoid hydrating decorative chrome that can render statically.
- Avoid global font preloads for fonts that are not used above the fold on most pages.
- Prefer `client:visible` or `client:idle` over `client:load` unless the interaction must be instant on first paint.

## Safe implementation pattern

- Keep the page shell in Astro.
- Move only the interactive controls into the island.
- Preserve existing props and stores so behavior does not regress.
- After changes, run `bun run lint` and `bun run build`, then verify the affected page in a browser.
