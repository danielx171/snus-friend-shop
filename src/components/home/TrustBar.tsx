import { Truck, Shield, Star, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { formatMarketPrice } from '@/lib/market';

const trustItems = [
  { icon: Truck, labelKey: 'trust.freeShipping' },
  { icon: Shield, labelKey: 'trust.klarna' },
  { icon: Star, labelKey: 'trust.trustpilot' },
  { icon: RefreshCw, labelKey: 'trust.easyReturns', fallback: 'Easy returns' },
];

export function TrustBar() {
  const { t, market } = useTranslation();
  const freeShippingFormatted = formatMarketPrice(market.freeShippingThreshold, market, 0);

  return (
    <section className="border-y border-border/50 bg-card/60 backdrop-blur-sm">
      <div className="container py-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {trustItems.map((item) => {
            const Icon = item.icon;
            const label = item.labelKey === 'trust.freeShipping'
              ? t(item.labelKey, { amount: freeShippingFormatted })
              : item.fallback ? item.fallback : t(item.labelKey);
            return (
              <div key={item.labelKey} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/8">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground leading-tight">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
