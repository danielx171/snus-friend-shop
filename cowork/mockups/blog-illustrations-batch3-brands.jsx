import React from 'react';

/**
 * Blog Illustration Components — Brand Article Showcases
 * Design system: #0c1018 → #161d2b gradients, #1e293b cards, #a3e635 accent
 * Each 800×400 viewBox for brand article headers
 */

// Illustration 1: Nordic Spirit Complete Guide
export const NordicSpiritBrandShowcase = () => (
  <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    <defs>
      <linearGradient id="ns-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0c1018" />
        <stop offset="100%" stopColor="#161d2b" />
      </linearGradient>
      <linearGradient id="ns-accent-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E8F4FD" />
        <stop offset="100%" stopColor="#0066CC" />
      </linearGradient>
      <filter id="ns-glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width="800" height="400" fill="url(#ns-bg-grad)" />

    {/* Title */}
    <text x="400" y="70" fontSize="48" fontWeight="700" fill="#0066CC" textAnchor="middle" fontFamily="system-ui">
      NORDIC SPIRIT
    </text>
    <text x="400" y="105" fontSize="16" fill="#94a3b8" textAnchor="middle" fontFamily="system-ui" letterSpacing="1">
      BY JTI • UK #1
    </text>

    {/* Union Jack Icon */}
    <g transform="translate(320, 60)">
      <rect width="20" height="16" fill="#0066CC" stroke="#f1f5f9" strokeWidth="1" />
      <line x1="0" y1="0" x2="20" y2="16" stroke="#F1F5F9" strokeWidth="1" />
      <line x1="20" y1="0" x2="0" y2="16" stroke="#F1F5F9" strokeWidth="1" />
    </g>

    {/* Can 1: Bergamot Wildberry (Purple) */}
    <g transform="translate(160, 150)">
      <rect x="0" y="0" width="60" height="120" rx="4" fill="#9333ea" stroke="#334155" strokeWidth="1.5" />
      <rect x="2" y="2" width="56" height="20" rx="2" fill="#a855f7" />
      <circle cx="30" cy="35" r="18" fill="#c084fc" opacity="0.6" />
      <text x="30" y="90" fontSize="10" fill="#f1f5f9" textAnchor="middle" fontWeight="600">BERGAMOT</text>
      <text x="30" y="105" fontSize="9" fill="#94a3b8" textAnchor="middle">WILDBERRY</text>
    </g>

    {/* Can 2: Spearmint (Green) */}
    <g transform="translate(370, 150)">
      <rect x="0" y="0" width="60" height="120" rx="4" fill="#10b981" stroke="#334155" strokeWidth="1.5" />
      <rect x="2" y="2" width="56" height="20" rx="2" fill="#34d399" />
      <circle cx="30" cy="35" r="18" fill="#6ee7b7" opacity="0.6" />
      <text x="30" y="90" fontSize="10" fill="#f1f5f9" textAnchor="middle" fontWeight="600">SPEARMINT</text>
      <text x="30" y="105" fontSize="9" fill="#94a3b8" textAnchor="middle">Fresh Green</text>
    </g>

    {/* Can 3: Frosty Mint (Icy Blue) */}
    <g transform="translate(580, 150)">
      <rect x="0" y="0" width="60" height="120" rx="4" fill="#0ea5e9" stroke="#334155" strokeWidth="1.5" />
      <rect x="2" y="2" width="56" height="20" rx="2" fill="#38bdf8" />
      <circle cx="30" cy="35" r="18" fill="#7dd3fc" opacity="0.6" />
      <text x="30" y="90" fontSize="10" fill="#f1f5f9" textAnchor="middle" fontWeight="600">FROSTY</text>
      <text x="30" y="105" fontSize="9" fill="#94a3b8" textAnchor="middle">MINT</text>
    </g>

    {/* "12 FLAVOURS" Badge */}
    <g transform="translate(680, 80)">
      <circle cx="0" cy="0" r="30" fill="#a3e635" stroke="#84cc16" strokeWidth="2" />
      <text x="0" y="-8" fontSize="12" fill="#0c1018" textAnchor="middle" fontWeight="700" fontFamily="system-ui">12</text>
      <text x="0" y="8" fontSize="9" fill="#0c1018" textAnchor="middle" fontWeight="600" fontFamily="system-ui">FLAVOURS</text>
    </g>
  </svg>
);

// Illustration 2: ON! Complete Guide
export const ONBrandShowcase = () => (
  <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    <defs>
      <linearGradient id="on-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0c1018" />
        <stop offset="100%" stopColor="#161d2b" />
      </linearGradient>
      <filter id="on-glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width="800" height="400" fill="url(#on-bg-grad)" />

    {/* Title */}
    <text x="400" y="70" fontSize="56" fontWeight="700" fill="#FF4500" textAnchor="middle" fontFamily="system-ui">
      ON!
    </text>
    <text x="400" y="105" fontSize="14" fill="#94a3b8" textAnchor="middle" fontFamily="system-ui" letterSpacing="1">
      NICOSILK TECHNOLOGY
    </text>

    {/* BY ALTRIA text */}
    <text x="120" y="95" fontSize="11" fill="#64748b" fontFamily="system-ui">BY ALTRIA</text>

    {/* LEFT SIDE: CLASSIC */}
    <text x="200" y="130" fontSize="13" fill="#a3e635" textAnchor="middle" fontWeight="600" fontFamily="system-ui">CLASSIC</text>

    {/* Can 1: Classic Mint */}
    <g transform="translate(130, 160)">
      <rect x="0" y="0" width="50" height="100" rx="3" fill="#2dd4bf" stroke="#334155" strokeWidth="1.5" />
      <rect x="2" y="2" width="46" height="16" rx="2" fill="#67e8f9" />
      <text x="25" y="65" fontSize="8" fill="#0c1018" textAnchor="middle" fontWeight="700">CLASSIC</text>
      <text x="25" y="78" fontSize="8" fill="#0c1018" textAnchor="middle">MINT</text>
      <text x="25" y="90" fontSize="8" fill="#0c1018" textAnchor="middle" fontWeight="600">3MG</text>
    </g>

    {/* Can 2: Classic Coffee */}
    <g transform="translate(220, 160)">
      <rect x="0" y="0" width="50" height="100" rx="3" fill="#78350f" stroke="#334155" strokeWidth="1.5" />
      <rect x="2" y="2" width="46" height="16" rx="2" fill="#a16207" />
      <text x="25" y="65" fontSize="8" fill="#fef3c7" textAnchor="middle" fontWeight="700">CLASSIC</text>
      <text x="25" y="78" fontSize="8" fill="#fef3c7" textAnchor="middle">COFFEE</text>
      <text x="25" y="90" fontSize="8" fill="#fef3c7" textAnchor="middle" fontWeight="600">3MG</text>
    </g>

    {/* RIGHT SIDE: PLUS (with lightning bolt) */}
    <g transform="translate(530, 120)">
      <text x="0" y="0" fontSize="13" fill="#a3e635" textAnchor="middle" fontWeight="600" fontFamily="system-ui">PLUS</text>
      {/* Lightning bolt */}
      <polygon points="15,0 20,-8 10,-8 15,5 5,5 15,15" fill="#a3e635" />
    </g>

    {/* Can 3: PLUS Mint */}
    <g transform="translate(480, 160)">
      <rect x="0" y="0" width="50" height="100" rx="3" fill="#06b6d4" stroke="#334155" strokeWidth="1.5" />
      <rect x="2" y="2" width="46" height="16" rx="2" fill="#22d3ee" />
      <rect x="0" y="0" width="50" height="100" rx="3" fill="none" stroke="#a3e635" strokeWidth="2" opacity="0.5" />
      <text x="25" y="65" fontSize="8" fill="#0c1018" textAnchor="middle" fontWeight="700">PLUS</text>
      <text x="25" y="78" fontSize="8" fill="#0c1018" textAnchor="middle">MINT</text>
      <text x="25" y="90" fontSize="8" fill="#0c1018" textAnchor="middle" fontWeight="600">6MG</text>
    </g>

    {/* Can 4: PLUS Berry */}
    <g transform="translate(570, 160)">
      <rect x="0" y="0" width="50" height="100" rx="3" fill="#d946ef" stroke="#334155" strokeWidth="1.5" />
      <rect x="2" y="2" width="46" height="16" rx="2" fill="#f472b6" />
      <rect x="0" y="0" width="50" height="100" rx="3" fill="none" stroke="#a3e635" strokeWidth="2" opacity="0.5" />
      <text x="25" y="65" fontSize="8" fill="#f1f5f9" textAnchor="middle" fontWeight="700">PLUS</text>
      <text x="25" y="78" fontSize="8" fill="#f1f5f9" textAnchor="middle">BERRY</text>
      <text x="25" y="90" fontSize="8" fill="#f1f5f9" textAnchor="middle" fontWeight="600">6MG</text>
    </g>

    {/* BEST VALUE Badge */}
    <g transform="translate(680, 85)">
      <rect x="-35" y="-18" width="70" height="36" rx="6" fill="#FF4500" stroke="#ff6b35" strokeWidth="1.5" />
      <text x="0" y="-5" fontSize="11" fill="#f1f5f9" textAnchor="middle" fontWeight="700" fontFamily="system-ui">BEST VALUE</text>
      <text x="0" y="10" fontSize="8" fill="#fecaca" textAnchor="middle" fontFamily="system-ui">Great Taste</text>
    </g>
  </svg>
);

// Illustration 3: Pablo Complete Guide
export const PabloBrandShowcase = () => (
  <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    <defs>
      <linearGradient id="pablo-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0c1018" />
        <stop offset="100%" stopColor="#1a0a0a" />
      </linearGradient>
      <radialGradient id="pablo-extreme-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFD700" opacity="0.4" />
        <stop offset="100%" stopColor="#FF4500" opacity="0" />
      </radialGradient>
      <filter id="pablo-fire">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width="800" height="400" fill="url(#pablo-bg-grad)" />

    {/* Extreme glow effect around right can */}
    <ellipse cx="570" cy="220" rx="100" ry="120" fill="url(#pablo-extreme-glow)" />

    {/* Title */}
    <text x="400" y="70" fontSize="52" fontWeight="700" fill="#FFD700" textAnchor="middle" fontFamily="system-ui">
      PABLO
    </text>
    <text x="400" y="105" fontSize="14" fill="#94a3b8" textAnchor="middle" fontFamily="system-ui" letterSpacing="1">
      10–50MG • EXTREME STRENGTH
    </text>

    {/* Warning Triangle Icon */}
    <g transform="translate(680, 55)">
      <polygon points="0,-18 16,10 -16,10" fill="none" stroke="#FFD700" strokeWidth="2" />
      <text x="0" y="3" fontSize="16" fill="#FFD700" textAnchor="middle" fontWeight="700">!</text>
    </g>

    {/* Can 1: Silver 10mg (Small) */}
    <g transform="translate(150, 200)">
      <rect x="0" y="0" width="40" height="80" rx="3" fill="#c0c0c0" stroke="#334155" strokeWidth="1" />
      <rect x="2" y="2" width="36" height="12" rx="1" fill="#e8e8e8" />
      <text x="20" y="50" fontSize="7" fill="#1a1a1a" textAnchor="middle" fontWeight="700">SILVER</text>
      <text x="20" y="62" fontSize="8" fill="#1a1a1a" textAnchor="middle" fontWeight="600">10MG</text>
    </g>

    {/* Can 2: Standard 25mg (Medium) */}
    <g transform="translate(310, 170)">
      <rect x="0" y="0" width="55" height="100" rx="3" fill="#FFD700" stroke="#334155" strokeWidth="1.5" />
      <rect x="2" y="2" width="51" height="16" rx="2" fill="#FFED4E" />
      <circle cx="27.5" cy="35" r="12" fill="#FFC700" opacity="0.7" />
      <text x="27.5" y="65" fontSize="8" fill="#1a1a1a" textAnchor="middle" fontWeight="700">STANDARD</text>
      <text x="27.5" y="77" fontSize="9" fill="#1a1a1a" textAnchor="middle" fontWeight="600">25MG</text>
    </g>

    {/* Can 3: Extreme 50mg (Large with glow) */}
    <g transform="translate(450, 130)" filter="url(#pablo-fire)">
      <rect x="0" y="0" width="75" height="130" rx="4" fill="#DC2626" stroke="#334155" strokeWidth="2" />
      <rect x="3" y="3" width="69" height="22" rx="2" fill="#EF4444" />
      <circle cx="37.5" cy="50" r="16" fill="#FF6B35" opacity="0.8" />
      <polygon points="37.5,45 40,35 35,45 42,48 32,48" fill="#FFA500" opacity="0.9" />
      <text x="37.5" y="85" fontSize="9" fill="#f1f5f9" textAnchor="middle" fontWeight="700">EXTREME</text>
      <text x="37.5" y="100" fontSize="10" fill="#fecaca" textAnchor="middle" fontWeight="700">50MG</text>
    </g>

    {/* Fire effect lines */}
    <g stroke="#FF6B35" strokeWidth="2" opacity="0.6" filter="url(#pablo-fire)">
      <path d="M 520 200 Q 530 170 540 150" fill="none" />
      <path d="M 550 210 Q 560 180 570 160" fill="none" />
      <path d="M 580 200 Q 585 170 590 150" fill="none" />
    </g>
  </svg>
);

// Illustration 4: Siberia Complete Guide
export const SiberiaBrandShowcase = () => (
  <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    <defs>
      <linearGradient id="siberia-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0c1018" />
        <stop offset="100%" stopColor="#161d2b" />
      </linearGradient>
      <linearGradient id="siberia-frost-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#00BFFF" />
        <stop offset="100%" stopColor="#0088CC" />
      </linearGradient>
      <filter id="siberia-frost">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width="800" height="400" fill="url(#siberia-bg-grad)" />

    {/* Snowflake decorations */}
    <g stroke="#00BFFF" strokeWidth="1.5" opacity="0.4" filter="url(#siberia-frost)">
      {/* Top left snowflake */}
      <g transform="translate(120, 80)">
        <line x1="0" y1="-12" x2="0" y2="12" />
        <line x1="-12" y1="0" x2="12" y2="0" />
        <line x1="-8" y1="-8" x2="8" y2="8" />
        <line x1="-8" y1="8" x2="8" y2="-8" />
      </g>
      {/* Top right snowflake */}
      <g transform="translate(680, 90)">
        <line x1="0" y1="-12" x2="0" y2="12" />
        <line x1="-12" y1="0" x2="12" y2="0" />
        <line x1="-8" y1="-8" x2="8" y2="8" />
        <line x1="-8" y1="8" x2="8" y2="-8" />
      </g>
    </g>

    {/* Title and Subtitle */}
    <text x="400" y="70" fontSize="56" fontWeight="700" fill="#00BFFF" textAnchor="middle" fontFamily="system-ui">
      SIBERIA
    </text>
    <text x="400" y="115" fontSize="32" fontWeight="600" fill="#a3e635" textAnchor="middle" fontFamily="system-ui" letterSpacing="2">
      -80°C
    </text>
    <text x="400" y="145" fontSize="12" fill="#94a3b8" textAnchor="middle" fontFamily="system-ui">LEGENDARY EXTREME • CULT CLASSIC</text>

    {/* Can 1: Ultra Slim 16.5mg */}
    <g transform="translate(120, 210)">
      <rect x="0" y="0" width="35" height="70" rx="2" fill="#00BFFF" stroke="#ffffff" strokeWidth="1" />
      <rect x="2" y="2" width="31" height="10" rx="1" fill="#7dd3fc" />
      <text x="17.5" y="45" fontSize="7" fill="#0c1018" textAnchor="middle" fontWeight="600">ULTRA</text>
      <text x="17.5" y="55" fontSize="7" fill="#0c1018" textAnchor="middle" fontWeight="600">SLIM</text>
      <text x="17.5" y="64" fontSize="6" fill="#0c1018" textAnchor="middle">16.5mg</text>
    </g>

    {/* Can 2: Slim 25mg */}
    <g transform="translate(240, 180)">
      <rect x="0" y="0" width="45" height="90" rx="2" fill="#0099CC" stroke="#ffffff" strokeWidth="1" />
      <rect x="2" y="2" width="41" height="13" rx="1" fill="#38bdf8" />
      <text x="22.5" y="50" fontSize="8" fill="#ffffff" textAnchor="middle" fontWeight="600">SLIM</text>
      <text x="22.5" y="62" fontSize="8" fill="#ffffff" textAnchor="middle" fontWeight="600">25MG</text>
    </g>

    {/* Can 3: Portion 33mg */}
    <g transform="translate(370, 150)">
      <rect x="0" y="0" width="55" height="110" rx="3" fill="#0066FF" stroke="#ffffff" strokeWidth="1.5" />
      <rect x="2" y="2" width="51" height="16" rx="2" fill="#0ea5e9" />
      <text x="27.5" y="65" fontSize="9" fill="#ffffff" textAnchor="middle" fontWeight="700">PORTION</text>
      <text x="27.5" y="80" fontSize="9" fill="#ffffff" textAnchor="middle" fontWeight="600">33MG</text>
    </g>

    {/* Can 4: Maxi 49.5mg (Largest, most extreme) */}
    <g transform="translate(500, 110)">
      <rect x="0" y="0" width="70" height="140" rx="3" fill="#0044BB" stroke="#ffffff" strokeWidth="2" />
      <rect x="2" y="2" width="66" height="20" rx="2" fill="#0ea5e9" />
      <rect x="0" y="0" width="70" height="140" rx="3" fill="none" stroke="#00BFFF" strokeWidth="1.5" opacity="0.6" filter="url(#siberia-frost)" />
      <text x="35" y="75" fontSize="10" fill="#ffffff" textAnchor="middle" fontWeight="700">MAXI</text>
      <text x="35" y="92" fontSize="10" fill="#ffffff" textAnchor="middle" fontWeight="700">49.5MG</text>
      <text x="35" y="105" fontSize="7" fill="#a3e635" textAnchor="middle" fontWeight="600">EXTREME</text>
    </g>

    {/* Temperature Gauge */}
    <g transform="translate(670, 200)">
      <rect x="-15" y="-50" width="30" height="100" rx="4" fill="none" stroke="#00BFFF" strokeWidth="1.5" />
      <rect x="-13" y="-20" width="26" height="48" fill="#00BFFF" opacity="0.4" />
      <circle cx="0" cy="-18" r="4" fill="#a3e635" />
    </g>
  </svg>
);

// Illustration 5: KLAR Complete Guide
export const KLARBrandShowcase = () => (
  <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    <defs>
      <linearGradient id="klar-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0c1018" />
        <stop offset="100%" stopColor="#161d2b" />
      </linearGradient>
      <linearGradient id="klar-purple-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#9F7AEA" />
        <stop offset="100%" stopColor="#6B4EE6" />
      </linearGradient>
      <filter id="klar-speed">
        <feGaussianBlur stdDeviation="1" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width="800" height="400" fill="url(#klar-bg-grad)" />

    {/* Bioceramic molecular hexagon pattern (background, subtle) */}
    <g stroke="#334155" strokeWidth="0.5" opacity="0.2">
      <polygon points="200,100 220,90 240,100 240,120 220,130 200,120" />
      <polygon points="280,150 300,140 320,150 320,170 300,180 280,170" />
      <polygon points="500,120 520,110 540,120 540,140 520,150 500,140" />
      <polygon points="600,200 620,190 640,200 640,220 620,230 600,220" />
      <polygon points="350,280 370,270 390,280 390,300 370,310 350,300" />
    </g>

    {/* Title */}
    <text x="400" y="70" fontSize="56" fontWeight="700" fill="#6B4EE6" textAnchor="middle" fontFamily="system-ui">
      KLAR
    </text>
    <text x="400" y="105" fontSize="14" fill="#94a3b8" textAnchor="middle" fontFamily="system-ui" letterSpacing="1">
      SERATEK BIOCERAMIC
    </text>

    {/* Beaker/Flask Icon */}
    <g transform="translate(680, 55)" fill="none" stroke="#6B4EE6" strokeWidth="1.5">
      <rect x="-8" y="-8" width="12" height="18" rx="1" />
      <line x1="-8" y1="5" x2="4" y2="5" />
      <line x1="0" y1="10" x2="4" y2="3" />
    </g>

    {/* Can 1: Mint (Green tint) */}
    <g transform="translate(220, 180)">
      <rect x="0" y="0" width="60" height="110" rx="3" fill="#10b981" stroke="#334155" strokeWidth="1.5" />
      <rect x="2" y="2" width="56" height="16" rx="2" fill="#34d399" />
      <circle cx="30" cy="40" r="14" fill="#6ee7b7" opacity="0.5" />
      <text x="30" y="70" fontSize="9" fill="#f1f5f9" textAnchor="middle" fontWeight="700">KLAR</text>
      <text x="30" y="83" fontSize="8" fill="#f1f5f9" textAnchor="middle">MINT</text>
      <text x="30" y="95" fontSize="7" fill="#d1d5db" textAnchor="middle" fontWeight="600">SERATEK</text>
    </g>

    {/* Can 2: Blank (Neutral/Gray) */}
    <g transform="translate(400, 180)">
      <rect x="0" y="0" width="60" height="110" rx="3" fill="#e0e0e0" stroke="#334155" strokeWidth="1.5" />
      <rect x="2" y="2" width="56" height="16" rx="2" fill="#f0f0f0" />
      <circle cx="30" cy="40" r="14" fill="#ffffff" opacity="0.5" />
      <text x="30" y="70" fontSize="9" fill="#0c1018" textAnchor="middle" fontWeight="700">KLAR</text>
      <text x="30" y="83" fontSize="8" fill="#0c1018" textAnchor="middle">BLANK</text>
      <text x="30" y="95" fontSize="7" fill="#404040" textAnchor="middle" fontWeight="600">SERATEK</text>
    </g>

    {/* "80% FASTER" Badge with speed lines */}
    <g transform="translate(120, 80)">
      <rect x="-38" y="-18" width="76" height="36" rx="6" fill="#6B4EE6" stroke="#9F7AEA" strokeWidth="1.5" />
      <text x="0" y="-3" fontSize="13" fill="#f1f5f9" textAnchor="middle" fontWeight="700" fontFamily="system-ui">80% FASTER</text>
      {/* Speed lines */}
      <line x1="-45" y1="-5" x2="-55" y2="-5" stroke="#a3e635" strokeWidth="1.5" filter="url(#klar-speed)" />
      <line x1="-48" y1="8" x2="-60" y2="8" stroke="#a3e635" strokeWidth="1.5" filter="url(#klar-speed)" opacity="0.6" />
    </g>

    {/* Innovation highlight */}
    <text x="400" y="330" fontSize="12" fill="#6B4EE6" textAnchor="middle" fontWeight="600" fontFamily="system-ui">
      SERATEK BIOCERAMIC — NEXT GENERATION
    </text>
  </svg>
);

/**
 * Metadata for blog integrations
 * Dimensions: 800×400 (all illustrations)
 */
export const illustrationMetadata = [
  {
    id: 'nordic-spirit-brand',
    articleSlug: 'nordic-spirit-complete-guide',
    title: 'Nordic Spirit Complete Guide',
    componentName: 'NordicSpiritBrandShowcase',
    dimensions: '800×400',
    brandColor: '#0066CC',
    flavorCount: 12,
  },
  {
    id: 'on-brand',
    articleSlug: 'on-complete-guide',
    title: 'ON! Complete Guide',
    componentName: 'ONBrandShowcase',
    dimensions: '800×400',
    brandColor: '#FF4500',
    flavorCount: 4,
  },
  {
    id: 'pablo-brand',
    articleSlug: 'pablo-complete-guide',
    title: 'Pablo Complete Guide',
    componentName: 'PabloBrandShowcase',
    dimensions: '800×400',
    brandColor: '#FFD700',
    strengthRange: '10-50mg',
  },
  {
    id: 'siberia-brand',
    articleSlug: 'siberia-complete-guide',
    title: 'Siberia Complete Guide',
    componentName: 'SiberiaBrandShowcase',
    dimensions: '800×400',
    brandColor: '#00BFFF',
    tagline: 'Legendary Extreme',
  },
  {
    id: 'klar-brand',
    articleSlug: 'klar-complete-guide',
    title: 'KLAR Complete Guide',
    componentName: 'KLARBrandShowcase',
    dimensions: '800×400',
    brandColor: '#6B4EE6',
    technology: 'SERATEK Bioceramic',
  },
];
