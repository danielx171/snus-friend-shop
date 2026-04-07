import React, { useState } from 'react';

/* ================================================================
   OG SOCIAL IMAGES — BLOG POSTS
   1200×630 each. Dark theme (#0c1018 → #161d2b).
   Accent: #a3e635 (lime green) or category-specific colour.

   Template pattern:
   - Left 60%: title (large), subtitle/description, category pill
   - Right 40%: category icon/illustration (abstract SVG)
   - Bottom bar: snusfriends.com watermark + reading time
   - Green accent line at top

   All 50 blog articles covered. Click thumbnails to preview full-size.
   ================================================================ */

const CATEGORY_COLORS = {
  'Guide': '#a3e635',
  'Best Of': '#fbbf24',
  'Comparison': '#38bdf8',
  'Health': '#22c55e',
  'Brand Guide': '#a855f7',
  'Safety': '#ef4444',
  'Legal': '#64748b',
  'Review': '#f97316',
  'Flavour': '#ec4899',
  'Strength': '#f97316',
};

const CATEGORY_ICONS = {
  'Guide': (color) => (
    <g>
      <rect x="20" y="15" width="60" height="75" rx="4" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
      <line x1="32" y1="35" x2="68" y2="35" stroke={color} strokeWidth="2" opacity="0.5" />
      <line x1="32" y1="48" x2="60" y2="48" stroke={color} strokeWidth="2" opacity="0.4" />
      <line x1="32" y1="61" x2="65" y2="61" stroke={color} strokeWidth="2" opacity="0.3" />
      <path d="M38 22 L50 22" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  'Best Of': (color) => (
    <g>
      <path d="M50 10 L56 30 L78 30 L60 42 L66 62 L50 50 L34 62 L40 42 L22 30 L44 30 Z" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5" />
      <text x="50" y="42" textAnchor="middle" fontSize="16" fontWeight="700" fill={color} fontFamily="system-ui">#1</text>
    </g>
  ),
  'Comparison': (color) => (
    <g>
      <circle cx="35" cy="45" r="25" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      <circle cx="65" cy="45" r="25" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      <text x="50" y="50" textAnchor="middle" fontSize="12" fontWeight="700" fill={color} fontFamily="system-ui">VS</text>
    </g>
  ),
  'Health': (color) => (
    <g>
      <path d="M50 15 L60 35 L80 35 L65 50 L70 70 L50 58 L30 70 L35 50 L20 35 L40 35 Z" fill="none" stroke={color} strokeWidth="1.5" />
      <path d="M42 40 L48 46 L58 34" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  ),
  'Brand Guide': (color) => (
    <g>
      <ellipse cx="50" cy="50" rx="35" ry="10" fill={color} opacity="0.15" />
      <rect x="30" y="20" width="40" height="30" rx="4" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
      <ellipse cx="50" cy="20" rx="20" ry="6" fill={color} opacity="0.2" />
    </g>
  ),
  'Safety': (color) => (
    <g>
      <path d="M50 10 L75 25 L75 55 Q75 75 50 85 Q25 75 25 55 L25 25 Z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      <path d="M40 48 L48 56 L62 40" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  ),
  'Flavour': (color) => (
    <g>
      <path d="M50 15 Q30 30 35 50 Q38 65 50 70 Q62 65 65 50 Q70 30 50 15" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
      <line x1="50" y1="20" x2="50" y2="65" stroke={color} strokeWidth="1" opacity="0.3" />
    </g>
  ),
  'Review': (color) => (
    <g>
      {[0,1,2,3,4].map(i => (
        <path key={i} d={`M${20+i*15} 40 L${22+i*15} 46 L${28+i*15} 46 L${23+i*15} 50 L${25+i*15} 56 L${20+i*15} 52 L${15+i*15} 56 L${17+i*15} 50 L${12+i*15} 46 L${18+i*15} 46 Z`} fill={i < 4 ? color : 'none'} stroke={color} strokeWidth="1" opacity={i < 4 ? 0.3 : 0.15} />
      ))}
    </g>
  ),
  'Strength': (color) => (
    <g>
      <rect x="15" y="60" width="12" height="20" rx="2" fill={color} opacity="0.15" />
      <rect x="32" y="45" width="12" height="35" rx="2" fill={color} opacity="0.2" />
      <rect x="49" y="30" width="12" height="50" rx="2" fill={color} opacity="0.25" />
      <rect x="66" y="15" width="12" height="65" rx="2" fill={color} opacity="0.3" />
    </g>
  ),
  'Legal': (color) => (
    <g>
      <rect x="25" y="15" width="50" height="65" rx="3" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      <line x1="35" y1="30" x2="65" y2="30" stroke={color} strokeWidth="2" opacity="0.3" />
      <line x1="35" y1="42" x2="58" y2="42" stroke={color} strokeWidth="1.5" opacity="0.25" />
      <line x1="35" y1="52" x2="62" y2="52" stroke={color} strokeWidth="1.5" opacity="0.2" />
      <circle cx="50" cy="68" r="5" fill={color} opacity="0.2" />
    </g>
  ),
};

const BLOG_OG = [
  // Best-of lists
  { slug: 'best-nicotine-pouches-2026', title: 'Best Nicotine Pouches 2026', subtitle: 'Expert-tested rankings across all brands', category: 'Best Of', readTime: '12 min' },
  { slug: 'best-nicotine-pouches-for-beginners-2026', title: 'Best Pouches for Beginners 2026', subtitle: 'Start here if you\'re new to nicotine pouches', category: 'Best Of', readTime: '10 min' },
  { slug: 'best-mint-nicotine-pouches-2026', title: 'Best Mint Nicotine Pouches 2026', subtitle: 'The #1 flavour category, ranked and reviewed', category: 'Best Of', readTime: '8 min' },
  { slug: 'best-berry-nicotine-pouches', title: 'Best Berry Nicotine Pouches', subtitle: 'Sweet, fruity, and surprisingly complex', category: 'Best Of', readTime: '7 min' },
  { slug: 'best-citrus-nicotine-pouches', title: 'Best Citrus Nicotine Pouches', subtitle: 'Bright, tangy flavours that wake you up', category: 'Best Of', readTime: '7 min' },
  { slug: 'best-coffee-nicotine-pouches', title: 'Best Coffee Nicotine Pouches', subtitle: 'Rich, warm flavours for coffee lovers', category: 'Best Of', readTime: '6 min' },
  { slug: 'best-strong-nicotine-pouches', title: 'Best Strong Nicotine Pouches', subtitle: 'For experienced users who need 12mg+', category: 'Best Of', readTime: '9 min' },
  { slug: 'best-slim-nicotine-pouches', title: 'Best Slim Nicotine Pouches', subtitle: 'Discreet format, maximum comfort', category: 'Best Of', readTime: '7 min' },
  { slug: 'best-budget-nicotine-pouches', title: 'Best Budget Nicotine Pouches', subtitle: 'Quality without the premium price tag', category: 'Best Of', readTime: '8 min' },
  { slug: 'best-nicotine-pouches-all-day-use', title: 'Best Pouches for All-Day Use', subtitle: 'Mild enough to use from morning to night', category: 'Best Of', readTime: '7 min' },
  { slug: 'best-nicotine-pouches-for-women', title: 'Best Nicotine Pouches for Women', subtitle: 'Slim formats and refined flavours', category: 'Best Of', readTime: '8 min' },
  { slug: 'best-nicotine-pouches-no-aftertaste', title: 'Best Pouches With No Aftertaste', subtitle: 'Clean finish, no lingering flavour', category: 'Best Of', readTime: '6 min' },
  { slug: 'strongest-nicotine-pouches-ranked-2026', title: 'Strongest Nicotine Pouches 2026', subtitle: 'From 16mg to 50mg — ranked by strength', category: 'Strength', readTime: '10 min' },
  { slug: 'all-velo-flavors-ranked-2026', title: 'All VELO Flavours Ranked 2026', subtitle: 'Every VELO variant tested and scored', category: 'Review', readTime: '12 min' },
  { slug: 'strongest-snus-brands-compared-beginners-warning', title: 'Strongest Snus Brands Compared', subtitle: 'A warning for beginners — and a guide for veterans', category: 'Strength', readTime: '11 min' },

  // Guides
  { slug: 'how-to-use-nicotine-pouches', title: 'How to Use Nicotine Pouches', subtitle: 'Step-by-step beginner\'s guide', category: 'Guide', readTime: '8 min' },
  { slug: 'how-to-choose-your-strength', title: 'How to Choose Your Strength', subtitle: 'From light to ultra-strong — find your level', category: 'Guide', readTime: '9 min' },
  { slug: 'nicotine-pouch-flavour-guide', title: 'Nicotine Pouch Flavour Guide', subtitle: 'Every flavour family explained', category: 'Flavour', readTime: '10 min' },
  { slug: 'nicotine-pouch-buying-guide-europe', title: 'Buying Guide: Europe', subtitle: 'Where to buy, shipping, and regulations by country', category: 'Guide', readTime: '12 min' },
  { slug: 'how-to-store-nicotine-pouches', title: 'How to Store Nicotine Pouches', subtitle: 'Keep them fresh for months', category: 'Guide', readTime: '5 min' },
  { slug: 'how-to-spot-fake-nicotine-pouches', title: 'How to Spot Fake Pouches', subtitle: 'Counterfeit detection guide', category: 'Guide', readTime: '7 min' },
  { slug: 'nicotine-pouch-subscription-guide', title: 'Subscription Guide', subtitle: 'Save 10-15% with auto-delivery', category: 'Guide', readTime: '6 min' },
  { slug: 'how-long-do-nicotine-pouches-last', title: 'How Long Do Pouches Last?', subtitle: 'Duration, shelf life, and freshness', category: 'Guide', readTime: '6 min' },
  { slug: 'how-much-do-nicotine-pouches-cost', title: 'How Much Do Pouches Cost?', subtitle: 'Price breakdown by brand and country', category: 'Guide', readTime: '7 min' },
  { slug: 'switching-from-cigarettes-to-nicotine-pouches', title: 'Switching from Cigarettes', subtitle: 'Your step-by-step transition guide', category: 'Guide', readTime: '11 min' },
  { slug: 'best-nicotine-pouches-for-quitting-smoking', title: 'Pouches for Quitting Smoking', subtitle: 'The most effective products for switching', category: 'Guide', readTime: '9 min' },

  // Health & safety
  { slug: 'are-nicotine-pouches-safe', title: 'Are Nicotine Pouches Safe?', subtitle: 'Evidence-based health guide', category: 'Health', readTime: '12 min' },
  { slug: 'are-zyns-bad-for-you', title: 'Are ZYNs Bad for You?', subtitle: 'Clinical evidence and health effects', category: 'Health', readTime: '14 min' },
  { slug: 'how-many-nicotine-pouches-a-day', title: 'How Many Pouches a Day?', subtitle: 'Safe dosing guide and tapering strategies', category: 'Health', readTime: '15 min' },
  { slug: 'nicotine-pouch-side-effects', title: 'Nicotine Pouch Side Effects', subtitle: 'What to expect and how to manage them', category: 'Health', readTime: '10 min' },
  { slug: 'nicotine-pouch-ingredients-explained', title: 'Ingredients Explained', subtitle: 'What\'s actually inside a nicotine pouch?', category: 'Health', readTime: '8 min' },
  { slug: 'can-you-swallow-nicotine-pouches', title: 'Can You Swallow a Pouch?', subtitle: 'What happens and what to do', category: 'Safety', readTime: '5 min' },

  // Comparisons
  { slug: 'nicotine-pouches-vs-vaping', title: 'Pouches vs Vaping', subtitle: 'Health, cost, and convenience compared', category: 'Comparison', readTime: '10 min' },
  { slug: 'nicotine-pouches-vs-cigarettes', title: 'Pouches vs Cigarettes', subtitle: 'Why switching matters for your health', category: 'Comparison', readTime: '9 min' },
  { slug: 'nicotine-pouches-vs-snus', title: 'Pouches vs Snus', subtitle: 'Tobacco-free vs traditional — key differences', category: 'Comparison', readTime: '8 min' },
  { slug: 'nicotine-pouches-vs-gum-vs-lozenges', title: 'Pouches vs Gum vs Lozenges', subtitle: 'Oral nicotine products compared', category: 'Comparison', readTime: '9 min' },
  { slug: 'loop-vs-skruf', title: 'LOOP vs Skruf', subtitle: 'Two Swedish favourites head to head', category: 'Comparison', readTime: '8 min' },

  // Brand guides
  { slug: 'zyn-nicotine-pouches-complete-guide', title: 'ZYN: Complete Guide', subtitle: 'The world\'s #1 nicotine pouch brand', category: 'Brand Guide', readTime: '15 min' },
  { slug: 'velo-nicotine-pouches-complete-guide', title: 'VELO: Complete Guide', subtitle: 'BAT\'s design-forward challenger', category: 'Brand Guide', readTime: '14 min' },
  { slug: 'loop-nicotine-pouches-complete-guide', title: 'LOOP: Complete Guide', subtitle: 'Sweden\'s boldest flavour innovator', category: 'Brand Guide', readTime: '12 min' },
  { slug: 'skruf-nicotine-pouches-complete-guide', title: 'Skruf: Complete Guide', subtitle: 'Heritage Swedish craftsmanship', category: 'Brand Guide', readTime: '11 min' },
  { slug: 'pablo-nicotine-pouches-complete-guide', title: 'Pablo: Complete Guide', subtitle: 'Europe\'s ultra-strong specialist', category: 'Brand Guide', readTime: '10 min' },
  { slug: 'nordic-spirit-nicotine-pouches-complete-guide', title: 'Nordic Spirit: Complete Guide', subtitle: 'JTI\'s accessible everyday pouch', category: 'Brand Guide', readTime: '10 min' },
  { slug: 'iceberg-nicotine-pouches-complete-guide', title: 'Iceberg: Complete Guide', subtitle: 'Maximum cooling sensation', category: 'Brand Guide', readTime: '9 min' },
  { slug: 'siberia-nicotine-pouches-complete-guide', title: 'Siberia: Complete Guide', subtitle: 'The original ultra-strong legend', category: 'Brand Guide', readTime: '10 min' },
  { slug: 'on-nicotine-pouches-complete-guide', title: 'ON!: Complete Guide', subtitle: 'Altria\'s ultra-discreet mini format', category: 'Brand Guide', readTime: '9 min' },
  { slug: 'fumi-nicotine-pouches-complete-guide', title: 'Fumi: Complete Guide', subtitle: 'Swedish Match\'s premium lifestyle brand', category: 'Brand Guide', readTime: '9 min' },
  { slug: 'klar-nicotine-pouches-complete-guide', title: 'KLAR: Complete Guide', subtitle: 'Finnish clarity and simplicity', category: 'Brand Guide', readTime: '8 min' },

  // Legal / regulatory
  { slug: 'nicotine-pouches-legal-europe-2026', title: 'Legal Status in Europe 2026', subtitle: 'Country-by-country regulation guide', category: 'Legal', readTime: '13 min' },
  { slug: 'nicotine-pouch-tax-regulations-2026', title: 'Tax & Regulations 2026', subtitle: 'TPD3, taxes, and what\'s changing', category: 'Legal', readTime: '10 min' },

  // Review
  { slug: 'rave-nicotine-pouches-review', title: 'RAVE Nicotine Pouches Review', subtitle: 'Energy-drink-inspired strong pouches', category: 'Review', readTime: '7 min' },
];

/* ================================================================
   OG IMAGE TEMPLATE COMPONENT
   ================================================================ */
function OGImage({ title, subtitle, category, readTime, slug }) {
  const color = CATEGORY_COLORS[category] || '#a3e635';
  const IconFn = CATEGORY_ICONS[category] || CATEGORY_ICONS['Guide'];

  return (
    <svg viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id={`bg-${slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0c1018" />
          <stop offset="100%" stopColor="#161d2b" />
        </linearGradient>
        <clipPath id={`clip-${slug}`}>
          <rect width="1200" height="630" rx="0" />
        </clipPath>
      </defs>

      {/* Background */}
      <rect width="1200" height="630" fill={`url(#bg-${slug})`} />

      {/* Top accent bar */}
      <rect x="0" y="0" width="1200" height="4" fill={color} />

      {/* Category icon area (right side) */}
      <g transform="translate(850, 140) scale(3.2)" opacity="0.6">
        {IconFn(color)}
      </g>

      {/* Category pill */}
      <rect x="80" y="160" width={category.length * 14 + 24} height="32" rx="16" fill={color} opacity="0.15" stroke={color} strokeWidth="1" />
      <text x={80 + (category.length * 14 + 24) / 2} y="181" textAnchor="middle" fontSize="14" fontWeight="600" fill={color} fontFamily="Inter, system-ui, sans-serif">{category.toUpperCase()}</text>

      {/* Title */}
      <text x="80" y="260" fontSize="48" fontWeight="700" fill="#f1f5f9" fontFamily="Inter, system-ui, sans-serif">
        {title.length > 32 ? (
          <>
            <tspan x="80" dy="0">{title.substring(0, title.lastIndexOf(' ', 32))}</tspan>
            <tspan x="80" dy="58">{title.substring(title.lastIndexOf(' ', 32) + 1)}</tspan>
          </>
        ) : title}
      </text>

      {/* Subtitle */}
      <text x="80" y={title.length > 32 ? 380 : 320} fontSize="22" fill="#94a3b8" fontFamily="Inter, system-ui, sans-serif">{subtitle}</text>

      {/* Bottom bar */}
      <rect x="0" y="570" width="1200" height="60" fill="#0a0e15" />
      <text x="80" y="605" fontSize="16" fontWeight="600" fill="#a3e635" fontFamily="Inter, system-ui, sans-serif">snusfriends.com</text>
      <text x="280" y="605" fontSize="14" fill="#64748b" fontFamily="Inter, system-ui, sans-serif">•</text>
      <text x="300" y="605" fontSize="14" fill="#64748b" fontFamily="Inter, system-ui, sans-serif">{readTime} read</text>

      {/* Subtle grid pattern */}
      <line x1="700" y1="100" x2="700" y2="530" stroke="#1e293b" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

/* ================================================================
   GALLERY
   ================================================================ */
export default function OGBlogGallery() {
  const [selected, setSelected] = useState(0);
  const [filterCat, setFilterCat] = useState('All');

  const categories = ['All', ...new Set(BLOG_OG.map(b => b.category))];
  const filtered = filterCat === 'All' ? BLOG_OG : BLOG_OG.filter(b => b.category === filterCat);

  return (
    <div style={{ background: '#0c1018', color: '#f1f5f9', minHeight: '100vh', padding: 32, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>OG Social Images — Blog Posts</h1>
        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>{BLOG_OG.length} images total. 1200×630 SVG, dark theme. Click any thumbnail to preview full-size.</p>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => { setFilterCat(cat); setSelected(0); }} style={{
              padding: '5px 12px', borderRadius: 16, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              border: `1px solid ${filterCat === cat ? (CATEGORY_COLORS[cat] || '#a3e635') : '#334155'}`,
              background: filterCat === cat ? `${CATEGORY_COLORS[cat] || '#a3e635'}15` : 'transparent',
              color: filterCat === cat ? (CATEGORY_COLORS[cat] || '#a3e635') : '#94a3b8',
            }}>
              {cat} {cat !== 'All' && `(${BLOG_OG.filter(b => b.category === cat).length})`}
            </button>
          ))}
        </div>

        {/* Preview */}
        {filtered.length > 0 && (
          <div style={{ background: '#161d2b', borderRadius: 12, padding: 12, marginBottom: 16 }}>
            <OGImage {...filtered[selected < filtered.length ? selected : 0]} />
          </div>
        )}

        {/* Info */}
        {filtered.length > 0 && (
          <div style={{ marginBottom: 24, fontSize: 13 }}>
            <span style={{ color: '#94a3b8' }}>/blog/{filtered[selected < filtered.length ? selected : 0].slug}</span>
            <span style={{ color: '#334155', margin: '0 8px' }}>•</span>
            <span style={{ color: '#64748b' }}>1200×630 SVG → export as PNG for &lt;meta property="og:image"&gt;</span>
          </div>
        )}

        {/* Thumbnail grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
          {filtered.map((og, i) => (
            <button key={og.slug} onClick={() => setSelected(i)} style={{
              background: selected === i ? '#1e293b' : '#161d2b', borderRadius: 8, padding: 6, cursor: 'pointer',
              border: `2px solid ${selected === i ? (CATEGORY_COLORS[og.category] || '#a3e635') : '#1e293b'}`,
              textAlign: 'left',
            }}>
              <div style={{ width: '100%', aspectRatio: '1200/630', borderRadius: 4, overflow: 'hidden', marginBottom: 4 }}>
                <OGImage {...og} />
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.3 }}>{og.title}</div>
            </button>
          ))}
        </div>

        {/* Implementation notes */}
        <div style={{ marginTop: 32, padding: 20, background: '#161d2b', borderRadius: 12, border: '1px solid #1e293b', fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 8 }}>Implementation</h3>
          <p>Export each SVG as a 1200×630 PNG using a headless browser or sharp/resvg. Save to <code style={{ background: '#0c1018', padding: '1px 4px', borderRadius: 4 }}>public/images/og/blog/</code>. Add to each article's frontmatter as <code style={{ background: '#0c1018', padding: '1px 4px', borderRadius: 4 }}>&lt;meta property="og:image" content="/images/og/blog/{'{'slug{'}'}.png" /&gt;</code>. File names: <code style={{ background: '#0c1018', padding: '1px 4px', borderRadius: 4 }}>{'{'slug{'}'}.png</code>. Total ~50 images at ~30-50KB each ≈ 2MB.</p>
        </div>
      </div>
    </div>
  );
}
