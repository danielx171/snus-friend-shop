/**
 * Blog Illustrations — Batch 4: Brand Guides
 * 5 SVG-based React component illustrations for:
 * - FUMI Nicotine Pouches Complete Guide
 * - ICEBERG Nicotine Pouches Complete Guide
 * - RAVE Nicotine Pouches Review
 * - ZYN Flavours Complete Guide (flavour wheel)
 * - VELO Flavours Complete Guide (flavour varieties)
 *
 * Dark theme: #0c1018 bg, #f1f5f9 text, brand colors as specified
 * Each export is a named React component ready to embed in blog posts
 */

import React from 'react';

/**
 * FUMI Brand Illustration
 * Hot pink (#FF69B4) + purple (#7B2D8E) with whimsical aesthetic
 * Shows 3 Fumi cans: Salty Raspberry, Fiery Mango, Zingy Ginger
 */
export const FumiBrandIllustration = () => (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    {/* Background */}
    <rect width="400" height="300" fill="#0c1018" />

    {/* Decorative background shapes */}
    <circle cx="80" cy="50" r="40" fill="#FF69B4" opacity="0.1" />
    <circle cx="320" cy="250" r="60" fill="#7B2D8E" opacity="0.1" />

    {/* Leaf/plant icon top left */}
    <g transform="translate(50, 40)">
      <path
        d="M 10 20 Q 15 5 20 0 Q 15 8 10 15 Q 5 8 0 0 Q 5 5 10 20"
        fill="#10b981"
        opacity="0.8"
      />
      <path
        d="M 12 20 L 12 30"
        stroke="#10b981"
        strokeWidth="1.5"
        opacity="0.8"
      />
    </g>

    {/* Left can: Salty Raspberry */}
    <g transform="translate(60, 80)">
      {/* Can body */}
      <rect x="0" y="0" width="35" height="80" rx="4" fill="#FF69B4" />
      {/* Can shine */}
      <rect x="3" y="2" width="8" height="76" rx="2" fill="#FFB3D9" opacity="0.6" />
      {/* Label */}
      <rect x="2" y="20" width="31" height="40" fill="#0c1018" />
      {/* Label text */}
      <text x="17.5" y="35" fontSize="6" fill="#FF69B4" textAnchor="middle" fontWeight="bold">
        FUMI
      </text>
      <text x="17.5" y="45" fontSize="3.5" fill="#f1f5f9" textAnchor="middle">
        Salty
      </text>
      <text x="17.5" y="52" fontSize="3.5" fill="#f1f5f9" textAnchor="middle">
        Raspberry
      </text>
    </g>

    {/* Center can: Fiery Mango */}
    <g transform="translate(165, 60)">
      {/* Can body */}
      <rect x="0" y="0" width="35" height="90" rx="4" fill="#FF8C42" />
      {/* Can shine */}
      <rect x="3" y="2" width="8" height="86" rx="2" fill="#FFB399" opacity="0.6" />
      {/* Spice indicator - small flame icon */}
      <path d="M 17.5 10 L 19 15 Q 17.5 17 16 15 Z" fill="#FF4500" />
      {/* Label */}
      <rect x="2" y="25" width="31" height="45" fill="#0c1018" />
      {/* Label text */}
      <text x="17.5" y="40" fontSize="6" fill="#FF8C42" textAnchor="middle" fontWeight="bold">
        FUMI
      </text>
      <text x="17.5" y="50" fontSize="3.5" fill="#f1f5f9" textAnchor="middle">
        Fiery
      </text>
      <text x="17.5" y="57" fontSize="3.5" fill="#f1f5f9" textAnchor="middle">
        Mango
      </text>
    </g>

    {/* Right can: Zingy Ginger */}
    <g transform="translate(270, 80)">
      {/* Can body */}
      <rect x="0" y="0" width="35" height="80" rx="4" fill="#D4A574" />
      {/* Can shine */}
      <rect x="3" y="2" width="8" height="76" rx="2" fill="#E8C9B0" opacity="0.6" />
      {/* Label */}
      <rect x="2" y="20" width="31" height="40" fill="#0c1018" />
      {/* Label text */}
      <text x="17.5" y="35" fontSize="6" fill="#D4A574" textAnchor="middle" fontWeight="bold">
        FUMI
      </text>
      <text x="17.5" y="45" fontSize="3.5" fill="#f1f5f9" textAnchor="middle">
        Zingy
      </text>
      <text x="17.5" y="52" fontSize="3.5" fill="#f1f5f9" textAnchor="middle">
        Ginger
      </text>
    </g>

    {/* Spice icons scattered */}
    <circle cx="120" cy="200" r="3" fill="#FF69B4" opacity="0.5" />
    <circle cx="200" cy="220" r="2.5" fill="#FF8C42" opacity="0.5" />
    <circle cx="280" cy="195" r="3" fill="#D4A574" opacity="0.5" />

    {/* Title and subtitle */}
    <text x="200" y="260" fontSize="20" fill="#FF69B4" textAnchor="middle" fontWeight="bold">
      FUMI
    </text>
    <text x="200" y="280" fontSize="11" fill="#cbd5e1" textAnchor="middle">
      ECCENTRIC NORDIC
    </text>
  </svg>
);

