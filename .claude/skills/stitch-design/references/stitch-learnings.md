# Stitch Learnings — Design Marathon March 2026

Compiled from generating 10+ production designs for SnusFriend.

## Design System Behavior

### Auto-Detection
- Stitch auto-detects URLs in prompts and creates reference chips
- It analyzes reference sites to build a design system (colors, typography, spacing)
- The first design in a new style creates a new design system; subsequent designs can reuse it
- Design systems are named automatically (e.g., "Obsidian Teal", "SnusFriend Ritual", "Nordic Ritual")

### Reuse (⚠️ KEY LEARNING)
- Once a design system exists, Stitch tends to REUSE it for new designs automatically
- This means all designs look similar if you don't actively force new systems
- **To force a new design system:** specify DIFFERENT hex codes + different visual vocabulary (e.g., "gold #D4A853 glass-morphism" instead of "teal #0F6E56")
- If you just say "make it different" but keep the same accent color, Stitch will reuse the existing system
- You can select a specific design system from the dropdown (though this requires precise clicking)
- Reusing a design system IS useful for multi-page consistency (same site, different pages)
- New design systems take 10-15 seconds longer to generate than reused ones
- **The Design Systems dropdown** shows all created systems — as of our marathon: Obsidian Teal, Nordic Ritual, The Modern Curator, Nordic Clarity, SnusFriend Ritual, Flavor Energy (7 total)
- When exploring different design DIRECTIONS, always specify unique palettes to generate unique systems

## Generation Timing

| Phase | Duration | Swedish Status Message |
|-------|----------|----------------------|
| Analyzing prompt | 5-10s | "Studerar designmönster" |
| Building/selecting design system | 10-20s | "Säkerställer konsekvens" |
| Color application | 5-10s | "Lägger till en färgklick" |
| Layout generation | 15-30s | "Genererar skärm" |
| Refinement | 5-10s | "Snitsar till" |
| **Total** | **40-90s** | |

## Rate Limits

- Usage shown as percentage in bottom-right corner of Stitch UI
- Each design uses approximately 2-4% of daily quota
- At 6% usage after ~10 designs, there's significant headroom
- Model set to "3.1 Pro (Thinking)" produces highest quality but uses more quota
- No hard limit observed in a single session — we generated 10+ designs without hitting a wall

## Canvas Navigation

- Designs appear as thumbnails on the infinite canvas
- Each design gets a label (truncated name) below its thumbnail
- Scrolling/zooming the canvas is unreliable via automation — use the chat panel description instead
- Double-clicking a design opens it in full view
- The canvas gets crowded after 5+ designs — new ones may appear off-screen

## What Stitch Excels At

1. **Color systems** — Give it a palette and it applies it beautifully
2. **Typography pairing** — Specify two fonts and it handles hierarchy
3. **Component-level design** — Cart drawers, product cards, modals score highest
4. **Dark theme rendering** — Products pop dramatically on dark backgrounds
5. **Reference site analysis** — It genuinely studies reference URLs and extracts patterns

## What Stitch Struggles With

1. **Long-scroll pages** — Homepage designs lose quality below the fold
2. **Complex data tables** — Filter sidebars are simplified
3. **Micro-interactions** — No hover state or animation representation
4. **Mobile layouts** — Always generates desktop-first; mobile readiness is theoretical
5. **Stock photos** — Sometimes inserts generic imagery that weakens the design

## Scoring Insights

### Score Distribution (10 designs)
- **8.0+**: Cart Drawer (8.45), PDP (7.95) — component-level designs
- **7.5-7.9**: Light Homepage (7.6), Bold Playful (7.5)
- **7.0-7.4**: PLP (7.35), Dark Homepage (7.0)

### What Correlates with Higher Scores
1. **Focused scope** — Cart drawer > Full homepage
2. **Real data** — Actual product names and prices > Placeholders
3. **Specific hex codes** — #0F6E56 > "teal"
4. **Fewer sections** — 4-5 clear sections > 8+ rushed sections
5. **Quality references** — ouraring.com, glossier.com > generic sites

### What Drags Scores Down
1. **Missing key UX patterns** — No pack selectors, no strength badges
2. **Generic layouts** — Standard e-commerce grid without signature elements
3. **Stock imagery** — Breaks the premium feel
4. **Inconsistent palette** — Introducing colors not in the design system

## Iteration Patterns

### What Works for Refinement
- "Make the product images larger and reduce the grid to 3 columns"
- "Add pack selector pills (1/3/5/10) to each product card"
- "Replace the stock photo with a product-focused image"

### What Doesn't Work for Refinement
- "Make it look better" — too vague
- "Complete redesign" — just submit a new prompt
- Adding 5+ changes in one refinement — do 2-3 max per iteration

## Browser Interaction Notes

- Chrome extension (`mcp__Claude_in_Chrome__*`) handles typing and navigation
- Computer-use is needed for clicking the submit button (Chrome extension can't reach it reliably)
- The prompt input field is at the bottom: "Vad vill du ändra eller skapa?"
- Submit button is the arrow icon at bottom-right of the input area
- Reference URL chips appear automatically — don't need to add them manually
- Escape key closes the chat panel to reveal the canvas
