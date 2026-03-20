import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Crown, Gift, Package, Sparkles, Check, ArrowRight, ShoppingCart, Coins,
} from 'lucide-react';
import { TIERS, SNUSPOINTS, MEMBERSHIP_FAQ } from '@/data/membership';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSnusPoints } from '@/hooks/useSnusPoints';

const SITE_URL = import.meta.env.VITE_SITE_URL as string | undefined;

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

export default function MembershipPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
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

  const { data: pointsData } = useSnusPoints(userId);

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
                      isVip && tier.glowClass
                    )}
                  >
                    {/* Header */}
                    <div className={cn('h-40 bg-gradient-to-br flex flex-col items-center justify-center gap-3 relative', tier.gradientClass)}>
                      {isVip && (
                        <Badge className="absolute top-4 right-4 bg-[hsl(var(--chart-4))] text-[hsl(220_16%_6%)] border-0 text-[10px] font-semibold">
                          Most Popular
                        </Badge>
                      )}
                      <div className={cn('h-14 w-14 rounded-full flex items-center justify-center', tier.accentBg)}>
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

                      <Button
                        disabled
                        className={cn(
                          'w-full rounded-xl h-11 font-semibold',
                          isVip
                            ? 'bg-[hsl(var(--chart-4))] text-[hsl(220_16%_6%)]'
                            : ''
                        )}
                      >
                        Coming Soon
                      </Button>
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
                <div key={feature.title} className="rounded-2xl glass-panel p-6 text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-[hsl(var(--chart-4)/0.15)] to-[hsl(var(--chart-4)/0.05)] flex items-center justify-center mb-4">
                    <feature.icon className="h-7 w-7 text-[hsl(var(--chart-4))]" />
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

            {/* 3-step visual */}
            <div className="grid gap-6 md:grid-cols-3 max-w-3xl mx-auto mb-10">
              {[
                { step: 1, icon: ShoppingCart, title: 'Shop', desc: 'Buy your favorite pouches as usual.' },
                { step: 2, icon: Coins, title: 'Earn', desc: `Get ${SNUSPOINTS.pointsPerEuro} SnusPoints per €1 spent.` },
                { step: 3, icon: Gift, title: 'Redeem', desc: `${SNUSPOINTS.freeTrialCost} points = 1 free mystery box month.` },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl glass-panel p-6 text-center relative">
                  <div className="absolute top-3 left-3 h-6 w-6 rounded-full bg-[hsl(var(--chart-2))] text-white text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                  <div className="mx-auto h-14 w-14 rounded-full bg-[hsl(var(--chart-2)/0.1)] flex items-center justify-center mb-4 mt-2">
                    <item.icon className="h-6 w-6 text-[hsl(var(--chart-2))]" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Points progress */}
            {(() => {
              const pts = pointsData?.balance ?? 0;
              const pct = Math.min((pts / SNUSPOINTS.freeTrialCost) * 100, 100);
              const remaining = Math.max(SNUSPOINTS.freeTrialCost - pts, 0);
              return (
                <div className="max-w-md mx-auto rounded-2xl glass-panel p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {userId ? 'Your SnusPoints' : 'SnusPoints Example'}
                    </span>
                    <span className="text-sm text-muted-foreground">{pts} / {SNUSPOINTS.freeTrialCost}</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted/40 overflow-hidden">
                    <div className="h-full rounded-full bg-[hsl(var(--chart-2))] transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {remaining > 0
                      ? `${remaining} more points until your free mystery box month!`
                      : 'You have enough points to redeem a free mystery box month!'}
                  </p>
                  {!userId && (
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      <Link to="/login" className="text-primary hover:underline">Sign in</Link> to see your balance.
                    </p>
                  )}
                </div>
              );
            })()}
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
      </Layout>
    </>
  );
}