/**
 * ICEBERG Brand Illustration
 * Bright ice blue (#00D4FF) + dark blue (#001a33)
 * Shows 3 cans of different sizes (6mg, 30mg, 40mg)
 * Ice/mountain background, frost crystals, -100°C text
 */
export const IcebergBrandIllustration = () => (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    {/* Background */}
    <rect width="400" height="300" fill="#0c1018" />

    {/* Iceberg/mountain silhouette background */}
    <path
      d="M 0 180 L 100 80 L 150 120 L 200 60 L 280 100 L 320 50 L 400 150 L 400 300 L 0 300 Z"
      fill="#001a33"
      opacity="0.3"
    />

    {/* Frost crystal decorations */}
    <g opacity="0.4">
      {/* Top left crystals */}
      <line x1="50" y1="30" x2="50" y2="50" stroke="#00D4FF" strokeWidth="1" />
      <line x1="40" y1="40" x2="60" y2="40" stroke="#00D4FF" strokeWidth="1" />
      <line x1="45" y1="35" x2="55" y2="45" stroke="#00D4FF" strokeWidth="1" />
      <line x1="55" y1="35" x2="45" y2="45" stroke="#00D4FF" strokeWidth="1" />

      {/* Right side crystals */}
      <line x1="330" y1="80" x2="330" y2="100" stroke="#00D4FF" strokeWidth="1" />
      <line x1="320" y1="90" x2="340" y2="90" stroke="#00D4FF" strokeWidth="1" />
    </g>

    {/* Small can: 6mg */}
    <g transform="translate(70, 140)">
      <rect x="0" y="0" width="30" height="60" rx="3" fill="#00D4FF" />
      <rect x="2" y="2" width="6" height="56" rx="2" fill="#7FE5FF" opacity="0.7" />
      <rect x="3" y="15" width="24" height="30" fill="#001a33" />
      <text x="15" y="28" fontSize="5" fill="#00D4FF" textAnchor="middle" fontWeight="bold">
        6mg
      </text>
      <text x="15" y="35" fontSize="2.5" fill="#f1f5f9" textAnchor="middle">
        MINT
      </text>
    </g>

    {/* Medium can: 30mg */}
    <g transform="translate(160, 100)">
      <rect x="0" y="0" width="40" height="100" rx="4" fill="#00D4FF" />
      <rect x="2" y="2" width="8" height="96" rx="2" fill="#7FE5FF" opacity="0.7" />
      <rect x="3" y="25" width="34" height="50" fill="#001a33" />
      <text x="20" y="45" fontSize="7" fill="#00D4FF" textAnchor="middle" fontWeight="bold">
        30mg
      </text>
      <text x="20" y="55" fontSize="3" fill="#f1f5f9" textAnchor="middle">
        EXTREME
      </text>
    </g>

    {/* Large can: 40mg */}
    <g transform="translate(260, 80)">
      <rect x="0" y="0" width="45" height="120" rx="4" fill="#00D4FF" />
      <rect x="2" y="2" width="9" height="116" rx="2" fill="#7FE5FF" opacity="0.7" />
      <rect x="3" y="30" width="39" height="60" fill="#001a33" />
      <text x="22.5" y="55" fontSize="8" fill="#00D4FF" textAnchor="middle" fontWeight="bold">
        40mg
      </text>
      <text x="22.5" y="67" fontSize="3.5" fill="#f1f5f9" textAnchor="middle">
        MAX
      </text>
    </g>

    {/* Glow effect around cans */}
    <circle cx="130" cy="170" r="80" fill="#00D4FF" opacity="0.05" />

    {/* Temperature indicator */}
    <g transform="translate(340, 240)">
      <text x="0" y="0" fontSize="9" fill="#00D4FF" fontWeight="bold" textAnchor="end">
        -100°C
      </text>
      <circle cx="-30" cy="-3" r="5" fill="none" stroke="#00D4FF" strokeWidth="1.5" opacity="0.6" />
    </g>

    {/* Title and subtitle */}
    <text x="200" y="260" fontSize="18" fill="#00D4FF" textAnchor="middle" fontWeight="bold">
      ICEBERG
    </text>
    <text x="200" y="280" fontSize="11" fill="#cbd5e1" textAnchor="middle">
      6-40MG
    </text>
  </svg>
);

