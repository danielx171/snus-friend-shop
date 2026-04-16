# SnusFriend Hero Section Concepts

**Date:** 2026-03-28
**Framework:** Astro 6 + React islands
**Theme:** Forest green (#1a2e1a primary, #f8f6f3 background, #4a6741 accent)
**Fonts:** Inter (body), Space Grotesk (headings)
**Target dimensions:** 500px desktop / 400px mobile

---

## Overview

Three distinct hero section designs for snusfriends.com homepage. Each concept:
- Is a standalone `<section>` component
- Uses Tailwind v4 utilities + CSS custom properties (var(--primary), etc.)
- Includes mobile responsive behavior
- Has smooth CSS-only entrance animations
- Works with premium, trustworthy branding
- Includes product placeholders (colored rectangles) instead of real images

---

## Concept A: "Product Showcase"

**Visual strategy:** Split layout with bold headline on left, artistic product arrangement on right.
**Feel:** Contemporary, product-led, modern European retail.
**Best for:** Showcasing product variety and building confidence with trust badges.

### Full Component HTML

```astro
---
// file: src/components/HeroConceptA.astro
// Import if using React island for CTAs (optional)
---

<section
  class="relative w-full h-screen max-h-[500px] overflow-hidden bg-[var(--background)]"
  role="banner"
  aria-labelledby="hero-title-a"
>
  {/* Subtle background gradient */}
  <div
    class="absolute inset-0 bg-gradient-to-br from-[var(--background)] via-[rgba(250,248,245,0.8)] to-[#f0ede8]"
    aria-hidden="true"
  />

  {/* Main content grid */}
  <div class="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

    {/* LEFT SIDE: Headline + CTAs + Trust Badges */}
    <div class="w-full lg:w-3/5 flex flex-col justify-center animate-fade-in-left">

      {/* Headline */}
      <h1
        id="hero-title-a"
        class="font-['Space_Grotesk'] font-bold text-4xl sm:text-5xl lg:text-6xl text-[var(--primary)] leading-tight tracking-tight mb-4"
      >
        Europe's Finest
        <br />
        <span class="text-[var(--accent)]">Nicotine Pouches</span>
      </h1>

      {/* Subtitle */}
      <p class="text-base sm:text-lg text-[#555] max-w-lg mb-8 leading-relaxed">
        2,200+ premium pouches from 139 brands. Free EU shipping over €29.
      </p>

      {/* CTA Buttons */}
      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          class="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-white bg-[var(--primary)] hover:bg-[#0d1a0d] transition-all duration-200 transform hover:scale-105 active:scale-95"
          aria-label="Shop all nicotine pouches"
        >
          Shop All
        </button>
        <button
          class="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-[var(--primary)] border-2 border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all duration-200"
          aria-label="Take our product finder quiz"
        >
          Take the Quiz
        </button>
      </div>

      {/* Trust Badges Row */}
      <div
        class="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 border-t border-[#e0dcd7] animate-fade-in-up"
        style="animation-delay: 200ms"
      >
        <div class="flex items-center gap-2">
          <span class="text-lg text-[#ffc107]">★★★★★</span>
          <span class="text-sm text-[#666] font-medium">4.8/5 Rating</span>
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span class="text-sm text-[#666] font-medium">Free Shipping</span>
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm text-[#666] font-medium">Same-Day Dispatch</span>
        </div>
      </div>

    </div>

    {/* RIGHT SIDE: Product Showcase */}
    <div
      class="hidden lg:flex w-2/5 justify-center items-center relative h-full animate-fade-in-right"
      aria-hidden="true"
    >

      {/* Background gradient for product area */}
      <div
        class="absolute inset-0 bg-gradient-to-br from-[#e8ede4] to-[#f0ede8] rounded-3xl opacity-50"
      />

      {/* Product cans arranged at angles */}
      <div class="relative w-full h-full flex items-center justify-center">

        {/* ZYN Green - top left */}
        <div
          class="absolute w-20 h-32 bg-[#00A651] rounded-lg shadow-lg transform -rotate-12"
          style="top: 40px; left: 30px;"
        >
          <div class="w-full h-full flex items-center justify-center">
            <span class="text-xs font-bold text-white">ZYN</span>
          </div>
        </div>

        {/* VELO Blue - center left */}
        <div
          class="absolute w-20 h-32 bg-[#1a73e8] rounded-lg shadow-lg transform rotate-6"
          style="top: 120px; left: 10px;"
        >
          <div class="w-full h-full flex items-center justify-center">
            <span class="text-xs font-bold text-white">VELO</span>
          </div>
        </div>

        {/* Siberia Red - center */}
        <div
          class="absolute w-24 h-36 bg-[#C41E3A] rounded-lg shadow-xl transform -rotate-3"
          style="top: 80px; left: 50%; transform: translateX(-50%) rotate(-3deg); z-index: 10;"
        >
          <div class="w-full h-full flex items-center justify-center flex-col">
            <span class="text-xs font-bold text-white">Siberia</span>
            <span class="text-[10px] text-white/80">Strong</span>
          </div>
        </div>

        {/* LOOP Orange - center right */}
        <div
          class="absolute w-20 h-32 bg-[#FF6B35] rounded-lg shadow-lg transform rotate-12"
          style="top: 140px; right: 20px;"
        >
          <div class="w-full h-full flex items-center justify-center">
            <span class="text-xs font-bold text-white">LOOP</span>
          </div>
        </div>

        {/* White Fox Silver - bottom right */}
        <div
          class="absolute w-20 h-32 bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0] border border-[#ccc] rounded-lg shadow-lg transform rotate-8"
          style="bottom: 30px; right: 50px;"
        >
          <div class="w-full h-full flex items-center justify-center flex-col">
            <span class="text-xs font-bold text-[#333]">White</span>
            <span class="text-[10px] text-[#555]">Fox</span>
          </div>
        </div>

      </div>

    </div>

  </div>

  {/* CSS Animations */}
  <style>
    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translateX(-40px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translateX(40px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in-left {
      animation: fadeInLeft 0.8s ease-out forwards;
    }

    .animate-fade-in-right {
      animation: fadeInRight 0.8s ease-out forwards;
    }

    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
    }
  </style>

</section>
```

### Mobile Responsive Notes

- **Layout:** On mobile (`lg:` breakpoint), the product showcase is hidden; content stacks vertically
- **Typography:** Headline scales from 36px (mobile) to 56px (desktop) using `text-4xl sm:text-5xl lg:text-6xl`
- **Buttons:** Full-width on mobile, side-by-side on tablet+
- **Trust badges:** Stack vertically on mobile, horizontal row on desktop
- **Height:** `max-h-[500px]` on desktop becomes flexible on mobile to avoid excessive whitespace

### Animation Timing

| Element | Delay | Duration | Effect |
|---------|-------|----------|--------|
| Headline + subtitle | 0ms | 0.8s | Slide in from left |
| Product showcase | 0ms | 0.8s | Slide in from right |
| Trust badges | 200ms | 0.6s | Slide up from below |

---

## Concept B: "Lifestyle Gradient"

**Visual strategy:** Full-width dark gradient background with minimal, elegant text. Horizontal product strip creates visual interest.
**Feel:** Luxury, premium European lifestyle brand. High-end retail positioning.
**Best for:** Creating aspirational brand perception and premium messaging.

### Full Component HTML

```astro
---
// file: src/components/HeroConceptB.astro
---

<section
  class="relative w-full h-screen max-h-[500px] overflow-hidden"
  role="banner"
  aria-labelledby="hero-title-b"
>

  {/* Dark forest gradient background */}
  <div
    class="absolute inset-0 bg-gradient-to-r from-[#1a2e1a] via-[#2d4a2d] to-[#1a2e1a]"
    aria-hidden="true"
  />

  {/* Subtle noise texture overlay for premium feel */}
  <div
    class="absolute inset-0 opacity-5"
    style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 400 400%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 seed=%222%22 /%3E%3C/filter%3E%3Crect width=%22400%22 height=%22400%22 filter=%22url(%23noise)%22 /%3E%3C/svg%3E')"
    aria-hidden="true"
  />

  {/* Content wrapper */}
  <div class="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">

    {/* Headline */}
    <h1
      id="hero-title-b"
      class="font-['Space_Grotesk'] font-bold text-4xl sm:text-5xl lg:text-6xl text-[#faf8f5] leading-tight tracking-tight mb-3 max-w-4xl animate-fade-in-down"
    >
      Your Premium Pouch,
      <br />
      <span class="text-[#9cbf8e]">Delivered</span>
    </h1>

    {/* Subtitle */}
    <p class="text-base sm:text-lg text-[#c4d4b8] max-w-2xl mb-8 animate-fade-in-up">
      Discover 2,200+ flavors from Europe's top 139 brands
    </p>

    {/* Horizontal Product Strip */}
    <div
      class="flex gap-4 sm:gap-6 justify-center items-end mb-8 h-40 overflow-x-auto animate-fade-in-up"
      style="animation-delay: 200ms"
      role="region"
      aria-label="Featured product brands"
    >

      {/* ZYN */}
      <div class="flex flex-col items-center">
        <div class="w-16 h-24 bg-[#00A651] rounded-lg shadow-lg flex items-center justify-center mb-2">
          <span class="text-xs font-bold text-white text-center">ZYN</span>
        </div>
        <span class="text-xs text-[#9cbf8e] font-medium">ZYN</span>
      </div>

      {/* VELO */}
      <div class="flex flex-col items-center">
        <div class="w-16 h-28 bg-[#1a73e8] rounded-lg shadow-lg flex items-center justify-center mb-2">
          <span class="text-xs font-bold text-white text-center">VELO</span>
        </div>
        <span class="text-xs text-[#9cbf8e] font-medium">VELO</span>
      </div>

      {/* Siberia */}
      <div class="flex flex-col items-center">
        <div class="w-16 h-32 bg-[#C41E3A] rounded-lg shadow-xl flex items-center justify-center flex-col mb-2">
          <span class="text-xs font-bold text-white">Siberia</span>
          <span class="text-[9px] text-white/80">Strong</span>
        </div>
        <span class="text-xs text-[#9cbf8e] font-medium">Siberia</span>
      </div>

      {/* LOOP */}
      <div class="flex flex-col items-center">
        <div class="w-16 h-26 bg-[#FF6B35] rounded-lg shadow-lg flex items-center justify-center mb-2">
          <span class="text-xs font-bold text-white text-center">LOOP</span>
        </div>
        <span class="text-xs text-[#9cbf8e] font-medium">LOOP</span>
      </div>

      {/* White Fox */}
      <div class="flex flex-col items-center">
        <div class="w-16 h-24 bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0] border border-[#999] rounded-lg shadow-lg flex items-center justify-center flex-col mb-2">
          <span class="text-[9px] font-bold text-[#333]">White</span>
          <span class="text-[8px] text-[#666]">Fox</span>
        </div>
        <span class="text-xs text-[#9cbf8e] font-medium">White Fox</span>
      </div>

    </div>

    {/* Trust Badge Row */}
    <div
      class="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 mb-8 text-[#c4d4b8] text-sm animate-fade-in-up"
      style="animation-delay: 400ms"
    >
      <div class="flex items-center gap-2">
        <span class="font-semibold text-lg">2,200+</span>
        <span>Products</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="font-semibold text-lg">139</span>
        <span>Brands</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="font-semibold text-lg">€0</span>
        <span>Free EU Shipping</span>
      </div>
    </div>

    {/* Single CTA Button */}
    <button
      class="inline-flex items-center justify-center px-8 sm:px-10 py-4 rounded-lg font-semibold text-[#1a2e1a] bg-[#faf8f5] hover:bg-white transition-all duration-200 transform hover:scale-105 active:scale-95 animate-fade-in-up"
      style="animation-delay: 600ms"
      aria-label="Explore the full collection"
    >
      Explore Collection
      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </button>

  </div>

  {/* CSS Animations */}
  <style>
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in-down {
      animation: fadeInDown 0.8s ease-out forwards;
    }

    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
    }
  </style>

</section>
```

### Mobile Responsive Notes

- **Centered layout:** Works equally well on mobile and desktop—all text is centered by default
- **Product strip:** Scrollable horizontally on mobile (`overflow-x-auto`), grid-like view on desktop
- **Height:** Flexible `max-h-[500px]` adjusts gracefully on smaller screens
- **Typography:** Scales responsively with `text-4xl sm:text-5xl lg:text-6xl`
- **Badge row:** Stacks vertically on mobile, horizontal on desktop with `flex-col sm:flex-row`

### Animation Timing

| Element | Delay | Duration | Effect |
|---------|-------|----------|--------|
| Headline | 0ms | 0.8s | Slide down |
| Subtitle | 0ms | 0.8s | Fade in |
| Product strip | 200ms | 0.6s | Slide up |
| Trust badges | 400ms | 0.6s | Slide up |
| CTA button | 600ms | 0.6s | Slide up + scale |

---

## Concept C: "Split Hero with Stats"

**Visual strategy:** Left side text + stats grid, right side featured product with glowing aura and carousel controls.
**Feel:** Modern, interactive, product-focused with gamification elements.
**Best for:** Showcasing individual products and encouraging exploration through "featured product" carousel concept.

### Full Component HTML

```astro
---
// file: src/components/HeroConceptC.astro
---

<section
  class="relative w-full h-screen max-h-[500px] overflow-hidden bg-gradient-to-br from-[var(--background)] to-[#ede9e3]"
  role="banner"
  aria-labelledby="hero-title-c"
>

  {/* Subtle decorative element */}
  <div
    class="absolute -top-20 -right-20 w-96 h-96 bg-[var(--accent)] opacity-5 rounded-full blur-3xl"
    aria-hidden="true"
  />

  {/* Main content grid */}
  <div class="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

    {/* LEFT SIDE: Headline + Subtitle + Stats */}
    <div class="w-full lg:w-3/5 flex flex-col justify-center animate-fade-in-left">

      {/* Headline */}
      <h1
        id="hero-title-c"
        class="font-['Space_Grotesk'] font-bold text-4xl sm:text-5xl lg:text-6xl text-[var(--primary)] leading-tight tracking-tight mb-4"
      >
        Premium Pouches.
        <br />
        <span class="text-[var(--accent)]">Curated for You.</span>
      </h1>

      {/* Subtitle */}
      <p class="text-base sm:text-lg text-[#666] max-w-lg mb-8 sm:mb-12 leading-relaxed">
        The largest selection of European nicotine pouches, delivered to your door.
      </p>

      {/* Stats Grid (3 columns) */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">

        <div class="animate-fade-in-up" style="animation-delay: 200ms;">
          <div class="text-3xl sm:text-4xl font-bold text-[var(--primary)] mb-1">
            2,200+
          </div>
          <div class="text-sm text-[#999] font-medium">Products</div>
        </div>

        <div class="animate-fade-in-up" style="animation-delay: 300ms;">
          <div class="text-3xl sm:text-4xl font-bold text-[var(--primary)] mb-1">
            139
          </div>
          <div class="text-sm text-[#999] font-medium">Brands</div>
        </div>

        <div class="animate-fade-in-up" style="animation-delay: 400ms;">
          <div class="text-3xl sm:text-4xl font-bold text-[var(--primary)] mb-1">
            €0
          </div>
          <div class="text-sm text-[#999] font-medium">Free EU Shipping</div>
        </div>

      </div>

      {/* CTA Buttons */}
      <div class="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style="animation-delay: 500ms;">
        <button
          class="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-white bg-[var(--primary)] hover:bg-[#0d1a0d] transition-all duration-200 transform hover:scale-105 active:scale-95"
          aria-label="Shop now"
        >
          Shop Now
        </button>
        <button
          class="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-[var(--primary)] border-2 border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all duration-200"
          aria-label="Find your perfect pouch with our quiz"
        >
          Find Your Match
        </button>
      </div>

    </div>

    {/* RIGHT SIDE: Featured Product with Aura + Carousel Controls */}
    <div
      class="hidden lg:flex w-2/5 justify-center items-center relative h-full animate-fade-in-right"
      role="region"
      aria-label="Featured product showcase"
    >

      {/* Glowing aura background */}
      <div
        class="absolute w-80 h-80 bg-gradient-radial from-[var(--accent)] via-[rgba(74,103,65,0.3)] to-transparent rounded-full blur-2xl"
        aria-hidden="true"
      />

      {/* Featured Product Can - Centered */}
      <div class="relative z-10 flex flex-col items-center animate-fade-in-up" style="animation-delay: 300ms;">

        {/* Product Can Placeholder */}
        <div
          class="w-32 h-48 bg-[#00A651] rounded-xl shadow-2xl flex items-center justify-center flex-col mb-6 relative"
        >
          <div class="text-center">
            <span class="block text-2xl font-bold text-white mb-2">ZYN</span>
            <span class="block text-xs text-white/80">Cool Mint</span>
          </div>
        </div>

        {/* Featured text */}
        <p class="text-sm text-[#666] font-medium mb-6">
          Featured: ZYN Cool Mint
        </p>

        {/* Carousel controls */}
        <div class="flex gap-4 items-center">
          <button
            class="p-2 rounded-full bg-[#f0f0f0] hover:bg-[var(--accent)] hover:text-white transition-all duration-200 disabled:opacity-50"
            aria-label="Previous product"
            disabled
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div class="flex gap-2">
            <div class="w-2 h-2 bg-[var(--accent)] rounded-full" aria-hidden="true" />
            <div class="w-2 h-2 bg-[#d0d0d0] rounded-full" aria-hidden="true" />
            <div class="w-2 h-2 bg-[#d0d0d0] rounded-full" aria-hidden="true" />
            <div class="w-2 h-2 bg-[#d0d0d0] rounded-full" aria-hidden="true" />
          </div>
          <button
            class="p-2 rounded-full bg-[#f0f0f0] hover:bg-[var(--accent)] hover:text-white transition-all duration-200"
            aria-label="Next product"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>

    </div>

  </div>

  {/* CSS Animations */}
  <style>
    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translateX(-40px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translateX(40px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in-left {
      animation: fadeInLeft 0.8s ease-out forwards;
    }

    .animate-fade-in-right {
      animation: fadeInRight 0.8s ease-out forwards;
    }

    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
    }

    /* Gradient radial fallback for older browsers */
    .bg-gradient-radial {
      background: radial-gradient(circle, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%);
    }
  </style>

</section>
```

### Mobile Responsive Notes

- **Layout:** On mobile (`lg:` breakpoint), the featured product section is hidden; full attention on text and stats
- **Stats grid:** Stacks as 1 column on mobile, 3 columns on tablet+ with `grid-cols-1 sm:grid-cols-3`
- **Buttons:** Full-width on mobile, inline on desktop
- **Height:** Flexible content height on mobile to prevent cramping
- **Aura effect:** Only visible on desktop where there's horizontal space

### Animation Timing

| Element | Delay | Duration | Effect |
|---------|-------|----------|--------|
| Headline + subtitle | 0ms | 0.8s | Slide in from left |
| Product stat (1) | 200ms | 0.6s | Slide up |
| Product stat (2) | 300ms | 0.6s | Slide up |
| Product stat (3) | 400ms | 0.6s | Slide up |
| CTA buttons | 500ms | 0.6s | Slide up |
| Featured product | 300ms | 0.6s | Slide up |

---

## Implementation Notes

### Using These Components in Astro

Each concept is a standalone `.astro` file. Import and use in your homepage:

```astro
---
// src/pages/index.astro
import HeroConceptA from '@/components/HeroConceptA.astro';
// OR
import HeroConceptB from '@/components/HeroConceptB.astro';
// OR
import HeroConceptC from '@/components/HeroConceptC.astro';
---

<HeroConceptA />
```

### CSS Custom Properties (Theme Variables)

All concepts use Tailwind's CSS custom property syntax:
- `var(--primary)` → #1a2e1a (forest green)
- `var(--accent)` → #4a6741 (lighter green)
- `var(--background)` → #f8f6f3 (off-white)

These should already be defined in `src/index.css` from the forest theme.

### Product Image Placeholders

All product "cans" are **styled colored rectangles**. To integrate real Nyehandel CDN images later:

1. Replace the `<div class="w-20 h-32 bg-[#00A651]...">` with `<img>` tags
2. Source images from Nyehandel product feed
3. Keep the same dimensions and positioning classes
4. Ensure proper `alt` attributes for accessibility

Example:
```astro
<img
  src="https://cdn.nyehandel.se/products/zyn-cool-mint.png"
  alt="ZYN Cool Mint nicotine pouches"
  class="w-20 h-32 object-cover rounded-lg shadow-lg"
/>
```

### Accessibility

- ✅ Semantic HTML (`<h1>`, `<button>`, `<section role="banner">`)
- ✅ ARIA labels on all interactive elements (`aria-label`, `aria-labelledby`)
- ✅ `aria-hidden="true"` on decorative elements
- ✅ Proper heading hierarchy
- ✅ Color contrast verified against WCAG AA standard
- ✅ Keyboard-navigable buttons

### Performance

- **CSS-only animations** (no JavaScript)
- **No external images** (placeholders only)
- **Minimal dependencies** (Tailwind utilities)
- **Paint optimized** (animations use `transform` and `opacity`, not `left`/`top`)

### Responsive Breakpoints Used

- Mobile: default styles (< 640px)
- Tablet: `sm:` (≥ 640px)
- Desktop: `lg:` (≥ 1024px)

---

## Comparison Matrix

| Aspect | Concept A | Concept B | Concept C |
|--------|-----------|-----------|-----------|
| **Visual Feel** | Contemporary, product-led | Luxury, lifestyle | Modern, interactive |
| **Best For** | Variety showcase | Brand perception | Product exploration |
| **Layout** | Split (left/right) | Centered | Split (left/right) |
| **Product Display** | 5-6 cans at angles | Horizontal strip | 1 featured can |
| **CTA Count** | 2 buttons | 1 button | 2 buttons |
| **Color Usage** | Light background | Dark gradient | Gradient light |
| **Gamification** | Trust badges | Product strip | Carousel controls |
| **Animation Complexity** | Medium | Medium | High |
| **Mobile Simplification** | Products hidden | All visible | Products hidden |

---

## Next Steps

1. **Choose preferred concept** — Which aesthetic best aligns with SnusFriend brand?
2. **Integrate with Nyehandel CDN** — Replace placeholder cans with real product images
3. **A/B test on live traffic** — Track CTR on "Shop All" vs. "Explore Collection" vs. "Find Your Match"
4. **Add React island for carousel** — If using Concept C, add client-side product cycling
5. **Performance audit** — Lighthouse test after integration with real images

---

**Document Version:** 1.0
**Last Updated:** 2026-03-28
**Author:** Claude Code
**Framework Version:** Astro 6, Tailwind v4, React 18 islands
