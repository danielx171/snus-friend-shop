import { useState, useEffect } from 'react';

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

// ─── Egg ────────────────────────────────────────────────────────────────────
type EggPattern = 'stripes' | 'dots' | 'zigzag' | 'diamonds' | 'flowers' | 'waves' | 'checks';

function Egg({ color, pattern, size = 64 }: { color: string; pattern: EggPattern; size?: number }) {
  const id = `egg-${color.replace('#', '')}-${pattern}-${size}`;
  const w = size;
  const h = Math.round(size * 1.3);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={`clip-${id}`}>
          <ellipse cx={w / 2} cy={h / 2} rx={w / 2 - 1} ry={h / 2 - 1} />
        </clipPath>
      </defs>
      <ellipse cx={w / 2} cy={h / 2} rx={w / 2 - 1} ry={h / 2 - 1} fill={color} />
      <g clipPath={`url(#clip-${id})`}>
        {pattern === 'stripes' && (<>
          <rect x="0" y={h*0.3} width={w} height={h*0.09} fill="white" opacity="0.5" />
          <rect x="0" y={h*0.48} width={w} height={h*0.07} fill="white" opacity="0.38" />
          <rect x="0" y={h*0.64} width={w} height={h*0.06} fill="white" opacity="0.3" />
        </>)}
        {pattern === 'dots' && (<>
          {[[w*.22,h*.28],[w*.58,h*.26],[w*.12,h*.48],[w*.48,h*.46],[w*.76,h*.44],
            [w*.28,h*.66],[w*.63,h*.64],[w*.44,h*.8]].map(([cx,cy],i) => (
            <circle key={i} cx={cx} cy={cy} r={w*0.065} fill="white" opacity="0.52" />
          ))}
        </>)}
        {pattern === 'zigzag' && (<>
          <polyline points={`0,${h*.37} ${w*.18},${h*.28} ${w*.36},${h*.37} ${w*.54},${h*.28} ${w*.72},${h*.37} ${w*.9},${h*.28} ${w},${h*.32}`}
            fill="none" stroke="white" strokeWidth={w*.048} opacity="0.52" />
          <polyline points={`0,${h*.56} ${w*.18},${h*.47} ${w*.36},${h*.56} ${w*.54},${h*.47} ${w*.72},${h*.56} ${w*.9},${h*.47} ${w},${h*.51}`}
            fill="none" stroke="white" strokeWidth={w*.036} opacity="0.4" />
        </>)}
        {pattern === 'diamonds' && (<>
          {[[w*.5,h*.22],[w*.22,h*.48],[w*.78,h*.48],[w*.5,h*.73]].map(([cx,cy],i) => (
            <polygon key={i} points={`${cx},${cy-w*.09} ${cx+w*.09},${cy} ${cx},${cy+w*.09} ${cx-w*.09},${cy}`}
              fill="white" opacity="0.46" />
          ))}
        </>)}
        {pattern === 'flowers' && (<>
          {[[w*.5,h*.3],[w*.22,h*.58],[w*.75,h*.6]].map(([cx,cy],fi) => (
            <g key={fi}>
              {[0,60,120,180,240,300].map((deg,pi) => {
                const rad = deg*Math.PI/180;
                return <circle key={pi} cx={cx+Math.cos(rad)*w*.08} cy={cy+Math.sin(rad)*w*.08}
                  r={w*.048} fill="white" opacity="0.44" />;
              })}
              <circle cx={cx} cy={cy} r={w*.042} fill="white" opacity="0.62" />
            </g>
          ))}
        </>)}
        {pattern === 'waves' && (<>
          <path d={`M0,${h*.38} Q${w*.25},${h*.3} ${w*.5},${h*.38} Q${w*.75},${h*.46} ${w},${h*.38}`}
            fill="none" stroke="white" strokeWidth={w*.042} opacity="0.5" />
          <path d={`M0,${h*.56} Q${w*.25},${h*.48} ${w*.5},${h*.56} Q${w*.75},${h*.64} ${w},${h*.56}`}
            fill="none" stroke="white" strokeWidth={w*.034} opacity="0.38" />
          <path d={`M0,${h*.72} Q${w*.25},${h*.64} ${w*.5},${h*.72} Q${w*.75},${h*.8} ${w},${h*.72}`}
            fill="none" stroke="white" strokeWidth={w*.026} opacity="0.28" />
        </>)}
        {pattern === 'checks' && (<>
          {[[w*.18,h*.25],[w*.5,h*.25],[w*.18,h*.5],[w*.5,h*.5],[w*.32,h*.38],[w*.32,h*.62],[w*.64,h*.38]].map(([cx,cy],i) => (
            <rect key={i} x={cx-w*.07} y={cy-w*.07} width={w*.14} height={w*.14}
              fill="white" opacity="0.42" rx={w*.02} />
          ))}
        </>)}
      </g>
      {/* Gloss */}
      <ellipse cx={w*.34} cy={h*.26} rx={w*.1} ry={h*.06} fill="white" opacity="0.28" />
      {/* Border */}
      <ellipse cx={w/2} cy={h/2} rx={w/2-1} ry={h/2-1} fill="none" stroke="white" strokeWidth="1.5" opacity="0.22" />
    </svg>
  );
}

