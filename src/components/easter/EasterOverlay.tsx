import { useState, useEffect } from 'react';

// Detect reduced-motion preference without framer-motion dependency
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

// Individual decorative egg SVGs with distinct patterns
function Egg({ color, pattern, size = 64 }: { color: string; pattern: 'stripes' | 'dots' | 'zigzag' | 'diamonds' | 'flowers' | 'waves'; size?: number }) {
  const id = `egg-${color.replace('#', '')}-${pattern}`;
  const w = size;
  const h = Math.round(size * 1.3);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={`clip-${id}`}>
          <ellipse cx={w / 2} cy={h / 2} rx={w / 2 - 1} ry={h / 2 - 1} />
        </clipPath>
      </defs>
      {/* Base fill */}
      <ellipse cx={w / 2} cy={h / 2} rx={w / 2 - 1} ry={h / 2 - 1} fill={color} />

      {/* Patterns */}
      <g clipPath={`url(#clip-${id})`}>
        {pattern === 'stripes' && (
          <>
            <rect x="0" y={h * 0.35} width={w} height={h * 0.08} fill="white" opacity="0.55" />
            <rect x="0" y={h * 0.52} width={w} height={h * 0.06} fill="white" opacity="0.4" />
            <rect x="0" y={h * 0.66} width={w} height={h * 0.05} fill="white" opacity="0.35" />
          </>
        )}
        {pattern === 'dots' && (
          <>
            {[
              [w*0.25, h*0.3], [w*0.6, h*0.28], [w*0.15, h*0.5], [w*0.5, h*0.48],
              [w*0.78, h*0.45], [w*0.3, h*0.68], [w*0.65, h*0.66], [w*0.45, h*0.82],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={w * 0.06} fill="white" opacity="0.5" />
            ))}
          </>
        )}
        {pattern === 'zigzag' && (
          <>
            <polyline
              points={`0,${h*0.38} ${w*0.15},${h*0.3} ${w*0.3},${h*0.38} ${w*0.45},${h*0.3} ${w*0.6},${h*0.38} ${w*0.75},${h*0.3} ${w},${h*0.38}`}
              fill="none" stroke="white" strokeWidth={w*0.045} opacity="0.5"
            />
            <polyline
              points={`0,${h*0.56} ${w*0.15},${h*0.48} ${w*0.3},${h*0.56} ${w*0.45},${h*0.48} ${w*0.6},${h*0.56} ${w*0.75},${h*0.48} ${w},${h*0.56}`}
              fill="none" stroke="white" strokeWidth={w*0.035} opacity="0.4"
            />
          </>
        )}
        {pattern === 'diamonds' && (
          <>
            {[
              [w*0.5, h*0.25], [w*0.25, h*0.5], [w*0.75, h*0.5], [w*0.5, h*0.72],
            ].map(([cx, cy], i) => (
              <polygon
                key={i}
                points={`${cx},${cy - w*0.08} ${cx + w*0.08},${cy} ${cx},${cy + w*0.08} ${cx - w*0.08},${cy}`}
                fill="white" opacity="0.45"
              />
            ))}
          </>
        )}
        {pattern === 'flowers' && (
          <>
            {[[w*0.5, h*0.35], [w*0.25, h*0.6], [w*0.72, h*0.62]].map(([cx, cy], fi) => (
              <g key={fi}>
                {[0, 60, 120, 180, 240, 300].map((deg, pi) => {
                  const rad = (deg * Math.PI) / 180;
                  const px = cx + Math.cos(rad) * w * 0.075;
                  const py = cy + Math.sin(rad) * w * 0.075;
                  return <circle key={pi} cx={px} cy={py} r={w * 0.045} fill="white" opacity="0.45" />;
                })}
                <circle cx={cx} cy={cy} r={w * 0.04} fill="white" opacity="0.6" />
              </g>
            ))}
          </>
        )}
        {pattern === 'waves' && (
          <>
            <path
              d={`M0,${h*0.4} Q${w*0.25},${h*0.32} ${w*0.5},${h*0.4} Q${w*0.75},${h*0.48} ${w},${h*0.4}`}
              fill="none" stroke="white" strokeWidth={w*0.04} opacity="0.5"
            />
            <path
              d={`M0,${h*0.57} Q${w*0.25},${h*0.49} ${w*0.5},${h*0.57} Q${w*0.75},${h*0.65} ${w},${h*0.57}`}
              fill="none" stroke="white" strokeWidth={w*0.035} opacity="0.4"
            />
          </>
        )}
      </g>

      {/* Shine */}
      <ellipse cx={w * 0.35} cy={h * 0.28} rx={w * 0.1} ry={h * 0.06} fill="white" opacity="0.3" />

      {/* Border */}
      <ellipse cx={w / 2} cy={h / 2} rx={w / 2 - 1} ry={h / 2 - 1} fill="none" stroke="white" strokeWidth="1.5" opacity="0.25" />
    </svg>
  );
}

