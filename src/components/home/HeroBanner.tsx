import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Star, Shield } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { formatMarketPrice } from '@/lib/market';
import { useCatalogProducts } from '@/hooks/useCatalog';

export function HeroBanner() {
  const { t, market, formatPrice } = useTranslation();
  const { data: products = [] } = useCatalogProducts();

  const freeShippingFormatted = formatMarketPrice(
    market.freeShippingThreshold,
    market,
    0
  );

  // Show first 4 products from real catalog
  const showcaseProducts = products.slice(0, 4);

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] grain">
      {/* Subtle warm radial glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[hsl(var(--chart-4)/0.06)] blur-[120px] pointer-events-none" />

      <div className="container py-16 md:py-24 lg:py-28 relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            {/* Trust pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(30_10%_70%/0.4)] bg-[hsl(30_20%_92%)] text-[hsl(220_15%_30%)] text-sm font-medium">
              <Star className="h-3.5 w-3.5 fill-current" />
              {t('trust.trustpilot')}
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.08]">
              <span className="block font-serif text-[hsl(220_20%_15%)]">
                {t('hero.title')}
              </span>
              <span className="block text-[hsl(var(--chart-4))] text-[1.1em] mt-2 animate-hero-fade-in">
                {t('trust.fastDelivery')}
              </span>
            </h1>

            <p className="max-w-lg text-lg text-[hsl(220_10%_45%)] leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Micro trust signals */}
            <div className="flex flex-wrap gap-6 text-sm text-[hsl(220_10%_45%)]">
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-[hsl(var(--chart-4))]" />
                <span>{t('trust.freeShipping', { amount: freeShippingFormatted })}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Shield className="h-4 w-4 text-[hsl(var(--chart-4))]" />
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Star className="h-4 w-4 text-[hsl(var(--chart-4))]" />
                <span>91 brands available</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="gap-2.5 rounded-2xl h-13 px-8 bg-[hsl(var(--chart-4))] text-white font-semibold hover:bg-[hsl(var(--chart-4)/0.9)] hover:shadow-[0_0_24px_hsl(var(--chart-4)/0.4)] transition-all duration-200"
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
                className="rounded-2xl h-13 px-8 border-[hsl(220_15%_30%/0.2)] text-[hsl(220_20%_15%)] hover:border-[hsl(var(--chart-4)/0.4)] hover:text-[hsl(var(--chart-4))] transition-all duration-200 bg-transparent"
              >
                <Link to="/nicotine-pouches?badge=newPrice">
                  {t('categories.newPrice')}
                </Link>
              </Button>
            </div>
          </div>

          {/* Product showcase */}
          <div className="relative hidden lg:block">
            {showcaseProducts.length > 0 ? (
              <div className="relative grid grid-cols-2 gap-5">
                {showcaseProducts.map((product, i) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className={`rounded-3xl glass-panel p-5 hover:border-primary/20 transition-all duration-300 ${i % 2 !== 0 ? 'mt-10' : ''}`}
                  >
                    <div className="h-28 rounded-2xl bg-gradient-to-br from-primary/12 to-primary/4 flex items-center justify-center mb-4 overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-2xl" loading="lazy" />
                      ) : (
                        <span className="text-white/80 font-bold text-center px-3 drop-shadow">{product.name}</span>
                      )}
                    </div>
                    <p className="font-semibold text-foreground truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t('products.from')} {formatPrice(product.prices.pack1)}/{t('cart.can')}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl glass-panel p-12 text-center">
                <p className="text-lg font-semibold text-foreground mb-2">700+ products</p>
                <p className="text-muted-foreground">Browse our full collection of nicotine pouches</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
