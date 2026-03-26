import React, { useState, useCallback, useEffect } from 'react';
import QueryProvider from './QueryProvider';
import ErrorBoundaryWrapper from './ErrorBoundaryWrapper';
import { supabase } from '@/lib/supabase-browser';
import { useSpinWheel, useSpinStatus } from '@/hooks/useSpinWheel';
import type { SpinResult } from '@/hooks/useSpinWheel';
import SpinWheel from '@/components/rewards/SpinWheel';
import PrizeReveal from '@/components/rewards/PrizeReveal';
import { useToast } from '@/hooks/use-toast';

function SpinWheelInner() {
  const { toast } = useToast();
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

  const spinStatus = useSpinStatus(userId);
  const spinMutation = useSpinWheel();
  const hasSpunToday = spinStatus.data === true;

  const [revealedPrize, setRevealedPrize] = useState<SpinResult | null>(null);

  const handleSpin = useCallback(async (): Promise<SpinResult> => {
    if (!userId) {
      toast({
        title: 'Sign in to spin',
        description: 'Create a free account to start earning rewards.',
      });
      throw new Error('Not authenticated');
    }
    return spinMutation.mutateAsync();
  }, [userId, spinMutation, toast]);

  const handlePrizeWon = useCallback((prize: SpinResult) => {
    setRevealedPrize(prize);
  }, []);

  const handleClosePrize = useCallback(() => {
    setRevealedPrize(null);
  }, []);

  return (
    <>
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground">
          {hasSpunToday
            ? 'Come back tomorrow for another spin!'
            : 'Spin the wheel once a day to win rewards'}
        </p>
      </div>

      {!userId && (
        <div className="text-center mb-6 p-4 rounded-xl bg-muted/50 border border-border/30">
          <p className="text-sm text-muted-foreground mb-3">
            Sign in to spin the wheel and collect rewards
          </p>
          <a
            href="/login?redirect=/rewards"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition gap-2"
          >
            Sign in
          </a>
        </div>
      )}

      <div className="mb-10">
        <SpinWheel
          onSpin={handleSpin}
          isSpinning={spinMutation.isPending}
          isExhausted={hasSpunToday || !userId}
          onPrizeWon={handlePrizeWon}
        />
      </div>

      <PrizeReveal prize={revealedPrize} onClose={handleClosePrize} />
    </>
  );
}

export default function SpinWheelIsland() {
  return (
    <ErrorBoundaryWrapper componentName="SpinWheel">
      <QueryProvider>
        <SpinWheelInner />
      </QueryProvider>
    </ErrorBoundaryWrapper>
  );
}