// ─── Bunny peeking from the side ────────────────────────────────────────────
function BunnySide({ side, scale = 1 }: { side: 'left' | 'right'; scale?: number }) {
  const flip = side === 'right';
  const w = Math.round(88 * scale);
  const h = Math.round(130 * scale);
  return (
    <svg width={w} height={h} viewBox="0 0 88 130" xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      {/* Long left ear */}
      <ellipse cx="26" cy="34" rx="11" ry="30" fill="#fce4ef" />
      <ellipse cx="26" cy="34" rx="6" ry="23" fill="#f9b8d4" />
      {/* Tall right ear (higher) */}
      <ellipse cx="52" cy="27" rx="11" ry="33" fill="#fce4ef" />
      <ellipse cx="52" cy="27" rx="6" ry="26" fill="#f9b8d4" />
      {/* Head */}
      <ellipse cx="38" cy="88" rx="32" ry="30" fill="#fef0f6" />
      {/* Eyes */}
      <circle cx="28" cy="82" r="5" fill="#2d1a2e" />
      <circle cx="48" cy="82" r="5" fill="#2d1a2e" />
      <circle cx="29.5" cy="80.5" r="2" fill="white" />
      <circle cx="49.5" cy="80.5" r="2" fill="white" />
      {/* Nose */}
      <ellipse cx="38" cy="92" rx="5" ry="3.5" fill="#f9a8c9" />
      {/* Mouth */}
      <path d="M33,96 Q38,101 43,96" fill="none" stroke="#e87aaa" strokeWidth="1.8" strokeLinecap="round" />
      {/* Cheek blush */}
      <circle cx="22" cy="90" r="7" fill="#fbc8dc" opacity="0.45" />
      <circle cx="54" cy="90" r="7" fill="#fbc8dc" opacity="0.45" />
      {/* Whiskers L */}
      <line x1="8" y1="89" x2="31" y2="91" stroke="#d4a0b8" strokeWidth="1.2" opacity="0.65" />
      <line x1="6" y1="94" x2="31" y2="94" stroke="#d4a0b8" strokeWidth="1.2" opacity="0.55" />
      {/* Whiskers R */}
      <line x1="45" y1="91" x2="68" y2="89" stroke="#d4a0b8" strokeWidth="1.2" opacity="0.65" />
      <line x1="45" y1="94" x2="70" y2="94" stroke="#d4a0b8" strokeWidth="1.2" opacity="0.55" />
      {/* Body */}
      <ellipse cx="38" cy="122" rx="28" ry="16" fill="#fef0f6" />
      {/* Small bow */}
      <path d="M30,108 Q38,104 46,108 Q38,112 30,108Z" fill="#fda4c8" opacity="0.7" />
      <circle cx="38" cy="108" r="2.5" fill="#f472b6" opacity="0.8" />
    </svg>
  );
}

