import React, { useState } from 'react';

/* ================================================================
   SNUSFRIEND AVATAR PARTS — BATCH 2 (25 new designs)

   Categories:
   A. Brand-Inspired Accessories (6)  — hats, glasses, gear themed after pouch brands
   B. Seasonal Expressions (6)        — holiday/season themed avatars
   C. Achievement Backgrounds (5)     — unlockable background rings/frames
   D. Pouch Character Variants (5)    — new base pouch-person designs
   E. Community Badges (3)            — special status indicators

   Each avatar is a 128x128 SVG. Colors reference the SnusFriend palette:
   - Primary green: #a3e635
   - Dark bg: #0c1018
   - Card bg: #161d2b
   - Text: #f1f5f9
   - Muted: #94a3b8

   Rarity tiers: common (gray), rare (blue), epic (purple), legendary (gold)
   ================================================================ */

const AVATARS = [
  // ─── A. BRAND-INSPIRED ACCESSORIES ──────────────────────────────
  {
    id: 'mint-king-crown',
    name: 'Mint King',
    category: 'Brand Accessories',
    rarity: 'epic',
    unlock_type: 'orders',
    unlock_threshold: 10,
    description: 'Golden crown with mint leaf gems — for loyal customers',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="mk-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
          <linearGradient id="mk-crown" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#mk-bg)" stroke="#fbbf24" strokeWidth="2" />
        {/* Face base */}
        <circle cx="64" cy="72" r="28" fill="#e2e8f0" />
        <circle cx="54" cy="68" r="3.5" fill="#1e293b" />
        <circle cx="74" cy="68" r="3.5" fill="#1e293b" />
        <path d="M56 78 Q64 84 72 78" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Crown */}
        <path d="M38 52 L44 38 L52 48 L64 32 L76 48 L84 38 L90 52 Z" fill="url(#mk-crown)" />
        <path d="M38 52 L90 52 L88 58 L40 58 Z" fill="#f59e0b" />
        {/* Mint leaf gems */}
        <circle cx="52" cy="48" r="3" fill="#a3e635" />
        <circle cx="64" cy="36" r="3.5" fill="#a3e635" />
        <circle cx="76" cy="48" r="3" fill="#a3e635" />
      </svg>
    ),
  },
  {
    id: 'arctic-explorer',
    name: 'Arctic Explorer',
    category: 'Brand Accessories',
    rarity: 'rare',
    unlock_type: 'points',
    unlock_threshold: 500,
    description: 'Fur-lined hood inspired by Nordic Spirit\'s ice aesthetic',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ae-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#ae-bg)" stroke="#60a5fa" strokeWidth="2" />
        {/* Fur hood */}
        <path d="M30 55 Q30 28 64 24 Q98 28 98 55 L96 72 Q96 78 90 78 L38 78 Q32 78 32 72 Z" fill="#475569" />
        <path d="M34 55 Q34 32 64 28 Q94 32 94 55 L92 68 Q92 72 88 72 L40 72 Q36 72 36 68 Z" fill="#64748b" />
        {/* Fur trim */}
        <path d="M32 72 Q48 68 64 72 Q80 68 96 72 Q80 78 64 74 Q48 78 32 72" fill="#e2e8f0" opacity="0.9" />
        {/* Face */}
        <circle cx="64" cy="60" r="22" fill="#e2e8f0" />
        <circle cx="56" cy="57" r="3" fill="#1e293b" />
        <circle cx="72" cy="57" r="3" fill="#1e293b" />
        <path d="M58 66 Q64 70 70 66" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Snow particles */}
        <circle cx="20" cy="30" r="1.5" fill="white" opacity="0.6" />
        <circle cx="105" cy="25" r="1" fill="white" opacity="0.5" />
        <circle cx="15" cy="90" r="1.5" fill="white" opacity="0.4" />
        <circle cx="110" cy="85" r="1" fill="white" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 'neon-visor',
    name: 'Neon Visor',
    category: 'Brand Accessories',
    rarity: 'common',
    unlock_type: 'free',
    unlock_threshold: 0,
    description: 'Cyberpunk visor in SnusFriend green — free for all',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="nv-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#nv-bg)" stroke="#a3e635" strokeWidth="2" />
        {/* Face */}
        <circle cx="64" cy="70" r="26" fill="#e2e8f0" />
        <path d="M58 76 Q64 80 70 76" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Neon visor */}
        <rect x="36" y="58" width="56" height="14" rx="7" fill="#0f172a" stroke="#a3e635" strokeWidth="2" />
        <rect x="40" y="61" width="20" height="8" rx="4" fill="#a3e635" opacity="0.3" />
        <rect x="68" y="61" width="20" height="8" rx="4" fill="#a3e635" opacity="0.3" />
        {/* Glow effect */}
        <rect x="36" y="58" width="56" height="14" rx="7" fill="none" stroke="#a3e635" strokeWidth="1" opacity="0.4" />
        {/* Hair spikes */}
        <path d="M42 50 L46 36 L52 48 L58 32 L64 46 L70 34 L76 48 L82 38 L86 50" fill="#334155" />
      </svg>
    ),
  },
  {
    id: 'berry-beret',
    name: 'Berry Beret',
    category: 'Brand Accessories',
    rarity: 'common',
    unlock_type: 'points',
    unlock_threshold: 100,
    description: 'Classic beret in berry purple — pouch connoisseur style',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bb-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e1030" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#bb-bg)" stroke="#a855f7" strokeWidth="2" />
        {/* Face */}
        <circle cx="64" cy="72" r="26" fill="#e2e8f0" />
        <circle cx="55" cy="68" r="3" fill="#1e293b" />
        <circle cx="73" cy="68" r="3" fill="#1e293b" />
        <path d="M57 78 Q64 83 71 78" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Beret */}
        <ellipse cx="64" cy="50" rx="30" ry="14" fill="#8b5cf6" />
        <ellipse cx="58" cy="50" rx="26" ry="12" fill="#a855f7" />
        <circle cx="64" cy="38" r="3" fill="#c084fc" />
        {/* Beret band */}
        <path d="M36 54 Q64 58 92 54" stroke="#7c3aed" strokeWidth="3" fill="none" />
      </svg>
    ),
  },
  {
    id: 'fire-headband',
    name: 'Fire Headband',
    category: 'Brand Accessories',
    rarity: 'rare',
    unlock_type: 'orders',
    unlock_threshold: 5,
    description: 'Flame-patterned headband for the strong-pouch enthusiast',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="fh-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2d1810" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
          <linearGradient id="fh-flame" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#fh-bg)" stroke="#ef4444" strokeWidth="2" />
        {/* Face */}
        <circle cx="64" cy="72" r="26" fill="#e2e8f0" />
        <circle cx="55" cy="68" r="3" fill="#1e293b" />
        <circle cx="73" cy="68" r="3" fill="#1e293b" />
        <path d="M56 79 Q64 83 72 79" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Headband */}
        <path d="M36 54 Q64 48 92 54" stroke="#1e293b" strokeWidth="8" fill="none" strokeLinecap="round" />
        {/* Flames on headband */}
        <path d="M40 50 Q42 40 44 50" fill="url(#fh-flame)" />
        <path d="M50 48 Q53 34 56 48" fill="url(#fh-flame)" />
        <path d="M60 46 Q64 30 68 46" fill="url(#fh-flame)" />
        <path d="M72 48 Q75 34 78 48" fill="url(#fh-flame)" />
        <path d="M84 50 Q86 40 88 50" fill="url(#fh-flame)" />
      </svg>
    ),
  },
  {
    id: 'gold-headphones',
    name: 'Gold Beats',
    category: 'Brand Accessories',
    rarity: 'epic',
    unlock_type: 'points',
    unlock_threshold: 2000,
    description: 'Gold DJ headphones — for the SnusPoints elite',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="gh-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
          <linearGradient id="gh-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#gh-bg)" stroke="#fbbf24" strokeWidth="2" />
        {/* Face */}
        <circle cx="64" cy="68" r="24" fill="#e2e8f0" />
        <circle cx="56" cy="65" r="3" fill="#1e293b" />
        <circle cx="72" cy="65" r="3" fill="#1e293b" />
        <path d="M58 74 Q64 78 70 74" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Headphone band */}
        <path d="M32 64 Q32 32 64 28 Q96 32 96 64" stroke="url(#gh-gold)" strokeWidth="5" fill="none" strokeLinecap="round" />
        {/* Ear cups */}
        <rect x="24" y="56" width="14" height="20" rx="5" fill="url(#gh-gold)" />
        <rect x="90" y="56" width="14" height="20" rx="5" fill="url(#gh-gold)" />
        <rect x="27" y="60" width="8" height="12" rx="3" fill="#92400e" opacity="0.4" />
        <rect x="93" y="60" width="8" height="12" rx="3" fill="#92400e" opacity="0.4" />
      </svg>
    ),
  },

  // ─── B. SEASONAL EXPRESSIONS ──────────────────────────────────
  {
    id: 'summer-shades',
    name: 'Summer Chill',
    category: 'Seasonal',
    rarity: 'common',
    unlock_type: 'free',
    unlock_threshold: 0,
    description: 'Sunglasses and a relaxed grin — summer vibes',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ss-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#ss-bg)" stroke="#38bdf8" strokeWidth="2" />
        {/* Sun */}
        <circle cx="100" cy="24" r="12" fill="#fbbf24" opacity="0.7" />
        <line x1="100" y1="8" x2="100" y2="4" stroke="#fbbf24" strokeWidth="2" opacity="0.5" />
        <line x1="114" y1="18" x2="118" y2="14" stroke="#fbbf24" strokeWidth="2" opacity="0.5" />
        <line x1="116" y1="30" x2="120" y2="30" stroke="#fbbf24" strokeWidth="2" opacity="0.5" />
        {/* Face */}
        <circle cx="64" cy="70" r="28" fill="#f5d0a9" />
        {/* Sunglasses */}
        <rect x="40" y="60" width="18" height="14" rx="3" fill="#1e293b" />
        <rect x="70" y="60" width="18" height="14" rx="3" fill="#1e293b" />
        <line x1="58" y1="66" x2="70" y2="66" stroke="#1e293b" strokeWidth="2" />
        <line x1="40" y1="66" x2="34" y2="62" stroke="#1e293b" strokeWidth="2" />
        <line x1="88" y1="66" x2="94" y2="62" stroke="#1e293b" strokeWidth="2" />
        {/* Mouth */}
        <path d="M54 82 Q64 90 74 82" stroke="#92400e" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'winter-cozy',
    name: 'Winter Cozy',
    category: 'Seasonal',
    rarity: 'rare',
    unlock_type: 'quest',
    unlock_threshold: 1,
    description: 'Knit beanie and rosy cheeks — December exclusive',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="wc-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#wc-bg)" stroke="#ef4444" strokeWidth="2" />
        {/* Snow */}
        <circle cx="18" cy="20" r="2" fill="white" opacity="0.5" />
        <circle cx="45" cy="12" r="1.5" fill="white" opacity="0.4" />
        <circle cx="95" cy="18" r="2" fill="white" opacity="0.5" />
        <circle cx="110" cy="40" r="1" fill="white" opacity="0.3" />
        {/* Face */}
        <circle cx="64" cy="72" r="26" fill="#e2e8f0" />
        <circle cx="55" cy="68" r="3" fill="#1e293b" />
        <circle cx="73" cy="68" r="3" fill="#1e293b" />
        <path d="M58 78 Q64 82 70 78" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Rosy cheeks */}
        <circle cx="48" cy="74" r="5" fill="#f87171" opacity="0.3" />
        <circle cx="80" cy="74" r="5" fill="#f87171" opacity="0.3" />
        {/* Knit beanie */}
        <path d="M36 58 Q36 34 64 30 Q92 34 92 58" fill="#ef4444" />
        <rect x="36" y="54" width="56" height="8" rx="2" fill="#dc2626" />
        {/* Knit pattern */}
        <line x1="44" y1="54" x2="44" y2="62" stroke="#ef4444" strokeWidth="1" opacity="0.5" />
        <line x1="56" y1="54" x2="56" y2="62" stroke="#ef4444" strokeWidth="1" opacity="0.5" />
        <line x1="68" y1="54" x2="68" y2="62" stroke="#ef4444" strokeWidth="1" opacity="0.5" />
        <line x1="80" y1="54" x2="80" y2="62" stroke="#ef4444" strokeWidth="1" opacity="0.5" />
        {/* Pom pom */}
        <circle cx="64" cy="28" r="7" fill="#fca5a5" />
      </svg>
    ),
  },
  {
    id: 'spring-bloom',
    name: 'Spring Bloom',
    category: 'Seasonal',
    rarity: 'common',
    unlock_type: 'free',
    unlock_threshold: 0,
    description: 'Flower crown with spring colours — fresh and bright',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sb-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a2e1a" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#sb-bg)" stroke="#a3e635" strokeWidth="2" />
        {/* Face */}
        <circle cx="64" cy="72" r="26" fill="#e2e8f0" />
        <circle cx="55" cy="68" r="3" fill="#1e293b" />
        <circle cx="73" cy="68" r="3" fill="#1e293b" />
        <path d="M58 78 Q64 82 70 78" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Flower crown */}
        <path d="M36 56 Q50 44 64 48 Q78 44 92 56" stroke="#65a30d" strokeWidth="3" fill="none" />
        {/* Flowers */}
        <circle cx="40" cy="52" r="5" fill="#f472b6" />
        <circle cx="40" cy="52" r="2" fill="#fbbf24" />
        <circle cx="52" cy="46" r="5" fill="#a78bfa" />
        <circle cx="52" cy="46" r="2" fill="#fbbf24" />
        <circle cx="64" cy="44" r="5" fill="#fb923c" />
        <circle cx="64" cy="44" r="2" fill="#fbbf24" />
        <circle cx="76" cy="46" r="5" fill="#38bdf8" />
        <circle cx="76" cy="46" r="2" fill="#fbbf24" />
        <circle cx="88" cy="52" r="5" fill="#f472b6" />
        <circle cx="88" cy="52" r="2" fill="#fbbf24" />
        {/* Leaves */}
        <ellipse cx="46" cy="50" rx="3" ry="1.5" fill="#65a30d" transform="rotate(-20 46 50)" />
        <ellipse cx="82" cy="50" rx="3" ry="1.5" fill="#65a30d" transform="rotate(20 82 50)" />
      </svg>
    ),
  },
  {
    id: 'autumn-leaf',
    name: 'Autumn Harvest',
    category: 'Seasonal',
    rarity: 'common',
    unlock_type: 'points',
    unlock_threshold: 200,
    description: 'Warm tones and falling leaves — autumn vibes',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="al-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2d1f0e" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#al-bg)" stroke="#f97316" strokeWidth="2" />
        {/* Falling leaves */}
        <path d="M20 25 Q25 20 22 30 Q18 28 20 25" fill="#ef4444" opacity="0.6" transform="rotate(30 20 25)" />
        <path d="M100 20 Q105 15 102 25 Q98 23 100 20" fill="#f97316" opacity="0.5" transform="rotate(-20 100 20)" />
        <path d="M15 80 Q20 75 17 85 Q13 83 15 80" fill="#fbbf24" opacity="0.5" transform="rotate(45 15 80)" />
        <path d="M108 70 Q113 65 110 75 Q106 73 108 70" fill="#ef4444" opacity="0.4" />
        {/* Face */}
        <circle cx="64" cy="72" r="26" fill="#e2e8f0" />
        <circle cx="55" cy="68" r="3" fill="#1e293b" />
        <circle cx="73" cy="68" r="3" fill="#1e293b" />
        <path d="M58 78 Q64 82 70 78" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Scarf */}
        <path d="M40 90 Q50 86 64 88 Q78 86 88 90" stroke="#f97316" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M40 90 Q50 86 64 88 Q78 86 88 90" stroke="#ea580c" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Beanie */}
        <path d="M38 58 Q38 36 64 32 Q90 36 90 58" fill="#92400e" />
        <rect x="38" y="54" width="52" height="6" rx="2" fill="#78350f" />
      </svg>
    ),
  },
  {
    id: 'halloween-pouch',
    name: 'Spooky Pouch',
    category: 'Seasonal',
    rarity: 'epic',
    unlock_type: 'quest',
    unlock_threshold: 1,
    description: 'Jack-o-lantern pouch face — October exclusive',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="hp-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a0a2e" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#hp-bg)" stroke="#f97316" strokeWidth="2" />
        {/* Moon */}
        <circle cx="96" cy="24" r="10" fill="#fde68a" opacity="0.6" />
        <circle cx="100" cy="22" r="9" fill="#1a0a2e" opacity="0.8" />
        {/* Pumpkin head */}
        <ellipse cx="64" cy="68" rx="32" ry="28" fill="#f97316" />
        <ellipse cx="64" cy="68" rx="28" ry="26" fill="#ea580c" />
        {/* Pumpkin lines */}
        <path d="M64 42 Q64 68 64 94" stroke="#c2410c" strokeWidth="1" opacity="0.4" />
        <path d="M44 46 Q44 68 44 90" stroke="#c2410c" strokeWidth="1" opacity="0.3" />
        <path d="M84 46 Q84 68 84 90" stroke="#c2410c" strokeWidth="1" opacity="0.3" />
        {/* Carved eyes */}
        <path d="M48 60 L56 52 L56 64 Z" fill="#fbbf24" />
        <path d="M80 60 L72 52 L72 64 Z" fill="#fbbf24" />
        {/* Carved mouth */}
        <path d="M46 76 L50 72 L56 78 L62 72 L68 78 L74 72 L78 76 L82 80 Q64 90 46 80 Z" fill="#fbbf24" />
        {/* Stem */}
        <rect x="60" y="38" width="8" height="8" rx="2" fill="#65a30d" />
      </svg>
    ),
  },
  {
    id: 'new-year-party',
    name: 'Party Pouch',
    category: 'Seasonal',
    rarity: 'rare',
    unlock_type: 'quest',
    unlock_threshold: 1,
    description: 'Party hat and confetti — New Year celebration',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ny-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e1040" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
          <linearGradient id="ny-hat" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#ny-bg)" stroke="#a855f7" strokeWidth="2" />
        {/* Confetti */}
        <rect x="20" y="25" width="4" height="2" rx="1" fill="#fbbf24" transform="rotate(30 20 25)" />
        <rect x="95" y="30" width="4" height="2" rx="1" fill="#38bdf8" transform="rotate(-45 95 30)" />
        <rect x="30" y="85" width="4" height="2" rx="1" fill="#f472b6" transform="rotate(60 30 85)" />
        <rect x="100" y="80" width="4" height="2" rx="1" fill="#a3e635" transform="rotate(-15 100 80)" />
        <rect x="50" y="15" width="3" height="2" rx="1" fill="#ef4444" transform="rotate(20 50 15)" />
        <rect x="80" y="10" width="3" height="2" rx="1" fill="#fbbf24" transform="rotate(-40 80 10)" />
        {/* Face */}
        <circle cx="64" cy="72" r="26" fill="#e2e8f0" />
        <circle cx="55" cy="68" r="3" fill="#1e293b" />
        <circle cx="73" cy="68" r="3" fill="#1e293b" />
        <path d="M54 80 Q64 88 74 80" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Party hat */}
        <path d="M44 56 L64 22 L84 56 Z" fill="url(#ny-hat)" />
        <rect x="42" y="53" width="44" height="5" rx="2" fill="#fbbf24" />
        {/* Star on top */}
        <path d="M64 18 L66 24 L72 24 L67 28 L69 34 L64 30 L59 34 L61 28 L56 24 L62 24 Z" fill="#fbbf24" />
      </svg>
    ),
  },

  // ─── C. ACHIEVEMENT BACKGROUNDS ──────────────────────────────
  {
    id: 'green-aurora',
    name: 'Northern Lights',
    category: 'Achievement Background',
    rarity: 'legendary',
    unlock_type: 'level',
    unlock_threshold: 10,
    description: 'Aurora borealis background — level 10 reward',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ga-bg" cx="50%" cy="80%" r="70%">
            <stop offset="0%" stopColor="#0c1018" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#ga-bg)" stroke="#a3e635" strokeWidth="2.5" />
        {/* Aurora waves */}
        <path d="M10 50 Q32 20 64 40 Q96 60 118 30" stroke="#a3e635" strokeWidth="8" fill="none" opacity="0.2" />
        <path d="M5 60 Q30 30 64 50 Q98 70 123 40" stroke="#22d3ee" strokeWidth="6" fill="none" opacity="0.15" />
        <path d="M10 45 Q40 15 70 35 Q100 55 120 25" stroke="#a855f7" strokeWidth="5" fill="none" opacity="0.12" />
        {/* Stars */}
        <circle cx="25" cy="20" r="1" fill="white" opacity="0.7" />
        <circle cx="50" cy="14" r="1.5" fill="white" opacity="0.5" />
        <circle cx="90" cy="18" r="1" fill="white" opacity="0.6" />
        <circle cx="105" cy="35" r="1" fill="white" opacity="0.4" />
        <circle cx="15" cy="38" r="0.8" fill="white" opacity="0.5" />
        {/* Face */}
        <circle cx="64" cy="72" r="26" fill="#e2e8f0" />
        <circle cx="55" cy="68" r="3" fill="#1e293b" />
        <circle cx="73" cy="68" r="3" fill="#1e293b" />
        <path d="M58 78 Q64 82 70 78" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Legendary glow ring */}
        <circle cx="64" cy="64" r="58" fill="none" stroke="#a3e635" strokeWidth="1" opacity="0.3" />
        <circle cx="64" cy="64" r="55" fill="none" stroke="#a3e635" strokeWidth="0.5" opacity="0.2" />
      </svg>
    ),
  },
  {
    id: 'diamond-frame',
    name: 'Diamond Status',
    category: 'Achievement Background',
    rarity: 'legendary',
    unlock_type: 'points',
    unlock_threshold: 10000,
    description: 'Diamond-encrusted frame — 10k SnusPoints milestone',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="df-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
          <linearGradient id="df-diamond" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="50%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#df-bg)" stroke="url(#df-diamond)" strokeWidth="3" />
        {/* Diamond accents around border */}
        <path d="M64 4 L67 8 L64 12 L61 8 Z" fill="#7dd3fc" />
        <path d="M64 116 L67 120 L64 124 L61 120 Z" fill="#7dd3fc" />
        <path d="M4 64 L8 67 L12 64 L8 61 Z" fill="#7dd3fc" />
        <path d="M116 64 L120 67 L124 64 L120 61 Z" fill="#7dd3fc" />
        <path d="M18 18 L21 22 L18 26 L15 22 Z" fill="#7dd3fc" opacity="0.7" />
        <path d="M110 18 L113 22 L110 26 L107 22 Z" fill="#7dd3fc" opacity="0.7" />
        <path d="M18 110 L21 114 L18 118 L15 114 Z" fill="#7dd3fc" opacity="0.7" />
        <path d="M110 110 L113 114 L110 118 L107 114 Z" fill="#7dd3fc" opacity="0.7" />
        {/* Face */}
        <circle cx="64" cy="68" r="26" fill="#e2e8f0" />
        <circle cx="55" cy="64" r="3" fill="#1e293b" />
        <circle cx="73" cy="64" r="3" fill="#1e293b" />
        <path d="M58 74 Q64 78 70 74" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Crown at top */}
        <path d="M48 38 L52 28 L58 34 L64 24 L70 34 L76 28 L80 38 Z" fill="url(#df-diamond)" />
      </svg>
    ),
  },
  {
    id: 'fire-ring',
    name: 'Blazing Ring',
    category: 'Achievement Background',
    rarity: 'epic',
    unlock_type: 'orders',
    unlock_threshold: 25,
    description: 'Ring of fire — 25 orders milestone',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="fr-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e1008" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#fr-bg)" stroke="#ef4444" strokeWidth="2" />
        {/* Outer fire ring */}
        <circle cx="64" cy="64" r="56" fill="none" stroke="#ef4444" strokeWidth="3" opacity="0.3" />
        <circle cx="64" cy="64" r="52" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.25" />
        <circle cx="64" cy="64" r="48" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.2" />
        {/* Fire licks around the ring */}
        <path d="M64 6 Q66 14 64 10 Q62 14 64 6" fill="#ef4444" opacity="0.5" />
        <path d="M64 118 Q66 126 64 122 Q62 126 64 118" fill="#ef4444" opacity="0.5" />
        <path d="M6 64 Q14 66 10 64 Q14 62 6 64" fill="#f97316" opacity="0.5" />
        <path d="M118 64 Q126 66 122 64 Q126 62 118 64" fill="#f97316" opacity="0.5" />
        {/* Face */}
        <circle cx="64" cy="68" r="24" fill="#e2e8f0" />
        <circle cx="56" cy="65" r="3" fill="#1e293b" />
        <circle cx="72" cy="65" r="3" fill="#1e293b" />
        <path d="M58 74 Q64 78 70 74" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'starfield',
    name: 'Starfield',
    category: 'Achievement Background',
    rarity: 'rare',
    unlock_type: 'reviews',
    unlock_threshold: 10,
    description: 'Galaxy background — 10 reviews milestone',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sf-bg" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#sf-bg)" stroke="#818cf8" strokeWidth="2" />
        {/* Stars at various sizes and opacities */}
        <circle cx="20" cy="20" r="1.5" fill="white" opacity="0.8" />
        <circle cx="40" cy="14" r="1" fill="white" opacity="0.6" />
        <circle cx="85" cy="10" r="1.5" fill="white" opacity="0.7" />
        <circle cx="100" cy="25" r="1" fill="#818cf8" opacity="0.6" />
        <circle cx="110" cy="50" r="1.5" fill="white" opacity="0.5" />
        <circle cx="105" cy="90" r="1" fill="white" opacity="0.6" />
        <circle cx="15" cy="70" r="1" fill="#818cf8" opacity="0.5" />
        <circle cx="25" cy="100" r="1.5" fill="white" opacity="0.4" />
        <circle cx="50" cy="108" r="1" fill="white" opacity="0.5" />
        <circle cx="90" cy="105" r="1" fill="#c084fc" opacity="0.4" />
        <circle cx="12" cy="45" r="0.8" fill="white" opacity="0.6" />
        <circle cx="70" cy="8" r="0.8" fill="white" opacity="0.5" />
        {/* Nebula haze */}
        <ellipse cx="40" cy="30" rx="20" ry="10" fill="#818cf8" opacity="0.06" />
        <ellipse cx="90" cy="80" rx="15" ry="8" fill="#c084fc" opacity="0.05" />
        {/* Face */}
        <circle cx="64" cy="68" r="24" fill="#e2e8f0" />
        <circle cx="56" cy="65" r="3" fill="#1e293b" />
        <circle cx="72" cy="65" r="3" fill="#1e293b" />
        <path d="M58 74 Q64 78 70 74" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'gradient-halo',
    name: 'SnusFriend Halo',
    category: 'Achievement Background',
    rarity: 'epic',
    unlock_type: 'level',
    unlock_threshold: 5,
    description: 'Green-to-gold halo — level 5 reward',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="gh2-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
          <linearGradient id="gh2-halo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a3e635" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#gh2-bg)" stroke="url(#gh2-halo)" strokeWidth="2.5" />
        {/* Halo */}
        <ellipse cx="64" cy="38" rx="28" ry="8" fill="none" stroke="url(#gh2-halo)" strokeWidth="3" opacity="0.7" />
        <ellipse cx="64" cy="38" rx="24" ry="6" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3" />
        {/* Glow */}
        <ellipse cx="64" cy="38" rx="30" ry="10" fill="url(#gh2-halo)" opacity="0.08" />
        {/* Face */}
        <circle cx="64" cy="70" r="26" fill="#e2e8f0" />
        <circle cx="55" cy="66" r="3" fill="#1e293b" />
        <circle cx="73" cy="66" r="3" fill="#1e293b" />
        <path d="M58 76 Q64 80 70 76" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },

  // ─── D. POUCH CHARACTER VARIANTS ──────────────────────────────
  {
    id: 'pouch-ninja',
    name: 'Pouch Ninja',
    category: 'Pouch Character',
    rarity: 'rare',
    unlock_type: 'points',
    unlock_threshold: 750,
    description: 'Stealth pouch with ninja mask — discreet user',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="pn-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#pn-bg)" stroke="#475569" strokeWidth="2" />
        {/* Pouch shape body */}
        <ellipse cx="64" cy="72" rx="30" ry="24" fill="#e2e8f0" />
        {/* Ninja mask */}
        <rect x="32" y="58" width="64" height="16" rx="4" fill="#1e293b" />
        {/* Eyes through mask */}
        <ellipse cx="50" cy="66" rx="6" ry="4" fill="white" />
        <ellipse cx="78" cy="66" rx="6" ry="4" fill="white" />
        <circle cx="51" cy="66" r="2.5" fill="#1e293b" />
        <circle cx="79" cy="66" r="2.5" fill="#1e293b" />
        {/* Mask tail */}
        <path d="M96 62 L110 55 L108 60 L115 58" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Star/shuriken */}
        <path d="M22 28 L26 24 L24 30 L28 28 L24 32 Z" fill="#94a3b8" />
      </svg>
    ),
  },
  {
    id: 'pouch-chef',
    name: 'Flavour Chef',
    category: 'Pouch Character',
    rarity: 'common',
    unlock_type: 'reviews',
    unlock_threshold: 3,
    description: 'Chef hat pouch — flavour connoisseur',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="pc-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#pc-bg)" stroke="#a3e635" strokeWidth="2" />
        {/* Face */}
        <circle cx="64" cy="72" r="26" fill="#e2e8f0" />
        <circle cx="55" cy="68" r="3" fill="#1e293b" />
        <circle cx="73" cy="68" r="3" fill="#1e293b" />
        <path d="M56 80 Q64 85 72 80" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Chef hat */}
        <rect x="42" y="44" width="44" height="14" rx="2" fill="#f8fafc" />
        {/* Puffy top */}
        <circle cx="50" cy="38" r="10" fill="#f1f5f9" />
        <circle cx="64" cy="34" r="12" fill="#f8fafc" />
        <circle cx="78" cy="38" r="10" fill="#f1f5f9" />
        {/* Hat band */}
        <rect x="42" y="52" width="44" height="4" rx="1" fill="#a3e635" />
        {/* Mustache */}
        <path d="M54 76 Q58 72 62 76" stroke="#64748b" strokeWidth="1.5" fill="none" />
        <path d="M66 76 Q70 72 74 76" stroke="#64748b" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
  {
    id: 'pouch-astronaut',
    name: 'Space Pouch',
    category: 'Pouch Character',
    rarity: 'epic',
    unlock_type: 'orders',
    unlock_threshold: 15,
    description: 'Astronaut helmet — exploring new flavours',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="pa-bg" cx="30%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
          <linearGradient id="pa-visor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" opacity="0.6" />
            <stop offset="100%" stopColor="#818cf8" opacity="0.4" />
          </linearGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#pa-bg)" stroke="#a855f7" strokeWidth="2" />
        {/* Stars */}
        <circle cx="15" cy="20" r="1" fill="white" opacity="0.6" />
        <circle cx="100" cy="15" r="1.5" fill="white" opacity="0.5" />
        <circle cx="110" cy="90" r="1" fill="white" opacity="0.4" />
        <circle cx="20" cy="100" r="1" fill="white" opacity="0.5" />
        {/* Helmet */}
        <circle cx="64" cy="64" r="34" fill="#94a3b8" />
        <circle cx="64" cy="64" r="30" fill="#cbd5e1" />
        {/* Visor */}
        <ellipse cx="64" cy="62" rx="22" ry="20" fill="url(#pa-visor)" />
        {/* Face through visor */}
        <circle cx="56" cy="60" r="3" fill="#1e293b" />
        <circle cx="72" cy="60" r="3" fill="#1e293b" />
        <path d="M58 68 Q64 72 70 68" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Visor shine */}
        <ellipse cx="52" cy="54" rx="6" ry="3" fill="white" opacity="0.25" transform="rotate(-20 52 54)" />
        {/* Helmet bolts */}
        <circle cx="34" cy="64" r="3" fill="#64748b" />
        <circle cx="94" cy="64" r="3" fill="#64748b" />
      </svg>
    ),
  },
  {
    id: 'pouch-viking',
    name: 'Viking Pouch',
    category: 'Pouch Character',
    rarity: 'rare',
    unlock_type: 'points',
    unlock_threshold: 1000,
    description: 'Horned helmet — Nordic warrior spirit',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="pv-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#pv-bg)" stroke="#f59e0b" strokeWidth="2" />
        {/* Face */}
        <circle cx="64" cy="72" r="26" fill="#e2e8f0" />
        <circle cx="55" cy="68" r="3" fill="#1e293b" />
        <circle cx="73" cy="68" r="3" fill="#1e293b" />
        {/* Determined mouth */}
        <line x1="56" y1="80" x2="72" y2="80" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        {/* Viking helmet */}
        <path d="M36 60 Q36 38 64 34 Q92 38 92 60" fill="#78716c" />
        <rect x="36" y="56" width="56" height="6" rx="2" fill="#a8a29e" />
        {/* Nose guard */}
        <rect x="62" y="52" width="4" height="18" rx="1" fill="#a8a29e" />
        {/* Horns */}
        <path d="M36 54 Q24 36 18 20" stroke="#f5f5dc" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M92 54 Q104 36 110 20" stroke="#f5f5dc" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* Horn tips */}
        <circle cx="18" cy="18" r="3" fill="#fef3c7" />
        <circle cx="110" cy="18" r="3" fill="#fef3c7" />
        {/* Beard */}
        <path d="M46 86 Q50 96 56 92 Q60 100 64 94 Q68 100 72 92 Q78 96 82 86" fill="#92400e" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 'pouch-robot',
    name: 'Robo Pouch',
    category: 'Pouch Character',
    rarity: 'common',
    unlock_type: 'free',
    unlock_threshold: 0,
    description: 'Friendly robot pouch — tech meets nicotine',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="pr-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#pr-bg)" stroke="#64748b" strokeWidth="2" />
        {/* Antenna */}
        <line x1="64" y1="34" x2="64" y2="22" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="64" cy="20" r="4" fill="#a3e635" />
        {/* Robot head */}
        <rect x="38" y="36" width="52" height="40" rx="8" fill="#94a3b8" />
        <rect x="42" y="40" width="44" height="32" rx="6" fill="#cbd5e1" />
        {/* Eyes (LED style) */}
        <rect x="48" y="50" width="12" height="8" rx="2" fill="#a3e635" />
        <rect x="68" y="50" width="12" height="8" rx="2" fill="#a3e635" />
        {/* Mouth (speaker grille) */}
        <line x1="52" y1="66" x2="76" y2="66" stroke="#64748b" strokeWidth="1.5" />
        <line x1="52" y1="69" x2="76" y2="69" stroke="#64748b" strokeWidth="1.5" />
        {/* Ears */}
        <rect x="30" y="48" width="8" height="16" rx="3" fill="#94a3b8" />
        <rect x="90" y="48" width="8" height="16" rx="3" fill="#94a3b8" />
        {/* Body hint */}
        <rect x="48" y="78" width="32" height="16" rx="4" fill="#94a3b8" />
        <circle cx="64" cy="86" r="4" fill="#a3e635" opacity="0.6" />
      </svg>
    ),
  },

  // ─── E. COMMUNITY BADGES ──────────────────────────────────────
  {
    id: 'og-member',
    name: 'OG Member',
    category: 'Community Badge',
    rarity: 'legendary',
    unlock_type: 'quest',
    unlock_threshold: 1,
    description: 'Gold "OG" badge — first 100 registered users',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="og-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
          <linearGradient id="og-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#og-bg)" stroke="#fbbf24" strokeWidth="3" />
        {/* Golden shimmer ring */}
        <circle cx="64" cy="64" r="58" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3" />
        <circle cx="64" cy="64" r="55" fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.2" />
        {/* Face */}
        <circle cx="64" cy="62" r="24" fill="#e2e8f0" />
        <circle cx="56" cy="59" r="3" fill="#1e293b" />
        <circle cx="72" cy="59" r="3" fill="#1e293b" />
        <path d="M58 68 Q64 72 70 68" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* OG banner at bottom */}
        <path d="M30 88 L40 84 L88 84 L98 88 L88 92 L40 92 Z" fill="url(#og-gold)" />
        <text x="64" y="90" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b" fontFamily="monospace">O G</text>
        {/* Star above */}
        <path d="M64 26 L67 34 L76 34 L69 39 L71 48 L64 43 L57 48 L59 39 L52 34 L61 34 Z" fill="#fbbf24" />
      </svg>
    ),
  },
  {
    id: 'review-master',
    name: 'Review Master',
    category: 'Community Badge',
    rarity: 'epic',
    unlock_type: 'reviews',
    unlock_threshold: 25,
    description: 'Pen and star badge — 25 reviews written',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="rm-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#rm-bg)" stroke="#a855f7" strokeWidth="2" />
        {/* Face */}
        <circle cx="64" cy="68" r="24" fill="#e2e8f0" />
        <circle cx="56" cy="65" r="3" fill="#1e293b" />
        <circle cx="72" cy="65" r="3" fill="#1e293b" />
        <path d="M58 74 Q64 78 70 74" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Quill pen */}
        <path d="M90 20 L100 10 L104 14 L94 24 Z" fill="#a855f7" />
        <line x1="90" y1="20" x2="76" y2="34" stroke="#a855f7" strokeWidth="2" />
        <path d="M74 36 L76 34 L78 36 L76 42 Z" fill="#64748b" />
        {/* 5 stars */}
        <g transform="translate(24, 96)">
          <path d="M8 0 L10 6 L16 6 L11 10 L13 16 L8 12 L3 16 L5 10 L0 6 L6 6 Z" fill="#fbbf24" transform="scale(0.6)" />
          <path d="M24 0 L26 6 L32 6 L27 10 L29 16 L24 12 L19 16 L21 10 L16 6 L22 6 Z" fill="#fbbf24" transform="scale(0.6)" />
          <path d="M40 0 L42 6 L48 6 L43 10 L45 16 L40 12 L35 16 L37 10 L32 6 L38 6 Z" fill="#fbbf24" transform="scale(0.6)" />
          <path d="M56 0 L58 6 L64 6 L59 10 L61 16 L56 12 L51 16 L53 10 L48 6 L54 6 Z" fill="#fbbf24" transform="scale(0.6)" />
          <path d="M72 0 L74 6 L80 6 L75 10 L77 16 L72 12 L67 16 L69 10 L64 6 L70 6 Z" fill="#fbbf24" transform="scale(0.6)" />
        </g>
      </svg>
    ),
  },
  {
    id: 'referral-champion',
    name: 'Referral Champ',
    category: 'Community Badge',
    rarity: 'rare',
    unlock_type: 'quest',
    unlock_threshold: 1,
    description: 'Megaphone badge — referred 5+ friends',
    svg: (
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="rc-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0c1018" />
          </radialGradient>
        </defs>
        <circle cx="64" cy="64" r="62" fill="url(#rc-bg)" stroke="#a3e635" strokeWidth="2" />
        {/* Face */}
        <circle cx="64" cy="68" r="24" fill="#e2e8f0" />
        <circle cx="56" cy="65" r="3" fill="#1e293b" />
        <circle cx="72" cy="65" r="3" fill="#1e293b" />
        <path d="M56 76 Q64 82 72 76" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Megaphone */}
        <path d="M86 42 L106 30 L106 54 L86 46 Z" fill="#a3e635" />
        <rect x="78" y="40" width="10" height="10" rx="2" fill="#65a30d" />
        {/* Sound waves */}
        <path d="M108 36 Q114 42 108 48" stroke="#a3e635" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M112 32 Q120 42 112 52" stroke="#a3e635" strokeWidth="1.5" fill="none" opacity="0.3" />
        {/* People silhouettes */}
        <circle cx="22" cy="92" r="6" fill="#64748b" opacity="0.5" />
        <circle cx="36" cy="96" r="5" fill="#64748b" opacity="0.4" />
        <circle cx="48" cy="100" r="4" fill="#64748b" opacity="0.3" />
      </svg>
    ),
  },
];

