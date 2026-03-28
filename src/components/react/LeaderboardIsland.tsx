import React, { useState, useEffect, useCallback, useMemo } from 'react';
import QueryProvider from './QueryProvider';
import ErrorBoundaryWrapper from './ErrorBoundaryWrapper';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  user_id: string;
  total_points: number;
  display_name: string | null;
  avatar_url: string | null;
  level_name?: string;
  badge_color?: string;
}

/** Medal emoji for top 3 */
function rankBadge(rank: number): string | null {
  if (rank === 1) return '\u{1F947}';
  if (rank === 2) return '\u{1F948}';
  if (rank === 3) return '\u{1F949}';
  return null;
}

const LeaderboardRow = React.memo(function LeaderboardRow({
  entry,
  rank,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  rank: number;
  isCurrentUser: boolean;
}) {
  const medal = rankBadge(rank);
  const displayName = entry.display_name || 'Anonymous Pouch Fan';

  return (
    <div
      className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
        isCurrentUser
          ? 'bg-primary/15 ring-1 ring-primary/30'
          : 'bg-muted/40 hover:bg-muted/60'
      }`}
    >
      {/* Rank */}
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          rank <= 3
            ? 'bg-primary/10 text-primary'
            : 'bg-muted text-muted-foreground'
        }`}
        aria-label={`Rank ${rank}`}
      >
        {medal ?? rank}
      </span>

      {/* Avatar */}
      {entry.avatar_url ? (
        <img
          src={entry.avatar_url}
          alt=""
          className="h-9 w-9 shrink-0 rounded-full object-cover border border-border"
          loading="lazy"
        />
      ) : (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold border border-border">
          {displayName.charAt(0).toUpperCase()}
        </span>
      )}

      {/* Name + Level */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {displayName}
          {isCurrentUser && (
            <span className="ml-1.5 text-xs text-primary font-normal">(you)</span>
          )}
        </p>
        {entry.level_name && (
          <span
            className="inline-block mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium leading-tight"
            style={{
              backgroundColor: `${entry.badge_color ?? 'hsl(var(--primary))'}20`,
              color: entry.badge_color ?? 'hsl(var(--primary))',
            }}
          >
            {entry.level_name}
          </span>
        )}
      </div>

      {/* Points */}
      <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
        {entry.total_points.toLocaleString()}
        <span className="ml-0.5 text-xs font-normal text-muted-foreground">pts</span>
      </span>
    </div>
  );
});

/** Loading skeleton */
function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
          <span className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          <span className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 w-28 rounded bg-muted animate-pulse" />
            <div className="h-3 w-16 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-4 w-14 rounded bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function LeaderboardInner() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    supabase.auth.getSession().then(({ data }) => {
      setCurrentUserId(data.session?.user?.id ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch top 20 from leaderboard view
      const { data: leaderboardData, error: lbError } = await supabase
        .from('leaderboard_top_users')
        .select('user_id, total_points, display_name, avatar_url')
        .order('total_points', { ascending: false })
        .limit(20);

      if (lbError) throw lbError;
      if (!leaderboardData || leaderboardData.length === 0) {
        setEntries([]);
        return;
      }

      // Fetch reputation data for level names and badge colors
      const userIds = leaderboardData.map((u) => u.user_id);
      const { data: repData } = await supabase
        .from('user_reputation')
        .select('user_id, level_name, badge_color')
        .in('user_id', userIds);

      const repMap = new Map(
        (repData ?? []).map((r: { user_id: string; level_name: string; badge_color: string }) => [
          r.user_id,
          { level_name: r.level_name, badge_color: r.badge_color },
        ])
      );

      const combined: LeaderboardEntry[] = leaderboardData.map((u) => ({
        ...u,
        level_name: repMap.get(u.user_id)?.level_name,
        badge_color: repMap.get(u.user_id)?.badge_color,
      }));

      setEntries(combined);
    } catch (err) {
      console.error('[Leaderboard] Fetch error:', err);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchLeaderboard();
    }
  }, [mounted, fetchLeaderboard]);

  // Check if current user is in the top list
  const currentUserInList = useMemo(
    () => currentUserId != null && entries.some((e) => e.user_id === currentUserId),
    [currentUserId, entries]
  );

  if (!mounted) return null;

  return (
    <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold">Leaderboard</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Live
        </span>
      </div>

      {loading && <LeaderboardSkeleton />}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <button
            onClick={fetchLeaderboard}
            className="mt-2 text-xs font-medium text-primary hover:underline"
            type="button"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="rounded-lg bg-muted/40 p-8 text-center">
          <p className="text-muted-foreground text-sm">
            No rankings yet. Be the first to earn points!
          </p>
          <a
            href="/products"
            className="mt-3 inline-flex items-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
          >
            Start Shopping
          </a>
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <>
          <div className="space-y-2">
            {entries.map((entry, idx) => (
              <LeaderboardRow
                key={entry.user_id}
                entry={entry}
                rank={idx + 1}
                isCurrentUser={entry.user_id === currentUserId}
              />
            ))}
          </div>

          {currentUserId && !currentUserInList && (
            <div className="mt-4 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3 text-center">
              <p className="text-sm text-muted-foreground">
                Keep earning points to make the leaderboard!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const LeaderboardIsland = React.memo(function LeaderboardIsland() {
  return (
    <ErrorBoundaryWrapper componentName="Leaderboard">
      <QueryProvider>
        <LeaderboardInner />
      </QueryProvider>
    </ErrorBoundaryWrapper>
  );
});

export default LeaderboardIsland;
