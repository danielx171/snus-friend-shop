# SnusFriend Logo Concepts — 5 Premium Wordmark Designs

Five refined SVG logo concepts for snusfriends.com, targeting premium European nicotine pouch market. Each concept includes header wordmark (160×32px), favicon mark (32×32px), and OG image version (centered, larger).

**Color Palette:**
- Primary: `#1a2e1a` (deep forest)
- Secondary: `#2d3b2d` (forest)
- Accent: `#4a6741` (sage)
- Light: `#faf8f5` (cream)

---

## Concept 1: The Minimal

**Rationale:** Ultra-clean Space Grotesk wordmark with integrated detail—the 'i' dot becomes a subtle pouch silhouette, suggesting the product without distraction. Pure geometric confidence, Haypp-adjacent. Works beautifully at any scale.

### 1.1 Header Wordmark (160×32px)

```svg
<svg viewBox="0 0 160 32" xmlns="http://www.w3.org/2000/svg">
  <!-- Background (optional, remove if transparent needed) -->
  <!-- <rect width="160" height="32" fill="#faf8f5"/> -->

  <!-- Main wordmark text -->
  <text x="0" y="24" font-family="Space Grotesk, monospace" font-size="24" font-weight="500" letter-spacing="-0.5" fill="#1a2e1a">
    snusfriend
  </text>

  <!-- Pouch-shaped dot on 'i' (replaces default dot) -->
  <g transform="translate(128, 10)">
    <!-- Pouch silhouette -->
    <path d="M 0 0 Q -3 0 -3 2 L -3 5 Q 0 6 3 5 L 3 2 Q 3 0 0 0 Z" fill="#1a2e1a" stroke="#1a2e1a" stroke-width="0.5"/>
  </g>
</svg>
```

### 1.2 Favicon Mark (32×32px)

```svg
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="16" cy="16" r="15" fill="#faf8f5" stroke="#1a2e1a" stroke-width="1"/>

  <!-- SF monogram -->
  <g transform="translate(8, 8)">
    <text x="0" y="14" font-family="Space Grotesk, monospace" font-size="14" font-weight="600" fill="#1a2e1a">SF</text>
  </g>

  <!-- Accent pouch shape in top right -->
  <g transform="translate(20, 6)">
    <path d="M 0 0 Q -2 0 -2 1.5 L -2 3.5 Q 0 4 2 3.5 L 2 1.5 Q 2 0 0 0 Z" fill="#4a6741"/>
  </g>
</svg>
```

### 1.3 OG Image Version (512×128px)

```svg
<svg viewBox="0 0 512 128" xmlns="http://www.w3.org/2000/svg">
  <!-- Subtle background -->
  <rect width="512" height="128" fill="#faf8f5"/>

  <!-- Main wordmark -->
  <text x="256" y="95" font-family="Space Grotesk, monospace" font-size="96" font-weight="500" letter-spacing="-1.5" fill="#1a2e1a" text-anchor="middle">
    snusfriend
  </text>

  <!-- Pouch-shaped dot on 'i' -->
  <g transform="translate(407, 35)">
    <path d="M 0 0 Q -8 0 -8 6 L -8 15 Q 0 18 8 15 L 8 6 Q 8 0 0 0 Z" fill="#1a2e1a" stroke="#1a2e1a" stroke-width="1"/>
  </g>

  <!-- Decorative underline accent -->
  <line x1="180" y1="110" x2="332" y2="110" stroke="#4a6741" stroke-width="2" stroke-linecap="round"/>
</svg>
```

---

## Concept 2: The Nordic Mark

**Rationale:** Inter Bold wordmark paired with an abstract Nordic rune/diamond incorporating a stylized leaf. The mark suggests Nordic heritage and natural ingredients—modern Scandinavian craft. The monogram translates perfectly to favicon.

### 2.1 Header Wordmark (160×32px)

```svg
<svg viewBox="0 0 160 32" xmlns="http://www.w3.org/2000/svg">
  <!-- Nordic mark (left) -->
  <g transform="translate(4, 6)">
    <!-- Diamond/rune shape -->
    <path d="M 8 0 L 16 8 L 8 16 L 0 8 Z" fill="none" stroke="#1a2e1a" stroke-width="1.2"/>

    <!-- Leaf inside -->
    <path d="M 8 5 Q 6 8 8 12 Q 10 8 8 5 Z" fill="#4a6741"/>
  </g>

  <!-- Wordmark text -->
  <text x="28" y="20" font-family="Inter, sans-serif" font-size="18" font-weight="700" letter-spacing="0.2" fill="#1a2e1a">
    SnusFriend
  </text>
</svg>
```

