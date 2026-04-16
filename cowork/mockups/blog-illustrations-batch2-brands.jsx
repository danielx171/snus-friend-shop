import React from 'react';

/**
 * Brand showcase illustrations for snusfriends.com article pages
 * 5 SVG components at 800×400 viewBox, matching design system
 * Design system: #0c1018→#161d2b gradient, #1e293b cards, #a3e635 accent
 */

// 1. ZYN Complete Guide
export const ZynBrandIllustration = () => (
  <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    <defs>
      <linearGradient id="zynBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0c1018" />
        <stop offset="100%" stopColor="#161d2b" />
      </linearGradient>
      <linearGradient id="zynCanMint" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00D4FF" />
        <stop offset="100%" stopColor="#0098CC" />
      </linearGradient>
      <linearGradient id="zynCanCitrus" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFB84D" />
        <stop offset="100%" stopColor="#FF9500" />
      </linearGradient>
      <linearGradient id="zynCanCoffee" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B4513" />
        <stop offset="100%" stopColor="#5C2E0A" />
      </linearGradient>
    </defs>

    {/* Background */}
    <rect width="800" height="400" fill="url(#zynBg)" />

    {/* Title Section */}
    <text
      x="400"
      y="50"
      fontSize="72"
      fontWeight="900"
      textAnchor="middle"
      fill="#00A3E0"
      fontFamily="system-ui"
    >
      ZYN
    </text>
    <text
      x="400"
      y="90"
      fontSize="20"
      textAnchor="middle"
      fill="#94a3b8"
      fontFamily="system-ui"
    >
      52 PRODUCTS
    </text>

    {/* Swedish flag mini-icon */}
    <g transform="translate(350, 65)">
      <rect width="20" height="14" fill="#006AA7" rx="2" />
      <rect width="6" height="14" x="8" fill="#FFCD00" />
      <rect width="20" height="6" y="5" fill="#FFCD00" />
    </g>

    {/* #1 WORLDWIDE badge */}
    <circle cx="450" cy="70" r="20" fill="#a3e635" />
    <text
      x="450"
      y="75"
      fontSize="12"
      fontWeight="bold"
      textAnchor="middle"
      fill="#0c1018"
      fontFamily="system-ui"
    >
      #1
    </text>

    {/* Can 1: Cool Mint */}
    <g transform="translate(150, 150)">
      {/* Can body */}
      <ellipse cx="35" cy="10" rx="28" ry="8" fill="url(#zynCanMint)" opacity="0.3" />
      <rect x="7" y="10" width="56" height="80" fill="url(#zynCanMint)" rx="4" />
      <ellipse cx="35" cy="90" rx="28" ry="8" fill="#0098CC" />
      {/* Highlight */}
      <rect x="12" y="15" width="8" height="70" fill="#ffffff" opacity="0.15" rx="2" />
      {/* ZYN branding */}
      <text
        x="35"
        y="50"
        fontSize="20"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui"
      >
        ZYN
      </text>
      {/* Strength badge */}
      <rect x="15" y="70" width="40" height="12" fill="#1e293b" rx="2" stroke="#334155" strokeWidth="1" />
      <text
        x="35"
        y="78"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        fill="#a3e635"
        fontFamily="system-ui"
      >
        3MG
      </text>
    </g>

    {/* Flavor label */}
    <text
      x="185"
      y="250"
      fontSize="14"
      fontWeight="600"
      textAnchor="middle"
      fill="#64748b"
      fontFamily="system-ui"
    >
      Cool Mint
    </text>

    {/* Can 2: Citrus */}
    <g transform="translate(360, 150)">
      <ellipse cx="35" cy="10" rx="28" ry="8" fill="url(#zynCanCitrus)" opacity="0.3" />
      <rect x="7" y="10" width="56" height="80" fill="url(#zynCanCitrus)" rx="4" />
      <ellipse cx="35" cy="90" rx="28" ry="8" fill="#FF9500" />
      <rect x="12" y="15" width="8" height="70" fill="#ffffff" opacity="0.15" rx="2" />
      <text
        x="35"
        y="50"
        fontSize="20"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui"
      >
        ZYN
      </text>
      <rect x="15" y="70" width="40" height="12" fill="#1e293b" rx="2" stroke="#334155" strokeWidth="1" />
      <text
        x="35"
        y="78"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        fill="#a3e635"
        fontFamily="system-ui"
      >
        3MG
      </text>
    </g>

    <text
      x="395"
      y="250"
      fontSize="14"
      fontWeight="600"
      textAnchor="middle"
      fill="#64748b"
      fontFamily="system-ui"
    >
      Citrus
    </text>

    {/* Can 3: Coffee */}
    <g transform="translate(570, 150)">
      <ellipse cx="35" cy="10" rx="28" ry="8" fill="url(#zynCanCoffee)" opacity="0.3" />
      <rect x="7" y="10" width="56" height="80" fill="url(#zynCanCoffee)" rx="4" />
      <ellipse cx="35" cy="90" rx="28" ry="8" fill="#5C2E0A" />
      <rect x="12" y="15" width="8" height="70" fill="#ffffff" opacity="0.15" rx="2" />
      <text
        x="35"
        y="50"
        fontSize="20"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui"
      >
        ZYN
      </text>
      <rect x="15" y="70" width="40" height="12" fill="#1e293b" rx="2" stroke="#334155" strokeWidth="1" />
      <text
        x="35"
        y="78"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        fill="#a3e635"
        fontFamily="system-ui"
      >
        3MG
      </text>
    </g>

    <text
      x="605"
      y="250"
      fontSize="14"
      fontWeight="600"
      textAnchor="middle"
      fill="#64748b"
      fontFamily="system-ui"
    >
      Coffee
    </text>
  </svg>
);

