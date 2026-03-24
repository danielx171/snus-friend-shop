import { useState, useEffect, useCallback } from 'react';

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
      <ellipse cx={w*.34} cy={h*.26} rx={w*.1} ry={h*.06} fill="white" opacity="0.28" />
      <ellipse cx={w/2} cy={h/2} rx={w/2-1} ry={h/2-1} fill="none" stroke="white" strokeWidth="1.5" opacity="0.22" />
    </svg>
  );
}

// ─── Side bunny — full body for wandering ───────────────────────────────────
function BunnySide({ side, scale = 1 }: { side: 'left' | 'right'; scale?: number }) {
  const flip = side === 'right';
  const w = Math.round(88 * scale);
  const h = Math.round(130 * scale);
  return (
    <svg width={w} height={h} viewBox="0 0 88 130" xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <ellipse cx="26" cy="34" rx="11" ry="30" fill="#fce4ef" />
      <ellipse cx="26" cy="34" rx="6" ry="23" fill="#f9b8d4" />
      <ellipse cx="52" cy="27" rx="11" ry="33" fill="#fce4ef" />
      <ellipse cx="52" cy="27" rx="6" ry="26" fill="#f9b8d4" />
      <ellipse cx="38" cy="88" rx="32" ry="30" fill="#fef0f6" />
      <circle cx="28" cy="82" r="5" fill="#2d1a2e" />
      <circle cx="48" cy="82" r="5" fill="#2d1a2e" />
      <circle cx="29.5" cy="80.5" r="2" fill="white" />
      <circle cx="49.5" cy="80.5" r="2" fill="white" />
      <ellipse cx="38" cy="92" rx="5" ry="3.5" fill="#f9a8c9" />
      <path d="M33,96 Q38,101 43,96" fill="none" stroke="#e87aaa" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="22" cy="90" r="7" fill="#fbc8dc" opacity="0.45" />
      <circle cx="54" cy="90" r="7" fill="#fbc8dc" opacity="0.45" />
      <line x1="8" y1="89" x2="31" y2="91" stroke="#d4a0b8" strokeWidth="1.2" opacity="0.65" />
      <line x1="6" y1="94" x2="31" y2="94" stroke="#d4a0b8" strokeWidth="1.2" opacity="0.55" />
      <line x1="45" y1="91" x2="68" y2="89" stroke="#d4a0b8" strokeWidth="1.2" opacity="0.65" />
      <line x1="45" y1="94" x2="70" y2="94" stroke="#d4a0b8" strokeWidth="1.2" opacity="0.55" />
      <ellipse cx="38" cy="122" rx="28" ry="16" fill="#fef0f6" />
      <path d="M30,108 Q38,104 46,108 Q38,112 30,108Z" fill="#fda4c8" opacity="0.7" />
      <circle cx="38" cy="108" r="2.5" fill="#f472b6" opacity="0.8" />
    </svg>
  );
}

// ─── Bottom bunny — pops up on hover, shows ears + face ─────────────────────
// Default: ears only visible (translateY hides the head below viewport bottom)
// Hover: full face springs up with bounce animation
function BunnyPopup({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <svg width="96" height="108" viewBox="0 0 96 108" xmlns="http://www.w3.org/2000/svg"
      style={{ transform: mirrored ? 'scaleX(-1)' : undefined }}>
      {/* Left ear */}
      <ellipse cx="28" cy="30" rx="13" ry="28" fill="#fce4ef" />
      <ellipse cx="28" cy="30" rx="7.5" ry="22" fill="#f9b8d4" />
      {/* Right ear (slightly taller) */}
      <ellipse cx="68" cy="23" rx="13" ry="32" fill="#fce4ef" />
      <ellipse cx="68" cy="23" rx="7.5" ry="25" fill="#f9b8d4" />
      {/* Head */}
      <ellipse cx="48" cy="82" rx="38" ry="30" fill="#fef0f6" />
      {/* Eyes */}
      <circle cx="35" cy="74" r="6" fill="#2d1a2e" />
      <circle cx="61" cy="74" r="6" fill="#2d1a2e" />
      <circle cx="36.5" cy="72.5" r="2.4" fill="white" />
      <circle cx="62.5" cy="72.5" r="2.4" fill="white" />
      {/* Nose */}
      <ellipse cx="48" cy="84" rx="5.5" ry="3.5" fill="#f9a8c9" />
      {/* Big smile */}
      <path d="M40,89 Q48,97 56,89" fill="none" stroke="#e87aaa" strokeWidth="2" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="27" cy="80" r="9" fill="#fbc8dc" opacity="0.42" />
      <circle cx="69" cy="80" r="9" fill="#fbc8dc" opacity="0.42" />
      {/* Whiskers left */}
      <line x1="6"  y1="80" x2="38" y2="82" stroke="#d4a0b8" strokeWidth="1.3" opacity="0.6" />
      <line x1="5"  y1="86" x2="38" y2="86" stroke="#d4a0b8" strokeWidth="1.3" opacity="0.5" />
      {/* Whiskers right */}
      <line x1="58" y1="82" x2="90" y2="80" stroke="#d4a0b8" strokeWidth="1.3" opacity="0.6" />
      <line x1="58" y1="86" x2="91" y2="86" stroke="#d4a0b8" strokeWidth="1.3" opacity="0.5" />
      {/* Bow */}
      <path d="M38,103 Q48,98 58,103 Q48,108 38,103Z" fill="#fda4c8" opacity="0.8" />
      <circle cx="48" cy="103" r="3.5" fill="#f472b6" />
    </svg>
  );
}