### 2.2 Favicon Mark (32×32px)

```svg
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="16" cy="16" r="15" fill="#faf8f5" stroke="#1a2e1a" stroke-width="1"/>

  <!-- Nordic diamond/rune mark -->
  <g transform="translate(16, 16)">
    <!-- Diamond -->
    <path d="M 6 -2 L 10 2 L 6 6 L 2 2 Z" fill="none" stroke="#1a2e1a" stroke-width="1"/>

    <!-- Leaf -->
    <path d="M 6 1 Q 4.5 3 6 5.5 Q 7.5 3 6 1 Z" fill="#4a6741"/>
  </g>
</svg>
```

### 2.3 OG Image Version (512×128px)

```svg
<svg viewBox="0 0 512 128" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="512" height="128" fill="#faf8f5"/>

  <!-- Nordic mark (left side) -->
  <g transform="translate(120, 40)">
    <!-- Diamond/rune -->
    <path d="M 24 0 L 48 24 L 24 48 L 0 24 Z" fill="none" stroke="#1a2e1a" stroke-width="3"/>

    <!-- Leaf -->
    <path d="M 24 12 Q 18 24 24 36 Q 30 24 24 12 Z" fill="#4a6741"/>
  </g>

  <!-- Wordmark text (centered right) -->
  <text x="280" y="90" font-family="Inter, sans-serif" font-size="72" font-weight="700" letter-spacing="0.5" fill="#1a2e1a">
    SnusFriend
  </text>

  <!-- Decorative line under mark -->
  <line x1="120" y1="100" x2="220" y2="100" stroke="#4a6741" stroke-width="3" stroke-linecap="round"/>
</svg>
```

---

## Concept 3: The Split

**Rationale:** Visual hierarchy via weight—"Snus" in 600, "Friend" in 700—creates dynamic tension. A vertical separator and integrated pouch silhouette suggest both product and community. Clean, modern, distinctly Scandinavian.

### 3.1 Header Wordmark (160×32px)

```svg
<svg viewBox="0 0 160 32" xmlns="http://www.w3.org/2000/svg">
  <!-- "Snus" (lighter weight) -->
  <text x="0" y="23" font-family="Inter, sans-serif" font-size="20" font-weight="600" letter-spacing="0" fill="#1a2e1a">
    Snus
  </text>

  <!-- Vertical separator + pouch -->
  <g transform="translate(56, 4)">
    <!-- Vertical line -->
    <line x1="0" y1="0" x2="0" y2="20" stroke="#4a6741" stroke-width="1.5"/>

    <!-- Tiny pouch -->
    <path d="M 3 6 Q 2 6 2 7 L 2 14 Q 3 15 4 14 L 4 7 Q 4 6 3 6 Z" fill="#4a6741" opacity="0.8"/>
  </g>

  <!-- "Friend" (bold weight) -->
  <text x="72" y="23" font-family="Inter, sans-serif" font-size="20" font-weight="700" letter-spacing="0" fill="#1a2e1a">
    Friend
  </text>
</svg>
```

### 3.2 Favicon Mark (32×32px)

```svg
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="16" cy="16" r="15" fill="#faf8f5" stroke="#1a2e1a" stroke-width="1"/>

  <!-- SF split monogram -->
  <g transform="translate(6, 6)">
    <!-- S (lighter) -->
    <text x="0" y="16" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#1a2e1a">S</text>

    <!-- Separator -->
    <line x1="10" y1="2" x2="10" y2="18" stroke="#4a6741" stroke-width="1"/>

    <!-- F (bold) -->
    <text x="14" y="16" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#1a2e1a">F</text>
  </g>
</svg>
```

### 3.3 OG Image Version (512×128px)

