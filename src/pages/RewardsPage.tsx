import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useSnusPoints } from '@/hooks/useSnusPoints';
import { useSpinWheel, useSpinStatus } from '@/hooks/useSpinWheel';
import { useVouchers } from '@/hooks/useVouchers';
import type { SpinResult } from '@/hooks/useSpinWheel';
import { SEO } from '@/components/seo/SEO';
import SpinWheel from '@/components/rewards/SpinWheel';
import PrizeReveal from '@/components/rewards/PrizeReveal';
import VoucherList from '@/components/rewards/VoucherList';

export default function RewardsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  /* ---- Auth state ---- */
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* ---- Data hooks ---- */
  const pointsQuery = useSnusPoints(userId);
  const spinStatus = useSpinStatus(userId);
  const spinMutation = useSpinWheel();
  const vouchersQuery = useVouchers(userId);

  const hasSpunToday = spinStatus.data === true;

  /* ---- Prize reveal ---- */
  const [revealedPrize, setRevealedPrize] = useState<SpinResult | null>(null);

  const handleSpin = useCallback(async (): Promise<SpinResult> => {
    if (!userId) {
      toast({ title: 'Sign in to spin', description: 'Create a free account to start earning rewards.' });
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

  const handleApplyVoucher = useCallback((id: string) => {
    toast({ title: 'Voucher applied', description: 'Discount will be applied at checkout.' });
    // Future: wire to cart context
  }, [toast]);

  const handleClaimVoucher = useCallback((id: string) => {
    toast({ title: 'Voucher claimed', description: 'The product has been added to your cart.' });
    // Future: wire to cart context
  }, [toast]);

  return (
    <Layout>
      <SEO
        title="Daily Spin & Rewards | SnusFriend"
        description="Spin the wheel daily to win SnusPoints, vouchers, and free products. Earn rewards every time you shop at SnusFriend."
      />
      <div className="container mx-auto max-w-lg px-4 py-8">
        {/* Points balance strip */}
        <div className="flex items-center justify-between rounded-xl bg-card border border-border/40 px-5 py-3 mb-8">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">SnusPoints</span>
          </div>
          <span className="text-lg font-bold tabular-nums">
            {pointsQuery.data?.balance ?? 0}
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-1">Daily Spin</h1>
          <p className="text-sm text-muted-foreground">
            {hasSpunToday
              ? 'Come back tomorrow for another spin!'
              : 'Spin the wheel once a day to win rewards'}
          </p>
        </div>

        {/* Spin Wheel */}
        <div className="mb-10">
          <SpinWheel
            onSpin={handleSpin}
            isSpinning={spinMutation.isPending}
            isExhausted={hasSpunToday}
            onPrizeWon={handlePrizeWon}
          />
        </div>

        {/* Not logged in prompt */}
        {!userId && (
          <div className="text-center mb-8 p-4 rounded-xl bg-muted/50 border border-border/30">
            <p className="text-sm text-muted-foreground mb-3">
              Sign in to spin the wheel and collect rewards
            </p>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/login')}
              className="gap-2"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Button>
          </div>
        )}

        {/* Vouchers */}
        {userId && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Your Vouchers</h2>
            <VoucherList
              vouchers={vouchersQuery.data ?? []}
              onApply={handleApplyVoucher}
              onClaim={handleClaimVoucher}
            />
          </div>
        )}
      </div>

      {/* Prize reveal overlay */}
      <PrizeReveal prize={revealedPrize} onClose={handleClosePrize} />
    </Layout>
  );
}