// ─── Bunny peeking upward from the bottom edge ──────────────────────────────
function BunnyBottom({ side }: { side: 'left' | 'right' }) {
  // Only ears + top of head visible — body hidden below viewport
  return (
    <svg width="100" height="90" viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg">
      {/* Left ear */}
      <ellipse cx="30" cy="28" rx="13" ry="34" fill="#fce4ef" />
      <ellipse cx="30" cy="28" rx="7.5" ry="27" fill="#f9b8d4" />
      {/* Right ear */}
      <ellipse cx="68" cy="22" rx="13" ry="38" fill="#fce4ef" />
      <ellipse cx="68" cy="22" rx="7.5" ry="30" fill="#f9b8d4" />
      {/* Top of head just peeking over */}
      <ellipse cx="49" cy="92" rx="38" ry="30" fill="#fef0f6" />
      {/* Forehead tuft */}
      <ellipse cx="49" cy="70" rx="6" ry="4" fill="#fce4ef" />
      {/* Eyes barely visible */}
      <circle cx="38" cy="80" r="4.5" fill="#2d1a2e" />
      <circle cx="60" cy="80" r="4.5" fill="#2d1a2e" />
      <circle cx="39.5" cy="78.5" r="1.8" fill="white" />
      <circle cx="61.5" cy="78.5" r="1.8" fill="white" />
    </svg>
  );
}

// ─── Egg layout ─────────────────────────────────────────────────────────────
const EGG_CONFIGS: {
  top?: string; bottom?: string; left?: string; right?: string;
  rotate: string; color: string; pattern: EggPattern; size: number; mobile: boolean;
}[] = [
  // ── Always visible (mobile + desktop) ──
  // top-left
  { top: '82px',    left: '-6px',   rotate: '-22deg', color: '#f9a8d4', pattern: 'dots',     size: 74, mobile: true  },
  // top-right
  { top: '76px',    right: '-6px',  rotate: '20deg',  color: '#7dd3fc', pattern: 'stripes',  size: 70, mobile: true  },
  // bottom-left
  { bottom: '80px', left: '-4px',   rotate: '-18deg', color: '#6ee7b7', pattern: 'waves',    size: 72, mobile: true  },
  // bottom-right
  { bottom: '76px', right: '-4px',  rotate: '22deg',  color: '#fca5a5', pattern: 'diamonds', size: 70, mobile: true  },
  // mid-left (mobile visible — offset so just edge is seen)
  { top: '42%',     left: '-8px',   rotate: '-12deg', color: '#d8b4fe', pattern: 'flowers',  size: 68, mobile: true  },
  // mid-right (mobile visible)
  { top: '40%',     right: '-8px',  rotate: '14deg',  color: '#fde68a', pattern: 'zigzag',   size: 66, mobile: true  },

  // ── Desktop-only extras ──
  // upper-left second egg
  { top: '160px',   left: '-12px',  rotate: '-8deg',  color: '#fbcfe8', pattern: 'checks',   size: 62, mobile: false },
  // upper-right second egg
  { top: '150px',   right: '-12px', rotate: '10deg',  color: '#bef264', pattern: 'dots',     size: 60, mobile: false },
  // lower-left
  { top: '68%',     left: '-14px',  rotate: '-6deg',  color: '#fcd34d', pattern: 'stripes',  size: 64, mobile: false },
  // lower-right
  { top: '65%',     right: '-14px', rotate: '8deg',   color: '#a5b4fc', pattern: 'waves',    size: 64, mobile: false },
  // bottom-left second
  { bottom: '160px',left: '-10px',  rotate: '-16deg', color: '#f0abfc', pattern: 'zigzag',   size: 58, mobile: false },
  // bottom-right second
  { bottom: '155px',right: '-10px', rotate: '18deg',  color: '#86efac', pattern: 'checks',   size: 58, mobile: false },
];

