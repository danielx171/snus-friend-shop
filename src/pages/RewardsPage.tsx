import { useState, useCallback, useEffect } from 'react';
import { navigate } from 'vike/client/router';
import { Coins, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useSnusPoints } from '@/hooks/useSnusPoints';
import { useSpinWheel, useSpinStatus } from '@/hooks/useSpinWheel';
import { useVouchers } from '@/hooks/useVouchers';
import { useQuests } from '@/hooks/useQuests';
import type { SpinResult } from '@/hooks/useSpinWheel';
import { SEO } from '@/components/seo/SEO';
import { SITE_URL } from '@/config/brand';
import SpinWheel from '@/components/rewards/SpinWheel';
import PrizeReveal from '@/components/rewards/PrizeReveal';
import VoucherList from '@/components/rewards/VoucherList';
import QuestBoard from '@/components/quests/QuestBoard';
import PointsRedemption from '@/components/rewards/PointsRedemption';
import StreakBanner from '@/components/rewards/StreakBanner';
import ReputationCard from '@/components/profile/ReputationCard';
import WeeklyChallenges from '@/components/rewards/WeeklyChallenges';
import { useLoginStreak } from '@/hooks/useLoginStreak';
import { useWeeklyChallenges } from '@/hooks/useWeeklyChallenges';
import { useSeasonalEvents, useJoinEvent } from '@/hooks/useSeasonalEvents';
import SeasonalBanner from '@/components/events/SeasonalBanner';
import EventCard from '@/components/events/EventCard';

/* ------------------------------------------------------------------ */
/*  Tab type                                                           */
/* ------------------------------------------------------------------ */

