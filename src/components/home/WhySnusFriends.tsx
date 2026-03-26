import { ShieldCheck, Truck, Package, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const reasons = [
  {
    icon: Package,
    title: '700+ products',
    stat: '700+',
    description: 'Browse 91 brands and over 700 nicotine pouch products — one of the largest selections in Europe.',
  },
  {
    icon: Truck,
    title: 'Fast EU shipping',
    stat: null,
    description: 'We ship across the EU and UK with DHL and UPS. Choose economy or express at checkout.',
  },
  {
    icon: ShieldCheck,
    title: '100% authentic products',
    stat: '100%',
    description: 'We only stock genuine products from authorised distributors. No fakes, ever.',
  },
  {
    icon: MessageCircle,
    title: 'Customer care',
    stat: null,
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
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            Why SnusFriend?
          </motion.h2>
          {/* Accent underline bar */}
          <motion.div
            className="mx-auto w-10 h-[3px] rounded-full bg-accent mb-4"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          />
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

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            // Highlight stat portion in title with accent color
            const titleNode = reason.stat ? (
              <>
                <span className="text-accent">{reason.stat}</span>
                {reason.title.replace(reason.stat, '')}
              </>
            ) : (
              reason.title
            );

            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
              >
                <div className="rounded-2xl p-8 bg-card/60 border border-white/[0.06] transition-all duration-[250ms] ease-out hover:bg-card/80 group">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 mb-5 transition-shadow duration-[250ms] ease-out group-hover:shadow-[0_0_20px_hsl(var(--accent)/0.15)]">
                    <Icon className="h-10 w-10 text-accent" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">{titleNode}</h3>
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
