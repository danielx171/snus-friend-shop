# SnusFriend Trust Bar Design Options

**Project:** snusfriends.com header announcement bar redesign
**Date:** 2026-03-28
**Theme:** Forest green (#1a2e1a), cream (#faf8f5), accent #4a6741
**Framework:** Astro 6 + Tailwind v4 + Inter font

---

## Option A — Single Static Bar

**Purpose:** Compact, scannable trust signal combining social proof, shipping, and speed.

### HTML (Astro Component)

```astro
---
// src/components/TrustBar/TrustBarA.astro
import { useState } from 'react';

interface Props {
  onClose?: () => void;
}
---

<div
  class="w-full bg-[#1a2e1a] text-[#faf8f5] px-4 py-3 md:py-2.5 flex items-center justify-between gap-3 md:gap-4 text-sm md:text-base leading-snug"
>
  <!-- Left content: Trust signals -->
  <div class="flex items-center gap-2 md:gap-4 flex-wrap md:flex-nowrap flex-1">
    <!-- Rating -->
    <div class="flex items-center gap-1.5 whitespace-nowrap">
      <span class="text-base md:text-lg">★★★★★</span>
      <span class="text-xs md:text-sm font-medium">4.8/5</span>
    </div>

    <!-- Divider -->
    <div class="hidden md:block w-px h-4 bg-[#faf8f5] opacity-40"></div>

    <!-- Shipping -->
    <div class="flex items-center gap-1 whitespace-nowrap">
      <span class="text-base">🚚</span>
      <span class="text-xs md:text-sm">Free EU Shipping over €29</span>
    </div>

    <!-- Divider (hidden on mobile) -->
    <div class="hidden md:block w-px h-4 bg-[#faf8f5] opacity-40"></div>

    <!-- Dispatch speed -->
    <div class="flex items-center gap-1 whitespace-nowrap">
      <span class="text-base">⚡</span>
      <span class="text-xs md:text-sm">Same-Day Before 2pm CET</span>
    </div>
  </div>

  <!-- Close button -->
  <button
    onclick="this.parentElement.style.display='none'"
    aria-label="Close trust bar"
    class="flex-shrink-0 ml-2 text-[#faf8f5] hover:opacity-70 transition-opacity p-1"
  >
    <span class="text-lg leading-none">×</span>
  </button>
</div>

<style>
  /* Mobile stacking: allow wrapping at tablet breakpoint */
  @media (max-width: 640px) {
    /* Icons slightly smaller on mobile */
  }
</style>
```

### Mobile Responsive Notes

- **xs/sm (< 768px):** Single row wraps if needed; emoji icons remain visible; dividers hidden
- **md+ (768px+):** Full horizontal layout with dividers between sections
- **Close button:** Always visible and accessible (32px tap target minimum)

### Accessibility

```html
<!-- Close button aria-label -->
<button aria-label="Close trust bar announcement">×</button>

<!-- Consider aria-live for dynamic dismissal -->
<div class="sr-only" role="status" aria-live="polite">
  Trust bar closed by user
</div>
```

### Usage in Astro Layout

```astro
<!-- src/layouts/BaseLayout.astro -->
---
import TrustBarA from '@/components/TrustBar/TrustBarA.astro';
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- ... -->
  </head>
  <body>
    <TrustBarA />
    <!-- Rest of site -->
  </body>
</html>
```

---

## Option B — Double Bar (Trust + Features)

**Purpose:** Two-tier hierarchy: social proof first, then concrete benefits.

### HTML (Astro Component)

```astro
---
// src/components/TrustBar/TrustBarB.astro
---

<div class="w-full bg-[#1a2e1a] text-[#faf8f5]">
  <!-- Top bar: Trust/reviews -->
  <div class="px-4 py-2.5 md:py-3 flex items-center justify-between gap-3 text-xs md:text-sm border-b border-[#faf8f5] border-opacity-20">
    <div class="flex items-center gap-2 flex-1">
      <span class="text-sm md:text-base">★★★★★</span>
      <span class="font-medium">4.8/5 from 2,400+ reviews</span>
      <span class="hidden md:inline text-[#faf8f5] text-opacity-70">·</span>
      <span class="hidden md:inline text-[#faf8f5] text-opacity-90">Trusted across Europe</span>
    </div>
    <button
      onclick="this.closest('.trust-bar-b').style.display='none'"
      aria-label="Close trust bar"
      class="flex-shrink-0 text-[#faf8f5] hover:opacity-70 transition-opacity p-1"
    >
      <span class="text-lg">×</span>
    </button>
  </div>

  <!-- Bottom bar: Features -->
  <div class="px-4 py-3 md:py-3.5 flex items-center justify-center md:justify-start gap-4 md:gap-6 flex-wrap md:flex-nowrap text-sm">
    <!-- Free shipping -->
    <div class="flex items-center gap-2 whitespace-nowrap">
      <span class="text-lg">🚚</span>
      <span>Free EU Shipping over €29</span>
    </div>

    <!-- Divider (hidden on mobile) -->
    <div class="hidden md:block w-px h-5 bg-[#faf8f5] bg-opacity-30"></div>

    <!-- Same-day dispatch -->
    <div class="flex items-center gap-2 whitespace-nowrap">
      <span class="text-lg">⚡</span>
      <span>Same-Day Dispatch</span>
    </div>

    <!-- Divider (hidden on mobile) -->
    <div class="hidden md:block w-px h-5 bg-[#faf8f5] bg-opacity-30"></div>

    <!-- Rewards -->
    <div class="flex items-center gap-2 whitespace-nowrap">
      <span class="text-lg">🎁</span>
      <span>Earn Reward Points</span>
    </div>
  </div>
</div>

<style>
  /* Subtle animation on load */
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .trust-bar-b {
    animation: slideDown 0.4s ease-out;
  }
</style>
```

### Mobile Responsive Notes

- **xs/sm (< 768px):**
  - Top bar: star rating + "2,400+ reviews" only (hide "Trusted across Europe")
  - Bottom bar: centers all three items, wraps to 2 rows if needed
  - Dividers hidden

- **md+ (768px+):**
  - Top bar: full text with bullet separator
  - Bottom bar: horizontal layout with visible dividers

### Accessibility

```html
<!-- Both bars should be in a single region for screen readers -->
<div role="region" aria-label="Trust and features announcement" class="trust-bar-b">
  <!-- ... -->
</div>

<!-- Close button affects both bars -->
<button aria-label="Close trust announcement">×</button>
```

---

## Option C — Rotating/Animated Bar (CSS-Only)

**Purpose:** Cycle through 3 key messages to maximize engagement and information density without page bloat.

### HTML (Astro Component)

```astro
---
// src/components/TrustBar/TrustBarC.astro
---

<div
  class="w-full bg-[#1a2e1a] text-[#faf8f5] px-4 py-3 md:py-3.5"
  role="region"
  aria-label="Rotating trust and feature announcement"
>
  <div class="flex items-center justify-between gap-4 max-w-7xl mx-auto">
    <!-- Message carousel -->
    <div class="flex-1 relative h-8 overflow-hidden">
      <div class="carousel-track">
        <!-- Message 1: Reviews -->
        <div class="carousel-slide">
          <div class="flex items-center gap-2">
            <span class="text-lg">★★★★★</span>
            <span class="text-sm md:text-base">Rated 4.8/5 by 2,400+ happy customers</span>
          </div>
        </div>

        <!-- Message 2: Shipping -->
        <div class="carousel-slide">
          <div class="flex items-center gap-2">
            <span class="text-lg">🚚</span>
            <span class="text-sm md:text-base">Free EU shipping on orders over €29 — dispatched same day</span>
          </div>
        </div>

        <!-- Message 3: Selection -->
        <div class="carousel-slide">
          <div class="flex items-center gap-2">
            <span class="text-lg">📦</span>
            <span class="text-sm md:text-base">731+ products from 57 brands — Europe's largest selection</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Carousel indicators (dots) -->
    <div class="flex items-center gap-1.5 flex-shrink-0">
      <button
        class="carousel-dot active"
        aria-label="Show reviews message"
        data-slide="0"
      ></button>
      <button
        class="carousel-dot"
        aria-label="Show shipping message"
        data-slide="1"
      ></button>
      <button
        class="carousel-dot"
        aria-label="Show selection message"
        data-slide="2"
      ></button>
    </div>

    <!-- Close button -->
    <button
      onclick="this.closest('[role=region]').style.display='none'"
      aria-label="Close trust bar"
      class="flex-shrink-0 text-[#faf8f5] hover:opacity-70 transition-opacity p-1 ml-2"
    >
      <span class="text-lg">×</span>
    </button>
  </div>
</div>

<style>
  /* Carousel track and animation */
  .carousel-track {
    display: flex;
    animation: carousel-rotate 12s infinite;
    /* 4s per message × 3 messages = 12s total */
  }

  .carousel-slide {
    flex: 0 0 100%;
    min-height: 32px;
    display: flex;
    align-items: center;
    padding: 0 0.5rem;
    animation: fadeInOut 4s ease-in-out;
  }

  /* Each slide fades in over 0.5s, stays for 3s, fades out over 0.5s */
  @keyframes fadeInOut {
    0% {
      opacity: 0;
    }
    12.5% {
      opacity: 1;
    }
    87.5% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  /* Carousel rotation: translate by -33.33% every 4s */
  @keyframes carousel-rotate {
    0% {
      transform: translateX(0);
    }
    33.33% {
      transform: translateX(-100%);
    }
    66.66% {
      transform: translateX(-200%);
    }
    100% {
      transform: translateX(-300%);
      /* Wrap back to start */
    }
  }

  /* Indicator dots */
  .carousel-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgba(250, 248, 245, 0.4);
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
    padding: 0;
  }

  .carousel-dot.active {
    background-color: #faf8f5;
  }

  .carousel-dot:hover {
    background-color: rgba(250, 248, 245, 0.7);
  }

  /* Smooth transitions for all content */
  .carousel-slide > div {
    display: flex;
    align-items: center;
    gap: inherit;
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    .carousel-slide {
      white-space: normal;
    }

    .carousel-slide > div {
      white-space: normal;
    }
  }
</style>

<!-- Optional: JavaScript enhancement for manual dot clicks -->
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const slideIndex = parseInt(e.target.dataset.slide);
        const track = e.target.closest('[role=region]').querySelector('.carousel-track');

        // Pause animation and jump to slide
        track.style.animationPlayState = 'paused';
        track.style.transform = `translateX(${-slideIndex * 100}%)`;

        // Update active dot
        dots.forEach((d) => d.classList.remove('active'));
        e.target.classList.add('active');

        // Resume animation after 6 seconds
        setTimeout(() => {
          track.style.animationPlayState = 'running';
        }, 6000);
      });
    });
  });
</script>
```

### Mobile Responsive Notes

- **xs/sm (< 640px):**
  - Text wraps naturally (white-space: normal)
  - Dots remain visible (8px circles)
  - Same 4-second cycle
  - Close button always accessible

- **md+ (768px+):**
  - Single line with white-space: nowrap
  - Larger text baseline (text-base)
  - Same carousel behavior

### CSS Animation Timing Breakdown

```
Total cycle: 12 seconds (3 messages × 4 seconds each)

Timeline for each message:
  0s → 4s:     Message in view (fade in 0–0.5s, display 0.5–3.5s, fade out 3.5–4s)
  4s → 8s:     Next message (repeats)
  8s → 12s:    Third message (repeats)
  12s → 0s:    Loop restarts

Carousel transform:
  0% → 33.33%:  translateX(0) → translateX(-100%)
  33.33% → 66.66%:  translateX(-100%) → translateX(-200%)
  66.66% → 100%:  translateX(-200%) → translateX(0) [wrap]
```

### Accessibility Notes

```html
<!-- Region label for screen readers -->
<div role="region" aria-label="Rotating trust and feature announcement">

<!-- Dot buttons have aria-labels -->
<button aria-label="Show reviews message" data-slide="0"></button>
<button aria-label="Show shipping message" data-slide="1"></button>
<button aria-label="Show selection message" data-slide="2"></button>

<!-- JavaScript pauses animation on focus for keyboard nav -->
<!-- (Recommendation: add `focus` handler to pause carousel for accessibility) -->
```

### Enhanced Accessibility JavaScript (Optional)

```javascript
// Pause carousel when user focuses on dots or bar
const region = document.querySelector('[role=region]');
const track = region.querySelector('.carousel-track');

region.addEventListener('focusin', () => {
  track.style.animationPlayState = 'paused';
});

region.addEventListener('focusout', () => {
  track.style.animationPlayState = 'running';
});
```

---

## Comparison Matrix

| Aspect | Option A | Option B | Option C |
|--------|----------|----------|----------|
| **Lines** | 1 | 2 | 1 (rotating) |
| **Messages** | 3 (compact) | 3 | 3 (cycling) |
| **Visual Weight** | Light | Medium | Light |
| **Animations** | None | Slide-in | Fade/rotate (CSS) |
| **Mobile UX** | Wraps naturally | Stacks 2 rows | Wraps text |
| **Code Complexity** | Minimal | Low | Medium (CSS animation) |
| **Best For** | Quick scan | Feature showcase | Maximum info density |
| **A/B Test Priority** | Baseline | Engagement | CTR on features |

---

## Implementation Checklist

- [ ] Choose primary option (A, B, or C)
- [ ] Place component in `src/components/TrustBar/`
- [ ] Import in `src/layouts/BaseLayout.astro` (above header nav)
- [ ] Test responsive breakpoints (xs, sm, md, lg)
- [ ] Test close button (CSS `display: none` or state management)
- [ ] Validate WCAG 2.1 AA compliance (keyboard nav, color contrast, screen readers)
- [ ] Measure performance: ensure no layout shift (CLS)
- [ ] Test emoji rendering across browsers (fallback icons if needed)
- [ ] Document in component comments
- [ ] Deploy to preview, gather A/B test data
- [ ] Update `CURRENT_PRIORITIES.md` with results

---

## Color Reference (Tailwind)

```css
--primary: #1a2e1a;           /* Dark forest green (bg) */
--background: #f8f6f3;        /* Off-white (page bg) */
--accent: #4a6741;            /* Mid forest green (accent) */
--cream-text: #faf8f5;        /* Cream for dark bg text */
--opacity-60: rgba(250, 248, 245, 0.6);
--opacity-40: rgba(250, 248, 245, 0.4);
```

### Tailwind Classes

```
bg-[#1a2e1a]      Dark forest (trust bar background)
text-[#faf8f5]    Cream text
border-[#faf8f5]  Cream borders
bg-opacity-20     Subtle divider lines
```

---

## Notes for Developer

1. **Astro SSG/SSR:** All three options render server-side; no hydration required unless JavaScript interactivity (Option C dots) is needed.

2. **Close button state:** Currently uses inline `onclick` with `display: none`. Consider persisting dismissal in localStorage:
   ```javascript
   // Simple localStorage approach
   if (localStorage.getItem('trust-bar-dismissed')) {
     document.querySelector('[role=region]').style.display = 'none';
   }
   ```

3. **CSS performance:** Option C uses pure CSS animations (no paint/layout thrashing). Carousel-track transform is GPU-accelerated.

4. **Emoji fallback:** If emoji rendering is inconsistent, replace with:
   - SVG inline icons (ship, star, clock, gift)
   - Or Unicode HTML entities: `&#11088;` for ★, `&#128666;` for 🚚

5. **A/B testing:** Each option has distinct engagement profiles:
   - **A:** Best for immediate trust signal (reduce cart abandonment)
   - **B:** Best for feature education (new visitor conversion)
   - **C:** Best for message recall (repeat visitor engagement)

---

**End of document**
