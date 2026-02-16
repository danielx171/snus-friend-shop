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
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/4 via-background to-secondary/6">
      <div className="container py-16 md:py-24 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-sm font-medium">
              <Star className="h-3.5 w-3.5 fill-current" />
              {t('trust.trustpilot')}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
              {t('hero.title')}
              <span className="block text-primary mt-1">{t('trust.fastDelivery')}</span>
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
              {t('hero.subtitle')}
            </p>
            
            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-primary" />
                <span>{t('trust.freeShipping', { amount: freeShippingFormatted })}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="h-4 w-4 text-primary" />
                <span>{t('product.subscribe')} & Save 10%</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg" className="gap-2.5 rounded-2xl h-13 px-8 shadow-md hover:shadow-lg transition-shadow">
                <Link to="/nicotine-pouches">
                  {t('hero.cta')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl h-13 px-8 border-border/60 hover:bg-accent/40">
                <Link to="/nicotine-pouches?badge=newPrice">
                  {t('categories.newPrice')}
                </Link>
              </Button>
            </div>
          </div>

          {/* Visual element - Product showcase cards */}
          <div className="relative hidden lg:block">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/6 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />
            <div className="relative grid grid-cols-2 gap-5">
              <div className="space-y-5">
                <div className="rounded-3xl bg-card p-5 shadow-md border border-border/40 hover:shadow-lg transition-shadow">
                  <div className="h-28 rounded-2xl bg-gradient-to-br from-primary/12 to-primary/4 flex items-center justify-center mb-4">
                    <span className="text-4xl">🧊</span>
                  </div>
                  <p className="font-semibold text-foreground">ZYN Cool Mint</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('products.from')} {formatPrice(3.49)}/{t('cart.can')}</p>
                </div>
                <div className="rounded-3xl bg-card p-5 shadow-md border border-border/40 hover:shadow-lg transition-shadow">
                  <div className="h-24 rounded-2xl bg-gradient-to-br from-secondary/15 to-secondary/5 flex items-center justify-center mb-4">
                    <span className="text-3xl">🍃</span>
                  </div>
                  <p className="font-semibold text-foreground">VELO Ice Cool</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('products.from')} {formatPrice(2.99)}/{t('cart.can')}</p>
                </div>
              </div>
              <div className="space-y-5 pt-10">
                <div className="rounded-3xl bg-card p-5 shadow-md border border-border/40 hover:shadow-lg transition-shadow">
                  <div className="h-24 rounded-2xl bg-gradient-to-br from-muted/60 to-muted/20 flex items-center justify-center mb-4">
                    <span className="text-3xl">🍋</span>
                  </div>
                  <p className="font-semibold text-foreground">ON! Citrus</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('products.from')} {formatPrice(2.49)}/{t('cart.can')}</p>
                </div>
                <div className="rounded-3xl bg-card p-5 shadow-md border border-border/40 hover:shadow-lg transition-shadow">
                  <div className="h-28 rounded-2xl bg-gradient-to-br from-primary/8 to-transparent flex items-center justify-center mb-4">
                    <span className="text-4xl">🫐</span>
                  </div>
                  <p className="font-semibold text-foreground">LOOP Berry</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('products.from')} {formatPrice(3.19)}/{t('cart.can')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