// 2. VELO Complete Guide
export const VeloBrandIllustration = () => (
  <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    <defs>
      <linearGradient id="veloBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0c1018" />
        <stop offset="100%" stopColor="#161d2b" />
      </linearGradient>
      <linearGradient id="veloCanMint" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1DB8A6" />
        <stop offset="100%" stopColor="#0F9A8C" />
      </linearGradient>
      <linearGradient id="veloCanMango" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF8A50" />
        <stop offset="100%" stopColor="#FF6B35" />
      </linearGradient>
      <linearGradient id="veloCanBerry" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E040FB" />
        <stop offset="100%" stopColor="#C41C8C" />
      </linearGradient>
    </defs>

    {/* Background */}
    <rect width="800" height="400" fill="url(#veloBg)" />

    {/* Title Section */}
    <text
      x="400"
      y="50"
      fontSize="72"
      fontWeight="900"
      textAnchor="middle"
      fill="#ffffff"
      fontFamily="system-ui"
    >
      VELO
    </text>
    <text
      x="400"
      y="90"
      fontSize="18"
      textAnchor="middle"
      fill="#94a3b8"
      fontFamily="system-ui"
    >
      BY BAT • 53 PRODUCTS
    </text>

    {/* GLOBAL #2 badge */}
    <circle cx="650" cy="70" r="20" fill="#E040FB" />
    <text
      x="650"
      y="73"
      fontSize="11"
      fontWeight="bold"
      textAnchor="middle"
      fill="#ffffff"
      fontFamily="system-ui"
    >
      #2
    </text>

    {/* Can 1: Mighty Peppermint */}
    <g transform="translate(150, 150)">
      <ellipse cx="35" cy="10" rx="28" ry="8" fill="url(#veloCanMint)" opacity="0.3" />
      <rect x="7" y="10" width="56" height="80" fill="url(#veloCanMint)" rx="4" />
      <ellipse cx="35" cy="90" rx="28" ry="8" fill="#0F9A8C" />
      <rect x="12" y="15" width="8" height="70" fill="#ffffff" opacity="0.15" rx="2" />
      <text
        x="35"
        y="50"
        fontSize="18"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui"
      >
        VELO
      </text>
      <rect x="15" y="70" width="40" height="12" fill="#1e293b" rx="2" stroke="#334155" strokeWidth="1" />
      <text
        x="35"
        y="78"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        fill="#a3e635"
        fontFamily="system-ui"
      >
        13MG
      </text>
    </g>

    <text
      x="185"
      y="250"
      fontSize="14"
      fontWeight="600"
      textAnchor="middle"
      fill="#64748b"
      fontFamily="system-ui"
    >
      Peppermint
    </text>

    {/* Can 2: Tropical Mango */}
    <g transform="translate(360, 150)">
      <ellipse cx="35" cy="10" rx="28" ry="8" fill="url(#veloCanMango)" opacity="0.3" />
      <rect x="7" y="10" width="56" height="80" fill="url(#veloCanMango)" rx="4" />
      <ellipse cx="35" cy="90" rx="28" ry="8" fill="#FF6B35" />
      <rect x="12" y="15" width="8" height="70" fill="#ffffff" opacity="0.15" rx="2" />
      <text
        x="35"
        y="50"
        fontSize="18"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui"
      >
        VELO
      </text>
      <rect x="15" y="70" width="40" height="12" fill="#1e293b" rx="2" stroke="#334155" strokeWidth="1" />
      <text
        x="35"
        y="78"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        fill="#a3e635"
        fontFamily="system-ui"
      >
        13MG
      </text>
    </g>

    <text
      x="395"
      y="250"
      fontSize="14"
      fontWeight="600"
      textAnchor="middle"
      fill="#64748b"
      fontFamily="system-ui"
    >
      Mango
    </text>

    {/* Can 3: Ruby Berry */}
    <g transform="translate(570, 150)">
      <ellipse cx="35" cy="10" rx="28" ry="8" fill="url(#veloCanBerry)" opacity="0.3" />
      <rect x="7" y="10" width="56" height="80" fill="url(#veloCanBerry)" rx="4" />
      <ellipse cx="35" cy="90" rx="28" ry="8" fill="#C41C8C" />
      <rect x="12" y="15" width="8" height="70" fill="#ffffff" opacity="0.15" rx="2" />
      <text
        x="35"
        y="50"
        fontSize="18"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui"
      >
        VELO
      </text>
      <rect x="15" y="70" width="40" height="12" fill="#1e293b" rx="2" stroke="#334155" strokeWidth="1" />
      <text
        x="35"
        y="78"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        fill="#a3e635"
        fontFamily="system-ui"
      >
        13MG
      </text>
    </g>

    <text
      x="605"
      y="250"
      fontSize="14"
      fontWeight="600"
      textAnchor="middle"
      fill="#64748b"
      fontFamily="system-ui"
    >
      Berry
    </text>
  </svg>
);

