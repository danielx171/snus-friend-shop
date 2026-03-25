import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, ArrowRight, Coins, Check } from 'lucide-react';
import { TIERS, SNUSPOINTS, type MembershipTier } from '@/data/membership';
import { cn } from '@/lib/utils';
import { useSnusPoints } from '@/hooks/useSnusPoints';

interface MembershipAccountTabProps {
  userId?: string | null;
  tier?: MembershipTier | null;
}

export function MembershipAccountTab({ userId = null, tier = null }: MembershipAccountTabProps) {
  const { data: pointsData } = useSnusPoints(userId);
  const points = pointsData?.balance ?? 0;
  const progress = Math.min((points / SNUSPOINTS.freeTrialCost) * 100, 100);
  const pointsRemaining = Math.max(SNUSPOINTS.freeTrialCost - points, 0);

  return (
    <div className="space-y-6">
      {/* SnusPoints Balance */}
      <Card className="glass-panel border-border/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-[hsl(var(--chart-2)/0.1)] flex items-center justify-center">
              <Coins className="h-5 w-5 text-[hsl(var(--chart-2))]" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{SNUSPOINTS.displayName}</h3>
              <p className="text-xs text-muted-foreground">Earn points on every order</p>
            </div>
            <span className="ml-auto text-2xl font-bold text-foreground">{points}</span>
          </div>

          <div className="h-2.5 rounded-full bg-muted/40 overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-[hsl(var(--chart-2))] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{points} / {SNUSPOINTS.freeTrialCost} points</span>
            {pointsRemaining > 0 ? (
              <span>{pointsRemaining} more for a free mystery box</span>
            ) : (
              <span className="text-[hsl(var(--chart-2))] font-medium">Ready to redeem!</span>
            )}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-muted/20 border border-border/20">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">How to earn:</span> You get {SNUSPOINTS.pointsPerEuro} {SNUSPOINTS.displayName} for every €1 you spend. Reach {SNUSPOINTS.freeTrialCost} points and redeem for a free mystery box month!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Membership Status */}
      {tier ? (
        /* Active member state (future) */
        <Card className="glass-panel border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="h-5 w-5 text-[hsl(var(--chart-4))]" />
              <h3 className="font-semibold text-foreground">Your Membership</h3>
              <Badge className="ml-auto bg-[hsl(var(--chart-4)/0.1)] text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4)/0.2)]">
                {tier === 'vip' ? 'VIP' : 'Member'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Mystery boxes are on the way — stay tuned!</p>
          </CardContent>
        </Card>
      ) : (
        /* Not a member — pitch */
        <Card className="glass-panel border-border/30 relative overflow-hidden">
          <Badge className="absolute top-4 right-4 bg-[hsl(var(--chart-4)/0.1)] text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4)/0.2)]">
            Coming Soon
          </Badge>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-[hsl(var(--chart-4)/0.1)] flex items-center justify-center">
                <Crown className="h-5 w-5 text-[hsl(var(--chart-4))]" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Join the Snus Family Club</h3>
                <p className="text-xs text-muted-foreground">Monthly mystery boxes & exclusive perks</p>
              </div>
            </div>

            {/* Mini tier cards */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {TIERS.map((t) => {
                const Icon = t.icon;
                return (
                  <div key={t.id} className={cn('rounded-xl border p-3', t.id === 'vip' ? t.accentBorder : 'border-border/30')}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={cn('h-4 w-4', t.accentText)} />
                      <span className="text-sm font-semibold text-foreground">{t.name}</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">{t.price}<span className="text-xs text-muted-foreground font-normal">{t.priceNote}</span></p>
                    <ul className="mt-2 space-y-1">
                      {t.perks.slice(0, 2).map((perk) => (
                        <li key={perk} className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
                          <Check className={cn('h-3 w-3 shrink-0 mt-0.5', t.accentText)} />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <Button asChild className="w-full rounded-xl bg-[hsl(var(--chart-4))] text-[hsl(220_16%_6%)] hover:bg-[hsl(var(--chart-4)/0.9)]">
              <Link to="/membership">
                Learn More
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