/**
 * RAVE Brand Illustration
 * Neon magenta (#FF00FF) + neon green (#00FF00)
 * Shows 3 RAVE cans with vibrant party/festival aesthetic
 * Lightning bolt for energy
 */
export const RaveBrandIllustration = () => (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    {/* Background */}
    <rect width="400" height="300" fill="#0c1018" />

    {/* Neon glow backgrounds */}
    <circle cx="100" cy="120" r="60" fill="#FF00FF" opacity="0.08" />
    <circle cx="300" cy="120" r="60" fill="#00FF00" opacity="0.08" />

    {/* Lightning bolt left */}
    <path
      d="M 40 80 L 60 100 L 50 110 L 70 140 L 50 145 L 55 170"
      stroke="#00FF00"
      strokeWidth="2"
      fill="none"
      opacity="0.6"
    />

    {/* Left can: Frozen Citrus */}
    <g transform="translate(60, 100)">
      <rect x="0" y="0" width="35" height="80" rx="4" fill="#00FF00" />
      <rect x="3" y="2" width="8" height="76" rx="2" fill="#7FFF7F" opacity="0.6" />
      <rect x="2" y="20" width="31" height="40" fill="#0c1018" />
      <text x="17.5" y="33" fontSize="5" fill="#00FF00" textAnchor="middle" fontWeight="bold">
        RAVE
      </text>
      <text x="17.5" y="44" fontSize="3" fill="#f1f5f9" textAnchor="middle">
        Frozen
      </text>
      <text x="17.5" y="50" fontSize="3" fill="#f1f5f9" textAnchor="middle">
        Citrus
      </text>
    </g>

    {/* Center can: Mango Django */}
    <g transform="translate(165, 75)">
      <rect x="0" y="0" width="40" height="100" rx="4" fill="#FF00FF" />
      <rect x="3" y="2" width="9" height="96" rx="2" fill="#FF7FFF" opacity="0.6" />
      <rect x="2" y="25" width="36" height="50" fill="#0c1018" />
      <text x="20" y="42" fontSize="6" fill="#FF00FF" textAnchor="middle" fontWeight="bold">
        RAVE
      </text>
      <text x="20" y="52" fontSize="3.5" fill="#f1f5f9" textAnchor="middle">
        Mango
      </text>
      <text x="20" y="58" fontSize="3.5" fill="#f1f5f9" textAnchor="middle">
        Django
      </text>
    </g>

    {/* Right can: Cola Explosion */}
    <g transform="translate(270, 100)">
      <rect x="0" y="0" width="35" height="80" rx="4" fill="#00FF00" />
      <rect x="3" y="2" width="8" height="76" rx="2" fill="#7FFF7F" opacity="0.6" />
      <rect x="2" y="20" width="31" height="40" fill="#0c1018" />
      <text x="17.5" y="33" fontSize="5" fill="#00FF00" textAnchor="middle" fontWeight="bold">
        RAVE
      </text>
      <text x="17.5" y="44" fontSize="3" fill="#f1f5f9" textAnchor="middle">
        Cola
      </text>
      <text x="17.5" y="50" fontSize="3" fill="#f1f5f9" textAnchor="middle">
        Explosion
      </text>
    </g>

    {/* Lightning bolt right */}
    <path
      d="M 360 85 L 340 105 L 350 115 L 330 145 L 350 150 L 345 170"
      stroke="#FF00FF"
      strokeWidth="2"
      fill="none"
      opacity="0.6"
    />

    {/* Energy indicators - small stars */}
    <circle cx="120" cy="60" r="2" fill="#00FF00" opacity="0.7" />
    <circle cx="200" cy="45" r="2.5" fill="#FF00FF" opacity="0.7" />
    <circle cx="280" cy="65" r="2" fill="#00FF00" opacity="0.7" />

    {/* Title and subtitle */}
    <text x="200" y="255" fontSize="20" fill="#FF00FF" textAnchor="middle" fontWeight="bold">
      RAVE
    </text>
    <text x="200" y="275" fontSize="11" fill="#cbd5e1" textAnchor="middle">
      NICOTINE + ENERGY
    </text>
  </svg>
);

