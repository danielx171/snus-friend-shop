import React, { useState } from 'react';

/* ================================================================
   BLOG ARTICLE ILLUSTRATIONS — Top 10 Articles

   Custom SVG hero illustrations for the highest-value blog pages.
   Each is 800x400 (2:1 aspect ratio) to work as article hero banners.

   Uses the SnusFriend dark palette:
   - bg: #0c1018  card: #161d2b  text: #f1f5f9
   - primary green: #a3e635  muted: #94a3b8

   Articles ranked by SEO value (search volume × conversion potential):
   1. how-to-use-nicotine-pouches       — THE beginner guide
   2. best-nicotine-pouches-2026        — best-of listicle
   3. nicotine-pouches-vs-vaping        — comparison (high search vol)
   4. nicotine-pouches-vs-cigarettes    — comparison (conversion)
   5. best-nicotine-pouches-for-beginners-2026 — beginner funnel
   6. how-to-choose-your-strength       — buying guide
   7. best-mint-nicotine-pouches-2026   — popular flavour
   8. are-nicotine-pouches-safe         — trust/safety
   9. nicotine-pouch-flavour-guide      — discovery guide
   10. switching-from-cigarettes         — conversion content
   ================================================================ */

const ILLUSTRATIONS = [
  {
    id: 'how-to-use',
    article: 'how-to-use-nicotine-pouches',
    title: 'How to Use Nicotine Pouches',
    description: 'Step-by-step visual: hand placing pouch under upper lip, with numbered steps',
    svg: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="htu-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0c1018" />
            <stop offset="100%" stopColor="#161d2b" />
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill="url(#htu-bg)" />

        {/* Step 1 - Open can */}
        <g transform="translate(80, 100)">
          <circle cx="80" cy="80" r="70" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          {/* Can shape */}
          <ellipse cx="80" cy="70" rx="35" ry="12" fill="#334155" />
          <rect x="45" y="70" width="70" height="30" fill="#334155" rx="2" />
          <ellipse cx="80" cy="100" rx="35" ry="12" fill="#475569" />
          <ellipse cx="80" cy="70" rx="30" ry="9" fill="#475569" />
          {/* Lid open */}
          <ellipse cx="80" cy="58" rx="28" ry="8" fill="#64748b" transform="rotate(-15 80 58)" />
          {/* Pouches inside */}
          <ellipse cx="75" cy="72" rx="8" ry="4" fill="#e2e8f0" />
          <ellipse cx="88" cy="74" rx="7" ry="4" fill="#e2e8f0" />
          {/* Step number */}
          <circle cx="135" cy="25" r="16" fill="#a3e635" />
          <text x="135" y="31" textAnchor="middle" fontSize="18" fontWeight="700" fill="#0c1018" fontFamily="system-ui">1</text>
          <text x="80" y="170" textAnchor="middle" fontSize="13" fill="#94a3b8" fontFamily="system-ui">Open the can</text>
        </g>

        {/* Step 2 - Pick a pouch */}
        <g transform="translate(280, 100)">
          <circle cx="80" cy="80" r="70" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          {/* Hand picking pouch */}
          <path d="M60 90 Q55 70 65 55 Q70 48 78 50 L85 55 Q90 48 95 52 L98 60 Q102 55 106 60 L105 75 Q100 90 85 95 L65 95 Q58 95 60 90" fill="#f5d0a9" />
          {/* Pouch between fingers */}
          <ellipse cx="80" cy="55" rx="12" ry="6" fill="white" stroke="#cbd5e1" strokeWidth="1" />
          <text x="80" y="58" textAnchor="middle" fontSize="6" fill="#94a3b8" fontFamily="system-ui">POUCH</text>
          {/* Step number */}
          <circle cx="135" cy="25" r="16" fill="#a3e635" />
          <text x="135" y="31" textAnchor="middle" fontSize="18" fontWeight="700" fill="#0c1018" fontFamily="system-ui">2</text>
          <text x="80" y="170" textAnchor="middle" fontSize="13" fill="#94a3b8" fontFamily="system-ui">Pick a pouch</text>
        </g>

        {/* Step 3 - Place under lip */}
        <g transform="translate(480, 100)">
          <circle cx="80" cy="80" r="70" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          {/* Simplified face profile */}
          <path d="M50 40 Q60 30 75 35 Q90 40 92 55 Q94 70 88 80 Q85 90 75 95 Q65 100 55 95 Q45 85 45 70 Q45 55 50 40" fill="#f5d0a9" />
          {/* Upper lip area with pouch */}
          <path d="M55 72 Q70 68 85 72 Q85 78 70 80 Q55 78 55 72" fill="#e8a88a" />
          {/* Pouch visible */}
          <ellipse cx="70" cy="73" rx="8" ry="3" fill="white" opacity="0.7" />
          {/* Eye */}
          <circle cx="68" cy="52" r="3" fill="#1e293b" />
          {/* Arrow pointing to placement */}
          <path d="M100 60 L85 70" stroke="#a3e635" strokeWidth="2" markerEnd="url(#arrow)" />
          <circle cx="102" cy="58" r="1" fill="#a3e635" />
          {/* Step number */}
          <circle cx="135" cy="25" r="16" fill="#a3e635" />
          <text x="135" y="31" textAnchor="middle" fontSize="18" fontWeight="700" fill="#0c1018" fontFamily="system-ui">3</text>
          <text x="80" y="170" textAnchor="middle" fontSize="13" fill="#94a3b8" fontFamily="system-ui">Place under lip</text>
        </g>

        {/* Decorative elements */}
        <text x="400" y="50" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="system-ui" letterSpacing="3" textTransform="uppercase">STEP-BY-STEP GUIDE</text>
        <line x1="300" y1="55" x2="500" y2="55" stroke="#334155" strokeWidth="1" />

        {/* Duration note */}
        <g transform="translate(650, 140)">
          <circle cx="40" cy="40" r="35" fill="#1e293b" stroke="#a3e635" strokeWidth="1" opacity="0.5" />
          <text x="40" y="35" textAnchor="middle" fontSize="22" fontWeight="700" fill="#a3e635" fontFamily="system-ui">20</text>
          <text x="40" y="48" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="system-ui">MINUTES</text>
          <text x="40" y="90" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="system-ui">Enjoy for</text>
          <text x="40" y="103" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="system-ui">20-60 min</text>
        </g>
      </svg>
    ),
  },
  {
    id: 'best-2026',
    article: 'best-nicotine-pouches-2026',
    title: 'Best Nicotine Pouches 2026',
    description: 'Podium with top 3 cans, trophy, and ranking stars',
    svg: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="b26-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0c1018" />
            <stop offset="100%" stopColor="#161d2b" />
          </linearGradient>
          <linearGradient id="b26-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill="url(#b26-bg)" />

        {/* Trophy */}
        <g transform="translate(340, 40)">
          <path d="M40 0 L80 0 L75 50 Q60 65 45 50 Z" fill="url(#b26-gold)" />
          <path d="M25 10 Q10 10 15 30 Q20 45 35 40" fill="#fbbf24" opacity="0.6" />
          <path d="M95 10 Q110 10 105 30 Q100 45 85 40" fill="#fbbf24" opacity="0.6" />
          <rect x="50" y="55" width="20" height="15" fill="#d97706" />
          <rect x="40" y="68" width="40" height="8" rx="2" fill="#b45309" />
          <text x="60" y="40" textAnchor="middle" fontSize="20" fill="#0c1018" fontWeight="700" fontFamily="system-ui">#1</text>
        </g>

        {/* Podium */}
        {/* 2nd place */}
        <rect x="180" y="260" width="150" height="100" fill="#334155" rx="4" />
        <text x="255" y="290" textAnchor="middle" fontSize="32" fontWeight="700" fill="#94a3b8" fontFamily="system-ui">2</text>
        {/* Can on 2nd */}
        <ellipse cx="255" cy="250" rx="28" ry="8" fill="#475569" />
        <rect x="227" y="220" width="56" height="30" fill="#475569" rx="2" />
        <ellipse cx="255" cy="220" rx="28" ry="8" fill="#64748b" />
        <text x="255" y="240" textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="600" fontFamily="system-ui">VELO</text>

        {/* 1st place */}
        <rect x="330" y="220" width="150" height="140" fill="#1e293b" rx="4" stroke="#fbbf24" strokeWidth="1" />
        <text x="405" y="260" textAnchor="middle" fontSize="36" fontWeight="700" fill="#fbbf24" fontFamily="system-ui">1</text>
        {/* Can on 1st */}
        <ellipse cx="405" cy="210" rx="30" ry="9" fill="#475569" />
        <rect x="375" y="178" width="60" height="32" fill="#475569" rx="2" />
        <ellipse cx="405" cy="178" rx="30" ry="9" fill="#64748b" />
        <text x="405" y="200" textAnchor="middle" fontSize="11" fill="#a3e635" fontWeight="700" fontFamily="system-ui">ZYN</text>

        {/* 3rd place */}
        <rect x="480" y="290" width="150" height="70" fill="#334155" rx="4" />
        <text x="555" y="315" textAnchor="middle" fontSize="28" fontWeight="700" fill="#94a3b8" fontFamily="system-ui">3</text>
        {/* Can on 3rd */}
        <ellipse cx="555" cy="280" rx="26" ry="7" fill="#475569" />
        <rect x="529" y="252" width="52" height="28" fill="#475569" rx="2" />
        <ellipse cx="555" cy="252" rx="26" ry="7" fill="#64748b" />
        <text x="555" y="272" textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="600" fontFamily="system-ui">LOOP</text>

        {/* Stars decoration */}
        <path d="M100 80 L103 88 L112 88 L105 93 L107 102 L100 97 L93 102 L95 93 L88 88 L97 88 Z" fill="#fbbf24" opacity="0.3" />
        <path d="M700 60 L703 68 L712 68 L705 73 L707 82 L700 77 L693 82 L695 73 L688 68 L697 68 Z" fill="#fbbf24" opacity="0.25" />
        <path d="M120 300 L122 306 L128 306 L123 310 L125 316 L120 312 L115 316 L117 310 L112 306 L118 306 Z" fill="#fbbf24" opacity="0.2" />

        <text x="400" y="390" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="system-ui">Based on expert reviews, customer ratings, and flavour consistency</text>
      </svg>
    ),
  },
  {
    id: 'vs-vaping',
    article: 'nicotine-pouches-vs-vaping',
    title: 'Nicotine Pouches vs Vaping',
    description: 'Split comparison: clean pouch on left, vape device with cloud on right',
    svg: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="400" fill="#0c1018" />

        {/* Left side - Pouches */}
        <rect x="0" y="0" width="390" height="400" fill="#0c1018" />

        {/* Pouch can */}
        <g transform="translate(120, 100)">
          <ellipse cx="80" cy="100" rx="55" ry="18" fill="#334155" />
          <rect x="25" y="40" width="110" height="60" fill="#1e293b" rx="3" />
          <ellipse cx="80" cy="40" rx="55" ry="18" fill="#334155" />
          <ellipse cx="80" cy="40" rx="48" ry="14" fill="#475569" />
          {/* Green check marks */}
          <text x="80" y="48" textAnchor="middle" fontSize="16" fill="#a3e635" fontFamily="system-ui">✓</text>
        </g>

        <text x="200" y="270" textAnchor="middle" fontSize="16" fontWeight="600" fill="#a3e635" fontFamily="system-ui">Nicotine Pouches</text>
        <text x="200" y="295" textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily="system-ui">No device needed</text>
        <text x="200" y="312" textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily="system-ui">No smoke or vapour</text>
        <text x="200" y="329" textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily="system-ui">Use anywhere</text>
        <text x="200" y="346" textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily="system-ui">No charging</text>

        {/* Divider */}
        <line x1="400" y1="40" x2="400" y2="360" stroke="#334155" strokeWidth="2" strokeDasharray="6 4" />
        <circle cx="400" cy="200" r="20" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        <text x="400" y="205" textAnchor="middle" fontSize="14" fontWeight="700" fill="#94a3b8" fontFamily="system-ui">VS</text>

        {/* Right side - Vaping */}
        <rect x="410" y="0" width="390" height="400" fill="#0c1018" />

        {/* Vape device */}
        <g transform="translate(520, 80)">
          {/* Device body */}
          <rect x="50" y="30" width="28" height="100" rx="8" fill="#475569" />
          <rect x="54" y="36" width="20" height="30" rx="3" fill="#334155" />
          {/* Mouthpiece */}
          <rect x="56" y="20" width="16" height="14" rx="4" fill="#64748b" />
          {/* Button */}
          <circle cx="64" cy="85" r="6" fill="#64748b" />
          {/* Vapour cloud */}
          <ellipse cx="64" cy="8" rx="20" ry="10" fill="#94a3b8" opacity="0.15" />
          <ellipse cx="70" cy="-5" rx="25" ry="12" fill="#94a3b8" opacity="0.1" />
          <ellipse cx="58" cy="-15" rx="18" ry="10" fill="#94a3b8" opacity="0.06" />
        </g>

        <text x="600" y="270" textAnchor="middle" fontSize="16" fontWeight="600" fill="#64748b" fontFamily="system-ui">Vaping</text>
        <text x="600" y="295" textAnchor="middle" fontSize="12" fill="#64748b" fontFamily="system-ui">Requires device + liquid</text>
        <text x="600" y="312" textAnchor="middle" fontSize="12" fill="#64748b" fontFamily="system-ui">Produces visible vapour</text>
        <text x="600" y="329" textAnchor="middle" fontSize="12" fill="#64748b" fontFamily="system-ui">Restricted in many places</text>
        <text x="600" y="346" textAnchor="middle" fontSize="12" fill="#64748b" fontFamily="system-ui">Needs regular charging</text>
      </svg>
    ),
  },
  {
    id: 'vs-cigarettes',
    article: 'nicotine-pouches-vs-cigarettes',
    title: 'Nicotine Pouches vs Cigarettes',
    description: 'Clean pouch vs crossed-out cigarette with smoke — health comparison',
    svg: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="400" fill="#0c1018" />

        {/* Left - Clean pouch with green glow */}
        <circle cx="200" cy="180" r="80" fill="#a3e635" opacity="0.05" />
        <circle cx="200" cy="180" r="60" fill="#a3e635" opacity="0.08" />
        <ellipse cx="200" cy="180" rx="40" ry="18" fill="white" />
        <text x="200" y="184" textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="system-ui">NICOTINE POUCH</text>
        {/* Green checkmark */}
        <circle cx="200" cy="130" r="16" fill="#a3e635" />
        <path d="M192 130 L198 136 L210 124" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />

        <text x="200" y="290" textAnchor="middle" fontSize="14" fontWeight="600" fill="#a3e635" fontFamily="system-ui">0 harmful chemicals</text>
        <text x="200" y="310" textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily="system-ui">No tar, no carbon monoxide</text>
        <text x="200" y="330" textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily="system-ui">No secondhand exposure</text>

        {/* VS divider */}
        <line x1="400" y1="40" x2="400" y2="360" stroke="#334155" strokeWidth="2" strokeDasharray="6 4" />
        <circle cx="400" cy="180" r="20" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        <text x="400" y="185" textAnchor="middle" fontSize="14" fontWeight="700" fill="#94a3b8" fontFamily="system-ui">VS</text>

        {/* Right - Cigarette with red X */}
        <g transform="translate(540, 140)">
          {/* Cigarette */}
          <rect x="0" y="30" width="120" height="12" rx="2" fill="#fef3c7" />
          <rect x="0" y="30" width="25" height="12" rx="2" fill="#f97316" />
          {/* Smoke */}
          <path d="M125 30 Q130 20 128 10 Q132 0 127 -10" stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.2" />
          <path d="M120 28 Q126 15 122 5 Q128 -8 124 -18" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.15" />
          {/* Red X */}
          <circle cx="60" cy="36" r="30" fill="#ef4444" opacity="0.15" />
          <line x1="40" y1="16" x2="80" y2="56" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          <line x1="80" y1="16" x2="40" y2="56" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
        </g>

        <text x="600" y="290" textAnchor="middle" fontSize="14" fontWeight="600" fill="#ef4444" fontFamily="system-ui">7,000+ chemicals</text>
        <text x="600" y="310" textAnchor="middle" fontSize="12" fill="#64748b" fontFamily="system-ui">70+ known carcinogens</text>
        <text x="600" y="330" textAnchor="middle" fontSize="12" fill="#64748b" fontFamily="system-ui">Harms bystanders</text>
      </svg>
    ),
  },
  {
    id: 'beginners-guide',
    article: 'best-nicotine-pouches-for-beginners-2026',
    title: 'Best Pouches for Beginners',
    description: 'Friendly welcome mat with starter pack of mild pouches',
    svg: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="400" fill="#0c1018" />

        {/* Welcoming arc */}
        <path d="M100 350 Q400 50 700 350" stroke="#a3e635" strokeWidth="2" fill="none" opacity="0.15" />
        <path d="M150 350 Q400 100 650 350" stroke="#a3e635" strokeWidth="1" fill="none" opacity="0.1" />

        {/* Beginner badge */}
        <circle cx="400" cy="80" r="30" fill="#a3e635" opacity="0.1" />
        <circle cx="400" cy="80" r="22" fill="#a3e635" opacity="0.15" />
        <text x="400" y="76" textAnchor="middle" fontSize="18" fill="#a3e635" fontFamily="system-ui">🌱</text>
        <text x="400" y="96" textAnchor="middle" fontSize="9" fill="#a3e635" fontFamily="system-ui" fontWeight="600">BEGINNER</text>

        {/* 3 starter cans */}
        {[
          { x: 180, label: 'Mild', mg: '4mg', color: '#86efac' },
          { x: 380, label: 'Normal', mg: '6mg', color: '#a3e635' },
          { x: 580, label: 'Strong', mg: '8mg', color: '#facc15' },
        ].map((can, i) => (
          <g key={i} transform={`translate(${can.x - 50}, 140)`}>
            <rect x="0" y="20" width="100" height="80" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            {/* Strength indicator */}
            <rect x="0" y="20" width="100" height="4" rx="2" fill={can.color} />
            <text x="50" y="60" textAnchor="middle" fontSize="14" fontWeight="700" fill="#f1f5f9" fontFamily="system-ui">{can.label}</text>
            <text x="50" y="78" textAnchor="middle" fontSize="20" fontWeight="700" fill={can.color} fontFamily="system-ui">{can.mg}</text>
            {/* Strength dots */}
            <g transform="translate(25, 88)">
              {[0, 1, 2, 3, 4].map((dot) => (
                <circle key={dot} cx={dot * 12} cy="0" r={dot <= i ? 4 : 3} fill={dot <= i ? can.color : '#334155'} />
              ))}
            </g>
          </g>
        ))}

        {/* Arrow progression */}
        <path d="M280 200 L340 200" stroke="#334155" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <path d="M480 200 L540 200" stroke="#334155" strokeWidth="2" />
        <text x="310" y="195" textAnchor="middle" fontSize="16" fill="#334155" fontFamily="system-ui">→</text>
        <text x="510" y="195" textAnchor="middle" fontSize="16" fill="#334155" fontFamily="system-ui">→</text>

        <text x="400" y="310" textAnchor="middle" fontSize="14" fill="#94a3b8" fontFamily="system-ui">Start mild, find your sweet spot</text>
        <text x="400" y="340" textAnchor="middle" fontSize="12" fill="#64748b" fontFamily="system-ui">Most beginners settle between 4-8mg after their first few cans</text>
      </svg>
    ),
  },
  {
    id: 'strength-guide',
    article: 'how-to-choose-your-strength',
    title: 'How to Choose Your Strength',
    description: 'Gradient strength meter from green (mild) to red (ultra strong)',
    svg: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sg-meter" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="25%" stopColor="#a3e635" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="75%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill="#0c1018" />

        {/* Strength meter bar */}
        <rect x="80" y="160" width="640" height="24" rx="12" fill="#1e293b" />
        <rect x="80" y="160" width="640" height="24" rx="12" fill="url(#sg-meter)" opacity="0.8" />

        {/* Strength labels */}
        {[
          { x: 120, label: 'Light', mg: '2-4mg', color: '#86efac' },
          { x: 240, label: 'Normal', mg: '4-6mg', color: '#a3e635' },
          { x: 360, label: 'Strong', mg: '6-10mg', color: '#facc15' },
          { x: 500, label: 'X-Strong', mg: '10-16mg', color: '#f97316' },
          { x: 640, label: 'Ultra', mg: '16-50mg', color: '#ef4444' },
        ].map((level, i) => (
          <g key={i}>
            {/* Tick mark */}
            <line x1={level.x} y1="190" x2={level.x} y2="206" stroke={level.color} strokeWidth="2" />
            <text x={level.x} y="225" textAnchor="middle" fontSize="13" fontWeight="600" fill={level.color} fontFamily="system-ui">{level.label}</text>
            <text x={level.x} y="242" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="system-ui">{level.mg}</text>
          </g>
        ))}

        {/* Who it's for labels */}
        <text x="180" y="280" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="system-ui">New users</text>
        <text x="360" y="280" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="system-ui">Regular users</text>
        <text x="570" y="280" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="system-ui">Experienced only</text>

        {/* Pointer for "recommended start" */}
        <g transform="translate(240, 120)">
          <path d="M0 30 L-8 10 L8 10 Z" fill="#a3e635" />
          <rect x="-45" y="-8" width="90" height="20" rx="4" fill="#a3e635" />
          <text x="0" y="6" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0c1018" fontFamily="system-ui">START HERE</text>
        </g>

        <text x="400" y="80" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="system-ui" letterSpacing="2">NICOTINE STRENGTH GUIDE</text>
        <text x="400" y="340" textAnchor="middle" fontSize="12" fill="#64748b" fontFamily="system-ui">Higher mg ≠ better. Find the strength that matches your tolerance.</text>
      </svg>
    ),
  },
  {
    id: 'best-mint',
    article: 'best-mint-nicotine-pouches-2026',
    title: 'Best Mint Nicotine Pouches',
    description: 'Fresh mint leaf burst with ice crystals on dark background',
    svg: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="400" fill="#0c1018" />

        {/* Central mint leaf cluster */}
        <g transform="translate(400, 180)">
          {/* Glow */}
          <circle cx="0" cy="0" r="120" fill="#a3e635" opacity="0.03" />
          <circle cx="0" cy="0" r="80" fill="#a3e635" opacity="0.05" />

          {/* Large mint leaf */}
          <path d="M0 -60 Q-50 -30 -40 20 Q-20 50 0 40 Q20 50 40 20 Q50 -30 0 -60" fill="#22c55e" opacity="0.7" />
          <line x1="0" y1="-55" x2="0" y2="35" stroke="#15803d" strokeWidth="1.5" />
          <path d="M0 -40 Q-15 -30 -25 -10" stroke="#15803d" strokeWidth="1" fill="none" />
          <path d="M0 -40 Q15 -30 25 -10" stroke="#15803d" strokeWidth="1" fill="none" />
          <path d="M0 -20 Q-12 -10 -20 10" stroke="#15803d" strokeWidth="1" fill="none" />
          <path d="M0 -20 Q12 -10 20 10" stroke="#15803d" strokeWidth="1" fill="none" />

          {/* Smaller leaf */}
          <path d="M50 -20 Q30 -40 60 -50 Q90 -40 70 -20 Q60 -10 50 -20" fill="#4ade80" opacity="0.5" />
          <path d="M-55 0 Q-75 -20 -45 -30 Q-15 -20 -35 0 Q-45 10 -55 0" fill="#4ade80" opacity="0.4" />
        </g>

        {/* Ice crystals */}
        <g opacity="0.3">
          <path d="M150 100 L155 90 L160 100 L155 110 Z" fill="#e0f2fe" />
          <path d="M650 120 L654 112 L658 120 L654 128 Z" fill="#e0f2fe" />
          <path d="M200 280 L203 274 L206 280 L203 286 Z" fill="#bae6fd" />
          <path d="M600 260 L604 252 L608 260 L604 268 Z" fill="#bae6fd" />
          <path d="M300 80 L302 76 L304 80 L302 84 Z" fill="#e0f2fe" />
          <path d="M520 300 L522 296 L524 300 L522 304 Z" fill="#e0f2fe" />
        </g>

        {/* Frost particles */}
        <circle cx="180" cy="150" r="2" fill="white" opacity="0.2" />
        <circle cx="620" cy="170" r="2" fill="white" opacity="0.15" />
        <circle cx="250" cy="320" r="1.5" fill="white" opacity="0.2" />
        <circle cx="550" cy="90" r="1.5" fill="white" opacity="0.15" />

        <text x="400" y="360" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="system-ui">The #1 most popular flavour category — ranked and reviewed</text>
      </svg>
    ),
  },
  {
    id: 'safety',
    article: 'are-nicotine-pouches-safe',
    title: 'Are Nicotine Pouches Safe?',
    description: 'Shield with checkmark surrounded by scientific data points',
    svg: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="400" fill="#0c1018" />

        {/* Central shield */}
        <g transform="translate(400, 190)">
          <path d="M0 -90 L65 -60 L65 20 Q65 70 0 100 Q-65 70 -65 20 L-65 -60 Z" fill="#1e293b" stroke="#a3e635" strokeWidth="2" />
          <path d="M0 -75 L52 -50 L52 15 Q52 55 0 80 Q-52 55 -52 15 L-52 -50 Z" fill="#a3e635" opacity="0.08" />
          {/* Checkmark */}
          <path d="M-20 5 L-5 20 L25 -15" stroke="#a3e635" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Data points orbiting */}
        {[
          { x: 160, y: 100, label: 'No tobacco', icon: '✓' },
          { x: 640, y: 100, label: 'No smoke', icon: '✓' },
          { x: 120, y: 280, label: 'No tar', icon: '✓' },
          { x: 680, y: 280, label: 'No CO', icon: '✓' },
        ].map((point, i) => (
          <g key={i}>
            <circle cx={point.x} cy={point.y} r="28" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            <text x={point.x} y={point.y - 2} textAnchor="middle" fontSize="16" fill="#a3e635" fontFamily="system-ui">{point.icon}</text>
            <text x={point.x} y={point.y + 44} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily="system-ui">{point.label}</text>
            {/* Connecting line to center */}
            <line x1={point.x} y1={point.y} x2="400" y2="190" stroke="#334155" strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
          </g>
        ))}

        <text x="400" y="50" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="system-ui" letterSpacing="2">EVIDENCE-BASED SAFETY OVERVIEW</text>
        <text x="400" y="370" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="system-ui">Based on published research and public health agency assessments</text>
      </svg>
    ),
  },
  {
    id: 'flavour-guide',
    article: 'nicotine-pouch-flavour-guide',
    title: 'Nicotine Pouch Flavour Guide',
    description: 'Flavour wheel with colour-coded segments for each flavour family',
    svg: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="400" fill="#0c1018" />

        {/* Flavour wheel */}
        <g transform="translate(400, 200)">
          {[
            { angle: 0, color: '#86efac', label: 'Mint', desc: 'Cool & fresh' },
            { angle: 45, color: '#f87171', label: 'Berry', desc: 'Sweet & fruity' },
            { angle: 90, color: '#fbbf24', label: 'Citrus', desc: 'Bright & tangy' },
            { angle: 135, color: '#fb923c', label: 'Tropical', desc: 'Exotic & sweet' },
            { angle: 180, color: '#a78bfa', label: 'Coffee', desc: 'Rich & warm' },
            { angle: 225, color: '#1e293b', label: 'Tobacco', desc: 'Classic & earthy' },
            { angle: 270, color: '#38bdf8', label: 'Ice', desc: 'Pure cooling' },
            { angle: 315, color: '#f472b6', label: 'Floral', desc: 'Delicate & soft' },
          ].map((segment, i) => {
            const startAngle = (segment.angle - 22.5) * Math.PI / 180;
            const endAngle = (segment.angle + 22.5) * Math.PI / 180;
            const r = 120;
            const labelR = 150;
            const x1 = Math.cos(startAngle) * r;
            const y1 = Math.sin(startAngle) * r;
            const x2 = Math.cos(endAngle) * r;
            const y2 = Math.sin(endAngle) * r;
            const labelX = Math.cos(segment.angle * Math.PI / 180) * labelR;
            const labelY = Math.sin(segment.angle * Math.PI / 180) * labelR;

            return (
              <g key={i}>
                <path
                  d={`M0 0 L${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                  fill={segment.color}
                  opacity={0.15}
                  stroke={segment.color}
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
                <text
                  x={labelX}
                  y={labelY - 4}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill={segment.color}
                  fontFamily="system-ui"
                >
                  {segment.label}
                </text>
                <text
                  x={labelX}
                  y={labelY + 10}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#64748b"
                  fontFamily="system-ui"
                >
                  {segment.desc}
                </text>
              </g>
            );
          })}

          {/* Center label */}
          <circle cx="0" cy="0" r="35" fill="#161d2b" stroke="#334155" strokeWidth="1" />
          <text x="0" y="-4" textAnchor="middle" fontSize="10" fontWeight="600" fill="#f1f5f9" fontFamily="system-ui">FLAVOUR</text>
          <text x="0" y="10" textAnchor="middle" fontSize="10" fontWeight="600" fill="#f1f5f9" fontFamily="system-ui">WHEEL</text>
        </g>
      </svg>
    ),
  },
  {
    id: 'switching',
    article: 'switching-from-cigarettes-to-nicotine-pouches',
    title: 'Switching from Cigarettes',
    description: 'Broken cigarette transforming into a clean pouch — journey visual',
    svg: (
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="400" fill="#0c1018" />

        {/* Journey path */}
        <path d="M100 200 Q250 200 400 200 Q550 200 700 200" stroke="#334155" strokeWidth="2" strokeDasharray="8 4" />

        {/* Start: Cigarette (fading/breaking) */}
        <g transform="translate(100, 160)">
          <rect x="0" y="20" width="80" height="10" rx="2" fill="#fef3c7" opacity="0.5" />
          <rect x="0" y="20" width="18" height="10" rx="2" fill="#f97316" opacity="0.5" />
          {/* Break crack */}
          <line x1="50" y1="18" x2="55" y2="32" stroke="#ef4444" strokeWidth="2" />
          {/* Smoke fading */}
          <path d="M85 20 Q88 12 86 5" stroke="#64748b" strokeWidth="1" fill="none" opacity="0.2" />
          {/* Red X */}
          <circle cx="40" cy="25" r="20" fill="#ef4444" opacity="0.1" />
          <line x1="28" y1="13" x2="52" y2="37" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          <line x1="52" y1="13" x2="28" y2="37" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          <text x="40" y="70" textAnchor="middle" fontSize="11" fill="#ef4444" fontFamily="system-ui">Before</text>
        </g>

        {/* Middle: Transformation arrow */}
        <g transform="translate(320, 175)">
          {/* Gradient arrow */}
          <path d="M0 25 L120 25" stroke="url(#sw-arrow)" strokeWidth="3" />
          <path d="M110 18 L125 25 L110 32" fill="none" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <text x="60" y="55" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="system-ui">Your journey</text>
        </g>
        <defs>
          <linearGradient id="sw-arrow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" opacity="0.5" />
            <stop offset="100%" stopColor="#a3e635" />
          </linearGradient>
        </defs>

        {/* End: Clean pouch with green glow */}
        <g transform="translate(580, 155)">
          <circle cx="40" cy="30" r="45" fill="#a3e635" opacity="0.05" />
          <circle cx="40" cy="30" r="30" fill="#a3e635" opacity="0.08" />
          <ellipse cx="40" cy="30" rx="30" ry="14" fill="white" />
          <text x="40" y="34" textAnchor="middle" fontSize="8" fill="#64748b" fontFamily="system-ui">NICOTINE POUCH</text>
          {/* Green check */}
          <circle cx="40" cy="-10" r="12" fill="#a3e635" />
          <path d="M34 -10 L38 -6 L47 -15" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <text x="40" y="70" textAnchor="middle" fontSize="11" fill="#a3e635" fontFamily="system-ui">After</text>
        </g>

        {/* Benefits along the path */}
        <g transform="translate(250, 260)">
          {[
            'Week 1: Taste improves',
            'Week 2: Breathing easier',
            'Month 1: Energy returns',
            'Month 3: Cigarette-free',
          ].map((text, i) => (
            <g key={i} transform={`translate(${i * 130}, 0)`}>
              <circle cx="0" cy="10" r="4" fill={i < 2 ? '#facc15' : '#a3e635'} opacity="0.6" />
              <text x="0" y="30" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="system-ui">{text}</text>
            </g>
          ))}
        </g>

        <text x="400" y="370" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="system-ui">Thousands have made the switch — here's how to do it right</text>
      </svg>
    ),
  },
];

/* ================================================================
   GALLERY
   ================================================================ */
export default function BlogIllustrations() {
  const [selected, setSelected] = useState(0);

  return (
    <div style={{ background: '#0c1018', color: '#f1f5f9', minHeight: '100vh', padding: '32px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Blog Article Illustrations</h1>
        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>10 custom SVG hero banners for the highest-value blog articles. 800×400, dark theme, brand-consistent.</p>

        {/* Thumbnail strip */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
          {ILLUSTRATIONS.map((ill, i) => (
            <button
              key={ill.id}
              onClick={() => setSelected(i)}
              style={{
                flex: '0 0 auto',
                width: 120,
                padding: '8px',
                borderRadius: 8,
                border: `2px solid ${selected === i ? '#a3e635' : '#1e293b'}`,
                background: selected === i ? '#1e293b' : '#161d2b',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div style={{ width: '100%', aspectRatio: '2', marginBottom: 4, borderRadius: 4, overflow: 'hidden' }}>
                {ill.svg}
              </div>
              <div style={{ fontSize: 10, color: selected === i ? '#a3e635' : '#94a3b8', lineHeight: 1.3 }}>{ill.title}</div>
            </button>
          ))}
        </div>

        {/* Selected illustration preview */}
        <div style={{ background: '#161d2b', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ width: '100%', aspectRatio: '2', borderRadius: 8, overflow: 'hidden' }}>
            {ILLUSTRATIONS[selected].svg}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{ILLUSTRATIONS[selected].title}</h2>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>{ILLUSTRATIONS[selected].description}</p>
            <code style={{ fontSize: 11, color: '#64748b', background: '#0c1018', padding: '2px 6px', borderRadius: 4 }}>
              /blog/{ILLUSTRATIONS[selected].article}
            </code>
          </div>
          <div style={{ fontSize: 11, color: '#64748b', textAlign: 'right' }}>
            <div>800 × 400 SVG</div>
            <div>~2KB each</div>
          </div>
        </div>

        {/* Implementation notes */}
        <div style={{ marginTop: 32, padding: 20, background: '#161d2b', borderRadius: 12, border: '1px solid #1e293b' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Implementation</h3>
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>
            <p>Export each SVG as a standalone file to <code style={{ background: '#0c1018', padding: '1px 4px', borderRadius: 4 }}>public/images/blog/</code>. Reference in the Astro frontmatter as <code style={{ background: '#0c1018', padding: '1px 4px', borderRadius: 4 }}>heroImage</code>. Each SVG is self-contained with no external dependencies. Convert text elements to <code style={{ background: '#0c1018', padding: '1px 4px', borderRadius: 4 }}>&lt;path&gt;</code> before production to avoid font rendering differences.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