```svg
<svg viewBox="0 0 512 128" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="512" height="128" fill="#faf8f5"/>

  <!-- "Snus" (lighter) -->
  <text x="140" y="100" font-family="Inter, sans-serif" font-size="72" font-weight="600" letter-spacing="0" fill="#1a2e1a">
    Snus
  </text>

  <!-- Vertical separator + pouch graphic -->
  <g transform="translate(380, 15)">
    <!-- Vertical line -->
    <line x1="0" y1="0" x2="0" y2="80" stroke="#4a6741" stroke-width="3"/>

    <!-- Pouch silhouette -->
    <path d="M 12 20 Q 8 20 8 26 L 8 55 Q 12 60 16 55 L 16 26 Q 16 20 12 20 Z" fill="#4a6741" opacity="0.7"/>
  </g>

  <!-- "Friend" (bold) -->
  <text x="420" y="100" font-family="Inter, sans-serif" font-size="72" font-weight="700" letter-spacing="0" fill="#1a2e1a">
    Friend
  </text>
</svg>
```

---

## Concept 4: The Badge

**Rationale:** Premium stamp aesthetic—uppercase wordmark in a rounded rectangle border with "EST. 2025" subtag. Conveys craftsmanship and exclusivity. Strong favicon presence. Inspired by high-end Scandinavian packaging.

### 4.1 Header Wordmark (160×32px)

```svg
<svg viewBox="0 0 160 32" xmlns="http://www.w3.org/2000/svg">
  <!-- Rounded rectangle border -->
  <rect x="2" y="2" width="156" height="28" rx="4" ry="4" fill="none" stroke="#1a2e1a" stroke-width="1.5"/>

  <!-- Main text -->
  <text x="80" y="19" font-family="Inter, sans-serif" font-size="14" font-weight="700" letter-spacing="1" fill="#1a2e1a" text-anchor="middle">
    SNUSFRIEND
  </text>

  <!-- Subtext -->
  <text x="80" y="28" font-family="Inter, sans-serif" font-size="6" font-weight="500" letter-spacing="0.5" fill="#4a6741" text-anchor="middle">
    EST. 2025 | PREMIUM POUCHES
  </text>
</svg>
```

### 4.2 Favicon Mark (32×32px)

```svg
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <!-- Outer circle -->
  <circle cx="16" cy="16" r="15" fill="#faf8f5" stroke="#1a2e1a" stroke-width="1.5"/>

  <!-- Inner rounded square border -->
  <rect x="6" y="8" width="20" height="16" rx="2" ry="2" fill="none" stroke="#1a2e1a" stroke-width="1"/>

  <!-- SF monogram -->
  <text x="16" y="19" font-family="Inter, sans-serif" font-size="10" font-weight="700" letter-spacing="0.5" fill="#1a2e1a" text-anchor="middle">
    SF
  </text>
</svg>
```

### 4.3 OG Image Version (512×128px)

```svg
<svg viewBox="0 0 512 128" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="512" height="128" fill="#faf8f5"/>

  <!-- Badge container (rounded rectangle) -->
  <rect x="80" y="12" width="352" height="104" rx="12" ry="12" fill="none" stroke="#1a2e1a" stroke-width="3"/>

  <!-- Main wordmark -->
  <text x="256" y="80" font-family="Inter, sans-serif" font-size="64" font-weight="700" letter-spacing="2" fill="#1a2e1a" text-anchor="middle">
    SNUSFRIEND
  </text>

  <!-- Subtext -->
  <text x="256" y="110" font-family="Inter, sans-serif" font-size="14" font-weight="500" letter-spacing="1.5" fill="#4a6741" text-anchor="middle">
    EST. 2025 | PREMIUM EUROPEAN POUCHES
  </text>
</svg>
```

---

## Concept 5: The Organic

**Rationale:** Slightly rounded letterforms (Inter rounded variant feel) with a flowing leaf element woven through the descenders. Warmer green palette, approachable yet premium. Suggests natural ingredients and Scandinavian craft tradition.

### 5.1 Header Wordmark (160×32px)

```svg
<svg viewBox="0 0 160 32" xmlns="http://www.w3.org/2000/svg">
  <!-- Main wordmark (rounded feel) -->
  <text x="0" y="23" font-family="Inter, sans-serif" font-size="20" font-weight="600" letter-spacing="-0.2" fill="#1a2e1a" font-style="italic">
    snusfriend
  </text>

  <!-- Leaf flourish woven through -->
  <g transform="translate(140, 10)">
    <!-- Leaf stem -->
    <path d="M 0 12 Q 2 8 4 4 Q 5 2 4 0" fill="none" stroke="#4a6741" stroke-width="1" stroke-linecap="round"/>

    <!-- Leaf blade -->
    <path d="M 4 4 Q 6 6 5 9 Q 4 8 4 4 Z M 4 4 Q 2 6 3 9 Q 4 8 4 4 Z" fill="#4a6741" opacity="0.8"/>
  </g>
</svg>
```