/**
 * ZYN Flavour Map Illustration
 * Colour wheel with 7 ZYN flavour categories
 * Each segment represents a flavour family with icon
 */
export const ZynFlavourMapIllustration = () => (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    {/* Background */}
    <rect width="400" height="300" fill="#0c1018" />

    {/* Central circle (white) */}
    <circle cx="200" cy="150" r="80" fill="#a3e635" opacity="0.15" />

    {/* Flavour wheel segments */}
    {/* Mint segment - teal */}
    <path
      d="M 200 150 L 200 70 A 80 80 0 0 1 255.3 87.9 Z"
      fill="#14B8A6"
      opacity="0.8"
    />

    {/* Citrus segment - orange */}
    <path
      d="M 200 150 L 255.3 87.9 A 80 80 0 0 1 292.8 142.3 Z"
      fill="#F97316"
      opacity="0.8"
    />

    {/* Berry segment - red */}
    <path
      d="M 200 150 L 292.8 142.3 A 80 80 0 0 1 255.3 212.1 Z"
      fill="#EF4444"
      opacity="0.8"
    />

    {/* Coffee segment - brown */}
    <path
      d="M 200 150 L 255.3 212.1 A 80 80 0 0 1 200 230 Z"
      fill="#92400E"
      opacity="0.8"
    />

    {/* Fruit segment - green */}
    <path
      d="M 200 150 L 200 230 A 80 80 0 0 1 107.2 212.1 Z"
      fill="#22C55E"
      opacity="0.8"
    />

    {/* Licorice segment - dark */}
    <path
      d="M 200 150 L 107.2 212.1 A 80 80 0 0 1 144.7 87.9 Z"
      fill="#1F2937"
      opacity="0.8"
    />

    {/* Original segment - gray */}
    <path
      d="M 200 150 L 144.7 87.9 A 80 80 0 0 1 200 70 Z"
      fill="#6B7280"
      opacity="0.8"
    />

    {/* Central circle labels */}
    <circle cx="200" cy="150" r="35" fill="#0c1018" />

    {/* Outer labels */}
    <text x="200" y="95" fontSize="9" fill="#14B8A6" textAnchor="middle" fontWeight="bold">
      MINT
    </text>
    <text x="270" y="130" fontSize="9" fill="#F97316" textAnchor="middle" fontWeight="bold">
      CITRUS
    </text>
    <text x="265" y="195" fontSize="9" fill="#EF4444" textAnchor="middle" fontWeight="bold">
      BERRY
    </text>
    <text x="200" y="240" fontSize="9" fill="#92400E" textAnchor="middle" fontWeight="bold">
      COFFEE
    </text>
    <text x="130" y="195" fontSize="9" fill="#22C55E" textAnchor="middle" fontWeight="bold">
      FRUIT
    </text>
    <text x="115" y="130" fontSize="9" fill="#1F2937" textAnchor="middle" fontWeight="bold">
      LICORICE
    </text>
    <text x="200" y="90" fontSize="9" fill="#6B7280" textAnchor="middle" fontWeight="bold" transform="translate(-45, 0)">
      ORIGINAL
    </text>

    {/* Center text */}
    <text x="200" y="150" fontSize="14" fill="#a3e635" textAnchor="middle" fontWeight="bold">
      ZYN
    </text>

    {/* Title and subtitle */}
    <text x="200" y="280" fontSize="14" fill="#a3e635" textAnchor="middle" fontWeight="bold">
      ZYN FLAVOUR MAP
    </text>
    <text x="200" y="295" fontSize="10" fill="#cbd5e1" textAnchor="middle">
      56+ PRODUCTS
    </text>
  </svg>
);

