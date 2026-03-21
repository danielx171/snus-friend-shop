import { Truck, Shield, Star, Package } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { formatMarketPrice } from '@/lib/market';
import { motion } from 'framer-motion';

const trustItems = [
  { id: 'free-shipping', icon: Truck, labelKey: 'trust.freeShipping' },
  { id: 'secure-checkout', icon: Shield, labelKey: '', fallback: 'Secure checkout' },
  { id: 'brands', icon: Star, labelKey: '', fallback: '91 brands' },
  { id: 'fast-shipping', icon: Package, labelKey: '', fallback: 'Fast EU shipping' },
];

export function TrustBar() {
  const { t, market } = useTranslation();
  const freeShippingFormatted = formatMarketPrice(market.freeShippingThreshold, market, 0);

  return (
    <motion.section
      className="border-y border-border/20 glass-panel bg-muted/5"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="container py-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {trustItems.map((item) => {
            const Icon = item.icon;
            const label = item.labelKey === 'trust.freeShipping'
              ? t(item.labelKey, { amount: freeShippingFormatted })
              : item.fallback || t(item.labelKey);
            return (
              <div key={item.id} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/15">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground leading-tight">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}