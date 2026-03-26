import React, { useCallback, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import type { SpinResult } from '@/hooks/useSpinWheel';

/* ------------------------------------------------------------------ */
/*  Segment configuration                                             */
/* ------------------------------------------------------------------ */

interface Segment {
  key: string;
  label: string;
  shortLabel: string;
  bgFrom: string;
  bgTo: string;
  accent: string;
  emoji: string;
}

const SEGMENTS: Segment[] = [
  { key: 'points_5',      label: '5 Points',    shortLabel: '5 pts',   bgFrom: '#0c2d4a', bgTo: '#0a2440', accent: '#22d3ee', emoji: '💰' },
  { key: 'points_10',     label: '10 Points',   shortLabel: '10 pts',  bgFrom: '#0e1f3d', bgTo: '#0b1a33', accent: '#38bdf8', emoji: '💰' },
  { key: 'voucher_15pct', label: '15% Off',     shortLabel: '15%',     bgFrom: '#1a0f30', bgTo: '#150b28', accent: '#a855f7', emoji: '🎟️' },
  { key: 'points_25',     label: '25 Points',   shortLabel: '25 pts',  bgFrom: '#0c2d4a', bgTo: '#0a2440', accent: '#22d3ee', emoji: '⚡' },
  { key: 'points_5b',     label: '5 Points',    shortLabel: '5 pts',   bgFrom: '#0e1f3d', bgTo: '#0b1a33', accent: '#38bdf8', emoji: '💰' },
  { key: 'free_can',      label: 'Free Can',    shortLabel: 'Free!',   bgFrom: '#1e0a0a', bgTo: '#180808', accent: '#ef4444', emoji: '🎁' },
  { key: 'points_50',     label: '50 Points',   shortLabel: '50 pts',  bgFrom: '#0c2d4a', bgTo: '#0a2440', accent: '#10b981', emoji: '⭐' },
  { key: 'free_month',    label: 'Free Month!', shortLabel: 'JACKPOT', bgFrom: '#1c1505', bgTo: '#161003', accent: '#fbbf24', emoji: '🏆' },
];

const SEGMENT_COUNT = SEGMENTS.length;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;

/* ------------------------------------------------------------------ */
/*  Props                                                             */
/* ------------------------------------------------------------------ */

interface SpinWheelProps {
  onSpin: () => Promise<SpinResult>;
  isSpinning: boolean;
  isExhausted: boolean;
  onPrizeWon: (prize: SpinResult) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

function SpinWheelInner({ onSpin, isSpinning, isExhausted, onPrizeWon }: SpinWheelProps) {
  const controls = useAnimation();
  const [localSpinning, setLocalSpinning] = useState(false);
  const currentRotation = useRef(0);

  const spinning = isSpinning || localSpinning;

  const handleSpin = useCallback(async () => {
    if (spinning || isExhausted) return;

    setLocalSpinning(true);

    try {
      const result = await onSpin();

      const segmentIndex = SEGMENTS.findIndex((s) => s.key === result.prize_key);
      const targetIndex = segmentIndex >= 0 ? segmentIndex : 0;

      const segmentCenter = targetIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
      const targetAngle = 360 - segmentCenter;
      const fullSpins = 6 * 360;
      const finalRotation = currentRotation.current + fullSpins + targetAngle - (currentRotation.current % 360);

      currentRotation.current = finalRotation;

      await controls.start({
        rotate: finalRotation,
        transition: {
          duration: 6,
          ease: [0.15, 0.85, 0.25, 1],
        },
      });

      onPrizeWon(result);
    } catch (err) {
      console.error('Spin failed', err);
    } finally {
      setLocalSpinning(false);
    }
  }, [spinning, isExhausted, onSpin, onPrizeWon, controls]);

  const cx = 200;
  const cy = 200;
  const radius = 170;
  const outerR = 190;

  // LED ring
  const ledCount = 36;
  const leds = Array.from({ length: ledCount }, (_, i) => {
    const angle = (i / ledCount) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + outerR * Math.cos(angle),
      y: cy + outerR * Math.sin(angle),
    };
  });

  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient glow — more subtle, uses theme primary */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="rounded-full blur-3xl"
          style={{
            width: 'min(380px, 85vw)',
            height: 'min(380px, 85vw)',
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="relative w-full mx-auto" style={{ maxWidth: 'min(420px, 90vw)', aspectRatio: '1' }}>
        {/* Pointer — metallic look */}
        <div className="absolute left-1/2 -top-1.5 z-20 -translate-x-1/2 drop-shadow-lg">
          <svg width="30" height="28" viewBox="0 0 30 28">
            <defs>
              <linearGradient id="pointer-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--primary) / 0.7)" />
              </linearGradient>
            </defs>
            <polygon points="15,28 1,0 29,0" fill="url(#pointer-grad)" />
            <polygon points="15,28 1,0 29,0" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.75" />
          </svg>
        </div>

        <svg viewBox="0 0 400 400" className="w-full h-full">
          <defs>
            {/* Metallic outer ring gradient */}
            <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="30%" stopColor="#4b5563" />
              <stop offset="50%" stopColor="#6b7280" />
              <stop offset="70%" stopColor="#4b5563" />
              <stop offset="100%" stopColor="#374151" />
            </linearGradient>
            {/* Center button gradient */}
            <radialGradient id="center-grad" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
            </radialGradient>
            {/* Segment gradients */}
            {SEGMENTS.map((seg, i) => (
              <linearGradient key={`sg-${i}`} id={`seg-${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={seg.bgFrom} />
                <stop offset="100%" stopColor={seg.bgTo} />
              </linearGradient>
            ))}
          </defs>

          {/* LED ring — chase pattern */}
          {leds.map((led, i) => (
            <circle
              key={i}
              cx={led.x}
              cy={led.y}
              r={2.5}
              className="led-dot"
              style={{
                fill: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#22d3ee' : '#a855f7',
                animationDelay: `${i * 80}ms`,
              }}
            />
          ))}

          {/* Outer metallic ring */}
          <circle cx={cx} cy={cy} r={radius + 4} fill="none" stroke="url(#ring-grad)" strokeWidth="5" />

          {/* Wheel group (rotated by framer-motion) */}
          <motion.g
            animate={controls}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          >
            {/* Segments */}
            {SEGMENTS.map((seg, i) => {
              const startAngle = (i * SEGMENT_ANGLE - 90) * (Math.PI / 180);
              const endAngle = ((i + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
              const x1 = cx + radius * Math.cos(startAngle);
              const y1 = cy + radius * Math.sin(startAngle);
              const x2 = cx + radius * Math.cos(endAngle);
              const y2 = cy + radius * Math.sin(endAngle);
              const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;

              const midAngle = ((i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2) - 90) * (Math.PI / 180);
              const labelR = radius * 0.65;
              const emojiR = radius * 0.38;
              const lx = cx + labelR * Math.cos(midAngle);
              const ly = cy + labelR * Math.sin(midAngle);
              const ex = cx + emojiR * Math.cos(midAngle);
              const ey = cy + emojiR * Math.sin(midAngle);
              const textRotation = i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;

              return (
                <g key={seg.key}>
                  {/* Segment fill */}
                  <path
                    d={`M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={`url(#seg-${i})`}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1.5"
                  />

                  {/* Accent glow at outer edge */}
                  <path
                    d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
                    fill="none"
                    stroke={seg.accent}
                    strokeWidth="2"
                    opacity="0.25"
                  />

                  {/* Emoji icon */}
                  <text
                    x={ex}
                    y={ey}
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${textRotation}, ${ex}, ${ey})`}
                    fontSize="18"
                    className="select-none"
                  >
                    {seg.emoji}
                  </text>

                  {/* Label */}
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${textRotation}, ${lx}, ${ly})`}
                    fontSize="10"
                    fontWeight="700"
                    fill={seg.accent}
                    className="select-none"
                    style={{ textShadow: `0 0 8px ${seg.accent}40` }}
                  >
                    {seg.label}
                  </text>
                </g>
              );
            })}

            {/* Inner ring shadow */}
            <circle cx={cx} cy={cy} r={34} fill="#0f172a" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          </motion.g>

          {/* Center hub button (stays still) */}
          <g
            className={isExhausted || spinning ? '' : 'cursor-pointer'}
            onClick={handleSpin}
            role="button"
            aria-label={isExhausted ? 'Already spun today' : 'Spin the wheel'}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleSpin();
            }}
          >
            {/* Outer glow ring */}
            {!isExhausted && !spinning && (
              <circle
                cx={cx}
                cy={cy}
                r={37}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                opacity="0.4"
                className="center-pulse"
              />
            )}

            {/* Button body */}
            <circle
              cx={cx}
              cy={cy}
              r={32}
              fill={isExhausted ? '#374151' : 'url(#center-grad)'}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.5"
              opacity={spinning ? 0.5 : 1}
            />

            {/* Glass highlight */}
            {!isExhausted && (
              <ellipse
                cx={cx}
                cy={cy - 10}
                rx={18}
                ry={10}
                fill="rgba(255,255,255,0.12)"
              />
            )}

            {/* Button text */}
            <text
              x={cx}
              y={cy + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="12"
              fontWeight="800"
              letterSpacing="1.5"
              fill="#fff"
              className="select-none pointer-events-none"
            >
              {isExhausted ? 'DONE' : spinning ? '...' : 'SPIN'}
            </text>
          </g>
        </svg>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes led-chase {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .led-dot {
          animation: led-chase 2s ease-in-out infinite;
        }
        @keyframes center-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .center-pulse {
          animation: center-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

const SpinWheel = React.memo(SpinWheelInner);
export default SpinWheel;