/**
 * VELO Flavours Illustration
 * Shows 5 VELO cans in a row representing flavour families
 * Magenta (#E040FB) brand color, "SHIFT COLLECTION" callout
 */
export const VeloFlavoursIllustration = () => (
  <svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    {/* Background */}
    <rect width="500" height="300" fill="#0c1018" />

    {/* Decorative glow */}
    <circle cx="250" cy="150" r="120" fill="#E040FB" opacity="0.08" />

    {/* Can 1: Mint (teal) */}
    <g transform="translate(40, 90)">
      <rect x="0" y="0" width="40" height="100" rx="4" fill="#14B8A6" />
      <rect x="3" y="2" width="9" height="96" rx="2" fill="#7DD5CA" opacity="0.6" />
      <rect x="2" y="30" width="36" height="40" fill="#1a202c" />
      <text x="20" y="48" fontSize="6" fill="#14B8A6" textAnchor="middle" fontWeight="bold">
        MINT
      </text>
    </g>

    {/* Can 2: Berry (pink) */}
    <g transform="translate(110, 70)">
      <rect x="0" y="0" width="40" height="120" rx="4" fill="#EC4899" />
      <rect x="3" y="2" width="9" height="116" rx="2" fill="#F5A3C7" opacity="0.6" />
      <rect x="2" y="35" width="36" height="50" fill="#1a202c" />
      <text x="20" y="57" fontSize="6" fill="#EC4899" textAnchor="middle" fontWeight="bold">
        BERRY
      </text>
    </g>

    {/* Can 3: Citrus (yellow) */}
    <g transform="translate(180, 85)">
      <rect x="0" y="0" width="40" height="105" rx="4" fill="#FBBF24" />
      <rect x="3" y="2" width="9" height="101" rx="2" fill="#FDD89B" opacity="0.6" />
      <rect x="2" y="32" width="36" height="41" fill="#1a202c" />
      <text x="20" y="52" fontSize="6" fill="#FBBF24" textAnchor="middle" fontWeight="bold">
        CITRUS
      </text>
    </g>

    {/* Can 4: Fruit (orange) */}
    <g transform="translate(250, 80)">
      <rect x="0" y="0" width="40" height="110" rx="4" fill="#F97316" />
      <rect x="3" y="2" width="9" height="106" rx="2" fill="#FCA5A5" opacity="0.6" />
      <rect x="2" y="33" width="36" height="44" fill="#1a202c" />
      <text x="20" y="55" fontSize="6" fill="#F97316" textAnchor="middle" fontWeight="bold">
        FRUIT
      </text>
    </g>

    {/* Can 5: Licorice (dark) */}
    <g transform="translate(320, 90)">
      <rect x="0" y="0" width="40" height="100" rx="4" fill="#6B21A8" />
      <rect x="3" y="2" width="9" height="96" rx="2" fill="#A78BFA" opacity="0.5" />
      <rect x="2" y="30" width="36" height="40" fill="#1a202c" />
      <text x="20" y="48" fontSize="6" fill="#A78BFA" textAnchor="middle" fontWeight="bold">
        LICORICE
      </text>
    </g>

    {/* SHIFT COLLECTION callout badge */}
    <g transform="translate(390, 110)">
      <circle cx="0" cy="0" r="35" fill="#E040FB" opacity="0.9" />
      <text x="0" y="-5" fontSize="8" fill="#f1f5f9" textAnchor="middle" fontWeight="bold">
        SHIFT
      </text>
      <text x="0" y="8" fontSize="8" fill="#f1f5f9" textAnchor="middle" fontWeight="bold">
        COLLECTION
      </text>
    </g>

    {/* Title and subtitle */}
    <text x="250" y="265" fontSize="18" fill="#E040FB" textAnchor="middle" fontWeight="bold">
      VELO FLAVOURS
    </text>
    <text x="250" y="290" fontSize="11" fill="#cbd5e1" textAnchor="middle">
      30+ VARIETIES
    </text>
  </svg>
);

