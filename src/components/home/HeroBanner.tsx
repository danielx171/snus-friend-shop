import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Star, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { formatMarketPrice } from '@/lib/market';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { cn } from '@/lib/utils';

interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  bgColor: string;
  /** Optional MP4/WebM URL — plays as a looping muted video background instead of bgColor */
  videoSrc?: string;
}

const SLIDES: HeroSlide[] = [
  {
    title: 'Premium Nicotine Pouches',
    subtitle: 'Fast delivery',
    description: 'Discover our wide range of quality products from leading brands',
    cta: { label: 'Explore Products', href: '/nicotine-pouches' },
    secondaryCta: { label: 'New Price', href: '/nicotine-pouches?badge=newPrice' },
    bgColor: '#FAF8F5',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Fresh flavors weekly',
    description: 'Be the first to try the latest nicotine pouches from top brands',
    cta: { label: 'Shop New', href: '/nicotine-pouches?badge=new' },
    bgColor: '#F5F8FA',
  },
  {
    title: 'Bestsellers',
    subtitle: 'Customer favorites',
    description: 'Our most loved pouches — tried, tested and recommended',
    cta: { label: 'Shop Bestsellers', href: '/nicotine-pouches?badge=popular' },
    bgColor: '#F8F5F0',
  },
];

const AUTO_ROTATE_MS = 6000;

export function HeroBanner() {
  const { t, market, formatPrice } = useTranslation();
  const { data: products = [] } = useCatalogProducts();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const freeShippingFormatted = formatMarketPrice(
    market.freeShippingThreshold,
    market,
    0
  );

  // Showcase: prioritize STNG slide 1, Loop slide 2, VELO slide 3, then fill with others
  const SHOWCASE_BRANDS = ['STNG', 'Loop', 'VELO'];
  const showcaseProducts = useMemo(() => {
    const brandName = SHOWCASE_BRANDS[activeSlide % SHOWCASE_BRANDS.length];
    const brandProducts = products.filter((p) => p.brand === brandName);
    if (brandProducts.length >= 4) return brandProducts.slice(0, 4);
    // Fill remaining slots from other products
    const others = products.filter((p) => p.brand !== brandName);
    return [...brandProducts, ...others].slice(0, 4);
  }, [products, activeSlide]);

  const goToSlide = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = SLIDES[activeSlide];

  return (
    <section
      className="relative overflow-hidden grain transition-colors duration-700"
      style={{ backgroundColor: slide.bgColor }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Optional video background — only rendered when videoSrc is set on a slide */}
      {SLIDES.map((s, i) =>
        s.videoSrc ? (
          <video
            key={i}
            src={s.videoSrc}
            autoPlay
            muted
            loop
            playsInline
            className={cn(
              'absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700',
              i === activeSlide ? 'opacity-100' : 'opacity-0'
            )}
          />
        ) : null
      )}

      {/* Subtle warm radial glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[hsl(var(--chart-4)/0.06)] blur-[120px] pointer-events-none" />

      <div className="container py-16 md:py-24 lg:py-28 relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left — slide content */}
          <div className="space-y-8">
            {/* Trust pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(30_10%_70%/0.4)] bg-[hsl(30_20%_92%)] text-[hsl(220_15%_30%)] text-sm font-medium">
              <Star className="h-3.5 w-3.5 fill-current" />
              {t('trust.trustpilot')}
            </div>

            {/* Crossfade text container */}
            <div className="relative min-h-[280px] sm:min-h-[260px]">
              {SLIDES.map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    'transition-all duration-700 ease-in-out',
                    i === activeSlide
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-2 pointer-events-none absolute inset-0'
                  )}
                >
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.08]">
                    <span className="block font-serif text-[hsl(220_20%_15%)]">
                      {s.title}
                    </span>
                    <span className="block text-[hsl(var(--chart-4))] text-[1.1em] mt-2">
                      {s.subtitle}
                    </span>
                  </h1>

                  <p className="max-w-lg text-lg text-[hsl(220_10%_45%)] leading-relaxed mt-6">
                    {s.description}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-6">
                    <Button
                      asChild
                      size="lg"
                      className="gap-2.5 rounded-2xl h-13 px-8 bg-[hsl(var(--chart-4))] text-white font-semibold hover:bg-[hsl(var(--chart-4)/0.9)] hover:shadow-[0_0_24px_hsl(var(--chart-4)/0.4)] transition-all duration-200"
                    >
                      <Link to={s.cta.href}>
                        {s.cta.label}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    {s.secondaryCta && (
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="rounded-2xl h-13 px-8 border-[hsl(220_15%_30%/0.2)] text-[hsl(220_20%_15%)] hover:border-[hsl(var(--chart-4)/0.4)] hover:text-[hsl(var(--chart-4))] transition-all duration-200 bg-transparent"
                      >
                        <Link to={s.secondaryCta.href}>
                          {s.secondaryCta.label}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Micro trust signals — persistent across slides */}
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

            {/* Slide controls — arrows + dot indicators */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(220_15%_30%/0.2)] bg-white/60 text-[hsl(220_20%_15%)] backdrop-blur-sm transition-all duration-150 hover:border-[hsl(var(--chart-4)/0.4)] hover:bg-white/80 hover:text-[hsl(var(--chart-4))]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={cn(
                      'rounded-full transition-all duration-300',
                      i === activeSlide
                        ? 'w-8 h-2.5 bg-[hsl(var(--chart-4))]'
                        : 'w-2.5 h-2.5 bg-[hsl(220_10%_70%/0.4)] hover:bg-[hsl(220_10%_60%/0.6)]'
                    )}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(220_15%_30%/0.2)] bg-white/60 text-[hsl(220_20%_15%)] backdrop-blur-sm transition-all duration-150 hover:border-[hsl(var(--chart-4)/0.4)] hover:bg-white/80 hover:text-[hsl(var(--chart-4))]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right — Product showcase (persistent) */}
          <div className="relative hidden lg:block">
            {showcaseProducts.length > 0 ? (
              <div className="relative grid grid-cols-2 gap-5">
                {showcaseProducts.map((product, i) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="rounded-3xl glass-panel p-5 hover:border-primary/20 transition-all duration-300 flex flex-col items-center text-center"
                  >
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/8 to-primary/3 flex items-center justify-center mb-4 overflow-hidden shrink-0">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" loading="lazy" />
                      ) : (
                        <span className="text-white/80 font-bold text-center px-3 drop-shadow text-sm">{product.name}</span>
                      )}
                    </div>
                    <p className="font-semibold text-foreground truncate w-full">{product.name}</p>
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
