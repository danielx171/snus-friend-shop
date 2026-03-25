import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { SITE_URL } from '@/config/brand';
import { useLeaderboard, type LeaderboardEntry } from '@/hooks/useLeaderboard';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const MEDAL_COLORS: Record<number, { bg: string; border: string; text: string }> = {
  1: { bg: 'from-yellow-500/20 to-yellow-600/5', border: 'border-yellow-500/40', text: 'text-yellow-400' },
  2: { bg: 'from-gray-300/20 to-gray-400/5', border: 'border-gray-400/40', text: 'text-gray-300' },
  3: { bg: 'from-amber-700/20 to-amber-800/5', border: 'border-amber-700/40', text: 'text-amber-600' },
};

function getInitial(name: string | null): string {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

const LeaderboardRow = React.memo(function LeaderboardRow({
  entry,
  rank,
}: {
  entry: LeaderboardEntry;
  rank: number;
}) {
  const medal = MEDAL_COLORS[rank];
  const isTop3 = rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.3, delay: Math.min(rank * 0.04, 0.6) }}
      className={`flex items-center gap-4 rounded-2xl border p-4 transition-all duration-200 ${
        isTop3
          ? `bg-gradient-to-r ${medal!.bg} ${medal!.border} shadow-lg`
          : 'border-border/40 bg-card hover:border-white/[0.12] hover:bg-white/[0.03]'
      }`}
    >
      {/* Rank */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm ${
          isTop3
            ? `${medal!.text} bg-black/20`
            : 'text-muted-foreground bg-white/[0.04]'
        }`}
      >
        {isTop3 ? (
          <Trophy className={`h-5 w-5 ${medal!.text}`} />
        ) : (
          `#${rank}`
        )}
      </div>

      {/* Avatar */}
      {entry.avatar_url ? (
        <img
          src={entry.avatar_url}
          alt=""
          className={`shrink-0 rounded-full object-cover ${isTop3 ? 'h-12 w-12' : 'h-10 w-10'}`}
        />
      ) : (
        <div
          className={`flex shrink-0 items-center justify-center rounded-full bg-[hsl(var(--chart-4)/0.15)] text-[hsl(var(--chart-4))] font-bold ${
            isTop3 ? 'h-12 w-12 text-lg' : 'h-10 w-10 text-sm'
          }`}
        >
          {getInitial(entry.display_name)}
        </div>
      )}

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-foreground truncate ${isTop3 ? 'text-base' : 'text-sm'}`}>
          {entry.display_name || 'Anonymous'}
        </p>
        {isTop3 && (
          <p className={`text-xs font-medium ${medal!.text}`}>
            {rank === 1 ? '1st Place' : rank === 2 ? '2nd Place' : '3rd Place'}
          </p>
        )}
      </div>

      {/* Points */}
      <div className="text-right shrink-0">
        <p className={`font-bold tabular-nums ${isTop3 ? 'text-lg text-foreground' : 'text-sm text-foreground'}`}>
          {entry.total_points.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">pts</p>
      </div>
    </motion.div>
  );
});

export default function LeaderboardPage() {
  const { leaders, isLoading } = useLeaderboard();

  return (
    <Layout>
      <SEO
        title="Leaderboard | SnusFriend"
        description="See the top SnusFriend members ranked by SnusPoints. Earn points, climb the ranks, and compete for the top spot."
        canonical={`${SITE_URL}/leaderboard`}
      />

      <div className="container py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <Trophy className="h-8 w-8 text-[hsl(var(--chart-4))]" />
            Leaderboard
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Our top community members ranked by SnusPoints. Earn points through purchases, reviews, quests, and daily spins.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-[72px] rounded-2xl border border-border/40 bg-card animate-pulse"
              />
            ))}
          </div>
        ) : leaders.length === 0 ? (
          <div className="rounded-2xl border border-border/40 bg-card p-12 text-center">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">No leaderboard data yet. Start earning SnusPoints to appear here!</p>
          </div>
        ) : (
          <div className="space-y-3 max-w-2xl">
            {leaders.map((entry, i) => (
              <LeaderboardRow key={entry.user_id} entry={entry} rank={i + 1} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
