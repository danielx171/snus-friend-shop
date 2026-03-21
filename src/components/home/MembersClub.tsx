import { Link } from 'react-router-dom';
import { ArrowRight, Check, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TIERS, SNUSPOINTS } from '@/data/membership';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function MembersClub() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden grain">
      {/* Warm background */}
      <div className="absolute inset-0 bg-muted/5 pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[hsl(var(--chart-4)/0.06)] blur-[120px] pointer-events-none" />

      <div className="container relative">
        {/* Section heading */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(var(--chart-4)/0.3)] bg-[hsl(var(--chart-4)/0.08)] text-sm font-medium text-[hsl(var(--chart-4))] mb-4">
            <Coins className="h-3.5 w-3.5" />
            Earn {SNUSPOINTS.displayName} on every order
          </div>
          <motion.h2
            className="text-3xl font-bold text-foreground tracking-tight"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            Snus Family Club
          </motion.h2>
          <motion.p
            className="text-muted-foreground mt-2 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            Monthly mystery boxes, exclusive discounts, and vendor merchandise — unlock the full SnusFriend experience.
          </motion.p>
        </div>

        {/* Tier cards */}
        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto mb-8">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            const isVip = tier.id === 'vip';

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <div
                  className={cn(
                    'relative rounded-2xl glass-panel overflow-hidden transition-all duration-300 hover:scale-[1.02]',
                    isVip && tier.accentBorder,
                    isVip && tier.glowClass
                  )}
                >
                  {/* Gradient header */}
                  <div className={cn('h-32 bg-gradient-to-br flex flex-col items-center justify-center gap-2 relative', tier.gradientClass)}>
                    {isVip && (
                      <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[hsl(var(--chart-4))] text-[hsl(220_16%_6%)]">
                        Most Popular
                      </span>
                    )}
                    <div className={cn('h-12 w-12 rounded-full flex items-center justify-center', tier.accentBg)}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className={cn('text-xl font-bold', tier.accentText)}>{tier.name}</h3>
                    <p className="text-xs text-muted-foreground">{tier.tagline}</p>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                      <span className="text-sm text-muted-foreground">{tier.priceNote}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-5">
                      {tier.mysteryBoxLabel} — {tier.discount}
                    </p>

                    {/* Perks */}
                    <ul className="space-y-2.5 mb-6">
                      {tier.perks.slice(0, 4).map((perk) => (
                        <li key={perk} className="flex items-start gap-2.5 text-sm text-foreground">
                          <Check className={cn('h-4 w-4 shrink-0 mt-0.5', tier.accentText)} />
                          {perk}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Button asChild variant={isVip ? 'default' : 'outline'} className={cn('w-full rounded-xl', isVip && 'bg-[hsl(var(--chart-4))] text-[hsl(220_16%_6%)] hover:bg-[hsl(var(--chart-4)/0.9)]')}>
                      <Link to="/membership">
                        Join Waitlist
                        <ArrowRight className="h-4 w-4 ml-1.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* SnusPoints callout */}
        <div className="max-w-3xl mx-auto">
          <Link
            to="/membership#points"
            className="flex items-center gap-4 rounded-2xl glass-panel p-5 hover:border-[hsl(var(--chart-2)/0.3)] transition-all duration-200 group"
          >
            <div className="h-10 w-10 rounded-full bg-[hsl(var(--chart-2))] flex items-center justify-center shrink-0">
              <Coins className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">
                Earn {SNUSPOINTS.displayName} on every order
              </p>
              <p className="text-xs text-muted-foreground">
                {SNUSPOINTS.pointsPerEuro} points per €1 spent — redeem {SNUSPOINTS.freeTrialCost} points for a free mystery box month!
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Learn more link */}
        <div className="text-center mt-8">
          <Link
            to="/membership"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Learn more about the Snus Family Club
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}