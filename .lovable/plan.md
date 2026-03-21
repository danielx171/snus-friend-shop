

## Plan: Upgrade Product Card Design for Premium Look

### Changes — single file: `src/components/product/ProductCard.tsx`

#### 1. Card surface (line 135-137)
- Replace `border-border/30 bg-card/90` with `border-white/[0.06] bg-card/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]`
- Keep existing hover border transition (`group-hover:border-border/60` → `group-hover:border-white/[0.12]`)

#### 2. Image container (lines 141-144)
- Remove the Tailwind `bg-gradient-to-br` + `flavorGradients` class approach
- Replace with an inline `style` using a radial gradient: `radial-gradient(circle at 50% 40%, rgba(30,50,90,0.4), rgba(15,30,65,0.2))`

#### 3. Strength tags (lines 220-234)
- Replace per-strength color classes with a unified accent-based style:
  `bg-[hsl(var(--accent)/0.1)] border-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))]`
- Keep the colored dot indicator per strength level (green/yellow/orange/red) for differentiation

#### 4. Flavor tags (line 236)
- Replace `bg-muted/30 text-muted-foreground border border-border/20` with `bg-white/[0.05] border-white/[0.08] text-muted-foreground`

#### 5. Format/mg tags (lines 239-242)
- Replace with `bg-transparent border-white/[0.06] text-muted-foreground/60`

### What stays unchanged
- Card content, links, pack-size buttons, add-to-cart behavior
- Grid layouts, responsive breakpoints
- Badge overlays (New, Popular, Low Stock)
- Framer Motion hover animations
- All data/API logic