// 3. LOOP Complete Guide
export const LoopBrandIllustration = () => (
  <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    <defs>
      <linearGradient id="loopBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0c1018" />
        <stop offset="100%" stopColor="#161d2b" />
      </linearGradient>
      <linearGradient id="loopCanLime" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7FED56" />
        <stop offset="100%" stopColor="#5FCC37" />
      </linearGradient>
      <linearGradient id="loopCanMint" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00D4FF" />
        <stop offset="100%" stopColor="#0098CC" />
      </linearGradient>
      <linearGradient id="loopCanPurple" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9D4EDD" />
        <stop offset="100%" stopColor="#5A189A" />
      </linearGradient>
    </defs>

    {/* Background */}
    <rect width="800" height="400" fill="url(#loopBg)" />

    {/* Lightning bolt icon */}
    <g transform="translate(120, 50)">
      <polygon points="15,0 25,20 15,25 20,40 0,15 10,10" fill="#FF6B35" opacity="0.7" />
    </g>

    {/* Title Section */}
    <text
      x="400"
      y="50"
      fontSize="72"
      fontWeight="900"
      textAnchor="middle"
      fill="#FF6B35"
      fontFamily="system-ui"
    >
      LOOP
    </text>
    <text
      x="400"
      y="90"
      fontSize="20"
      textAnchor="middle"
      fill="#94a3b8"
      fontFamily="system-ui"
    >
      INSTANT RUSH
    </text>

    {/* Eco leaf icon */}
    <g transform="translate(680, 55)">
      <ellipse cx="10" cy="10" rx="8" ry="12" fill="#2EC4B6" opacity="0.7" transform="rotate(-30 10 10)" />
      <path d="M 10 0 Q 15 5 15 10" stroke="#2EC4B6" strokeWidth="2" fill="none" opacity="0.7" />
    </g>

    {/* Can 1: Jalapeño Lime */}
    <g transform="translate(150, 150)">
      <ellipse cx="35" cy="10" rx="28" ry="8" fill="url(#loopCanLime)" opacity="0.3" />
      <rect x="7" y="10" width="56" height="80" fill="url(#loopCanLime)" rx="4" />
      <ellipse cx="35" cy="90" rx="28" ry="8" fill="#5FCC37" />
      <rect x="12" y="15" width="8" height="70" fill="#ffffff" opacity="0.15" rx="2" />
      <text
        x="35"
        y="50"
        fontSize="18"
        fontWeight="bold"
        textAnchor="middle"
        fill="#1e293b"
        fontFamily="system-ui"
      >
        LOOP
      </text>
      <rect x="15" y="70" width="40" height="12" fill="#1e293b" rx="2" stroke="#334155" strokeWidth="1" />
      <text
        x="35"
        y="78"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        fill="#FF6B35"
        fontFamily="system-ui"
      >
        16MG
      </text>
    </g>

    <text
      x="185"
      y="250"
      fontSize="14"
      fontWeight="600"
      textAnchor="middle"
      fill="#64748b"
      fontFamily="system-ui"
    >
      Jalapeño Lime
    </text>

    {/* Can 2: Mint Mania */}
    <g transform="translate(360, 150)">
      <ellipse cx="35" cy="10" rx="28" ry="8" fill="url(#loopCanMint)" opacity="0.3" />
      <rect x="7" y="10" width="56" height="80" fill="url(#loopCanMint)" rx="4" />
      <ellipse cx="35" cy="90" rx="28" ry="8" fill="#0098CC" />
      <rect x="12" y="15" width="8" height="70" fill="#ffffff" opacity="0.15" rx="2" />
      <text
        x="35"
        y="50"
        fontSize="18"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui"
      >
        LOOP
      </text>
      <rect x="15" y="70" width="40" height="12" fill="#1e293b" rx="2" stroke="#334155" strokeWidth="1" />
      <text
        x="35"
        y="78"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        fill="#a3e635"
        fontFamily="system-ui"
      >
        16MG
      </text>
    </g>

    <text
      x="395"
      y="250"
      fontSize="14"
      fontWeight="600"
      textAnchor="middle"
      fill="#64748b"
      fontFamily="system-ui"
    >
      Mint Mania
    </text>

    {/* Can 3: Salty Ludicris */}
    <g transform="translate(570, 150)">
      <ellipse cx="35" cy="10" rx="28" ry="8" fill="url(#loopCanPurple)" opacity="0.3" />
      <rect x="7" y="10" width="56" height="80" fill="url(#loopCanPurple)" rx="4" />
      <ellipse cx="35" cy="90" rx="28" ry="8" fill="#5A189A" />
      <rect x="12" y="15" width="8" height="70" fill="#ffffff" opacity="0.15" rx="2" />
      <text
        x="35"
        y="50"
        fontSize="18"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui"
      >
        LOOP
      </text>
      <rect x="15" y="70" width="40" height="12" fill="#1e293b" rx="2" stroke="#334155" strokeWidth="1" />
      <text
        x="35"
        y="78"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        fill="#a3e635"
        fontFamily="system-ui"
      >
        16MG
      </text>
    </g>

    <text
      x="605"
      y="250"
      fontSize="14"
      fontWeight="600"
      textAnchor="middle"
      fill="#64748b"
      fontFamily="system-ui"
    >
      Salty Ludicris
    </text>
  </svg>
);

