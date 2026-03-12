import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Star, RefreshCw, Award } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { formatMarketPrice } from '@/lib/market';

export function HeroBanner() {
  const { t, market, formatPrice } = useTranslation();

  const freeShippingFormatted = formatMarketPrice(
    market.freeShippingThreshold,
    market,
    0
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-card/50 to-background">
      {/* Ambient orbs */}
      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-chart-2/5 blur-[80px]" />

      <div className="container py-16 md:py-24 lg:py-28 relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            {/* Trust pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/8 text-primary text-sm font-medium">
              <Star className="h-3.5 w-3.5 fill-current" />
              {t('trust.trustpilot')}
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.08]">
              {t('hero.title')}
              <span className="block text-primary mt-1">{t('trust.fastDelivery')}</span>
            </h1>

            <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
              {t('hero.subtitle')}
            </p>
            
            {/* Micro trust signals */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-primary" />
                <span>{t('trust.freeShipping', { amount: freeShippingFormatted })}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="h-4 w-4 text-primary" />
                <span>{t('product.subscribe')} & Save 10%</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="h-4 w-4 text-primary" />
                <span>Earn loyalty points</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg" className="gap-2.5 rounded-2xl h-13 px-8 glow-primary hover:shadow-lg transition-all">
                <Link to="/nicotine-pouches">
                  {t('hero.cta')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl h-13 px-8 border-border/40 hover:border-primary/30 hover:text-primary transition-all">
                <Link to="/nicotine-pouches?badge=newPrice">
                  {t('categories.newPrice')}
                </Link>
              </Button>
            </div>
          </div>

          {/* Product showcase */}
          <div className="relative hidden lg:block">
            <div className="relative grid grid-cols-2 gap-5">
              {[
                { emoji: '🧊', name: 'ZYN Cool Mint', price: 3.49, gradient: 'from-primary/12 to-primary/4' },
                { emoji: '🍃', name: 'VELO Ice Cool', price: 2.99, gradient: 'from-chart-2/12 to-chart-2/4' },
                { emoji: '🍋', name: 'ON! Citrus', price: 2.49, gradient: 'from-chart-4/15 to-chart-4/5' },
                { emoji: '🫐', name: 'LOOP Berry', price: 3.19, gradient: 'from-chart-3/10 to-chart-3/4' },
              ].map((item, i) => (
                <div
                  key={item.name}
                  className={`rounded-3xl glass-panel p-5 hover:border-primary/20 transition-all duration-300 ${i % 2 !== 0 ? 'mt-10' : ''}`}
                >
                  <div className={`h-28 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4`}>
                    <span className="text-4xl">{item.emoji}</span>
                  </div>
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('products.from')} {formatPrice(item.price)}/{t('cart.can')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