// ─── Egg layout ─────────────────────────────────────────────────────────────
const EGG_CONFIGS: {
  top?: string; bottom?: string; left?: string; right?: string;
  rotate: string; color: string; pattern: EggPattern; size: number; mobile: boolean;
}[] = [
  // LEFT
  { top: '96px',    left: '0px', rotate: '-22deg', color: '#f9a8d4', pattern: 'dots',     size: 72, mobile: true  },
  { top: '210px',   left: '0px', rotate: '-14deg', color: '#fbcfe8', pattern: 'checks',   size: 62, mobile: false },
  { top: '43%',     left: '0px', rotate: '-10deg', color: '#d8b4fe', pattern: 'flowers',  size: 68, mobile: true  },
  { top: '62%',     left: '0px', rotate: '-8deg',  color: '#fcd34d', pattern: 'stripes',  size: 64, mobile: false },
  { bottom: '120px',left: '0px', rotate: '-18deg', color: '#6ee7b7', pattern: 'waves',    size: 70, mobile: true  },
  { bottom: '220px',left: '0px', rotate: '-12deg', color: '#f0abfc', pattern: 'zigzag',   size: 56, mobile: false },
  // RIGHT
  { top: '90px',    right: '0px', rotate: '20deg',  color: '#7dd3fc', pattern: 'stripes',  size: 70, mobile: true  },
  { top: '200px',   right: '0px', rotate: '12deg',  color: '#bef264', pattern: 'dots',     size: 60, mobile: false },
  { top: '41%',     right: '0px', rotate: '14deg',  color: '#fde68a', pattern: 'zigzag',   size: 66, mobile: true  },
  { top: '60%',     right: '0px', rotate: '10deg',  color: '#a5b4fc', pattern: 'waves',    size: 64, mobile: false },
  { bottom: '116px',right: '0px', rotate: '22deg',  color: '#fca5a5', pattern: 'diamonds', size: 70, mobile: true  },
  { bottom: '216px',right: '0px', rotate: '16deg',  color: '#86efac', pattern: 'checks',   size: 56, mobile: false },
];

