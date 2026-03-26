import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TIERS, SNUSPOINTS } from '@/data/membership';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function MembersClub() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden grain">
      {/* Radial gradient from top-center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(60,40,100,0.12), transparent)' }}
      />
      {/* Blurred accent circle top-right */}
      <div
        className="absolute -top-12 -right-12 w-[200px] h-[200px] rounded-full pointer-events-none"
        style={{ background: 'hsl(var(--accent))', opacity: 0.04, filter: 'blur(80px)' }}
      />

      <div className="container relative">
        {/* Section heading */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/10 text-xs font-medium text-accent mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Earn {SNUSPOINTS.displayName} on every order
          </div>
          <motion.h2
            className="text-3xl font-bold text-foreground tracking-tight"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            Snus Family Club
          </motion.h2>
          <motion.p
            className="text-muted-foreground mt-2 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
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
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: isVip ? 0.35 : 0.2, ease: 'easeOut' }}
              >
                <div
                  className={cn(
                    'relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]',
                    isVip
                      ? 'bg-card/80 border-2 border-[hsl(var(--chart-4)/0.4)] shadow-[0_0_24px_hsl(var(--chart-4)/0.08)]'
                      : 'bg-card/70 border border-white/[0.15] shadow-[0_0_16px_rgba(255,255,255,0.03)]'
                  )}
                  style={isVip ? {
                    backgroundImage: 'linear-gradient(135deg, transparent 40%, hsl(var(--accent) / 0.04) 60%, transparent 80%)',
                    backgroundSize: '300% 300%',
                    animation: 'shimmer-sweep 5s ease-in-out infinite',
                  } : undefined}
                >
                  {/* Gradient header */}
                  <div className={cn('h-32 bg-gradient-to-br flex flex-col items-center justify-center gap-2 relative', tier.gradientClass)}>
                    {isVip && (
                      <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-accent text-accent-foreground z-10">
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
                  <div className={cn('p-8', isVip && 'pt-10')}>
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
                          <Check className="h-3.5 w-3.5 shrink-0 mt-0.5 text-accent" />
                          {perk}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Button asChild variant={isVip ? 'default' : 'outline'} className={cn('w-full rounded-xl transition-all duration-200 hover:scale-[1.02] hover:brightness-110', isVip && 'bg-accent text-accent-foreground')}>
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

        {/* SnusPoints callout with progress bar */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Link
            to="/membership#points"
            className="block rounded-2xl bg-accent/[0.06] border border-accent/15 p-6 hover:bg-accent/[0.08] transition-all duration-200 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-accent" />
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
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span className="font-medium text-accent">340 pts</span>
                <span>500 pts</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={{ width: '0%' }}
                  whileInView={{ width: '68%' }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                Shop €50 worth of pouches and you're already here!
              </p>
            </div>
          </Link>
        </motion.div>

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

      {/* Shimmer animation */}
      <style>{`
        @keyframes shimmer-sweep {
          0%, 100% { background-position: 200% 200%; }
          50% { background-position: -100% -100%; }
        }
      `}</style>
    </section>
  );
}
