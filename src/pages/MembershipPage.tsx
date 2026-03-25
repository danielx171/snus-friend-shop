import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, animate } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Crown, Gift, Package, Sparkles, Check, ArrowRight, ShoppingCart, Coins, Star,
} from 'lucide-react';
import { TIERS, SNUSPOINTS, MEMBERSHIP_FAQ } from '@/data/membership';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSnusPoints } from '@/hooks/useSnusPoints';
import { useMembership } from '@/hooks/useMembership';

import { SITE_URL } from '@/config/brand';

const mysteryBoxFeatures = [
  { icon: Gift, title: 'Curated selection', desc: 'Hand-picked pouches from top brands, tailored to your taste profile.' },
  { icon: Package, title: 'Surprise flavors', desc: 'Discover new favorites you wouldn\'t normally try — that\'s the fun of it.' },
  { icon: Sparkles, title: 'Exclusive products', desc: 'Limited editions and pre-release flavors available only to members.' },
];

const merchPlaceholders = [
  { label: 'Branded cans', gradient: 'from-primary/15 to-primary/5' },
  { label: 'Apparel collection', gradient: 'from-[hsl(var(--chart-4)/0.15)] to-[hsl(var(--chart-4)/0.05)]' },
  { label: 'Accessories', gradient: 'from-[hsl(var(--chart-2)/0.15)] to-[hsl(var(--chart-2)/0.05)]' },
  { label: 'Collector items', gradient: 'from-[hsl(var(--chart-1)/0.15)] to-[hsl(var(--chart-1)/0.05)]' },
];

/* Small helper: animated count-up for step cards */
function StepCounter({ inView, target, label, delay }: { inView: boolean; target: number; label: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);
  useEffect(() => {
    if (inView && !hasRun.current && ref.current) {
      hasRun.current = true;
      const controls = animate(0, target, {
        duration: 0.8,
        ease: 'easeOut',
        delay,
        onUpdate(v) { if (ref.current) ref.current.textContent = `${Math.round(v)} ${label}`; },
      });
      return () => controls.stop();
    }
  }, [inView, target, label, delay]);
  return <p className="text-sm font-semibold text-[hsl(var(--chart-2))]"><span ref={ref}>0 {label}</span></p>;
}

