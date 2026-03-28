# Theme Picker Implementation — Claude Code Prompt

Copy-paste this into Claude Code to build the theme picker UI:

---

## Prompt

```
I've added 2 new themes (forest, copper) to src/stores/theme.ts and src/index.css.
The theme type is now: 'velo' | 'light' | 'editorial' | 'forest' | 'copper'

Build a ThemePicker React island component and wire it into the site:

1. Create src/components/ThemePicker.tsx:
   - Import { useStore } from '@nanostores/react'
   - Import { $theme, setTheme, allThemes, themeLabels, type Theme } from '@/stores/theme'
   - Show 5 color dot buttons in a row (one per theme)
   - Each dot: 24px circle filled with the theme's primary color
   - Active dot gets a ring/outline
   - On click: call setTheme(themeName)
   - Wrap in React.memo
   - Use aria-label on each button: "Switch to {themeLabels[theme]} theme"
   - Theme primary colors for the dots:
     - velo: hsl(218 100% 55%) — electric blue
     - light: hsl(213 65% 32%) — glacier navy
     - editorial: hsl(28 80% 44%) — cognac/amber
     - forest: hsl(153 55% 18%) — deep forest green
     - copper: hsl(28 55% 46%) — warm copper

2. Add it to the footer in src/components/Footer.astro:
   - Import and place <ThemePicker client:idle /> in the footer
   - Small label "Choose your vibe" above it (text-muted-foreground, text-xs)
   - client:idle so it doesn't block page load

3. Add an inline <script> in src/layouts/BaseLayout.astro <head>
   to apply the saved theme class BEFORE first paint (prevents flash):
   ```html
   <script is:inline>
     (function(){
       var t = localStorage.getItem('theme');
       if (t) {
         t = JSON.parse(t);
         document.documentElement.classList.add(t);
       }
     })();
   </script>
   ```

4. Make sure forest and copper themes have product-card hover overrides
   in src/index.css (same pattern as .light .product-card and .velo .product-card):
   - .forest .product-card: border-color on hover = forest green tint
   - .copper .product-card: border-color on hover = copper/bronze tint

Performance budget: the ThemePicker component must be under 2KB.
Do NOT add any new npm dependencies.
Test with: bun run build (should compile with no errors)
```

---

## What's Already Done

- [x] `src/stores/theme.ts` — Extended with 5 themes, labels, allThemes array, cycleTheme()
- [x] `src/index.css` — Forest + Copper theme CSS custom properties added
- [x] `src/index.css` — Glass panel variants for forest + copper
- [x] `src/index.css` — Typography overrides for forest + copper
- [x] `src/config/tenant.ts` — Type extended to support all 5 themes

## What Claude Code Needs to Build

- [ ] `src/components/ThemePicker.tsx` — Color dot picker component
- [ ] Footer integration — Add picker to footer with client:idle
- [ ] Flash prevention — Inline script in BaseLayout head
- [ ] Product card hover overrides — .forest and .copper variants
- [ ] Build verification — `bun run build` passes