/* ================================================================
   CATEGORY COLORS (for the filter tabs)
   ================================================================ */
const CATEGORY_COLORS = {
  'Brand Accessories': '#38bdf8',
  'Seasonal': '#f97316',
  'Achievement Background': '#a855f7',
  'Pouch Character': '#a3e635',
  'Community Badge': '#fbbf24',
};

const RARITY_COLORS = {
  common: '#94a3b8',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
};

/* ================================================================
   GALLERY COMPONENT
   ================================================================ */
export default function AvatarGallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const categories = ['All', ...new Set(AVATARS.map((a) => a.category))];
  const filtered = selectedCategory === 'All' ? AVATARS : AVATARS.filter((a) => a.category === selectedCategory);

  return (
    <div style={{ background: '#0c1018', color: '#f1f5f9', minHeight: '100vh', padding: '32px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Avatar Parts — Batch 2</h1>
        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>25 new pouch-themed avatars across 5 categories. Click any avatar to see details.</p>

        {/* Stats bar */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          {Object.entries(RARITY_COLORS).map(([rarity, color]) => {
            const count = AVATARS.filter((a) => a.rarity === rarity).length;
            return (
              <div key={rarity} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                <span style={{ color, textTransform: 'capitalize' }}>{rarity}</span>
                <span style={{ color: '#64748b' }}>({count})</span>
              </div>
            );
          })}
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: `1px solid ${selectedCategory === cat ? (CATEGORY_COLORS[cat] || '#a3e635') : '#334155'}`,
                background: selectedCategory === cat ? `${CATEGORY_COLORS[cat] || '#a3e635'}15` : 'transparent',
                color: selectedCategory === cat ? (CATEGORY_COLORS[cat] || '#a3e635') : '#94a3b8',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                transition: 'all 0.15s',
              }}
            >
              {cat} {cat !== 'All' && `(${AVATARS.filter((a) => a.category === cat).length})`}
            </button>
          ))}
        </div>

        {/* Avatar grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          {filtered.map((avatar) => (
            <div
              key={avatar.id}
              onClick={() => setSelectedAvatar(selectedAvatar?.id === avatar.id ? null : avatar)}
              style={{
                background: '#161d2b',
                borderRadius: 12,
                padding: 12,
                cursor: 'pointer',
                border: `2px solid ${selectedAvatar?.id === avatar.id ? RARITY_COLORS[avatar.rarity] : '#1e293b'}`,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ width: '100%', aspectRatio: '1', marginBottom: 8 }}>
                {avatar.svg}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{avatar.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: RARITY_COLORS[avatar.rarity],
                  }}
                />
                <span style={{ fontSize: 11, color: RARITY_COLORS[avatar.rarity], textTransform: 'capitalize' }}>
                  {avatar.rarity}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected avatar detail panel */}
        {selectedAvatar && (
          <div
            style={{
              marginTop: 32,
              background: '#161d2b',
              borderRadius: 16,
              padding: 24,
              display: 'flex',
              gap: 24,
              border: `2px solid ${RARITY_COLORS[selectedAvatar.rarity]}40`,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ width: 128, height: 128, flexShrink: 0 }}>{selectedAvatar.svg}</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{selectedAvatar.name}</h2>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    background: `${RARITY_COLORS[selectedAvatar.rarity]}20`,
                    color: RARITY_COLORS[selectedAvatar.rarity],
                    textTransform: 'uppercase',
                  }}
                >
                  {selectedAvatar.rarity}
                </span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: 11,
                    background: `${CATEGORY_COLORS[selectedAvatar.category] || '#a3e635'}20`,
                    color: CATEGORY_COLORS[selectedAvatar.category] || '#a3e635',
                  }}
                >
                  {selectedAvatar.category}
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 12 }}>{selectedAvatar.description}</p>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                <strong style={{ color: '#94a3b8' }}>Unlock:</strong>{' '}
                {selectedAvatar.unlock_type === 'free'
                  ? 'Available to everyone'
                  : selectedAvatar.unlock_type === 'quest'
                    ? 'Complete a special quest'
                    : selectedAvatar.unlock_type === 'points'
                      ? `Earn ${selectedAvatar.unlock_threshold.toLocaleString()} SnusPoints`
                      : selectedAvatar.unlock_type === 'orders'
                        ? `Place ${selectedAvatar.unlock_threshold} orders`
                        : selectedAvatar.unlock_type === 'reviews'
                          ? `Write ${selectedAvatar.unlock_threshold} reviews`
                          : `Reach level ${selectedAvatar.unlock_threshold}`}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                <strong style={{ color: '#94a3b8' }}>DB ID:</strong> {selectedAvatar.id}
              </div>
            </div>
          </div>
        )}

        {/* Implementation notes */}
        <div style={{ marginTop: 48, padding: 24, background: '#161d2b', borderRadius: 12, border: '1px solid #1e293b' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Implementation Notes</h3>
          <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
            <p style={{ marginBottom: 8 }}>
              <strong style={{ color: '#f1f5f9' }}>Storage:</strong> Export each SVG as a standalone file, upload to Supabase Storage (avatars bucket), then insert rows into the <code style={{ background: '#0c1018', padding: '1px 4px', borderRadius: 4 }}>avatars</code> table with the public URL as <code style={{ background: '#0c1018', padding: '1px 4px', borderRadius: 4 }}>image_url</code>.
            </p>
            <p style={{ marginBottom: 8 }}>
              <strong style={{ color: '#f1f5f9' }}>Rarity distribution:</strong> 5 common (free/low-points), 7 rare (points/quest), 7 epic (orders/level/quest), 6 legendary (high-points/level/quest). This adds variety to each tier.
            </p>
            <p style={{ marginBottom: 8 }}>
              <strong style={{ color: '#f1f5f9' }}>Seasonal avatars:</strong> Halloween (October), Winter Cozy (December), Party Pouch (January), Spring Bloom (March-May), Summer Chill (June-August), Autumn Harvest (September-November). Can be made available/hidden via quest <code style={{ background: '#0c1018', padding: '1px 4px', borderRadius: 4 }}>active</code> flag.
            </p>
            <p>
              <strong style={{ color: '#f1f5f9' }}>Sort order:</strong> Assign sort_order values starting at 100 (after existing avatars) in increments of 10 to allow future insertions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