// 4. Skruf Complete Guide
export const SkrufBrandIllustration = () => (
  <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    <defs>
      <linearGradient id="skrufBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0c1018" />
        <stop offset="100%" stopColor="#161d2b" />
      </linearGradient>
      <linearGradient id="skrufCanMint" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4FBF85" />
        <stop offset="100%" stopColor="#2E8B57" />
      </linearGradient>
      <linearGradient id="skrufCanPurple" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5A8E" />
        <stop offset="100%" stopColor="#5A3A5A" />
      </linearGradient>
      <linearGradient id="skrufCanLicorice" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3D3D3D" />
        <stop offset="100%" stopColor="#1A1A1A" />
      </linearGradient>
    </defs>

    {/* Background */}
    <rect width="800" height="400" fill="url(#skrufBg)" />

    {/* Crown/Shield icon */}
    <g transform="translate(100, 45)">
      <circle cx="15" cy="15" r="12" fill="none" stroke="#C4A35A" strokeWidth="1.5" />
      <polygon points="15,5 19,12 25,12 20,16 22,22 15,18 8,22 10,16 5,12 11,12" fill="#C4A35A" opacity="0.6" />
    </g>

    {/* Title Section */}
    <text
      x="400"
      y="50"
      fontSize="72"
      fontWeight="900"
      textAnchor="middle"
      fill="#4A7C59"
      fontFamily="system-ui"
    >
      SKRUF
    </text>
    <text
      x="400"
      y="90"
      fontSize="18"
      textAnchor="middle"
      fill="#94a3b8"
      fontFamily="system-ui"
    >
      EST. 2002 • SWEDISH CRAFT
    </text>

    {/* Can 1: Fresh Mint */}
    <g transform="translate(150, 150)">
      <ellipse cx="35" cy="10" rx="28" ry="8" fill="url(#skrufCanMint)" opacity="0.3" />
      <rect x="7" y="10" width="56" height="80" fill="url(#skrufCanMint)" rx="4" />
      <ellipse cx="35" cy="90" rx="28" ry="8" fill="#2E8B57" />
      <rect x="12" y="15" width="8" height="70" fill="#ffffff" opacity="0.15" rx="2" />
      <text
        x="35"
        y="50"
        fontSize="16"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui"
      >
        SKRUF
      </text>
      <rect x="18" y="70" width="34" height="12" fill="#1e293b" rx="2" stroke="#334155" strokeWidth="1" />
      <text
        x="35"
        y="78"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        fill="#C4A35A"
        fontFamily="system-ui"
      >
        S2
      </text>
    </g>

    <text
      x="185"
      y="250"
      fontSize="14"
      fontWeight="600"
      textAnchor="middle"
      fill="#64748b"
      fontFamily="system-ui"
    >
      Fresh Mint
    </text>

    {/* Can 2: Purple Cassice */}
    <g transform="translate(360, 150)">
      <ellipse cx="35" cy="10" rx="28" ry="8" fill="url(#skrufCanPurple)" opacity="0.3" />
      <rect x="7" y="10" width="56" height="80" fill="url(#skrufCanPurple)" rx="4" />
      <ellipse cx="35" cy="90" rx="28" ry="8" fill="#5A3A5A" />
      <rect x="12" y="15" width="8" height="70" fill="#ffffff" opacity="0.15" rx="2" />
      <text
        x="35"
        y="50"
        fontSize="16"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui"
      >
        SKRUF
      </text>
      <rect x="18" y="70" width="34" height="12" fill="#1e293b" rx="2" stroke="#334155" strokeWidth="1" />
      <text
        x="35"
        y="78"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        fill="#C4A35A"
        fontFamily="system-ui"
      >
        S3
      </text>
    </g>

    <text
      x="395"
      y="250"
      fontSize="14"
      fontWeight="600"
      textAnchor="middle"
      fill="#64748b"
      fontFamily="system-ui"
    >
      Purple Cassice
    </text>

    {/* Can 3: Nordic Licorice */}
    <g transform="translate(570, 150)">
      <ellipse cx="35" cy="10" rx="28" ry="8" fill="url(#skrufCanLicorice)" opacity="0.3" />
      <rect x="7" y="10" width="56" height="80" fill="url(#skrufCanLicorice)" rx="4" />
      <ellipse cx="35" cy="90" rx="28" ry="8" fill="#1A1A1A" />
      <rect x="12" y="15" width="8" height="70" fill="#ffffff" opacity="0.15" rx="2" />
      <text
        x="35"
        y="50"
        fontSize="16"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui"
      >
        SKRUF
      </text>
      <rect x="18" y="70" width="34" height="12" fill="#1e293b" rx="2" stroke="#334155" strokeWidth="1" />
      <text
        x="35"
        y="78"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        fill="#C4A35A"
        fontFamily="system-ui"
      >
        S4
      </text>
    </g>

    <text
      x="605"
      y="250"
      fontSize="14"
      fontWeight="600"
      textAnchor="middle"
      fill="#64748b"
      fontFamily="system-ui"
    >
      Licorice
    </text>
  </svg>
);

