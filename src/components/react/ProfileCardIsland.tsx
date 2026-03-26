import React, { useState, useEffect, useMemo } from 'react';
import QueryProvider from './QueryProvider';
import ErrorBoundaryWrapper from './ErrorBoundaryWrapper';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/hooks/useUserProfile';
import ProfileCard from '@/components/profile/ProfileCard';

interface Props {
  /** Server-fetched stats passed from the Astro page */
  ordersCount: number;
  reviewsCount: number;
  snusPoints: number;
}

function ProfileCardInner({ ordersCount, reviewsCount, snusPoints }: Props) {
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

  const { profile, avatars, updateProfile, isLoading } = useUserProfile(userId);

  const avatarData = useMemo(() => {
    if (!profile?.avatar_id) return avatars[0] ?? null;
    return avatars.find((a) => a.id === profile.avatar_id) ?? avatars[0] ?? null;
  }, [profile?.avatar_id, avatars]);

  if (!userId || isLoading) {
    return null;
  }

  return (
    <ProfileCard
      profile={profile}
      avatarData={avatarData}
      stats={{ ordersCount, reviewsCount, snusPoints }}
      onSave={updateProfile}
    />
  );
}

export default function ProfileCardIsland(props: Props) {
  return (
    <ErrorBoundaryWrapper componentName="ProfileCard">
      <QueryProvider>
        <ProfileCardInner {...props} />
      </QueryProvider>
    </ErrorBoundaryWrapper>
  );
}
