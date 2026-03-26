import React from 'react';
import { motion } from 'framer-motion';
import { AchievementCard } from './AchievementCard';
import type { AchievementWithProgress } from '@/hooks/useAchievements';

/* ------------------------------------------------------------------ */
/*  Constants                                                           */
/* ------------------------------------------------------------------ */

const CATEGORY_ORDER = ['reviews', 'orders', 'community', 'referrals', 'milestone'] as const;

const CATEGORY_LABELS: Record<string, string> = {
  reviews: 'Reviews',
  orders: 'Orders',
  community: 'Community',
  referrals: 'Referrals',
  milestone: 'Milestones',
};

/* ------------------------------------------------------------------ */
/*  Animation variants                                                  */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

interface AchievementGridProps {
  grouped: Record<string, AchievementWithProgress[]>;
  unlockedCount: number;
  totalCount: number;
}

export function AchievementGrid({ grouped, unlockedCount, totalCount }: AchievementGridProps) {
  // Only render categories that have at least one achievement
  const categoriesToRender = CATEGORY_ORDER.filter(
    (cat) => (grouped[cat]?.length ?? 0) > 0
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Achievements</h2>
        <span className="text-sm text-muted-foreground font-medium">
          {unlockedCount} / {totalCount} unlocked
        </span>
      </div>

      {/* Categories */}
      {categoriesToRender.map((category) => (
        <section key={category} className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {CATEGORY_LABELS[category] ?? category}
          </h3>

          <motion.div
            className="grid grid-cols-2 gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {grouped[category].map((achievement) => (
              <motion.div key={achievement.id} variants={cardVariants}>
                <AchievementCard achievement={achievement} className="h-full" />
              </motion.div>
            ))}
          </motion.div>
        </section>
      ))}
    </div>
  );
}