// Cute bunny peeking from the side
function BunnySide({ side }: { side: 'left' | 'right' }) {
  const flip = side === 'right';
  return (
    <svg
      width="72" height="110"
      viewBox="0 0 72 110"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      {/* Left ear */}
      <ellipse cx="22" cy="30" rx="9" ry="26" fill="#f9d0e0" />
      <ellipse cx="22" cy="30" rx="5" ry="20" fill="#f4a6c0" />
      {/* Right ear */}
      <ellipse cx="42" cy="24" rx="9" ry="28" fill="#f9d0e0" />
      <ellipse cx="42" cy="24" rx="5" ry="22" fill="#f4a6c0" />
      {/* Head */}
      <ellipse cx="32" cy="72" rx="26" ry="24" fill="#fde8f0" />
      {/* Face details */}
      <circle cx="24" cy="68" r="4" fill="#333" />
      <circle cx="40" cy="68" r="4" fill="#333" />
      <circle cx="25" cy="67" r="1.5" fill="white" />
      <circle cx="41" cy="67" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="32" cy="76" rx="4" ry="2.5" fill="#f4a6c0" />
      {/* Mouth */}
      <path d="M28,79 Q32,83 36,79" fill="none" stroke="#e880a0" strokeWidth="1.5" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="20" cy="75" r="5" fill="#f9bdd0" opacity="0.5" />
      <circle cx="44" cy="75" r="5" fill="#f9bdd0" opacity="0.5" />
      {/* Whiskers left */}
      <line x1="12" y1="74" x2="27" y2="76" stroke="#c0a0b0" strokeWidth="1" opacity="0.6" />
      <line x1="10" y1="78" x2="27" y2="78" stroke="#c0a0b0" strokeWidth="1" opacity="0.6" />
      {/* Whiskers right */}
      <line x1="37" y1="76" x2="52" y2="74" stroke="#c0a0b0" strokeWidth="1" opacity="0.6" />
      <line x1="37" y1="78" x2="54" y2="78" stroke="#c0a0b0" strokeWidth="1" opacity="0.6" />
      {/* Body (partially off-screen) */}
      <ellipse cx="32" cy="104" rx="22" ry="14" fill="#fde8f0" />
    </svg>
  );
}

// Egg positions — 8 eggs placed around the viewport edges
const EGG_CONFIGS = [
  // top-left corner
  { top: '80px',  left: '-8px',  rotate: '-20deg', color: '#f9a8d4', pattern: 'dots'     as const, size: 72, hideOnMobile: false },
  // top-right corner
  { top: '72px',  right: '-6px', rotate: '18deg',  color: '#a5f3fc', pattern: 'stripes'  as const, size: 68, hideOnMobile: false },
  // left edge mid
  { top: '38%',   left: '-10px', rotate: '-10deg', color: '#d8b4fe', pattern: 'flowers'  as const, size: 76, hideOnMobile: true  },
  // right edge mid
  { top: '35%',   right: '-10px',rotate: '12deg',  color: '#fde68a', pattern: 'zigzag'   as const, size: 74, hideOnMobile: true  },
  // bottom-left
  { bottom: '90px', left: '-4px', rotate: '-15deg',color: '#6ee7b7', pattern: 'waves'    as const, size: 70, hideOnMobile: false },
  // bottom-right
  { bottom: '85px', right: '-4px',rotate: '20deg', color: '#fca5a5', pattern: 'diamonds' as const, size: 70, hideOnMobile: false },
  // left side lower
  { top: '62%',   left: '-14px', rotate: '-8deg',  color: '#fbcfe8', pattern: 'stripes'  as const, size: 64, hideOnMobile: true  },
  // right side lower
  { top: '60%',   right: '-14px',rotate: '10deg',  color: '#bef264', pattern: 'dots'     as const, size: 64, hideOnMobile: true  },
];

