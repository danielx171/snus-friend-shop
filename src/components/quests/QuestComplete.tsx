import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Coins, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { QuestWithProgress } from '@/hooks/useQuests';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface QuestCompleteProps {
  quest: QuestWithProgress;
  onDismiss: () => void;
  open: boolean;
}

/* ------------------------------------------------------------------ */
/*  Confetti                                                           */
/* ------------------------------------------------------------------ */

function usePrefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function Confetti() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 1.8 + Math.random() * 1.5,
        color: ['#fbbf24', '#22d3ee', '#10b981', '#ef4444', '#a78bfa', '#f472b6'][i % 6],
        size: 4 + Math.random() * 5,
        rotation: Math.random() * 360,
      })),
    [],
  );

  if (prefersReducedMotion) return null;

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
          transition={{ duration: p.duration, delay: p.delay, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Particles                                                          */
/* ------------------------------------------------------------------ */

function Particles() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const distance = 100 + Math.random() * 60;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          size: 3 + Math.random() * 4,
          delay: Math.random() * 0.25,
        };
      }),
    [],
  );

  if (prefersReducedMotion) return null;

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none bg-[hsl(var(--color-success))]"
          style={{ width: p.size, height: p.size, left: '50%', top: '50%' }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
          transition={{ duration: 1.1, delay: 0.3 + p.delay, ease: 'easeOut' }}
        />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

function QuestCompleteInner({ quest, onDismiss, open }: QuestCompleteProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onDismiss} />

          {/* Confetti */}
          <Confetti />

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
                background:
                  'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.10) 45%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.10) 55%, transparent 60%)',
              }}
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 1.1, delay: 0.5, ease: 'easeInOut' }}
            />

            {/* Close button */}
            <button
              onClick={onDismiss}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted/50 transition-colors"
              aria-label="Close quest complete dialog"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>

            {/* Icon burst */}
            <div className="relative flex items-center justify-center mb-6">
              <Particles />

              {/* Glow ring */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 100,
                  height: 100,
                  background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
                }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Icon */}
              <motion.div
                className="relative flex items-center justify-center w-20 h-20 rounded-full border-2 border-[hsl(var(--color-success))] text-[hsl(var(--color-success))]"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.4 }}
              >
                <CheckCircle2 className="h-10 w-10" />
              </motion.div>
            </div>

            {/* Labels */}
            <motion.p
              className="text-sm font-medium text-muted-foreground mb-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Quest Complete!
            </motion.p>

            <motion.h2
              className="text-xl font-bold mb-4 text-[hsl(var(--color-success))]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72 }}
            >
              {quest.title}
            </motion.h2>

            {/* Rewards */}
            <motion.div
              className="flex flex-col items-center gap-2 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.88 }}
            >
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Coins className="h-4 w-4 text-primary" />
                <span>+{quest.reward_points} SnusPoints earned</span>
              </div>

              {quest.rewardAvatarName && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Star className="h-4 w-4 text-[hsl(var(--color-tier-gold))]" />
                  <span className="font-medium">{quest.rewardAvatarName}</span>
                  {quest.rewardAvatarRarity && (
                    <Badge
                      variant="outline"
                      className="text-xs px-1.5 py-0 h-4 border border-[hsl(var(--color-rarity-legendary)/0.4)] text-[hsl(var(--color-rarity-legendary))] bg-[hsl(var(--color-rarity-legendary)/0.1)]"
                    >
                      {quest.rewardAvatarRarity}
                    </Badge>
                  )}
                  <span className="text-muted-foreground text-xs">avatar unlocked!</span>
                </div>
              )}
            </motion.div>

            {/* Dismiss */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Button onClick={onDismiss} className="w-full rounded-xl" size="lg">
                Awesome!
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const QuestComplete = React.memo(QuestCompleteInner);
export default QuestComplete;
