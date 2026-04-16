import React from 'react';

/* ================================================================
   ZYN HEALTH PROFILE ILLUSTRATION

   Custom SVG for "are-zyns-bad-for-you" blog article hero.
   800x400 (2:1 aspect ratio) for article hero banner.

   Uses SnusFriend dark palette:
   - bg: #0c1018 to #161d2b gradient
   - card: #1e293b, borders: #334155
   - text: #f1f5f9 (bright), #94a3b8 (muted), #64748b (dim)
   - primary green: #a3e635 (lime accent)

   Illustrates 3 ZYN strength tiers with risk indicators.
   ================================================================ */

const ZYNHealthProfileIllustration = () => (
  <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Background gradient */}
      <linearGradient id="zyh-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0c1018" />
        <stop offset="100%" stopColor="#161d2b" />
      </linearGradient>

      {/* ZYN brand blue gradient */}
      <linearGradient id="zyh-blue" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#00A3E0" />
        <stop offset="100%" stopColor="#0087c1" />
      </linearGradient>

      {/* Low risk - green gradient */}
      <linearGradient id="zyh-low-risk" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="100%" stopColor="#4ade80" />
      </linearGradient>

      {/* Moderate risk - orange gradient */}
      <linearGradient id="zyh-moderate-risk" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#f97316" />
      </linearGradient>

      {/* High risk - red-orange gradient */}
      <linearGradient id="zyh-high-risk" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ff6b6b" />
        <stop offset="100%" stopColor="#ee5a6f" />
      </linearGradient>

      {/* Risk meter gradient (left to right) */}
      <linearGradient id="zyh-risk-meter" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="50%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#ff6b6b" />
      </linearGradient>

      {/* Heartbeat line gradient */}
      <linearGradient id="zyh-heartbeat" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#a3e635" opacity="0.8" />
        <stop offset="50%" stopColor="#a3e635" opacity="0.4" />
        <stop offset="100%" stopColor="#a3e635" opacity="0.8" />
      </linearGradient>

      {/* Arrow marker for risk indicators */}
      <marker id="zyh-arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
        <polygon points="0,0 10,5 0,10" fill="#a3e635" opacity="0.6" />
      </marker>
    </defs>

    {/* Background */}
    <rect width="800" height="400" fill="url(#zyh-bg)" />

    {/* Title section */}
    <text
      x="400"
      y="35"
      textAnchor="middle"
      fontSize="12"
      fontWeight="700"
      fill="#94a3b8"
      fontFamily="system-ui"
      letterSpacing="2"
      textTransform="uppercase"
    >
      ZYN Health Profile
    </text>

    {/* Divider line */}
    <line x1="250" y1="45" x2="550" y2="45" stroke="#334155" strokeWidth="1" />

    {/* ========== CAN 1: 3MG (LOW RISK) ========== */}
    <g transform="translate(100, 80)">
      {/* Can card background */}
      <rect x="0" y="0" width="140" height="220" fill="#1e293b" stroke="#334155" strokeWidth="1" rx="4" />

      {/* Can cylinder - simplified low-poly style */}
      {/* Top ellipse */}
      <ellipse cx="70" cy="35" rx="40" ry="12" fill="#86efac" opacity="0.8" />
      <ellipse cx="70" cy="35" rx="36" ry="9" fill="url(#zyh-low-risk)" />

      {/* Can body */}
      <rect x="30" y="35" width="80" height="65" fill="url(#zyh-low-risk)" rx="2" />

      {/* Can bottom */}
      <ellipse cx="70" cy="100" rx="40" ry="12" fill="#22c55e" opacity="0.6" />

      {/* ZYN logo text on can */}
      <text x="70" y="65" textAnchor="middle" fontSize="14" fontWeight="700" fill="white" fontFamily="system-ui">
        ZYN
      </text>

      {/* Strength label */}
      <text x="70" y="80" textAnchor="middle" fontSize="11" fontWeight="600" fill="white" opacity="0.9" fontFamily="system-ui">
        3mg
      </text>

      {/* Risk label below can */}
      <text x="70" y="135" textAnchor="middle" fontSize="12" fontWeight="600" fill="#86efac" fontFamily="system-ui">
        LOW RISK
      </text>

      {/* Risk meter bar */}
      <rect x="20" y="150" width="100" height="6" fill="#0c1018" stroke="#334155" strokeWidth="1" rx="2" />
      <rect x="20" y="150" width="25" height="6" fill="url(#zyh-risk-meter)" rx="2" />

      {/* Risk percentage */}
      <text x="70" y="175" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="system-ui">
        ~15% addiction risk
      </text>

      {/* Checkmark badge */}
      <circle cx="115" cy="20" r="14" fill="#22c55e" opacity="0.8" />
      <text x="115" y="28" textAnchor="middle" fontSize="16" fill="white" fontFamily="system-ui">
        ✓
      </text>
    </g>

    {/* ========== CAN 2: 6MG (MODERATE RISK) ========== */}
    <g transform="translate(330, 80)">
      {/* Can card background */}
      <rect x="0" y="0" width="140" height="220" fill="#1e293b" stroke="#334155" strokeWidth="1" rx="4" />

      {/* Can cylinder */}
      {/* Top ellipse */}
      <ellipse cx="70" cy="35" rx="40" ry="12" fill="#00A3E0" opacity="0.85" />
      <ellipse cx="70" cy="35" rx="36" ry="9" fill="url(#zyh-blue)" />

      {/* Can body */}
      <rect x="30" y="35" width="80" height="65" fill="url(#zyh-blue)" rx="2" />

      {/* Can bottom */}
      <ellipse cx="70" cy="100" rx="40" ry="12" fill="#0087c1" opacity="0.6" />

      {/* ZYN logo */}
      <text x="70" y="65" textAnchor="middle" fontSize="14" fontWeight="700" fill="white" fontFamily="system-ui">
        ZYN
      </text>

      {/* Strength label */}
      <text x="70" y="80" textAnchor="middle" fontSize="11" fontWeight="600" fill="white" opacity="0.95" fontFamily="system-ui">
        6mg
      </text>

      {/* Risk label */}
      <text x="70" y="135" textAnchor="middle" fontSize="12" fontWeight="600" fill="#fb923c" fontFamily="system-ui">
        MODERATE
      </text>

      {/* Risk meter bar */}
      <rect x="20" y="150" width="100" height="6" fill="#0c1018" stroke="#334155" strokeWidth="1" rx="2" />
      <rect x="20" y="150" width="55" height="6" fill="url(#zyh-risk-meter)" rx="2" />

      {/* Risk percentage */}
      <text x="70" y="175" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="system-ui">
        ~30% addiction risk
      </text>

      {/* Caution indicator */}
      <circle cx="115" cy="20" r="14" fill="#fb923c" opacity="0.8" />
      <text x="115" y="25" textAnchor="middle" fontSize="18" fill="white" fontWeight="700" fontFamily="system-ui">
        !
      </text>
    </g>

    {/* ========== CAN 3: 11MG (HIGHER RISK) ========== */}
    <g transform="translate(560, 80)">
      {/* Can card background */}
      <rect x="0" y="0" width="140" height="220" fill="#1e293b" stroke="#334155" strokeWidth="1" rx="4" />

      {/* Can cylinder */}
      {/* Top ellipse */}
      <ellipse cx="70" cy="35" rx="40" ry="12" fill="#ff6b6b" opacity="0.85" />
      <ellipse cx="70" cy="35" rx="36" ry="9" fill="url(#zyh-high-risk)" />

      {/* Can body */}
      <rect x="30" y="35" width="80" height="65" fill="url(#zyh-high-risk)" rx="2" />

      {/* Can bottom */}
      <ellipse cx="70" cy="100" rx="40" ry="12" fill="#ee5a6f" opacity="0.6" />

      {/* ZYN logo */}
      <text x="70" y="65" textAnchor="middle" fontSize="14" fontWeight="700" fill="white" fontFamily="system-ui">
        ZYN
      </text>

      {/* Strength label */}
      <text x="70" y="80" textAnchor="middle" fontSize="11" fontWeight="600" fill="white" opacity="0.95" fontFamily="system-ui">
        11mg
      </text>

      {/* Risk label */}
      <text x="70" y="135" textAnchor="middle" fontSize="12" fontWeight="600" fill="#ff6b6b" fontFamily="system-ui">
        HIGHER RISK
      </text>

      {/* Risk meter bar */}
      <rect x="20" y="150" width="100" height="6" fill="#0c1018" stroke="#334155" strokeWidth="1" rx="2" />
      <rect x="20" y="150" width="85" height="6" fill="url(#zyh-risk-meter)" rx="2" />

      {/* Risk percentage */}
      <text x="70" y="175" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="system-ui">
        ~50% addiction risk
      </text>

      {/* Alert indicator */}
      <circle cx="115" cy="20" r="14" fill="#ff6b6b" opacity="0.8" />
      <text x="115" y="27" textAnchor="middle" fontSize="18" fill="white" fontWeight="700" fontFamily="system-ui">
        ⚠
      </text>
    </g>

    {/* ========== BOTTOM SECTION ========== */}

    {/* Heartbeat line across bottom */}
    <g opacity="0.4">
      <path
        d="M 50 350 L 100 350 L 110 340 L 120 360 L 135 350 L 200 350 L 250 330 L 280 370 L 300 350 L 400 350 L 450 330 L 480 370 L 500 350 L 600 350 L 650 330 L 680 370 L 700 350 L 750 350"
        stroke="url(#zyh-heartbeat)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>

    {/* Tobacco-free badge */}
    <g transform="translate(670, 310)">
      {/* Shield background */}
      <path
        d="M 0 0 L 35 0 L 35 35 Q 18 50 0 35 Z"
        fill="#1e293b"
        stroke="#334155"
        strokeWidth="1"
      />

      {/* Checkmark */}
      <path d="M 8 18 L 14 24 L 28 10" stroke="#a3e635" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Label */}
      <text x="17" y="65" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="system-ui" fontWeight="600">
        Tobacco-free
      </text>
    </g>

    {/* Bottom info text */}
    <text
      x="400"
      y="390"
      textAnchor="middle"
      fontSize="10"
      fill="#64748b"
      fontFamily="system-ui"
    >
      Health risk increases with nicotine strength. ZYNs are tobacco-free and contain pharmaceutical-grade nicotine.
    </text>
  </svg>
);

export default ZYNHealthProfileIllustration;

/* Metadata for integration */
export const metadata = {
  id: 'zyn-health-profile',
  article: 'are-zyns-bad-for-you',
  title: 'Are ZYNs Bad for You? Health Risk by Strength',
  dimensions: '800x400',
  description: 'Visual guide showing ZYN health profiles across 3 strength tiers (3mg, 6mg, 11mg) with risk indicators and addiction potential.',
  colors: {
    lowRisk: '#86efac',
    moderateRisk: '#fb923c',
    higherRisk: '#ff6b6b',
    zynBrand: '#00A3E0',
    accent: '#a3e635',
  },
};
