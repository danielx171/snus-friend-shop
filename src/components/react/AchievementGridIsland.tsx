import React, { useState, useEffect } from 'react';
import QueryProvider from './QueryProvider';
import ErrorBoundaryWrapper from './ErrorBoundaryWrapper';
import { supabase } from '@/integrations/supabase/client';
import { useAchievements } from '@/hooks/useAchievements';
import { AchievementGrid } from '@/components/gamification/AchievementGrid';

function AchievementGridInner() {
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
      setAuthChecked(true);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
      setAuthChecked(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const { data: achievementData, isLoading } = useAchievements(userId);

  // Still checking auth — show a brief loading state
  if (!authChecked) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        Loading achievements...
      </div>
    );
  }

  // Not logged in — show a friendly sign-in prompt instead of forever-loading
  if (!userId) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground mb-3">
          Sign in to track your achievements and earn rewards.
        </p>
        <a
          href="/login"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Sign In
        </a>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        Loading achievements...
      </div>
    );
  }

  if (!achievementData || achievementData.totalCount === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        No achievements available yet.
      </div>
    );
  }

  return (
    <AchievementGrid
      grouped={achievementData.grouped}
      unlockedCount={achievementData.unlockedCount}
      totalCount={achievementData.totalCount}
    />
  );
}

export default function AchievementGridIsland() {
  return (
    <ErrorBoundaryWrapper componentName="AchievementGrid">
      <QueryProvider>
        <AchievementGridInner />
      </QueryProvider>
    </ErrorBoundaryWrapper>
  );
}