type Tab = 'spin' | 'quests' | 'vouchers' | 'redeem';

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function RewardsPage() {
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

  /* ---- Active tab ---- */
  const [activeTab, setActiveTab] = useState<Tab>('spin');

  /* ---- Data hooks ---- */
  const pointsQuery = useSnusPoints(userId);
  const spinStatus = useSpinStatus(userId);
  const spinMutation = useSpinWheel();
  const vouchersQuery = useVouchers(userId);
  const questsQuery = useQuests(userId);
  const loginStreak = useLoginStreak(userId);
  const challengesQuery = useWeeklyChallenges(userId);
  const eventsQuery = useSeasonalEvents(userId);
  const joinEventMutation = useJoinEvent();

  const hasSpunToday = spinStatus.data === true;

  const handleJoinEvent = useCallback((eventId: string) => {
    if (!userId) {
      toast({ title: 'Sign in to join', description: 'Create a free account to participate in events.' });
      return;
    }
    joinEventMutation.mutate({ eventId, userId });
  }, [userId, joinEventMutation, toast]);

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

  const handleApplyVoucher = useCallback((_id: string) => {
    toast({ title: 'Voucher applied', description: 'Discount will be applied at checkout.' });
    // Future: wire to cart context
  }, [toast]);

  const handleClaimVoucher = useCallback((_id: string) => {
    toast({ title: 'Voucher claimed', description: 'The product has been added to your cart.' });
    // Future: wire to cart context
  }, [toast]);

  /* ------------------------------------------------------------------ */
  /*  Tab config                                                         */
  /* ------------------------------------------------------------------ */

  const tabs: { id: Tab; label: string }[] = [
    { id: 'spin', label: 'Spin' },
    { id: 'quests', label: 'Quests' },
    { id: 'vouchers', label: 'Vouchers' },
    { id: 'redeem', label: 'Redeem' },
  ];

  return (
    <Layout>
      <SEO
        title="Rewards & SnusPoints | SnusFriend"
        description="Earn SnusPoints with every purchase. Spin the daily wheel, complete quests, and unlock exclusive rewards."
        canonical={`${SITE_URL}/rewards`}
      />
      <div className="container mx-auto max-w-2xl px-4 py-8">

        {/* Seasonal event banner */}
        {eventsQuery.data?.map((event) => (
          <SeasonalBanner
            key={event.id}
            event={event}
            userId={userId}
            onJoin={handleJoinEvent}
            isJoining={joinEventMutation.isPending}
          />
        ))}

        {/* Streak banner */}
        {userId && (
          <StreakBanner
            streak={loginStreak.streak}
            longestStreak={loginStreak.longestStreak}
            totalDays={loginStreak.totalDays}
            isLoading={loginStreak.isLoading}
          />
        )}

        {/* Reputation level */}
        {userId && <ReputationCard userId={userId} />}

        {/* Points balance strip */}
        <div className="flex items-center justify-between rounded-xl bg-card border border-border/40 px-5 py-3 mb-6">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">SnusPoints</span>
          </div>
          <span className="text-lg font-bold tabular-nums">
            {pointsQuery.data?.balance ?? 0}
          </span>
        </div>

        {/* Tab bar */}
        <div className="flex rounded-xl bg-muted/50 border border-border/30 p-1 mb-6 gap-1">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 text-sm font-medium py-2 px-3 rounded-lg transition-all ${
                activeTab === id
                  ? 'bg-card text-foreground shadow-sm border border-border/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-pressed={activeTab === id}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ---- Spin tab ---- */}
        {activeTab === 'spin' && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-1">Daily Spin</h2>
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

            <div className="mb-10">
              <SpinWheel
                onSpin={handleSpin}
                isSpinning={spinMutation.isPending}
                isExhausted={hasSpunToday || !userId}
                onPrizeWon={handlePrizeWon}
              />
            </div>
          </>
        )}

        {/* ---- Quests tab ---- */}
        {activeTab === 'quests' && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-1">Quests</h2>
              <p className="text-sm text-muted-foreground">
                Complete quests to earn SnusPoints and unlock exclusive avatars
              </p>
            </div>

            {!userId && (
              <div className="text-center mb-6 p-4 rounded-xl bg-muted/50 border border-border/30">
                <p className="text-sm text-muted-foreground mb-3">
                  Sign in to track your quest progress
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

            <QuestBoard
              quests={questsQuery.data ?? []}
              isLoading={questsQuery.isLoading}
            />

            {/* Active seasonal events */}
            {eventsQuery.data && eventsQuery.data.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-3">Seasonal Events</h3>
                <div className="space-y-4">
                  {eventsQuery.data.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      userId={userId}
                      onJoin={handleJoinEvent}
                      isJoining={joinEventMutation.isPending}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ---- Vouchers tab ---- */}
        {activeTab === 'vouchers' && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-1">Your Vouchers</h2>
              <p className="text-sm text-muted-foreground">
                Redeem your earned vouchers at checkout
              </p>
            </div>

            {userId ? (
              <VoucherList
                vouchers={vouchersQuery.data ?? []}
                onApply={handleApplyVoucher}
                onClaim={handleClaimVoucher}
              />
            ) : (
              <div className="text-center mb-8 p-4 rounded-xl bg-muted/50 border border-border/30">
                <p className="text-sm text-muted-foreground mb-3">
                  Sign in to see your vouchers
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
          </>
        )}

        {/* ---- Redeem tab ---- */}
        {activeTab === 'redeem' && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-1">Redeem Points</h2>
              <p className="text-sm text-muted-foreground">
                Spend your SnusPoints on discounts and rewards
              </p>
            </div>

            {userId ? (
              <PointsRedemption balance={pointsQuery.data?.balance ?? 0} />
            ) : (
              <div className="text-center mb-8 p-4 rounded-xl bg-muted/50 border border-border/30">
                <p className="text-sm text-muted-foreground mb-3">
                  Sign in to redeem your points
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
          </>
        )}

        {/* ---- Weekly Challenges ---- */}
        <div className="mt-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-1">Weekly Challenges</h2>
            <p className="text-sm text-muted-foreground">
              Join time-limited group goals to earn bonus SnusPoints
            </p>
          </div>
          <WeeklyChallenges
            challenges={challengesQuery.data ?? []}
            isLoading={challengesQuery.isLoading}
            onJoin={(id) => challengesQuery.joinChallenge.mutate(id)}
            isJoining={challengesQuery.joinChallenge.isPending}
          />
        </div>

      </div>

      {/* Prize reveal overlay */}
      <PrizeReveal prize={revealedPrize} onClose={handleClosePrize} />
    </Layout>
  );
}
