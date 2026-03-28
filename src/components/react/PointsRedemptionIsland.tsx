import { useSnusPoints } from '@/hooks/useSnusPoints';
import PointsRedemption from '@/components/rewards/PointsRedemption';
import QueryProvider from './QueryProvider';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

function PointsRedemptionInner() {
  const [userId, setUserId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  const { data: points } = useSnusPoints();
  const balance = points?.balance ?? 0;

  if (!mounted) return null;

  if (!userId) {
    return (
      <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-8 text-center">
        <p className="text-muted-foreground mb-4">Sign in to redeem your points for rewards.</p>
        <a
          href="/login"
          className="inline-flex items-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
        >
          Sign In
        </a>
      </div>
    );
  }

  return <PointsRedemption balance={balance} />;
}

export default function PointsRedemptionIsland() {
  return (
    <QueryProvider>
      <PointsRedemptionInner />
    </QueryProvider>
  );
}