// 5. White Fox Complete Guide
export const WhiteFoxBrandIllustration = () => (
  <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    <defs>
      <linearGradient id="whiteFoxBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0c1018" />
        <stop offset="100%" stopColor="#161d2b" />
      </linearGradient>
      <linearGradient id="foxCanWhite" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F8F9FA" />
        <stop offset="100%" stopColor="#E8EAED" />
      </linearGradient>
      <linearGradient id="foxCanIntense" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4D4D8" />
        <stop offset="100%" stopColor="#9CA3AF" />
      </linearGradient>
      <linearGradient id="foxCanBlack" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#374151" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
      <linearGradient id="strengthMeter" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#22c55e" />
        <stop offset="50%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
    </defs>

    {/* Background */}
    <rect width="800" height="400" fill="url(#whiteFoxBg)" />

    {/* Fox silhouette icon */}
    <g transform="translate(110, 45)">
      <circle cx="12" cy="14" r="5" fill="#ffffff" opacity="0.6" />
      <polygon points="12,10 16,8 18,10 16,14" fill="#ffffff" opacity="0.6" />
      <polygon points="8,10 4,8 2,10 4,14" fill="#ffffff" opacity="0.6" />
      <path d="M 12 14 Q 16 18 20 17" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.6" />
    </g>

    {/* Title Section */}
    <text
      x="400"
      y="50"
      fontSize="72"
      fontWeight="900"
      textAnchor="middle"
      fill="#ffffff"
      fontFamily="system-ui"
    >
      WHITE FOX
    </text>
    <text
      x="400"
      y="90"
      fontSize="18"
      textAnchor="middle"
      fill="#94a3b8"
      fontFamily="system-ui"
    >
      MINT SPECIALIST • 12-24MG
    </text>

    {/* Can 1: All White (12mg) - Smaller */}
    <g transform="translate(100, 155)">
      <ellipse cx="28" cy="8" rx="22" ry="6" fill="url(#foxCanWhite)" opacity="0.3" />
      <rect x="6" y="8" width="44" height="60" fill="url(#foxCanWhite)" rx="3" />
      <ellipse cx="28" cy="68" rx="22" ry="6" fill="#E8EAED" />
      <rect x="10" y="12" width="6" height="50" fill="#ffffff" opacity="0.15" rx="1" />
      <text
        x="28"
        y="42"
        fontSize="14"
        fontWeight="bold"
        textAnchor="middle"
        fill="#1A1A2E"
        fontFamily="system-ui"
      >
        ALL WHITE
      </text>
    </g>

    {/* Can 2: Double Mint (12mg) */}
    <g transform="translate(220, 140)">
      <ellipse cx="28" cy="8" rx="22" ry="6" fill="url(#foxCanWhite)" opacity="0.3" />
      <rect x="6" y="8" width="44" height="75" fill="url(#foxCanWhite)" rx="3" />
      <ellipse cx="28" cy="83" rx="22" ry="6" fill="#E8EAED" />
      <rect x="10" y="12" width="6" height="65" fill="#ffffff" opacity="0.15" rx="1" />
      <text
        x="28"
        y="48"
        fontSize="13"
        fontWeight="bold"
        textAnchor="middle"
        fill="#1A1A2E"
        fontFamily="system-ui"
      >
        DOUBLE
      </text>
      <text
        x="28"
        y="62"
        fontSize="13"
        fontWeight="bold"
        textAnchor="middle"
        fill="#1A1A2E"
        fontFamily="system-ui"
      >
        MINT
      </text>
    </g>

    {/* Can 3: Peppered Mint (14.3mg) - Medium */}
    <g transform="translate(330, 130)">
      <ellipse cx="28" cy="8" rx="22" ry="6" fill="url(#foxCanIntense)" opacity="0.3" />
      <rect x="6" y="8" width="44" height="85" fill="url(#foxCanIntense)" rx="3" />
      <ellipse cx="28" cy="93" rx="22" ry="6" fill="#9CA3AF" />
      <rect x="10" y="12" width="6" height="75" fill="#ffffff" opacity="0.15" rx="1" />
      <text
        x="28"
        y="52"
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui"
      >
        PEPPERED
      </text>
      <text
        x="28"
        y="65"
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui"
      >
        MINT
      </text>
    </g>

    {/* Can 4: Full Charge (16.5mg) - Tall */}
    <g transform="translate(440, 120)">
      <ellipse cx="28" cy="8" rx="22" ry="6" fill="url(#foxCanIntense)" opacity="0.3" />
      <rect x="6" y="8" width="44" height="95" fill="url(#foxCanIntense)" rx="3" />
      <ellipse cx="28" cy="103" rx="22" ry="6" fill="#9CA3AF" />
      <rect x="10" y="12" width="6" height="85" fill="#ffffff" opacity="0.15" rx="1" />
      <text
        x="28"
        y="52"
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui"
      >
        FULL
      </text>
      <text
        x="28"
        y="65"
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui"
      >
        CHARGE
      </text>
    </g>

    {/* Can 5: Black Edition (24mg) - Tallest, Darkest */}
    <g transform="translate(550, 105)">
      <ellipse cx="28" cy="8" rx="22" ry="6" fill="url(#foxCanBlack)" opacity="0.4" />
      <rect x="6" y="8" width="44" height="110" fill="url(#foxCanBlack)" rx="3" stroke="#1A1A2E" strokeWidth="1" />
      <ellipse cx="28" cy="118" rx="22" ry="6" fill="#111827" />
      <rect x="10" y="12" width="6" height="100" fill="#ffffff" opacity="0.1" rx="1" />
      <text
        x="28"
        y="56"
        fontSize="11"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui"
      >
        BLACK
      </text>
      <text
        x="28"
        y="68"
        fontSize="11"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui"
      >
        EDITION
      </text>
      {/* Elite badge on Black Edition */}
      <circle cx="42" cy="18" r="8" fill="#ef4444" opacity="0.8" />
      <text
        x="42"
        y="21"
        fontSize="9"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui"
      >
        24
      </text>
    </g>

    {/* Strength meter at bottom */}
    <rect x="100" y="300" width="600" height="8" fill="url(#strengthMeter)" rx="2" />
    <text
      x="105"
      y="330"
      fontSize="12"
      fill="#64748b"
      fontFamily="system-ui"
    >
      12MG
    </text>
    <text
      x="725"
      y="330"
      fontSize="12"
      fill="#ef4444"
      fontFamily="system-ui"
      textAnchor="end"
    >
      24MG
    </text>
  </svg>
);

