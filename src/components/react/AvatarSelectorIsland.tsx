import React, { useState, useEffect, useCallback } from 'react';
import QueryProvider from './QueryProvider';
import ErrorBoundaryWrapper from './ErrorBoundaryWrapper';
import { supabase } from '@/lib/supabase-browser';
import { useAvatarSelector } from '@/hooks/useAvatarSelector';
import AvatarSelector from '@/components/profile/AvatarSelector';

function AvatarSelectorInner() {
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

  const { avatars, selectedAvatarId, isLoading, isSelecting, selectAvatar, error } =
    useAvatarSelector(userId);

  const handleSelect = useCallback(
    (avatarId: string) => {
      selectAvatar(avatarId);
    },
    [selectAvatar],
  );

  if (!userId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        Loading avatars...
      </div>
    );
  }

  return (
    <AvatarSelector
      avatars={avatars}
      selectedAvatarId={selectedAvatarId}
      isSelecting={isSelecting}
      onSelect={handleSelect}
      error={error}
    />
  );
}

export default function AvatarSelectorIsland() {
  return (
    <ErrorBoundaryWrapper componentName="AvatarSelector">
      <QueryProvider>
        <AvatarSelectorInner />
      </QueryProvider>
    </ErrorBoundaryWrapper>
  );
}