### 5.2 Favicon Mark (32×32px)

```svg
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="16" cy="16" r="15" fill="#faf8f5" stroke="#1a2e1a" stroke-width="1.5"/>

  <!-- Single leaf mark with S integration -->
  <g transform="translate(16, 16)">
    <!-- Stem -->
    <path d="M 0 -8 Q 1.5 -4 2 0 Q 2 4 1 6" fill="none" stroke="#1a2e1a" stroke-width="1.5" stroke-linecap="round"/>

    <!-- Left blade -->
    <path d="M 0 -2 Q -3 -1 -4 2 Q -3 0 0 -2 Z" fill="#4a6741"/>

    <!-- Right blade -->
    <path d="M 0 -2 Q 3 -1 4 2 Q 3 0 0 -2 Z" fill="#4a6741"/>

    <!-- Small S accent below -->
    <text x="0" y="5" font-family="Inter, sans-serif" font-size="8" font-weight="700" fill="#1a2e1a" text-anchor="middle">S</text>
  </g>
</svg>
```

### 5.3 OG Image Version (512×128px)

```svg
<svg viewBox="0 0 512 128" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="512" height="128" fill="#faf8f5"/>

  <!-- Main wordmark -->
  <text x="256" y="95" font-family="Inter, sans-serif" font-size="88" font-weight="600" letter-spacing="-0.5" fill="#1a2e1a" text-anchor="middle" font-style="italic">
    snusfriend
  </text>

  <!-- Large leaf flourish (top right) -->
  <g transform="translate(370, 20)">
    <!-- Stem -->
    <path d="M 0 0 Q 3 12 8 24 Q 10 28 8 32" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round"/>

    <!-- Left blade -->
    <path d="M 4 8 Q -6 12 -8 20 Q -4 14 4 8 Z" fill="#4a6741" opacity="0.8"/>

    <!-- Right blade -->
    <path d="M 4 8 Q 14 12 16 20 Q 12 14 4 8 Z" fill="#4a6741" opacity="0.8"/>

    <!-- Bottom accent leaf -->
    <path d="M 8 24 Q 12 28 14 32 Q 10 30 8 24 Z M 8 24 Q 4 28 2 32 Q 6 30 8 24 Z" fill="#4a6741" opacity="0.6"/>
  </g>

  <!-- Decorative underline -->
  <line x1="160" y1="110" x2="352" y2="110" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round"/>
</svg>
```

---

## Implementation Notes

### Color Reference
- Deep Forest: `#1a2e1a` (primary text/outlines)
- Forest Secondary: `#2d3b2d` (rarely used; hover states)
- Sage Accent: `#4a6741` (decorative elements, secondary)
- Cream: `#faf8f5` (backgrounds, high contrast)

### Font Stack
- **Primary:** Space Grotesk (Concept 1)
- **Secondary:** Inter (Concepts 2–5)
- Both fonts already loaded on snusfriends.com

### Usage
- **Concept 1 (The Minimal):** Website header, footer, favicon—maximum scalability
- **Concept 2 (The Nordic Mark):** Premium packaging mockups, social media headers
- **Concept 3 (The Split):** Newsletter headers, product page dividers
- **Concept 4 (The Badge):** Certification/trust badges, product stamps
- **Concept 5 (The Organic):** Blog headers, campaign graphics, seasonal branding

### Optimization
- All SVGs use clean path data (optimized for production)
- Remove comments before deploying to production
- Test favicon in browsers (especially Concept 1, 2, and 4—they use stroke outlines)
- For dark mode, swap fill colors: `#1a2e1a` → `#faf8f5`, `#4a6741` → lighter sage

---

## Next Steps
1. Import SVGs into Figma for refinement and color variants
2. Export favicon versions as `.ico` (auto-convert from SVG)
3. Create dark-mode variants (invert colors)
4. A/B test on homepage hero and checkout page
5. Obtain legal review before using "EST. 2025" in final badge concept