// ─── Main overlay ────────────────────────────────────────────────────────────
export function EasterOverlay() {
  const reducedMotion = usePrefersReducedMotion();
  const [wiggling, setWiggling] = useState(!reducedMotion);
  const [showBanner, setShowBanner] = useState(true);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade everything in quickly
    const fadeIn = setTimeout(() => setVisible(true), 150);
    // Banner appears
    const bannerIn = setTimeout(() => setBannerVisible(true), 300);
    // Banner fades out after 6s
    const bannerOut = setTimeout(() => setBannerVisible(false), 6000);
    const bannerRemove = setTimeout(() => setShowBanner(false), 7200);
    // Eggs stop wiggling after 5 seconds
    const wiggleStop = setTimeout(() => setWiggling(false), 5000);

    return () => {
      clearTimeout(fadeIn);
      clearTimeout(bannerIn);
      clearTimeout(bannerOut);
      clearTimeout(bannerRemove);
      clearTimeout(wiggleStop);
    };
  }, []);

  return (
    <>
      {/* ── Eggs ── */}
      {EGG_CONFIGS.map((cfg, i) => (
        <div
          key={i}
          className={[
            'fixed pointer-events-none select-none z-[40]',
            cfg.mobile ? '' : 'hidden md:block',
            wiggling ? 'easter-wiggle-active' : '',
            'transition-opacity duration-700',
          ].join(' ')}
          style={{
            top: cfg.top,
            bottom: cfg.bottom,
            left: cfg.left,
            right: cfg.right,
            opacity: visible ? 1 : 0,
            transform: `rotate(${cfg.rotate})`,
            animationDelay: wiggling ? `${i * 0.15}s` : undefined,
          }}
          aria-hidden="true"
        >
          <Egg color={cfg.color} pattern={cfg.pattern} size={cfg.size} />
        </div>
      ))}

      {/* ── Side bunnies (mid-page, desktop) ── */}
      <div
        className="fixed pointer-events-none select-none z-[40] hidden md:block transition-opacity duration-1000"
        style={{ top: '30%', left: 0, opacity: visible ? 1 : 0, transform: 'translateX(-22px)' }}
        aria-hidden="true"
      >
        <BunnySide side="left" scale={1.1} />
      </div>
      <div
        className="fixed pointer-events-none select-none z-[40] hidden md:block transition-opacity duration-1000"
        style={{ top: '30%', right: 0, opacity: visible ? 1 : 0, transform: 'translateX(22px)' }}
        aria-hidden="true"
      >
        <BunnySide side="right" scale={1.1} />
      </div>

      {/* ── Bottom-peeking bunnies (corners, desktop) ── */}
      <div
        className="fixed pointer-events-none select-none z-[40] hidden md:block transition-opacity duration-1000"
        style={{ bottom: 0, left: '6%', opacity: visible ? 1 : 0, transform: 'translateY(10px)' }}
        aria-hidden="true"
      >
        <BunnyBottom side="left" />
      </div>
      <div
        className="fixed pointer-events-none select-none z-[40] hidden md:block transition-opacity duration-1000"
        style={{ bottom: 0, right: '6%', opacity: visible ? 1 : 0, transform: 'translateY(10px) scaleX(-1)' }}
        aria-hidden="true"
      >
        <BunnyBottom side="right" />
      </div>

      {/* ── Mobile side bunnies (smaller, on mobile too) ── */}
      <div
        className="fixed pointer-events-none select-none z-[40] md:hidden transition-opacity duration-1000"
        style={{ top: '55%', left: 0, opacity: visible ? 1 : 0, transform: 'translateX(-28px)' }}
        aria-hidden="true"
      >
        <BunnySide side="left" scale={0.72} />
      </div>
      <div
        className="fixed pointer-events-none select-none z-[40] md:hidden transition-opacity duration-1000"
        style={{ top: '55%', right: 0, opacity: visible ? 1 : 0, transform: 'translateX(28px)' }}
        aria-hidden="true"
      >
        <BunnySide side="right" scale={0.72} />
      </div>

      {/* ── Happy Easter banner ── */}
      {showBanner && (
        <div
          className="fixed left-1/2 z-[45] pointer-events-none select-none transition-all duration-700"
          style={{
            top: '76px',
            opacity: bannerVisible ? 1 : 0,
            transform: `translateX(-50%) translateY(${bannerVisible ? '0px' : '-14px'})`,
          }}
          aria-hidden="true"
        >
          <div
            className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold whitespace-nowrap tracking-wide"
            style={{
              background: 'linear-gradient(90deg, #fda4af 0%, #fde68a 30%, #86efac 60%, #93c5fd 100%)',
              color: '#3b1426',
              boxShadow: '0 4px 24px rgba(253,164,175,0.5), 0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            🐣&nbsp;&nbsp;Happy Easter!&nbsp;&nbsp;🐰
          </div>
        </div>
      )}
    </>
  );
}
