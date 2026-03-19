import { Shield, Truck, Package, Heart } from 'lucide-react';

const reasons = [
  {
    icon: Package,
    title: '700+ products',
    description: 'Browse 91 brands and over 700 nicotine pouch products — one of the largest selections in Europe.',
  },
  {
    icon: Truck,
    title: 'Fast EU shipping',
    description: 'We ship across the EU and UK with DHL and UPS. Choose economy or express at checkout.',
  },
  {
    icon: Shield,
    title: '100% authentic products',
    description: 'We only stock genuine products from authorised distributors. No fakes, ever.',
  },
  {
    icon: Heart,
    title: 'Customer care',
    description: 'Our team is here to help with product advice and any questions you might have.',
  },
];

export function WhySnusFriends() {
  return (
    <section className="py-16 md:py-20 bg-[hsl(30_20%_50%/0.04)]">
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
