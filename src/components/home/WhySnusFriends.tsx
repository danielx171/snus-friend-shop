import { Shield, Truck, Package, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl font-bold text-foreground tracking-tight mb-3"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            Why SnusFriend?
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-md mx-auto"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            We make it easy to find and enjoy premium nicotine pouches, delivered fast to your door.
          </motion.p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
              >
                <div
                  className="rounded-2xl glass-panel p-6 hover:border-primary/20 transition-all group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/15 mb-4 group-hover:glow-primary transition-all">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{reason.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}