# Brand & UI

Scope: visual language, component patterns, and UI consistency. Not responsible for data fetching, auth flows, or checkout logic.

## Themes
Three active themes: `dark` (default), `light`, `editorial`. All UI must work across all three. Use CSS custom property tokens — never hardcode hex values.

## Core Tokens

| Token | Used for |
|---|---|
| `hsl(var(--primary))` | CTAs, interactive elements, active states |
| `hsl(var(--success))` | Confirmation states, fulfilled badges |
| `hsl(var(--destructive))` | Error states, delete actions |
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary text, labels, metadata |
| `border-border/30` | Default card and input borders |
| `bg-card` | Card backgrounds |

## Shape & Spacing
- Large cards and product images: `rounded-2xl` or `rounded-3xl`
- Inputs and small controls: `rounded-xl`
- CTA buttons: `rounded-2xl h-14` — standard large CTA shape
- Standard card border: `border border-border/30`
- Do not use `rounded-lg` for new surfaces; it does not match the existing premium feel

## Surfaces
- `glass-panel` — standard translucent surface (sidebars, info blocks)
- `glass-panel-strong` — higher opacity (drawers, dropdowns, mobile sheets)
- Do not recreate with inline `backdrop-blur` — use the existing utility classes

## Glow
- `glow-primary` — primary CTA buttons and active pack-size selectors only
- Maximum one glowing element per section. Do not apply to secondary actions.

## Typography
- Section/page headings: `font-serif font-semibold tracking-tight` (or `font-bold`)
- Card titles: `font-serif text-lg`
- Body: default sans-serif; secondary info in `text-muted-foreground text-sm`
- Order IDs and codes: `font-mono tracking-wide`
- Do not introduce new web fonts

## Components
Always use existing shadcn primitives from `src/components/ui/`. Order of preference:
1. Existing primitive as-is
2. Composition of existing primitives
3. New component written from shadcn patterns

Do not build a custom button, input, dialog, or badge when the primitive exists.

## Required State UI Shapes

| State | Pattern |
|---|---|
| Loading | Named skeleton component (`PDPSkeleton`, `ProductCardSkeleton`) or centered `Loader2 animate-spin` |
| Query error | `font-bold` heading + `text-muted-foreground text-sm` message + recovery `Button` (back link or retry) |
| Empty / not-found | `EmptyState` component or equivalent centered block with action |
| Success / confirmed | `Check` icon inside `bg-[hsl(var(--success))]` rounded circle, animate in with `transition-all duration-700` |

Do not use a spinner where a named skeleton exists. Do not let error fall through to empty silently.

## Badge Variants
| Key | Style |
|---|---|
| `newPrice` | `bg-primary text-primary-foreground` |
| `new` | `bg-chart-2 text-primary-foreground` |
| `popular` | `bg-card/90 text-foreground border border-border/40` |
| `limited` | `bg-destructive text-destructive-foreground` |

Do not add badge variants without confirming they fit within the four-key scheme.

## Lovable Rule
Lovable output is a **visual reference only**.
- Do not copy components, auth flows, DB schema, or type definitions from Lovable into this repo.
- If a Lovable component is useful, rewrite it from scratch using the repo's shadcn primitives and existing hooks.
- Before integrating any Lovable-derived component, verify: no hardcoded data, no inline auth logic, no direct DB calls.

## What Not To Do
- Do not hardcode hex colors anywhere — use tokens
- Do not add `backdrop-blur` inline where `glass-panel` exists
- Do not create new theme variables without updating all three themes
- Do not put layout or spacing decisions in edge function code
- Do not use `rounded-lg` for new card surfaces
