import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Star, RefreshCw, Award } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { formatMarketPrice } from '@/lib/market';
import productImage from '@/assets/product-citrus.jpg';

export function HeroBanner() {
  const { t, market, formatPrice } = useTranslation();

  const freeShippingFormatted = formatMarketPrice(
    market.freeShippingThreshold,
    market,
    0
  );

  return (
    <section className="relative overflow-hidden bg-[hsl(220_16%_6%)] grain">
      {/* Subtle radial glow behind content */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[hsl(var(--chart-4)/0.06)] blur-[120px] pointer-events-none" />

      <div className="container py-16 md:py-24 lg:py-28 relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            {/* Trust pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(0_0%_100%/0.1)] bg-[hsl(0_0%_100%/0.05)] text-[hsl(210_20%_90%)] text-sm font-medium">
              <Star className="h-3.5 w-3.5 fill-current" />
              {t('trust.trustpilot')}
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.08]">
              <span className="block font-serif text-[hsl(0_0%_98%)]">
                {t('hero.title')}
              </span>
              <span className="block text-[hsl(var(--chart-4))] text-[1.1em] mt-2 animate-hero-fade-in">
                {t('trust.fastDelivery')}
              </span>
            </h1>

            <p className="max-w-lg text-lg text-[hsl(215_15%_60%)] leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Micro trust signals */}
            <div className="flex flex-wrap gap-6 text-sm text-[hsl(215_15%_60%)]">
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-[hsl(var(--chart-4))]" />
                <span>{t('trust.freeShipping', { amount: freeShippingFormatted })}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="h-4 w-4 text-[hsl(var(--chart-4))]" />
                <span>{t('product.subscribe')} & Save 10%</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="h-4 w-4 text-[hsl(var(--chart-4))]" />
                <span>Earn loyalty points</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="gap-2.5 rounded-2xl h-13 px-8 bg-[hsl(var(--chart-4))] text-[hsl(220_16%_6%)] font-semibold hover:bg-[hsl(var(--chart-4)/0.9)] hover:shadow-[0_0_24px_hsl(var(--chart-4)/0.4)] transition-all duration-200"
              >
                <Link to="/nicotine-pouches">
                  {t('hero.cta')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-2xl h-13 px-8 border-[hsl(0_0%_100%/0.12)] text-[hsl(210_20%_90%)] hover:border-[hsl(var(--chart-4)/0.4)] hover:text-[hsl(var(--chart-4))] transition-all duration-200 bg-transparent"
              >
                <Link to="/nicotine-pouches?badge=newPrice">
                  {t('categories.newPrice')}
                </Link>
              </Button>
            </div>
          </div>

          {/* Floating product can */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative">
              {/* Glow behind the can */}
              <div className="absolute inset-0 scale-90 rounded-full bg-[hsl(var(--chart-4)/0.15)] blur-[80px]" />
              <div className="relative w-80 h-80 rounded-full overflow-hidden animate-hero-sway shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5),0_0_40px_hsl(var(--chart-4)/0.15)]">
                <img
                  src={productImage}
                  alt="Premium nicotine pouch can"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
