import React, { useCallback } from 'react';
import { Coins, Loader2, Gift, Truck, Package, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRedeemPoints } from '@/hooks/useRedeemPoints';
import { tenant } from '@/config/tenant';
import { loyaltyCurrencyName } from '@/lib/loyalty';

/* ------------------------------------------------------------------ */
/*  Rewards catalog (mirrors edge-function REWARDS config)             */
/* ------------------------------------------------------------------ */

const REWARDS = [
  {
    type: 'free_shipping',
    name: 'Free Shipping',
    description: 'Free shipping on your next order',
    cost: 150,
    icon: Truck,
  },
  {
    type: 'discount_5',
    name: '€5 Off',
    description: 'Get €5 off your next order',
    cost: 200,
    icon: Tag,
  },
  {
    type: 'discount_10',
    name: '€10 Off',
    description: 'Get €10 off your next order',
    cost: 350,
    icon: Tag,
  },
  {
    type: 'mystery_box',
    name: 'Mystery Box',
    description: 'A curated box of 5 pouches picked by our team — surprise flavours and strengths',
    cost: 500,
    icon: Package,
  },
  {
    type: 'mystery_box_founders',
    name: "Founder's Edition Box",
    description: `DOUBLE loot: 10 curated pouches + exclusive ${tenant.name} merch. Limited to first 10 redeemers!`,
    cost: 500,
    icon: Gift,
    limited: true,
    maxRedemptions: 10,
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface Props {
  balance: number;
}

const PointsRedemption = React.memo(function PointsRedemption({ balance }: Props) {
  const { toast } = useToast();
  const redeemMutation = useRedeemPoints();

  const handleRedeem = useCallback(
    async (rewardType: string, rewardName: string) => {
      try {
        await redeemMutation.mutateAsync(rewardType);
        toast({
          title: 'Reward redeemed!',
          description: `${rewardName} has been added to your vouchers.`,
        });
      } catch {
        toast({
          title: 'Redemption failed',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    },
    [redeemMutation, toast],
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      {REWARDS.map((reward) => {
        const Icon = reward.icon;
        const canAfford = balance >= reward.cost;
        const isRedeeming =
          redeemMutation.isPending &&
          redeemMutation.variables === reward.type;

        return (
          <div
            key={reward.type}
            className="flex flex-col rounded-xl glass-panel p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-1 ml-auto text-sm font-semibold tabular-nums">
                <Coins className="h-3.5 w-3.5 text-primary" />
                {reward.cost}
              </div>
            </div>

            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="text-sm font-semibold">{reward.name}</h3>
              {'limited' in reward && reward.limited && (
                <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-400 uppercase tracking-wider">
                  Limited
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-3 flex-1">
              {reward.description}
            </p>

            <Button
              size="sm"
              variant={canAfford ? 'default' : 'secondary'}
              disabled={!canAfford || isRedeeming}
              onClick={() => handleRedeem(reward.type, reward.name)}
              className="w-full"
              aria-label={`Redeem ${reward.name} for ${reward.cost} ${loyaltyCurrencyName}`}
            >
              {isRedeeming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : canAfford ? (
                'Redeem'
              ) : (
                `Not enough ${loyaltyCurrencyName}`
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
});

export default PointsRedemption;
