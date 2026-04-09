import React, { useState, useCallback } from 'react';
import QueryProvider from './QueryProvider';
import ErrorBoundaryWrapper from './ErrorBoundaryWrapper';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useSpinWheel, useSpinStatus } from '@/hooks/useSpinWheel';
import type { SpinResult } from '@/hooks/useSpinWheel';
import SpinWheel from '@/components/rewards/SpinWheel';
import PrizeReveal from '@/components/rewards/PrizeReveal';

/* Guest spin — visual only, random prize for animation */
const GUEST_PRIZES: SpinResult[] = [
  { prize_key: 'points_5',      prize_display: { icon: '💰', title: '5 SnusCoins',    description: 'SnusCoins for your balance',       type: 'points'  }, points_awarded: 5 },
  { prize_key: 'points_10',     prize_display: { icon: '💰', title: '10 SnusCoins',   description: 'SnusCoins for your balance',    type: 'points'  }, points_awarded: 10 },
  { prize_key: 'voucher_15pct', prize_display: { icon: '🎟️', title: '15% Off',     description: 'Discount on your next order',     type: 'voucher' } },
  { prize_key: 'points_25',     prize_display: { icon: '⚡', title: '25 SnusCoins',   description: 'SnusCoins for your balance',    type: 'points'  }, points_awarded: 25 },
  { prize_key: 'points_5b',     prize_display: { icon: '💰', title: '5 SnusCoins',    description: 'SnusCoins for your balance',    type: 'points'  }, points_awarded: 5 },
  { prize_key: 'free_can',      prize_display: { icon: '🎁', title: 'Free Can',    description: 'A free can with your next order', type: 'voucher' } },
  { prize_key: 'points_50',     prize_display: { icon: '⭐', title: '50 SnusCoins',   description: 'SnusCoins for your balance',    type: 'points'  }, points_awarded: 50 },
  { prize_key: 'free_month',    prize_display: { icon: '🏆', title: 'Free Month!', description: 'A free month of SnusFriend!',     type: 'jackpot' } },
];

function SpinWheelInner() {
  const { userId, authChecked } = useAuthUser();
  const spinStatus = useSpinStatus(userId);
  const spinMutation = useSpinWheel();
  const hasSpunToday = spinStatus.data === true;

  const [revealedPrize, setRevealedPrize] = useState<SpinResult | null>(null);
  const [guestHasSpun, setGuestHasSpun] = useState(false);
  const [isGuestSpin, setIsGuestSpin] = useState(false);

  const handleSpin = useCallback(async (): Promise<SpinResult> => {
    if (!userId) {
      // Guest spin — pick a random prize for the animation, no backend call
      const prize = GUEST_PRIZES[Math.floor(Math.random() * GUEST_PRIZES.length)];
      setGuestHasSpun(true);
      return prize;
    }
    return spinMutation.mutateAsync();
  }, [userId, spinMutation]);

  const handlePrizeWon = useCallback((prize: SpinResult) => {
    setIsGuestSpin(!userId);
    setRevealedPrize(prize);
  }, [userId]);

  const handleClosePrize = useCallback(() => {
    setRevealedPrize(null);
  }, []);

  // Don't render until auth is resolved — prevents flash of "Sign in" wall for
  // logged-in users on prerendered (SSG) pages where __AUTH_STATE__ is null at build time
  if (!authChecked) return null;

  const isExhausted = userId ? hasSpunToday : guestHasSpun;

  return (
    <>
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground">
          {isExhausted
            ? userId
              ? 'Come back tomorrow for another spin!'
              : 'Create a free account to claim your prize and spin daily!'
            : 'Spin the wheel once a day to win rewards'}
        </p>
      </div>

      <div className="mb-10">
        <SpinWheel
          onSpin={handleSpin}
          isSpinning={spinMutation.isPending}
          isExhausted={isExhausted}
          onPrizeWon={handlePrizeWon}
        />
      </div>

      <PrizeReveal prize={revealedPrize} onClose={handleClosePrize} guestMode={isGuestSpin} />
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