/**
 * Metadata export for integration
 * Used by article templates to reference illustrations by slug
 */
export const brandIllustrationMetadata = [
  {
    id: 'zynjsx-zyn-guide',
    articleSlug: 'zynjsx-guide',
    title: 'ZYN Complete Guide - 52 Products Showcase',
    component: 'ZynBrandIllustration',
    dimensions: { width: 800, height: 400 },
    brandColor: '#00A3E0',
    description: '3 ZYN varieties with Swedish heritage flag, #1 worldwide badge, strength indicators'
  },
  {
    id: 'velo-velo-guide',
    articleSlug: 'velo-guide',
    title: 'VELO Complete Guide - 53 Products Showcase',
    component: 'VeloBrandIllustration',
    dimensions: { width: 800, height: 400 },
    brandColor: '#1A1A2E',
    accentColor: '#E040FB',
    description: '3 VELO varieties with color-coded flavors, BY BAT attribution, GLOBAL #2 badge'
  },
  {
    id: 'loop-loop-guide',
    articleSlug: 'loop-guide',
    title: 'LOOP Complete Guide - Instant Rush',
    component: 'LoopBrandIllustration',
    dimensions: { width: 800, height: 400 },
    brandColor: '#FF6B35',
    accentColor: '#2EC4B6',
    description: '3 LOOP varieties with lightning bolt (speed) and eco-leaf icons, unique flavor gradients'
  },
  {
    id: 'skruf-skruf-guide',
    articleSlug: 'skruf-guide',
    title: 'Skruf Complete Guide - Swedish Craft',
    component: 'SkrufBrandIllustration',
    dimensions: { width: 800, height: 400 },
    brandColor: '#4A7C59',
    accentColor: '#C4A35A',
    description: '3 Skruf varieties with heritage crown icon, S2/S3/S4 strength badges, classic warmth'
  },
  {
    id: 'white-fox-white-fox-guide',
    articleSlug: 'white-fox-guide',
    title: 'White Fox Complete Guide - Mint Specialist',
    component: 'WhiteFoxBrandIllustration',
    dimensions: { width: 800, height: 400 },
    brandColor: '#FFFFFF',
    accentColor: '#1A1A2E',
    description: '5 White Fox strength ladder (12-24mg) with gradient intensity, Black Edition highlight, strength meter'
  }
];
