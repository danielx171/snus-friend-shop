import React, { useState, useEffect } from 'react';
import QueryProvider from './QueryProvider';
import ErrorBoundaryWrapper from './ErrorBoundaryWrapper';
import { supabase } from '@/integrations/supabase/client';
import { useAchievements } from '@/hooks/useAchievements';
import { AchievementGrid } from '@/components/gamification/AchievementGrid';

function AchievementGridInner() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const { data: achievementData, isLoading } = useAchievements(userId);

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
