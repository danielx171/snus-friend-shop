import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Star, Shield, ChevronLeft, ChevronRight, Package } from 'lucide-react';
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
  accentColor: string;
  brandFilter: string;
}

const SLIDES: HeroSlide[] = [
  {
    title: 'Premium Nicotine\nPouches',
    subtitle: 'Free EU delivery',
    description: 'Discover 700+ products from 91 leading brands — delivered fast',
    cta: { label: 'Explore Products', href: '/nicotine-pouches' },
    secondaryCta: { label: 'Special Offers', href: '/nicotine-pouches?badge=newPrice' },
    accentColor: 'hsl(var(--chart-4))',
    brandFilter: 'STNG',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Fresh flavors weekly',
    description: 'Be the first to try the latest nicotine pouches from top brands',
    cta: { label: 'Shop New', href: '/nicotine-pouches?badge=new' },
    accentColor: 'hsl(var(--chart-2))',
    brandFilter: 'Loop',
  },
  {
    title: 'Bestsellers',
    subtitle: 'Customer favorites',
    description: 'Our most loved pouches — tried, tested and recommended',
    cta: { label: 'Shop Bestsellers', href: '/nicotine-pouches?badge=popular' },
    accentColor: 'hsl(var(--primary))',
    brandFilter: 'VELO',
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

  const showcaseProducts = useMemo(() => {
    const brandName = SLIDES[activeSlide % SLIDES.length].brandFilter;
    const brandProducts = products.filter((p) => p.brand === brandName && (typeof p.stock !== 'number' || p.stock > 0));
    if (brandProducts.length >= 4) return brandProducts.slice(0, 4);
    const others = products.filter((p) => p.brand !== brandName && (typeof p.stock !== 'number' || p.stock > 0));
    return [...brandProducts, ...others].slice(0, 4);
  }, [products, activeSlide]);

  const goToSlide = useCallback((index: number) => { setActiveSlide(index); }, []);
  const prevSlide = useCallback(() => { setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length); }, []);
  const nextSlide = useCallback(() => { setActiveSlide((prev) => (prev + 1) % SLIDES.length); }, []);

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
      className="relative overflow-hidden bg-background border-b border-border/20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Floating pouch-can circles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Circle 1 — blue, 72px */}
        <div className="hero-float-circle" style={{ width: 72, height: 72, left: '8%', bottom: '-10%', animationDuration: '22s', animationDelay: '-3s' }}>
          <div className="hero-float-inner" style={{ width: '65%', height: '65%' }} />
        </div>
        {/* Circle 2 — lime, 56px */}
        <div className="hero-float-circle hero-float-lime" style={{ width: 56, height: 56, left: '22%', bottom: '-8%', animationDuration: '18s', animationDelay: '-11s' }}>
          <div className="hero-float-inner hero-float-inner-lime" style={{ width: '65%', height: '65%' }} />
        </div>
        {/* Circle 3 — blue, 88px */}
        <div className="hero-float-circle" style={{ width: 88, height: 88, left: '38%', bottom: '-12%', animationDuration: '26s', animationDelay: '-7s' }}>
          <div className="hero-float-inner" style={{ width: '65%', height: '65%' }} />
        </div>
        {/* Circle 4 — lime, 44px */}
        <div className="hero-float-circle hero-float-lime" style={{ width: 44, height: 44, left: '52%', bottom: '-6%', animationDuration: '15s', animationDelay: '-1s' }}>
          <div className="hero-float-inner hero-float-inner-lime" style={{ width: '65%', height: '65%' }} />
        </div>
        {/* Circle 5 — blue, 64px */}
        <div className="hero-float-circle" style={{ width: 64, height: 64, left: '65%', bottom: '-14%', animationDuration: '24s', animationDelay: '-16s' }}>
          <div className="hero-float-inner" style={{ width: '65%', height: '65%' }} />
        </div>
        {/* Circle 6 — lime, 78px */}
        <div className="hero-float-circle hero-float-lime" style={{ width: 78, height: 78, left: '78%', bottom: '-9%', animationDuration: '20s', animationDelay: '-5s' }}>
          <div className="hero-float-inner hero-float-inner-lime" style={{ width: '65%', height: '65%' }} />
        </div>
        {/* Circle 7 — blue, 50px */}
        <div className="hero-float-circle" style={{ width: 50, height: 50, left: '90%', bottom: '-7%', animationDuration: '28s', animationDelay: '-20s' }}>
          <div className="hero-float-inner" style={{ width: '65%', height: '65%' }} />
        </div>
        {/* Circle 8 — lime, 60px */}
        <div className="hero-float-circle hero-float-lime" style={{ width: 60, height: 60, left: '4%', bottom: '-15%', animationDuration: '17s', animationDelay: '-9s' }}>
          <div className="hero-float-inner hero-float-inner-lime" style={{ width: '65%', height: '65%' }} />
        </div>
        {/* Circle 9 — blue, 46px */}
        <div className="hero-float-circle" style={{ width: 46, height: 46, left: '45%', bottom: '-5%', animationDuration: '30s', animationDelay: '-14s' }}>
          <div className="hero-float-inner" style={{ width: '65%', height: '65%' }} />
        </div>
        {/* Circle 10 — lime, 82px */}
        <div className="hero-float-circle hero-float-lime" style={{ width: 82, height: 82, left: '58%', bottom: '-11%', animationDuration: '19s', animationDelay: '-2s' }}>
          <div className="hero-float-inner hero-float-inner-lime" style={{ width: '65%', height: '65%' }} />
        </div>
      </div>

      {/* Glow blob 1 — navy, top-right */}
      <div
        className="absolute -top-[100px] -right-[100px] w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{ background: 'rgba(0, 49, 138, 0.25)', filter: 'blur(120px)' }}
      />
      {/* Glow blob 2 — lime, bottom-left */}
      <div
        className="absolute -bottom-[80px] -left-[60px] w-[400px] h-[400px] rounded-full pointer-events-none z-0"
        style={{ background: 'rgba(216, 237, 98, 0.08)', filter: 'blur(100px)' }}
      />
      {/* Slide-reactive accent glow */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[130px] pointer-events-none transition-all duration-1000 z-0"
        style={{ background: slide.accentColor }}
      />
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container py-14 md:py-20 lg:py-24 relative z-[1]">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14 items-center">

          {/* Left — slide content */}
          <div className="space-y-7">
            {/* Trust pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/40 bg-card/60 text-muted-foreground text-xs font-medium backdrop-blur-sm">
                <Star className="h-3 w-3 fill-[hsl(var(--chart-4))] text-[hsl(var(--chart-4))]" />
                {t('trust.trustpilot')}
              </div>
            </motion.div>

            {/* Crossfade text container */}
            <div className="relative min-h-[240px] sm:min-h-[220px] overflow-hidden">
              {SLIDES.map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    'transition-all duration-600 ease-in-out',
                    i === activeSlide
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-2 pointer-events-none absolute inset-0'
                  )}
                >
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.08] text-foreground">
                    {s.title.split('\n').map((line, idx) => (
                      <motion.span
                        key={idx}
                        className={cn('block', idx === 1 && 'text-foreground')}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx === 0 ? 0.15 : 0.25, ease: 'easeOut' }}
                      >
                        {line}
                      </motion.span>
                    ))}
                    <motion.span
                      className="block text-[0.8em] mt-2 font-semibold"
                      style={{ color: s.accentColor }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
                    >
                      {s.subtitle}
                    </motion.span>
                  </h1>

                  <motion.p
                    className="max-w-lg text-base text-muted-foreground leading-relaxed mt-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
                  >
                    {s.description}
                  </motion.p>

                  <motion.div
                    className="flex flex-wrap gap-3 pt-5"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6, ease: 'easeOut' }}
                  >
                    <Button
                      asChild
                      size="lg"
                      className="gap-2 rounded-2xl h-12 px-7 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                      style={{ backgroundColor: s.accentColor, color: 'white' }}
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
                        className="rounded-2xl h-12 px-7 border-border/60 bg-card/60 backdrop-blur-sm hover:bg-card hover:border-border transition-all duration-200 text-foreground"
                      >
                        <Link to={s.secondaryCta.href}>
                          {s.secondaryCta.label}
                        </Link>
                      </Button>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Trust signals */}
            <motion.div
              className="flex flex-wrap gap-5 text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
            >
              <div className="flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 shrink-0" style={{ color: slide.accentColor }} />
                <span>{t('trust.freeShipping', { amount: freeShippingFormatted })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 shrink-0" style={{ color: slide.accentColor }} />
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-3.5 w-3.5 shrink-0" style={{ color: slide.accentColor }} />
                <span>91 brands available</span>
              </div>
            </motion.div>

            {/* Slide controls */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/40 bg-card/60 text-muted-foreground backdrop-blur-sm transition-all duration-150 hover:border-border hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className="rounded-full transition-all duration-300"
                    style={i === activeSlide
                      ? { width: '2rem', height: '0.5rem', backgroundColor: slide.accentColor }
                      : { width: '0.5rem', height: '0.5rem', backgroundColor: 'hsl(var(--border))' }
                    }
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/40 bg-card/60 text-muted-foreground backdrop-blur-sm transition-all duration-150 hover:border-border hover:text-foreground"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right — Product showcase */}
          <div className="relative">
            {showcaseProducts.length > 0 ? (
              <>
                {/* Desktop: 2×2 grid */}
                <div className="hidden lg:grid grid-cols-2 gap-3">
                  {showcaseProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + i * 0.08, ease: 'easeOut' }}
                    >
                      <Link
                        to={`/product/${product.id}`}
                        className="group relative rounded-2xl border border-border/30 bg-card/80 backdrop-blur-sm overflow-hidden hover:border-border/60 hover:bg-card transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 block"
                      >
                        {/* Product image — full bleed, square */}
                        <div className="aspect-square w-full overflow-hidden bg-muted/20">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center p-4">
                              <span className="font-bold text-sm text-center leading-snug text-muted-foreground">{product.brand}</span>
                            </div>
                          )}
                        </div>
                        {/* Info overlay */}
                        <div className="p-3">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">{product.brand}</p>
                          <p className="font-semibold text-foreground text-xs leading-snug line-clamp-1 mt-0.5">{product.name}</p>
                          <p className="text-xs mt-1 font-medium" style={{ color: slide.accentColor }}>
                            {formatPrice(product.prices.pack1)}/{t('cart.can')}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile: horizontal scroll row */}
                <div className="flex lg:hidden gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                  {showcaseProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      className="flex-none w-32"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + i * 0.08, ease: 'easeOut' }}
                    >
                      <Link
                        to={`/product/${product.id}`}
                        className="rounded-2xl border border-border/30 bg-card/80 p-3 hover:border-border/60 transition-all duration-200 block"
                      >
                        <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted/30 flex items-center justify-center mb-2">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-contain" loading="lazy" />
                          ) : (
                            <span className="text-muted-foreground font-bold text-[9px] text-center px-1">{product.brand}</span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">{product.brand}</p>
                        <p className="font-medium text-foreground text-xs leading-snug line-clamp-2 mt-0.5">{product.name}</p>
                        <p className="text-[10px] mt-1" style={{ color: slide.accentColor }}>
                          {formatPrice(product.prices.pack1)}
                        </p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-border/30 bg-card/80 p-12 text-center">
                <p className="text-lg font-semibold text-foreground mb-2">700+ products</p>
                <p className="text-muted-foreground text-sm">Browse our full collection of nicotine pouches</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes hero-float-up {
          0% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-30vh) translateX(12px); }
          50% { transform: translateY(-60vh) translateX(-8px); }
          75% { transform: translateY(-90vh) translateX(15px); }
          100% { transform: translateY(-120vh) translateX(0); }
        }
        .hero-float-circle {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(212, 237, 98, 0.2);
          background: rgba(0, 49, 138, 0.08);
          opacity: 0.1;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: hero-float-up linear infinite;
        }
        .hero-float-lime {
          background: rgba(216, 237, 98, 0.07);
          opacity: 0.13;
        }
        .hero-float-inner {
          border-radius: 50%;
          border: 1px solid rgba(212, 237, 98, 0.16);
          background: rgba(0, 49, 138, 0.06);
        }
        .hero-float-inner-lime {
          background: rgba(216, 237, 98, 0.05);
        }
      `}</style>
    </section>
  );
}
