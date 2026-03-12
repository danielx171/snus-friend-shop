import { Shield, Truck, Star, RefreshCw, Award, Heart } from 'lucide-react';

const reasons = [
  {
    icon: Star,
    title: 'Trusted by thousands',
    description: 'Over 10,000 happy customers across the UK and EU. Rated 4.8★ on Trustpilot.',
  },
  {
    icon: Truck,
    title: 'Lightning-fast delivery',
    description: 'Same-day dispatch on orders placed before 2pm. Free delivery over £25.',
  },
  {
    icon: Award,
    title: 'Earn loyalty points',
    description: 'Every purchase earns you points towards exclusive discounts and free products.',
  },
  {
    icon: Shield,
    title: '100% authentic products',
    description: 'We only stock genuine products from authorised distributors. No fakes, ever.',
  },
  {
    icon: RefreshCw,
    title: 'Subscribe & save 10%',
    description: 'Set up a subscription and save 10% on every order. Pause or cancel anytime.',
  },
  {
    icon: Heart,
    title: 'Expert customer care',
    description: 'Our UK-based team is here to help with product advice and any questions.',
  },
];

export function WhySnusFriends() {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-3">
            Why SnusFriend?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We make it easy to find and enjoy premium nicotine pouches, delivered fast to your door.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className="rounded-2xl glass-panel p-6 hover:border-primary/20 transition-all group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/15 mb-4 group-hover:glow-primary transition-all">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{reason.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
