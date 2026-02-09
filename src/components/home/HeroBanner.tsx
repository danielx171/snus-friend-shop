import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Star, RefreshCw } from 'lucide-react';
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
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <div className="container py-12 md:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Star className="h-4 w-4 fill-current" />
              {t('trust.trustpilot')}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t('hero.title')}
              <span className="block text-primary">{t('trust.fastDelivery')}</span>
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
              {t('hero.subtitle')}
            </p>
            
            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                <span>{t('trust.freeShipping', { amount: freeShippingFormatted })}</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-primary" />
                <span>{t('product.subscribe')} & Save 10%</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="gap-2 rounded-xl h-12 px-6">
                <Link to="/nicotine-pouches">
                  {t('hero.cta')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl h-12 px-6">
                <Link to="/nicotine-pouches?badge=newPrice">
                  {t('categories.newPrice')}
                </Link>
              </Button>
            </div>
          </div>

          {/* Visual element - Product showcase cards */}
          <div className="relative hidden lg:block">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-secondary/20 blur-2xl" />
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl bg-card p-4 shadow-lg border border-border">
                  <div className="h-24 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3">
                    <span className="text-4xl">🧊</span>
                  </div>
                  <p className="font-semibold text-foreground">ZYN Cool Mint</p>
                  <p className="text-sm text-muted-foreground">{t('products.from')} {formatPrice(3.49)}/{t('cart.can')}</p>
                </div>
                <div className="rounded-2xl bg-card p-4 shadow-lg border border-border">
                  <div className="h-20 rounded-xl bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center mb-3">
                    <span className="text-3xl">🍃</span>
                  </div>
                  <p className="font-semibold text-foreground">VELO Ice Cool</p>
                  <p className="text-sm text-muted-foreground">{t('products.from')} {formatPrice(2.99)}/{t('cart.can')}</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl bg-card p-4 shadow-lg border border-border">
                  <div className="h-20 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-3">
                    <span className="text-3xl">🍋</span>
                  </div>
                  <p className="font-semibold text-foreground">ON! Citrus</p>
                  <p className="text-sm text-muted-foreground">{t('products.from')} {formatPrice(2.49)}/{t('cart.can')}</p>
                </div>
                <div className="rounded-2xl bg-card p-4 shadow-lg border border-border">
                  <div className="h-24 rounded-xl bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center mb-3">
                    <span className="text-4xl">🫐</span>
                  </div>
                  <p className="font-semibold text-foreground">LOOP Berry</p>
                  <p className="text-sm text-muted-foreground">{t('products.from')} {formatPrice(3.19)}/{t('cart.can')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