// ─── Main overlay ────────────────────────────────────────────────────────────
export function EasterOverlay() {
  const reducedMotion = usePrefersReducedMotion();

  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem('easter-overlay') !== 'off'; } catch { return true; }
  });
  const [showBanner, setShowBanner] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  // Hover state for bottom bunnies
  const [leftPopped, setLeftPopped] = useState(false);
  const [rightPopped, setRightPopped] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      setBannerVisible(false);
      return;
    }
    setShowBanner(true);
    const fadeIn       = setTimeout(() => setVisible(true), 120);
    const bannerIn     = setTimeout(() => setBannerVisible(true), 500);
    const bannerOut    = setTimeout(() => setBannerVisible(false), 6200);
    const bannerRemove = setTimeout(() => setShowBanner(false), 7400);
    return () => {
      clearTimeout(fadeIn);
      clearTimeout(bannerIn);
      clearTimeout(bannerOut);
      clearTimeout(bannerRemove);
    };
  }, [enabled]);

  const toggle = useCallback(() => {
    setEnabled(prev => {
      const next = !prev;
      try { localStorage.setItem('easter-overlay', next ? 'on' : 'off'); } catch { /* noop */ }
      if (next) setAnimKey(k => k + 1);
      return next;
    });
  }, []);

  const eggOffset = (cfg: typeof EGG_CONFIGS[0]) => {
    const half = -(cfg.size / 2);
    return {
      marginLeft:  cfg.left  !== undefined ? `${half}px` : undefined,
      marginRight: cfg.right !== undefined ? `${half}px` : undefined,
    };
  };

  // Spring transition: fast spring up, ease-in drop
  const bunnyTransitionStyle = (popped: boolean) => ({
    transform: popped ? 'translateY(4px)' : 'translateY(64px)',
    transition: 'transform 0.45s',
    transitionTimingFunction: popped
      ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'  // spring overshoot on the way up
      : 'cubic-bezier(0.55, 0, 1, 0.45)',     // quick snappy drop on leave
  });

  return (
    <>
      {/* ── Eggs ── */}
      {EGG_CONFIGS.map((cfg, i) => (
        <div
          key={i}
          className={[
            'fixed pointer-events-none select-none z-[38]',
            cfg.mobile ? '' : 'hidden md:block',
            'transition-opacity duration-700',
          ].join(' ')}
          style={{
            top: cfg.top,
            bottom: cfg.bottom,
            left: cfg.left,
            right: cfg.right,
            ...eggOffset(cfg),
            opacity: visible && enabled ? 0.72 : 0,
            transform: `rotate(${cfg.rotate})`,
          }}
          aria-hidden="true"
        >
          <div
            key={animKey}
            className={!reducedMotion ? 'easter-wiggle-active' : ''}
            style={{ animationDelay: `${0.3 + i * 0.12}s` }}
          >
            <Egg color={cfg.color} pattern={cfg.pattern} size={cfg.size} />
          </div>
        </div>
      ))}

      {/* ── Side bunnies — wander up/down, lean in to "grab" eggs (desktop) ── */}
      {!reducedMotion && (
        <>
          <div
            className="fixed pointer-events-none select-none z-[38] hidden md:block transition-opacity duration-1000"
            style={{ top: 0, left: 0, opacity: visible && enabled ? 0.88 : 0 }}
            aria-hidden="true"
          >
            <div className="bunny-wander-left">
              <BunnySide side="left" scale={1.05} />
            </div>
          </div>
          <div
            className="fixed pointer-events-none select-none z-[38] hidden md:block transition-opacity duration-1000"
            style={{ top: 0, right: 0, opacity: visible && enabled ? 0.88 : 0 }}
            aria-hidden="true"
          >
            <div className="bunny-wander-right">
              <BunnySide side="right" scale={1.05} />
            </div>
          </div>
        </>
      )}

      {/* ── Bottom popup bunnies — hidden, hover to pop up (desktop) ── */}
      {/* Left */}
      <div
        className="fixed z-[39] hidden md:block select-none"
        style={{ bottom: 0, left: '9%', opacity: visible && enabled ? 1 : 0, transition: 'opacity 1s', cursor: 'default', pointerEvents: enabled ? 'auto' : 'none' }}
        onMouseEnter={() => setLeftPopped(true)}
        onMouseLeave={() => setLeftPopped(false)}
        aria-hidden="true"
      >
        {/* Invisible hover zone so user can discover the bunny */}
        <div style={{ height: '24px', width: '96px', position: 'absolute', bottom: '44px' }} />
        <div style={bunnyTransitionStyle(leftPopped)}>
          <BunnyPopup />
        </div>
      </div>
      {/* Right */}
      <div
        className="fixed z-[39] hidden md:block select-none"
        style={{ bottom: 0, right: '9%', opacity: visible && enabled ? 1 : 0, transition: 'opacity 1s', cursor: 'default', pointerEvents: enabled ? 'auto' : 'none' }}
        onMouseEnter={() => setRightPopped(true)}
        onMouseLeave={() => setRightPopped(false)}
        aria-hidden="true"
      >
        <div style={{ height: '24px', width: '96px', position: 'absolute', bottom: '44px' }} />
        <div style={bunnyTransitionStyle(rightPopped)}>
          <BunnyPopup mirrored />
        </div>
      </div>

      {/* ── Happy Easter banner ── */}
      {showBanner && (
        <div
          className="fixed left-1/2 z-[45] pointer-events-none select-none transition-all duration-700"
          style={{
            top: '72px',
            opacity: bannerVisible ? 1 : 0,
            transform: `translateX(-50%) translateY(${bannerVisible ? '0px' : '-10px'})`,
          }}
          aria-hidden="true"
        >
          <div
            className="flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-bold whitespace-nowrap tracking-wide"
            style={{
              background: 'linear-gradient(90deg, #fda4af 0%, #fde68a 35%, #86efac 65%, #93c5fd 100%)',
              color: '#3b1426',
              boxShadow: '0 4px 20px rgba(253,164,175,0.45), 0 2px 6px rgba(0,0,0,0.08)',
              border: '2px solid rgba(255,255,255,0.55)',
            }}
          >
            🐣&nbsp; Happy Easter! &nbsp;🌸
          </div>
        </div>
      )}

      {/* ── Toggle button ── */}
      <button
        onClick={toggle}
        className="fixed bottom-5 right-5 z-[50] flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-bold tracking-wide cursor-pointer select-none"
        style={{
          background: enabled
            ? 'linear-gradient(135deg, #fda4af 0%, #fde68a 50%, #86efac 100%)'
            : 'rgba(100,100,120,0.55)',
          color: enabled ? '#5c1a2e' : '#94a3b8',
          boxShadow: enabled
            ? '0 4px 18px rgba(253,164,175,0.45), 0 2px 6px rgba(0,0,0,0.1)'
            : '0 2px 8px rgba(0,0,0,0.15)',
          border: `2px solid ${enabled ? 'rgba(255,255,255,0.55)' : 'rgba(148,163,184,0.3)'}`,
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease',
        }}
        aria-label={enabled ? 'Hide Easter decorations' : 'Show Easter decorations'}
      >
        {enabled ? '🐣' : '🥚'}
        <span>Easter {enabled ? 'On' : 'Off'}</span>
      </button>
    </>
  );
}