/**
 * Metadata array for all illustrations
 * Use this to reference illustrations by name and purpose
 */
export const blogIllustrationsBatch4 = [
  {
    id: 'fumi-brand',
    component: FumiBrandIllustration,
    title: 'FUMI Brand Illustration',
    article: 'fumi-nicotine-pouches-complete-guide',
    brandColor: '#FF69B4',
    accentColor: '#7B2D8E',
    theme: 'whimsical-eccentric',
    description: 'FUMI brand showcase with 3 eccentric flavours (Salty Raspberry, Fiery Mango, Zingy Ginger)',
  },
  {
    id: 'iceberg-brand',
    component: IcebergBrandIllustration,
    title: 'ICEBERG Brand Illustration',
    article: 'iceberg-nicotine-pouches-complete-guide',
    brandColor: '#00D4FF',
    accentColor: '#001a33',
    theme: 'extreme-cold',
    description: 'ICEBERG strength tiers (6mg, 30mg, 40mg) with ice-age aesthetic, -100°C indicator',
  },
  {
    id: 'rave-brand',
    component: RaveBrandIllustration,
    title: 'RAVE Brand Illustration',
    article: 'rave-nicotine-pouches-review',
    brandColor: '#FF00FF',
    accentColor: '#00FF00',
    theme: 'neon-party',
    description: 'RAVE energy pouches with vibrant neon aesthetic (Frozen Citrus, Mango Django, Cola Explosion)',
  },
  {
    id: 'zyn-flavour-map',
    component: ZynFlavourMapIllustration,
    title: 'ZYN Flavour Map',
    article: 'zyn-flavours-complete-guide',
    brandColor: '#00A3E0',
    accentColor: '#a3e635',
    theme: 'informational-wheel',
    description: '7-segment flavour wheel showing ZYN categories (Mint, Citrus, Berry, Coffee, Fruit, Licorice, Original)',
  },
  {
    id: 'velo-flavours',
    component: VeloFlavoursIllustration,
    title: 'VELO Flavours Illustration',
    article: 'velo-flavours-complete-guide',
    brandColor: '#E040FB',
    accentColor: '#1A1A2E',
    theme: 'variety-showcase',
    description: '5-can flavour family lineup (Mint, Berry, Citrus, Fruit, Licorice) with SHIFT COLLECTION badge',
  },
];

/**
 * Export all components together
 */
export default {
  FumiBrandIllustration,
  IcebergBrandIllustration,
  RaveBrandIllustration,
  ZynFlavourMapIllustration,
  VeloFlavoursIllustration,
  blogIllustrationsBatch4,
};