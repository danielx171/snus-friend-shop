import React, { useCallback, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Coins, Percent, Package, Trophy, Star, Gift, Zap, Heart } from 'lucide-react';
import type { SpinResult } from '@/hooks/useSpinWheel';

/* ------------------------------------------------------------------ */
/*  Segment configuration                                             */
/* ------------------------------------------------------------------ */

interface Segment {
  key: string;
  label: string;
  shortLabel: string;
  bg: string;
  color: string;
  Icon: React.ElementType;
}

const SEGMENTS: Segment[] = [
  { key: 'points_5',      label: '5 Points',    shortLabel: '5',    bg: '#0d2847', color: '#22d3ee', Icon: Coins },
  { key: 'points_10',     label: '10 Points',   shortLabel: '10',   bg: '#111d3a', color: '#22d3ee', Icon: Coins },
  { key: 'voucher_15pct', label: '15% Off',     shortLabel: '15%',  bg: '#0d2847', color: '#10b981', Icon: Percent },
  { key: 'points_25',     label: '25 Points',   shortLabel: '25',   bg: '#111d3a', color: '#22d3ee', Icon: Zap },
  { key: 'points_5b',     label: '5 Points',    shortLabel: '5',    bg: '#0d2847', color: '#22d3ee', Icon: Coins },
  { key: 'free_can',      label: 'Free Can',    shortLabel: 'Free', bg: '#1a0d2e', color: '#ef4444', Icon: Gift },
  { key: 'points_50',     label: '50 Points',   shortLabel: '50',   bg: '#111d3a', color: '#22d3ee', Icon: Star },
  { key: 'free_month',    label: 'Free Month!', shortLabel: 'JP',   bg: '#1a1505', color: '#fbbf24', Icon: Trophy },
];

const SEGMENT_COUNT = SEGMENTS.length;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT; // 45 degrees

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
/*  LED dot positions                                                 */
/* ------------------------------------------------------------------ */

function ledPositions(count: number, cx: number, cy: number, r: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
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

      // Find the segment index for the prize
      const segmentIndex = SEGMENTS.findIndex((s) => s.key === result.prize_key);
      const targetIndex = segmentIndex >= 0 ? segmentIndex : 0;

      // Calculate target rotation:
      // Each segment spans SEGMENT_ANGLE degrees. We want the pointer (top)
      // to land in the middle of the target segment.
      // Segment 0 is at 0 degrees (top). We rotate clockwise.
      const segmentCenter = targetIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
      // Invert because the wheel rotates, not the pointer
      const targetAngle = 360 - segmentCenter;
      // Add full rotations for dramatic effect
      const fullSpins = 5 * 360;
      const finalRotation = currentRotation.current + fullSpins + targetAngle - (currentRotation.current % 360);

      currentRotation.current = finalRotation;

      await controls.start({
        rotate: finalRotation,
        transition: {
          duration: 5.5,
          ease: [0.2, 0.8, 0.3, 1], // deceleration curve
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
  const radius = 180;
  const leds = ledPositions(32, cx, cy, radius + 12);

  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="rounded-full blur-3xl opacity-30"
          style={{
            width: 420,
            height: 420,
            background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
            animation: 'pulse 3s ease-in-out infinite',
          }}
        />
      </div>

      <div className="relative" style={{ width: 424, height: 424 }}>
        {/* Pointer triangle at top */}
        <div className="absolute left-1/2 -top-2 z-20 -translate-x-1/2">
          <svg width="28" height="24" viewBox="0 0 28 24">
            <polygon points="14,24 0,0 28,0" fill="hsl(var(--primary))" stroke="#fff" strokeWidth="1" />
          </svg>
        </div>

        <svg viewBox="0 0 424 424" className="w-full h-full">
          {/* LED ring */}
          {leds.map((led, i) => (
            <circle
              key={i}
              cx={led.x + 12}
              cy={led.y + 12}
              r={3}
              className="led-dot"
              style={{
                fill: i % 2 === 0 ? '#fbbf24' : '#22d3ee',
                animationDelay: `${i * 60}ms`,
              }}
            />
          ))}

          {/* Wheel group (rotated by framer-motion) */}
          <motion.g
            animate={controls}
            style={{ transformOrigin: '212px 212px' }}
          >
            {/* Outer ring */}
            <circle cx={212} cy={212} r={radius} fill="none" stroke="#1e293b" strokeWidth="6" />

            {/* Segments */}
            {SEGMENTS.map((seg, i) => {
              const startAngle = (i * SEGMENT_ANGLE - 90) * (Math.PI / 180);
              const endAngle = ((i + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
              const x1 = 212 + radius * Math.cos(startAngle);
              const y1 = 212 + radius * Math.sin(startAngle);
              const x2 = 212 + radius * Math.cos(endAngle);
              const y2 = 212 + radius * Math.sin(endAngle);
              const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;

              const midAngle = ((i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2) - 90) * (Math.PI / 180);
              const labelR = radius * 0.62;
              const iconR = radius * 0.38;
              const lx = 212 + labelR * Math.cos(midAngle);
              const ly = 212 + labelR * Math.sin(midAngle);
              const ix = 212 + iconR * Math.cos(midAngle);
              const iy = 212 + iconR * Math.sin(midAngle);
              const textRotation = i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;

              return (
                <g key={seg.key}>
                  <path
                    d={`M 212 212 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={seg.bg}
                    stroke="#1e293b"
                    strokeWidth="1"
                  />
                  {/* Icon placeholder (rendered as a colored circle + text) */}
                  <g transform={`translate(${ix}, ${iy}) rotate(${textRotation})`}>
                    <circle r="14" fill={seg.bg} stroke={seg.color} strokeWidth="1.5" opacity="0.8" />
                    <text
                      textAnchor="middle"
                      dy="0.35em"
                      fontSize="10"
                      fontWeight="700"
                      fill={seg.color}
                    >
                      {seg.shortLabel}
                    </text>
                  </g>
                  {/* Label */}
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${textRotation}, ${lx}, ${ly})`}
                    fontSize="11"
                    fontWeight="600"
                    fill={seg.color}
                    className="select-none"
                  >
                    {seg.label}
                  </text>
                </g>
              );
            })}

            {/* Inner ring border */}
            <circle cx={212} cy={212} r={30} fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
          </motion.g>

          {/* Center hub button (outside rotation group so it stays still) */}
          <g
            className="cursor-pointer"
            onClick={handleSpin}
            role="button"
            aria-label={isExhausted ? 'Already spun today' : 'Spin the wheel'}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleSpin();
            }}
          >
            <circle
              cx={212}
              cy={212}
              r={30}
              fill={isExhausted ? '#374151' : 'hsl(var(--primary))'}
              stroke="#fff"
              strokeWidth="2"
              opacity={spinning ? 0.5 : 1}
            />
            <text
              x={212}
              y={212}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="11"
              fontWeight="700"
              fill="#fff"
              className="select-none pointer-events-none"
            >
              {isExhausted ? 'DONE' : spinning ? '...' : 'SPIN'}
            </text>
          </g>
        </svg>
      </div>

      {/* LED animation keyframes */}
      <style>{`
        @keyframes led-blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .led-dot {
          animation: led-blink 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

const SpinWheel = React.memo(SpinWheelInner);
export default SpinWheel;
