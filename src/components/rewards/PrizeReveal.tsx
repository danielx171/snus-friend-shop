import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Percent, Package, Trophy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

import type { SpinResult } from '@/hooks/useSpinWheel';

interface PrizeRevealProps {
  prize: SpinResult | null;
  onClose: () => void;
}

/* ------------------------------------------------------------------ */
/*  Config per prize type                                             */
/* ------------------------------------------------------------------ */

const TYPE_CONFIG: Record<string, { Icon: React.ElementType; glowColor: string; ringColor: string; subtitle: string }> = {
  points: { Icon: Coins, glowColor: '#22d3ee', ringColor: 'rgba(34,211,238,0.3)', subtitle: 'SnusPoints earned!' },
  voucher: { Icon: Percent, glowColor: '#a855f7', ringColor: 'rgba(168,85,247,0.3)', subtitle: 'Voucher won!' },
  jackpot: { Icon: Trophy, glowColor: '#fbbf24', ringColor: 'rgba(251,191,36,0.3)', subtitle: 'JACKPOT!' },
};

/* ------------------------------------------------------------------ */
/*  Particle burst                                                    */
/* ------------------------------------------------------------------ */

function Particles({ color }: { color: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const distance = 120 + Math.random() * 80;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          size: 3 + Math.random() * 4,
          delay: Math.random() * 0.3,
        };
      }),
    [],
  );

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: color,
            left: '50%',
            top: '50%',
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
          transition={{ duration: 1.2, delay: 0.3 + p.delay, ease: 'easeOut' }}
        />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Confetti rain                                                     */
/* ------------------------------------------------------------------ */

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        color: ['#fbbf24', '#22d3ee', '#10b981', '#ef4444', '#a78bfa', '#f472b6'][i % 6],
        size: 4 + Math.random() * 6,
        rotation: Math.random() * 360,
      })),
    [],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: 1,
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{ y: '100vh', rotate: p.rotation + 720, opacity: 0 }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

function PrizeRevealInner({ prize, onClose }: PrizeRevealProps) {
  if (!prize) return null;

  const prizeType = prize.prize_display?.type ?? 'points';
  const config = TYPE_CONFIG[prizeType] ?? TYPE_CONFIG.points;
  const showConfetti = prizeType === 'jackpot' || prizeType === 'voucher';

  return (
    <AnimatePresence>
      {prize && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

          {/* Confetti */}
          {showConfetti && <Confetti />}

          {/* Card */}
          <motion.div
            className="relative z-10 mx-4 w-full max-w-sm bg-card/95 backdrop-blur-sm border border-border/20 rounded-3xl p-8 text-center overflow-hidden"
            initial={{ scale: 0.3, rotateY: 180, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          >
            {/* Shine sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.12) 55%, transparent 60%)',
              }}
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 1.2, delay: 0.5, ease: 'easeInOut' }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted/50 transition-colors"
              aria-label="Close prize reveal"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>

            {/* Particle burst */}
            <div className="relative flex items-center justify-center mb-6">
              <Particles color={config.glowColor} />

              {/* Icon glow ring */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 100,
                  height: 100,
                  background: `radial-gradient(circle, ${config.ringColor} 0%, transparent 70%)`,
                }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Icon */}
              <motion.div
                className="relative flex items-center justify-center w-20 h-20 rounded-full border-2"
                style={{ borderColor: config.glowColor, color: config.glowColor }}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.4 }}
              >
                <config.Icon className="h-10 w-10" />
              </motion.div>
            </div>

            {/* Text */}
            <motion.p
              className="text-sm font-medium text-muted-foreground mb-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {config.subtitle}
            </motion.p>

            <motion.h2
              className="text-2xl font-bold mb-2"
              style={{ color: config.glowColor }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              {prize.prize_display?.title ?? prize.prize_key}
            </motion.h2>

            {prizeType === 'points' && (
              <motion.p
                className="text-muted-foreground text-sm mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Added to your SnusPoints balance
              </motion.p>
            )}

            {(prizeType === 'voucher' || prizeType === 'jackpot') && (
              <motion.p
                className="text-muted-foreground text-sm mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {prize.prize_display?.description ?? 'Voucher added to your rewards'}
              </motion.p>
            )}

            {/* Collect button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 }}
            >
              <Button onClick={onClose} className="w-full rounded-xl" size="lg">
                Collect
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const PrizeReveal = React.memo(PrizeRevealInner);
export default PrizeReveal;
