---
name: stitch-design
description: "Generate high-quality UI designs using Google Stitch (stitch.withgoogle.com). Use this skill whenever the user asks to create designs, mockups, wireframes, or UI concepts using Stitch, or when the user mentions 'Stitch', 'design generation', 'AI design tool', 'generate a mockup', 'design in Stitch', or 'create a design'. Also trigger when the user wants to iterate on existing Stitch designs, score designs, or improve prompts for Stitch. This skill contains battle-tested prompt patterns learned from generating 10+ production designs."
---

# Stitch Design Generation Skill

Generate production-quality UI designs using Google Stitch with optimized prompts, efficient workflows, and systematic scoring.

## What is Stitch?

Google Stitch (stitch.withgoogle.com) is an AI design generation tool that creates full-fidelity UI designs from text prompts. It:
- Creates design systems automatically from reference sites
- Generates pixel-perfect mockups with real typography, spacing, and color
- Supports iterative refinement through conversation
- Outputs designs at 1280px+ widths suitable for development handoff
- UI is in **Swedish** but accepts **English prompts**

## Prerequisites

Stitch requires browser interaction:
1. **Claude in Chrome extension** — for typing prompts and navigating
2. **Computer-use access** — for clicking the submit button and design system dropdowns (Chrome extension alone can't reach these)
3. A Stitch project already open in a Chrome tab

## Stitch Prompt Engineering (Battle-Tested Patterns)

### The Anatomy of a High-Scoring Stitch Prompt

Through 10+ design generations, we've learned the optimal prompt structure:

```
[PAGE TYPE] for [BRAND]. [THEME DESCRIPTION with hex codes].

[LAYOUT]: [Specific spatial arrangement — left/right, columns, sections].

[COMPONENT DETAILS]: For each section, describe:
- Exact content (real copy, not lorem ipsum)
- Visual specs (colors, sizes, weights)
- Interactive states (hover, active, selected)
- Data (real product names, prices, counts)

[UNIQUE UX PATTERNS]: Describe any non-standard interactions.

Reference: [2-3 real URLs that exemplify the style].
```

### What Makes Prompts Score Higher (7.5+ out of 10)

Based on scoring 10 designs with weighted criteria:

1. **Specificity wins**: "teal #0F6E56 Add to Cart button" > "green button"
2. **Real data beats placeholders**: "ZYN Cool Mint Slim €4.90" > "Product Name $X.XX"
3. **Reference URLs are critical**: Stitch analyzes reference sites to build design systems automatically. Always include 2-3 URLs
4. **Color-coded systems shine**: Describing a systematic color scheme (strength badges: green MILD, yellow REGULAR, orange STRONG, red EXTRA STRONG) produces more cohesive designs
5. **Component-level > Page-level**: Focused prompts (cart drawer, PDP) scored 8.0+ while full-page prompts (homepage) scored 7.0-7.6
6. **Dark themes pop**: Product imagery looks dramatically better on dark (#1A1A2E) backgrounds
7. **Name the design pattern**: "masonry grid", "faceted search", "tabbed content area" — Stitch knows these patterns

### ⚠️ Design System Reuse Trap

Stitch auto-reuses existing design systems for new prompts. If all your designs look the same, this is why.

**To force a genuinely different design direction:**
- Specify **different hex codes** (e.g., `#D4A853` gold instead of `#0F6E56` teal)
- Use **different visual vocabulary** (e.g., "glass-morphism" vs "minimal clean")
- Reference **different sites** (e.g., amex.com vs ritual.com)
- Stitch will then show "Building the design system" instead of reusing an existing one

**When you WANT consistency** (same site, different pages):
- Keep the same accent color and references
- Stitch will reuse the design system automatically, giving multi-page coherence

### What Doesn't Work

- **Vague style descriptions**: "make it look premium" — be specific about what premium means (thin borders, generous whitespace, muted accents)
- **Too many sections**: Prompts with 8+ distinct sections produce rushed designs. Keep to 4-5 key sections
- **Missing dimensions**: Don't specify exact pixel values for everything — Stitch handles proportions well. But DO specify key constraints (drawer width, image aspect ratios)
- **Conflicting references**: Don't mix minimalist (muji.com) with maximalist (drinkolipop.com) references
- **Same palette = same design system**: If you use `#0F6E56` teal in every prompt, Stitch reuses the same system every time

### Prompt Templates by Page Type

Read `references/prompt-templates.md` for complete templates for:
- Homepage (light/dark/editorial)
- Product Listing Page (PLP)
- Product Detail Page (PDP)
- Cart Drawer
- Category/Brand Page
- Wildcard/Experimental designs

## Workflow

### Step 1: Prepare the Prompt

1. Identify the page type and theme
2. Gather 2-3 reference URLs
3. Write the prompt using the template from `references/prompt-templates.md`
4. Include real brand data (product names, prices, counts)

### Step 2: Submit to Stitch

1. Click the prompt input field ("Vad vill du ändra eller skapa?")
2. Type or paste the prompt (Stitch auto-detects URLs as reference chips)
3. Click the send/submit button (arrow icon, bottom-right of input area)
4. Wait 40-90 seconds for generation (status messages in Swedish: "Genererar skärm", "Studerar designmönster", "Designing the UI")

### Step 3: Review the Output

Stitch responds with:
- A text description of what it created (in the chat panel)
- A design thumbnail on the canvas
- A question asking if you want to refine

### Step 4: Score the Design

Use this weighted scoring system:

| Criteria | Weight | What to Evaluate |
|----------|--------|------------------|
| Visual Impact | 0.25 | First impression, hero treatment, color harmony, typography hierarchy |
| E-commerce UX | 0.25 | Product cards, CTAs, navigation, conversion elements |
| Brand Consistency | 0.20 | Does it match the design system? Color palette, typography, tone |
| Implementability | 0.20 | Can a developer build this? Standard patterns, no impossible layouts |
| Mobile Readiness | 0.10 | Will this adapt to mobile? Column counts, touch targets, hierarchy |

**Formula:** Visual×0.25 + UX×0.25 + Brand×0.20 + Impl×0.20 + Mobile×0.10

### Step 5: Iterate

Based on the score, either:
- **7.5+**: Keep and move to next design
- **6.5-7.4**: Refine with a follow-up prompt addressing specific weaknesses
- **Below 6.5**: Start fresh with a revised prompt

## Stitch UI Reference (Swedish)

| Swedish | English | Where |
|---------|---------|-------|
| Vad vill du ändra eller skapa? | What do you want to change or create? | Prompt input |
| Genererar skärm | Generating screen | Status |
| Studerar designmönster | Studying design patterns | Status |
| Lägger till en färgklick | Adding a splash of color | Status |
| Säkerställer konsekvens | Ensuring consistency | Status |
| Snitsar till | Carving/crafting | Status |
| Agentlogg | Agent log | Bottom bar |

## Key Learnings from the Design Marathon

Read `references/stitch-learnings.md` for the complete findings from generating 10+ designs, including:
- Design system reuse patterns
- Rate limit management (usage shown in bottom-right as percentage)
- How Stitch handles reference URLs
- Canvas navigation tips
- Common generation failures and fixes