export function EasterOverlay() {
  const reducedMotion = usePrefersReducedMotion();
  const [wiggling, setWiggling] = useState(!reducedMotion);
  const [showBanner, setShowBanner] = useState(true);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bunniesVisible, setBunniesVisible] = useState(false);

  useEffect(() => {
    // Fade in banner
    const bannerTimer = setTimeout(() => setBannerVisible(true), 200);
    // Auto-hide banner after 5.5s
    const hideTimer = setTimeout(() => setBannerVisible(false), 5500);
    const removeTimer = setTimeout(() => setShowBanner(false), 6800);
    // Stop wiggling after 2.8s
    const wiggleTimer = setTimeout(() => setWiggling(false), 2800);
    // Fade in bunnies after 0.5s
    const bunnyTimer = setTimeout(() => setBunniesVisible(true), 500);

    return () => {
      clearTimeout(bannerTimer);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
      clearTimeout(wiggleTimer);
      clearTimeout(bunnyTimer);
    };
  }, []);

  return (
    <>
      {/* Easter eggs */}
      {EGG_CONFIGS.map((cfg, i) => (
        <div
          key={i}
          className={[
            'fixed pointer-events-none z-[40] select-none',
            cfg.hideOnMobile ? 'hidden md:block' : '',
            wiggling ? 'easter-wiggle-active' : '',
          ].join(' ')}
          style={{
            top: cfg.top,
            left: (cfg as any).left,
            right: (cfg as any).right,
            bottom: (cfg as any).bottom,
            transform: `rotate(${cfg.rotate})`,
            animationDelay: `${i * 0.12}s`,
          }}
          aria-hidden="true"
        >
          <Egg color={cfg.color} pattern={cfg.pattern} size={cfg.size} />
        </div>
      ))}

      {/* Bunny left */}
      <div
        className="fixed bottom-[160px] left-0 pointer-events-none z-[40] hidden md:block select-none transition-opacity duration-1000"
        style={{ opacity: bunniesVisible ? 1 : 0, transform: 'translateX(-18px)' }}
        aria-hidden="true"
      >
        <BunnySide side="left" />
      </div>

      {/* Bunny right */}
      <div
        className="fixed bottom-[160px] right-0 pointer-events-none z-[40] hidden md:block select-none transition-opacity duration-1000"
        style={{ opacity: bunniesVisible ? 1 : 0, transform: 'translateX(18px)' }}
        aria-hidden="true"
      >
        <BunnySide side="right" />
      </div>

      {/* Happy Easter banner */}
      {showBanner && (
        <div
          className="fixed top-[76px] left-1/2 -translate-x-1/2 z-[45] pointer-events-none select-none transition-all duration-700"
          style={{ opacity: bannerVisible ? 1 : 0, transform: `translateX(-50%) translateY(${bannerVisible ? '0px' : '-12px'})` }}
          aria-hidden="true"
        >
          <div className="flex items-center gap-2 rounded-full px-5 py-2 shadow-lg text-sm font-semibold whitespace-nowrap"
            style={{
              background: 'linear-gradient(90deg, #fda4af 0%, #fde68a 35%, #86efac 65%, #93c5fd 100%)',
              color: '#3b1f2b',
              boxShadow: '0 4px 20px rgba(253,164,175,0.45)',
            }}>
            🐣&nbsp;Happy Easter!&nbsp;🐰
          </div>
        </div>
      )}
    </>
  );
}
