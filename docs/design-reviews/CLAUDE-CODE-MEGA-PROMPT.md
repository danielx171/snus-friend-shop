# Claude Code — Design System + Performance Audit Prompt

Copy the prompt between the `---` lines into Claude Code.

---

## The Prompt

```
I need 3 things done in this session. Read CLAUDE.md first, then proceed in order.

### 1. THEME PICKER (build the UI for our new 5-theme system)

I've already added 2 new themes (forest, copper) to src/stores/theme.ts and src/index.css.
The theme type is now: 'velo' | 'light' | 'editorial' | 'forest' | 'copper'
The store already exports: allThemes, themeLabels, setTheme, cycleTheme.

Build a ThemePicker React island component:

a) Create src/components/react/ThemePicker.tsx:
   - Import { useStore } from '@nanostores/react'
   - Import { $theme, setTheme, allThemes, themeLabels, type Theme } from '@/stores/theme'
   - Render 5 color dot buttons in a horizontal row
   - Each dot: 24px circle, filled with the theme's primary color:
     - velo: hsl(218 100% 55%)
     - light: hsl(213 65% 32%)
     - editorial: hsl(28 80% 44%)
     - forest: hsl(153 55% 18%)
     - copper: hsl(28 55% 46%)
   - Active dot gets a 2px ring/outline in same color with 4px offset
   - On click: setTheme(themeName)
   - Wrap entire component in React.memo
   - aria-label on each button: "Switch to {label} theme"
   - Component must be under 2KB. No new dependencies.

b) Add to footer — find src/components/Footer.astro (or wherever the footer is):
   - Import ThemePicker and place it as <ThemePicker client:idle />
   - Add small label "Choose your vibe" above it (text-muted-foreground, text-xs)
   - client:idle ensures it doesn't block initial page load at all

c) Flash prevention — in src/layouts/BaseLayout.astro (or Base.astro), add this
   inline script BEFORE any stylesheet in the <head>:
   ```html
   <script is:inline>
     (function(){
       try {
         var t = localStorage.getItem('theme');
         if (t) document.documentElement.classList.add(JSON.parse(t));
       } catch(e) {}
     })();
   </script>
   ```

d) Add product card hover overrides for the 2 new themes in src/index.css,
   same pattern as .light .product-card and .velo .product-card:
   - .forest .product-card:hover { border-color: hsl(153 55% 18% / 0.25); box-shadow: ... }
   - .copper .product-card:hover { border-color: hsl(28 55% 46% / 0.25); box-shadow: ... }

### 2. FIX /PRODUCTS PAGE — 2.4MB HTML IS TOO LARGE

The /products page currently bakes all 731 products into a single HTML file (2.4MB).
This is our biggest performance problem. Fix it:

a) Add pagination: 24 products per page (or use a "Load More" button pattern).
   The FilterableProductGrid React island already exists — add pagination state to it.
   First page loads with 24 products server-rendered. "Show More" loads the next batch
   client-side from the already-available data (all products are in the Astro content layer).

b) Alternatively, if the product data comes from the Astro content collection at build time,
   create paginated static routes: /products/page/1, /products/page/2, etc.
   Astro has built-in paginate() in getStaticPaths — use that.

c) Target: /products initial HTML must be under 200KB uncompressed, under 30KB gzipped.

d) Add a canonical meta tag on paginated pages and prev/next link tags for SEO.

### 3. 14KB PERFORMANCE AUDIT — CHECK ALL PAGES

Run through the built output and check which pages exceed the 14KB gzipped threshold
(the TCP slow start window — first round trip budget):

a) Run: bun run build
b) Then check each HTML file in dist/:
   ```bash
   for f in dist/**/*.html; do
     raw=$(wc -c < "$f")
     gz=$(gzip -c "$f" | wc -c)
     if [ "$gz" -gt 14336 ]; then
       echo "⚠️  OVER 14KB: $f — ${raw}B raw, ${gz}B gzipped"
     else
       echo "✅ OK: $f — ${raw}B raw, ${gz}B gzipped"
     fi
   done
   ```
c) For any pages over 14KB gzipped, list what's making them heavy and suggest fixes.
   Common fixes: reduce inline SVGs, defer non-critical content, split large pages.
d) Don't break anything — just audit and report. Fix only obvious wins (like removing
   unused inline styles or oversized meta tags).

### Build verification
After all changes, run:
- bun run build (must succeed)
- bun run lint (fix any new lint errors)

### DON'T:
- Don't add any new npm/bun dependencies
- Don't modify src/lib/cart-utils.ts
- Don't change the Astro content layer config (src/content.config.ts)
- Don't touch supabase/functions/
```

---

## Context for Claude Code

**What's already done (by Cowork session):**
- `src/stores/theme.ts` — 5 themes with labels, allThemes array, setTheme/cycleTheme functions
- `src/index.css` — Forest + Copper theme CSS custom properties, glass panels, typography overrides
- `src/config/tenant.ts` — Type widened to support all 5 themes

**Current site measurements:**
- Homepage: 55KB raw → ~9.5KB gzipped (✅ under 14KB)
- PDP: 55KB raw → ~10KB gzipped (✅ under 14KB)
- /products: 2.4MB raw (🔴 needs pagination)
- Brands: 100KB raw → ~15KB gzipped (🟡 slightly over)
- CSS source: 36KB → 7.3KB gzipped

**Files Claude Code should NOT touch:**
- src/lib/cart-utils.ts (hard boundary per CLAUDE.md)
- supabase/functions/ (backend stays separate)
- src/content.config.ts (content layer is stable)
