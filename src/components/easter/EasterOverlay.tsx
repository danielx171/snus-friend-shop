import { useState, useEffect } from 'react';

const EGG_COLORS = [
  { fill: '#F9A8D4', stripe: '#F472B6' },  // pink
  { fill: '#C4B5FD', stripe: '#A78BFA' },  // lavender
  { fill: '#6EE7B7', stripe: '#34D399' },  // mint
  { fill: '#7DD3FC', stripe: '#38BDF8' },  // sky
  { fill: '#FDE68A', stripe: '#FBBF24' },  // yellow
  { fill: '#FDA4AF', stripe: '#FB7185' },  // coral
];

const EGG_POSITIONS = [
  { top: '12%', left: '3%', rotate: -15, size: 48 },
  { top: '8%', right: '4%', rotate: 20, size: 44 },
  { bottom: '18%', left: '2%', rotate: 10, size: 40 },
  { bottom: '12%', right: '3%', rotate: -20, size: 46 },
  { top: '45%', left: '1%', rotate: 25, size: 36 },
  { top: '40%', right: '1.5%', rotate: -10, size: 38 },
];

function EasterEgg({ fill, stripe, size, wiggle }: { fill: string; stripe: string; size: number; wiggle: boolean }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 40 52" className={wiggle ? 'easter-wiggle' : ''}>
      <ellipse cx="20" cy="28" rx="16" ry="22" fill={fill} />
      <ellipse cx="20" cy="28" rx="16" ry="22" fill="none" stroke={stripe} strokeWidth="1.5" opacity="0.5" />
      <path d="M6 22 Q20 18 34 22" stroke={stripe} strokeWidth="2.5" fill="none" opacity="0.6" strokeLinecap="round" />
      <path d="M8 32 Q20 28 32 32" stroke={stripe} strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" />
      <circle cx="14" cy="26" r="2" fill={stripe} opacity="0.35" />
      <circle cx="26" cy="26" r="2" fill={stripe} opacity="0.35" />
      <circle cx="20" cy="38" r="1.5" fill={stripe} opacity="0.3" />
    </svg>
  );
}

function BunnyEars({ side }: { side: 'left' | 'right' }) {
  const flip = side === 'right' ? 'scaleX(-1)' : '';
  return (
    <svg
      width="50"
      height="80"
      viewBox="0 0 50 80"
      className="easter-bunny"
      style={{ transform: flip }}
    >
      <ellipse cx="18" cy="30" rx="8" ry="28" fill="#F9A8D4" opacity="0.7" />
      <ellipse cx="18" cy="30" rx="4.5" ry="22" fill="#FBCFE8" opacity="0.6" />
      <ellipse cx="35" cy="34" rx="7" ry="24" fill="#F9A8D4" opacity="0.7" />
      <ellipse cx="35" cy="34" rx="4" ry="19" fill="#FBCFE8" opacity="0.6" />
      <ellipse cx="25" cy="65" rx="18" ry="14" fill="#F9A8D4" opacity="0.6" />
    </svg>
  );
}

export function EasterOverlay() {
  const [wiggle, setWiggle] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [hideBanner, setHideBanner] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setWiggle(false);
      return;
    }
    const t = setTimeout(() => setWiggle(false), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => setShowBanner(true));
    const t = setTimeout(() => setHideBanner(true), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[40] overflow-hidden" aria-hidden="true">
      {/* Easter Eggs */}
      {EGG_POSITIONS.map((pos, i) => {
        const hideMobile = i >= 4;
        const { rotate, size, ...cssPos } = pos;
        return (
          <div
            key={i}
            className={`fixed ${hideMobile ? 'hidden sm:block' : ''}`}
            style={{
              ...cssPos,
              transform: `rotate(${rotate}deg)`,
            }}
          >
            <EasterEgg fill={EGG_COLORS[i].fill} stripe={EGG_COLORS[i].stripe} size={size} wiggle={wiggle} />
          </div>
        );
      })}

      {/* Bunny ears - hidden on mobile */}
      <div
        className="fixed left-0 bottom-[30%] hidden sm:block"
        style={{
          opacity: 1,
          transition: 'opacity 1s ease-in',
        }}
      >
        <BunnyEars side="left" />
      </div>
      <div
        className="fixed right-0 bottom-[25%] hidden sm:block"
        style={{
          opacity: 1,
          transition: 'opacity 1s ease-in',
        }}
      >
        <BunnyEars side="right" />
      </div>

      {/* Happy Easter banner */}
      <div
        className="fixed left-1/2 z-[40]"
        style={{
          top: '72px',
          transform: 'translateX(-50%)',
          opacity: showBanner && !hideBanner ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
        }}
      >
        <div
          className="rounded-full px-6 py-2 text-sm font-semibold shadow-md whitespace-nowrap"
          style={{
            background: 'linear-gradient(135deg, #F9A8D4, #FDE68A, #6EE7B7)',
            color: '#1a1a2e',
          }}
        >
          🐣 Happy Easter 🐣
        </div>
      </div>
    </div>
  );
}