/* Confetti-like floating dots for celebration */
function ConfettiDots() {
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return null;

  const dots = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((i) => (
        <motion.div
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            left: `${8 + (i / 12) * 84}%`,
            top: `${20 + Math.sin(i * 1.3) * 30}%`,
            backgroundColor: i % 3 === 0 ? 'hsl(var(--chart-2))' : i % 3 === 1 ? 'hsl(var(--chart-4))' : 'hsl(var(--primary))',
          }}
          initial={{ opacity: 0, y: 10, scale: 0 }}
          animate={{ opacity: [0, 1, 0.6], y: [10, -8, -4], scale: [0, 1.2, 0.8] }}
          transition={{ duration: 2, ease: 'easeOut', repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function MembershipPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const stepsRef = useRef<HTMLDivElement>(null);
  const stepsInView = useInView(stepsRef, { once: true, margin: '-60px' });
  const barRef = useRef<HTMLDivElement>(null);
  const barInView = useInView(barRef, { once: true, margin: '-40px' });
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedCounter = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const { data: pointsData } = useSnusPoints(userId);
  const { data: membershipData } = useMembership(userId);
  const pts = pointsData?.balance ?? 0;
  const pct = Math.min((pts / SNUSPOINTS.freeTrialCost) * 100, 100);
  const remaining = Math.max(SNUSPOINTS.freeTrialCost - pts, 0);

  // For logged-out users, demo animates to 340; for logged-in, use real balance
  const displayTarget = userId ? pts : 340;
  const displayPct = Math.min((displayTarget / SNUSPOINTS.freeTrialCost) * 100, 100);

  useEffect(() => {
    if (barInView && !hasAnimatedCounter.current && counterRef.current) {
      hasAnimatedCounter.current = true;
      const controls = animate(0, displayTarget, {
        duration: userId ? 1.5 : 2,
        ease: 'easeOut',
        onUpdate(v) {
          if (counterRef.current) counterRef.current.textContent = `${Math.round(v)} / ${SNUSPOINTS.freeTrialCost}`;
        },
      });
      return () => controls.stop();
    }
  }, [barInView, displayTarget, userId]);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('save-waitlist-email', {
        body: { email: email.trim(), source: 'membership' },
      });
      if (error) throw error;
      toast.success('You\'re on the list! We\'ll notify you when memberships launch.');
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Snus Family Club — Membership & Mystery Boxes | SnusFriend"
        description="Join the Snus Family Club for monthly mystery boxes of premium nicotine pouches, exclusive discounts, and VIP vendor merchandise. Earn SnusPoints on every order."
        canonical={SITE_URL ? SITE_URL + '/membership' : undefined}
      />
      <Layout showNicotineWarning={false}>
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden grain" style={{ backgroundColor: '#FAF8F5' }}>
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[hsl(var(--chart-4)/0.08)] blur-[120px] pointer-events-none" />
          <div className="container py-20 md:py-28 relative text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(var(--chart-4)/0.3)] bg-[hsl(var(--chart-4)/0.08)] text-sm font-medium text-[hsl(var(--chart-4))] mb-6">
              <Crown className="h-4 w-4" />
              Exclusive membership
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08]">
              <span className="block font-serif text-[hsl(220_20%_15%)]">Snus Family Club</span>
              <span className="block text-[hsl(var(--chart-4))] text-[0.8em] mt-2">
                Your monthly pouch surprise
              </span>
            </h1>
            <p className="max-w-xl mx-auto text-lg text-[hsl(220_10%_45%)] leading-relaxed mt-6">
              Curated mystery boxes, exclusive discounts, and vendor merchandise — join the club and elevate your pouch experience.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Button asChild size="lg" className="gap-2 rounded-2xl h-13 px-8 bg-[hsl(var(--chart-4))] text-[hsl(220_16%_6%)] font-semibold hover:bg-[hsl(var(--chart-4)/0.9)] hover:shadow-[0_0_24px_hsl(var(--chart-4)/0.4)] transition-all">
                <a href="#tiers">
                  View Plans
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl h-13 px-8 border-[hsl(220_15%_30%/0.2)] bg-transparent">
                <a href="#points">
                  <Coins className="h-4 w-4 mr-1.5" />
                  How SnusPoints Work
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* ─── Tier Comparison ─── */}
        <section id="tiers" className="py-16 md:py-20 scroll-mt-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground tracking-tight">Choose Your Plan</h2>
              <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                Two tiers, one mission — bringing the best pouches to your doorstep every month.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {TIERS.map((tier) => {
                const Icon = tier.icon;
                const isVip = tier.id === 'vip';

                return (
                  <div
                    key={tier.id}
                    className={cn(
                      'relative rounded-2xl glass-panel overflow-hidden transition-all duration-300',
                      isVip && tier.accentBorder,
                      isVip && tier.glowClass,
                      isVip && 'membership-vip-card membership-vip-hover',
                      !isVip && 'membership-member-card membership-member-hover'
                    )}
                  >
                    {/* VIP shimmer sweep */}
                    {isVip && <div className="membership-shimmer" />}

                    {/* Header */}
                    <div className={cn('h-40 bg-gradient-to-br flex flex-col items-center justify-center gap-3 relative', tier.gradientClass)}>
                      {isVip && (
                        <Badge className="absolute top-4 right-4 bg-[hsl(var(--chart-4))] text-[hsl(220_16%_6%)] border-0 text-[10px] font-semibold membership-badge-pulse">
                          Most Popular
                        </Badge>
                      )}
                      <div className={cn(
                        'h-14 w-14 rounded-full flex items-center justify-center',
                        tier.accentBg,
                        isVip ? 'membership-crown-pulse' : 'membership-gift-float'
                      )}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className={cn('text-2xl font-bold', tier.accentText)}>{tier.name}</h3>
                      <p className="text-sm text-muted-foreground">{tier.tagline}</p>
                    </div>

                    {/* Body */}
                    <div className="p-8">
                      <div className="flex items-baseline gap-1.5 mb-1">
                        <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                        <span className="text-muted-foreground">{tier.priceNote}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6">{tier.mysteryBoxDesc}</p>

                      <ul className="space-y-3 mb-8">
                        {tier.perks.map((perk) => (
                          <li key={perk} className="flex items-start gap-3 text-sm text-foreground">
                            <Check className={cn('h-4 w-4 shrink-0 mt-0.5', tier.accentText)} />
                            {perk}
                          </li>
                        ))}
                      </ul>

                      {/* Tier status button */}
                      {(() => {
                        const currentTierId = membershipData?.currentTier?.id;
                        const isCurrentTier = userId && currentTierId === tier.id;
                        const isUpgrade = userId && currentTierId === 'member' && tier.id === 'vip';

                        if (!userId) {
                          return (
                            <Button
                              asChild
                              className={cn(
                                'w-full rounded-xl h-11 font-semibold',
                                isVip
                                  ? 'bg-[hsl(var(--chart-4))] text-[hsl(220_16%_6%)] hover:bg-[hsl(var(--chart-4)/0.9)]'
                                  : ''
                              )}
                            >
                              <Link to="/login">Sign in to see your tier</Link>
                            </Button>
                          );
                        }

                        if (isCurrentTier) {
                          return (
                            <div className="space-y-2">
                              <Button
                                disabled
                                className={cn(
                                  'w-full rounded-xl h-11 font-semibold',
                                  isVip
                                    ? 'bg-[hsl(var(--chart-4))] text-[hsl(220_16%_6%)]'
                                    : ''
                                )}
                              >
                                <Check className="h-4 w-4 mr-1.5" />
                                Your Current Tier
                              </Button>
                              {membershipData?.nextTier && !isVip && (
                                <p className="text-xs text-muted-foreground text-center">
                                  <span className="font-semibold text-foreground">{membershipData.pointsToNextTier.toLocaleString()}</span> points to {membershipData.nextTier.name}
                                </p>
                              )}
                            </div>
                          );
                        }

                        if (isUpgrade) {
                          return (
                            <div className="space-y-2">
                              <div className="w-full h-2 rounded-full bg-muted/40 overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-700"
                                  style={{
                                    width: `${membershipData?.progressPct ?? 0}%`,
                                    background: 'linear-gradient(90deg, hsl(var(--chart-2)), hsl(var(--chart-4)))',
                                  }}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground text-center">
                                <span className="font-semibold text-foreground">{membershipData?.pointsToNextTier.toLocaleString()}</span> points to unlock VIP
                              </p>
                            </div>
                          );
                        }

                        // Fallback (e.g. already VIP looking at member card)
                        return (
                          <Button
                            disabled
                            variant="outline"
                            className="w-full rounded-xl h-11 font-semibold"
                          >
                            Included in your plan
                          </Button>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Mystery Box Preview ─── */}
        <section className="py-16 md:py-20 bg-card/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground tracking-tight">What's in the Box?</h2>
              <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                Every month, a surprise selection of premium pouches — curated by our team, delivered to your door.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-3xl mx-auto">
              {mysteryBoxFeatures.map((feature) => (
                <div key={feature.title} className="group rounded-2xl glass-panel p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_hsl(0_0%_0%/0.2)]">
                  <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-[hsl(var(--chart-4)/0.15)] to-[hsl(var(--chart-4)/0.05)] flex items-center justify-center mb-4 transition-all duration-200 group-hover:shadow-[0_0_16px_hsl(var(--chart-4)/0.4)]">
                    <feature.icon className="h-7 w-7 text-[hsl(var(--chart-4))] transition-transform duration-200 group-hover:scale-[1.15]" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── VIP Merchandise Teaser ─── */}
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="text-center mb-12">
              <Badge className="bg-[hsl(var(--chart-4)/0.1)] text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4)/0.2)] mb-4">
                VIP Exclusive
              </Badge>
              <h2 className="text-3xl font-bold text-foreground tracking-tight">Vendor Merchandise</h2>
              <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                Exclusive branded gear from your favorite pouch brands — only for VIP members.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-3xl mx-auto">
              {merchPlaceholders.map((item) => (
                <div key={item.label} className="rounded-2xl glass-panel overflow-hidden">
                  <div className={cn('h-32 bg-gradient-to-br flex items-center justify-center', item.gradient)}>
                    <Package className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Coming soon</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SnusPoints ─── */}
        <section id="points" className="py-16 md:py-20 bg-card/30 scroll-mt-20">
          <div className="container">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(var(--chart-2)/0.3)] bg-[hsl(var(--chart-2)/0.08)] text-sm font-medium text-[hsl(var(--chart-2))] mb-4">
                <Coins className="h-3.5 w-3.5" />
                Loyalty Rewards
              </div>
              <h2 className="text-3xl font-bold text-foreground tracking-tight">SnusPoints</h2>
              <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                Shop, earn, redeem. Every order brings you closer to a free mystery box month.
              </p>
            </div>

            {/* 3-step visual with connecting line */}
            <div ref={stepsRef} className="relative max-w-3xl mx-auto mb-10">
              {/* Connecting line that draws itself */}
              <div className="hidden md:block absolute top-[4.5rem] left-[16.67%] right-[16.67%] h-[2px] z-0">
                <motion.div
                  className="h-full bg-gradient-to-r from-[hsl(var(--chart-2))] via-[hsl(var(--chart-2)/0.6)] to-[hsl(var(--chart-2))]"
                  initial={{ scaleX: 0 }}
                  animate={stepsInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3 relative z-10">
                {[
                  { step: 1, icon: ShoppingCart, title: 'Shop', desc: 'Buy your favorite pouches as usual.', countTo: null, countLabel: null },
                  { step: 2, icon: Coins, title: 'Earn', desc: 'Points credited on every order.', countTo: 10, countLabel: 'pts / €1' },
                  { step: 3, icon: Gift, title: 'Redeem', desc: 'Free mystery box month!', countTo: 500, countLabel: 'pts' },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, scale: 0.3, y: 20 }}
                    animate={stepsInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.3, y: 20 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.34, 1.56, 0.64, 1],
                      delay: i * 0.3,
                    }}
                    className="rounded-2xl glass-panel p-6 text-center relative"
                  >
                    <div className="absolute top-3 left-3 h-6 w-6 rounded-full bg-[hsl(var(--chart-2))] text-white text-xs font-bold flex items-center justify-center">
                      {item.step}
                    </div>
                    <div className="mx-auto h-14 w-14 rounded-full bg-[hsl(var(--chart-2)/0.1)] flex items-center justify-center mb-4 mt-2">
                      <item.icon className="h-6 w-6 text-[hsl(var(--chart-2))]" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    {item.countTo !== null ? (
                      <StepCounter inView={stepsInView} target={item.countTo} label={item.countLabel!} delay={i * 0.3 + 0.4} />
                    ) : (
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Points progress — enhanced */}
            <div ref={barRef} className="max-w-md mx-auto rounded-2xl glass-panel p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {userId ? 'Your SnusPoints' : 'SnusPoints Demo'}
                </span>
                <span ref={counterRef} className="text-sm text-muted-foreground">0 / {SNUSPOINTS.freeTrialCost}</span>
              </div>

              {/* Progress bar */}
              <div className="h-3 rounded-full bg-muted/40 overflow-hidden relative">
                {/* Milestone markers */}
                {[100, 250, 500].map((m) => (
                  <div
                    key={m}
                    className="absolute top-0 h-full w-[2px] bg-border/40 z-10"
                    style={{ left: `${(m / SNUSPOINTS.freeTrialCost) * 100}%` }}
                  />
                ))}
                <motion.div
                  className="h-full rounded-full relative"
                  style={{
                    background: 'linear-gradient(90deg, hsl(var(--chart-2)), hsl(var(--chart-4)))',
                    boxShadow: '0 0 12px hsl(65 80% 62% / 0.4), 0 0 4px hsl(65 80% 62% / 0.25)',
                  }}
                  initial={{ width: '0%' }}
                  animate={barInView ? { width: `${displayPct}%` } : { width: '0%' }}
                  transition={{ duration: userId ? 1.5 : 2, ease: 'easeOut' }}
                >
                  <motion.div
                    className="absolute right-0 top-0 h-full w-4 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at right, hsl(var(--chart-4)), transparent)',
                      boxShadow: '0 0 14px 4px hsl(var(--chart-4))',
                    }}
                    initial={{ opacity: 0.6 }}
                    animate={barInView ? { opacity: [0.6, 1, 0.6] } : { opacity: 0 }}
                    transition={{
                      duration: 2,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      delay: userId ? 1.5 : 2,
                    }}
                  />
                </motion.div>
              </div>

              {/* Milestone labels */}
              <div className="relative h-6 mt-1">
                {[
                  { value: 100, icon: Star },
                  { value: 250, icon: Sparkles },
                  { value: 500, icon: Gift },
                ].map((m) => {
                  const passed = displayTarget >= m.value;
                  const MIcon = m.icon;
                  return (
                    <div
                      key={m.value}
                      className="absolute -translate-x-1/2 flex flex-col items-center"
                      style={{ left: `${(m.value / SNUSPOINTS.freeTrialCost) * 100}%` }}
                    >
                      <span className={cn(
                        'text-[10px] font-medium flex items-center gap-0.5',
                        passed ? 'text-[hsl(var(--chart-2))]' : 'text-muted-foreground/60'
                      )}>
                        {userId && passed ? (
                          <Check className="h-3 w-3" />
                        ) : m.value === 500 ? (
                          <span>🎁</span>
                        ) : (
                          <MIcon className="h-3 w-3" />
                        )}
                        {m.value}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Status text */}
              {userId ? (
                displayTarget >= SNUSPOINTS.freeTrialCost ? (
                  /* Celebration state */
                  <div className="mt-3 text-center relative overflow-hidden rounded-xl bg-[hsl(var(--chart-2)/0.08)] border border-[hsl(var(--chart-2)/0.2)] p-4">
                    <ConfettiDots />
                    <p className="text-sm font-semibold text-[hsl(var(--chart-2))] mb-2 relative z-10">
                      🎉 You've earned a free mystery box month!
                    </p>
                    <Button disabled size="sm" className="rounded-xl bg-[hsl(var(--chart-2))] text-white relative z-10">
                      Redeem your free month <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    You're <span className="font-semibold text-foreground">{remaining}</span> points from a free mystery box month!
                  </p>
                )
              ) : (
                <div className="mt-3 text-center space-y-1.5">
                  <p className="text-xs text-muted-foreground">
                    Shop <span className="font-semibold text-foreground">€34</span> worth of pouches and you're already here! →
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link> to track your real balance.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="py-16 md:py-20">
          <div className="container max-w-2xl">
            <h2 className="text-3xl font-bold text-foreground tracking-tight text-center mb-10">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {MEMBERSHIP_FAQ.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded-xl glass-panel px-6 border-border/30"
                >
                  <AccordionTrigger className="text-sm font-medium text-foreground hover:text-primary py-4">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ─── Waitlist CTA ─── */}
        <section className="py-16 md:py-20 bg-card/30">
          <div className="container max-w-lg text-center">
            <Crown className="h-10 w-10 text-[hsl(var(--chart-4))] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">
              Be the first to join
            </h2>
            <p className="text-muted-foreground mb-6">
              Sign up for the waitlist and we'll notify you as soon as memberships launch.
            </p>
            <form onSubmit={handleWaitlist} className="flex gap-3 max-w-sm mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl flex-1"
                required
              />
              <Button type="submit" disabled={submitting} className="rounded-xl bg-[hsl(var(--chart-4))] text-[hsl(220_16%_6%)] hover:bg-[hsl(var(--chart-4)/0.9)] shrink-0">
                {submitting ? 'Saving…' : 'Join Waitlist'}
              </Button>
            </form>
          </div>
        </section>
        <style>{`
          .membership-vip-card {
            border: 2px solid transparent;
            background-clip: padding-box;
            box-shadow: 0 0 20px rgba(244, 231, 0, 0.15);
            position: relative;
          }
          .membership-vip-card::before {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: inherit;
            padding: 2px;
            background: conic-gradient(from var(--vip-angle, 0deg), hsl(65 80% 55%), hsl(65 80% 62%), rgba(255,255,255,0.5), hsl(65 80% 55%));
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            animation: membership-vip-rotate 4s linear infinite;
            pointer-events: none;
            z-index: 1;
          }
          @property --vip-angle {
            syntax: '<angle>';
            initial-value: 0deg;
            inherits: false;
          }
          @keyframes membership-vip-rotate {
            to { --vip-angle: 360deg; }
          }
          .membership-shimmer {
            position: absolute;
            inset: 0;
            overflow: hidden;
            pointer-events: none;
            z-index: 2;
            border-radius: inherit;
          }
          .membership-shimmer::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -100%;
            width: 80px;
            height: 200%;
            background: linear-gradient(
              115deg,
              transparent 20%,
              rgba(255,255,255,0.06) 50%,
              transparent 80%
            );
            animation: membership-shimmer-sweep 5s ease-in-out infinite;
          }
          @keyframes membership-shimmer-sweep {
            0% { left: -80px; }
            100% { left: calc(100% + 80px); }
          }
          .membership-crown-pulse {
            animation: membership-crown-pulse 3s ease-in-out infinite;
          }
          @keyframes membership-crown-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }

          /* Member card: border glow oscillation + hover lift */
          .membership-member-card {
            box-shadow: 0 0 20px rgba(0, 49, 138, 0.5);
            animation: membership-member-border-glow 3s ease-in-out infinite;
          }
          @keyframes membership-member-border-glow {
            0%, 100% { border-color: rgba(255,255,255,0.1); }
            50% { border-color: rgba(255,255,255,0.2); }
          }
          .membership-member-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 40px rgba(0, 49, 138, 0.35), 0 0 24px rgba(0, 49, 138, 0.5);
            border-color: rgba(255,255,255,0.25);
          }

          /* VIP card: hover lift + glow + gradient border */
          .membership-vip-hover:hover {
            transform: translateY(-6px);
            box-shadow: 0 20px 50px rgba(0,0,0,0.3), 0 0 30px rgba(244,231,0,0.25), 0 0 20px rgba(251,191,36,0.2);
            border-color: #fbbf24;
          }

          /* Most Popular badge pulse */
          .membership-badge-pulse {
            animation: membership-badge-glow 2.5s ease-in-out infinite;
          }
          @keyframes membership-badge-glow {
            0%, 100% { box-shadow: none; }
            50% { box-shadow: 0 0 16px hsl(var(--chart-4) / 0.4); }
          }

          .membership-gift-float {
            animation: membership-gift-float 2.5s ease-in-out infinite;
          }
          @keyframes membership-gift-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
        `}</style>
      </Layout>
    </>
  );
}
