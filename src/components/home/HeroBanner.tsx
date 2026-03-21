import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Star, Shield, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { formatMarketPrice } from '@/lib/market';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { useBrands } from '@/hooks/useBrands';
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
    description: 'Discover {count}+ products from {brands} leading brands — delivered fast',
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

/* ---- animation helpers ---- */
const easeOut = [0, 0, 0.2, 1] as const;
const easeIn = [0.4, 0, 1, 1] as const;

/* Slide heading stagger delays (relative to slide entering) */
const SLIDE_LINE_DELAYS = [0, 0.1, 0.2, 0.3, 0.35];

export function HeroBanner() {
  const { t, market, formatPrice } = useTranslation();
  const { data: products = [] } = useCatalogProducts();
  const { brands } = useBrands();
  const brandCount = brands.length || 91;
  const productCount = products.length || 700;
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const progressRef = useRef<HTMLDivElement>(null);

  /* Mark entrance done after initial stagger completes (~1.3s) */
  useEffect(() => {
    const t = setTimeout(() => setHasMounted(true), 1400);
    return () => clearTimeout(t);
  }, []);

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

  const goToSlide = useCallback((index: number) => {
    setSlideDirection(index > activeSlide ? 'next' : 'prev');
    setActiveSlide(index);
  }, [activeSlide]);

  const prevSlide = useCallback(() => {
    setSlideDirection('prev');
    setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const nextSlide = useCallback(() => {
    setSlideDirection('next');
    setActiveSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  /* Auto-advance + progress bar */
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setSlideDirection('next');
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [isPaused, activeSlide]);

  const slide = SLIDES[activeSlide];

  /* ---- floating circle data ---- */
  const floatingCircles = useMemo(() => [
    { w: 72, left: '8%', bottom: '-10%', dur: '22s', delay: '-3s', lime: false },
    { w: 56, left: '22%', bottom: '-8%', dur: '18s', delay: '-11s', lime: true },
    { w: 88, left: '38%', bottom: '-12%', dur: '26s', delay: '-7s', lime: false },
    { w: 44, left: '52%', bottom: '-6%', dur: '15s', delay: '-1s', lime: true },
    { w: 64, left: '65%', bottom: '-14%', dur: '24s', delay: '-16s', lime: false },
    { w: 78, left: '78%', bottom: '-9%', dur: '20s', delay: '-5s', lime: true },
    { w: 50, left: '90%', bottom: '-7%', dur: '28s', delay: '-20s', lime: false },
    { w: 60, left: '4%', bottom: '-15%', dur: '17s', delay: '-9s', lime: true },
    { w: 46, left: '45%', bottom: '-5%', dur: '30s', delay: '-14s', lime: false },
    { w: 82, left: '58%', bottom: '-11%', dur: '19s', delay: '-2s', lime: true },
  ], []);

  return (
    <section
      className="relative overflow-hidden bg-background border-b border-border/20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ===== BACKGROUND ATMOSPHERE ===== */}

      {/* Floating pouch-can circles — entrance fade only */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {floatingCircles.map((c, i) => (
          <motion.div
            key={i}
            className={cn('hero-float-circle', c.lime && 'hero-float-lime')}
            style={{
              width: c.w,
              height: c.w,
              left: c.left,
              bottom: c.bottom,
              animationDuration: c.dur,
              animationDelay: c.delay,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: c.lime ? 0.13 : 0.1 }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.05, ease: easeOut }}
          >
            <div className={cn('hero-float-inner', c.lime && 'hero-float-inner-lime')} style={{ width: '65%', height: '65%' }} />
          </motion.div>
        ))}
      </div>

      {/* Glow blob 1 — navy, top-right — entrance + drift */}
      <motion.div
        className="absolute -top-[100px] -right-[100px] w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{ background: 'rgba(0, 49, 138, 0.25)', filter: 'blur(120px)' }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: [0, 30, -15, 0],
          y: [0, -20, 10, 0],
        }}
        transition={{
          opacity: { duration: 0.8, ease: easeOut },
          scale: { duration: 0.8, ease: easeOut },
          x: { duration: 15, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
          y: { duration: 15, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
        }}
      />

      {/* Glow blob 2 — lime, bottom-left — entrance + drift */}
      <motion.div
        className="absolute -bottom-[80px] -left-[60px] w-[400px] h-[400px] rounded-full pointer-events-none z-0"
        style={{ background: 'rgba(216, 237, 98, 0.08)', filter: 'blur(100px)' }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: [0, -20, 25, 0],
          y: [0, 15, -20, 0],
        }}
        transition={{
          opacity: { duration: 0.8, ease: easeOut },
          scale: { duration: 0.8, ease: easeOut },
          x: { duration: 15, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror', delay: 3 },
          y: { duration: 15, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror', delay: 3 },
        }}
      />

      {/* Radial gradient pulse behind heading text */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-[500px] h-[400px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ opacity: [0, 0.15, 0] }}
        transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
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

      {/* ===== CONTENT ===== */}
      <div className="container py-8 md:py-16 lg:py-24 relative z-[1]">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14 items-center">

          {/* Left — slide content */}
          <div className="space-y-7">
            {/* Trust pill — entrance */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0, ease: easeOut }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/40 bg-card/60 text-muted-foreground text-xs font-medium backdrop-blur-sm">
                <Star className="h-3 w-3 fill-[hsl(var(--chart-4))] text-[hsl(var(--chart-4))]" />
                {t('trust.trustpilot')}
              </div>
            </motion.div>

            {/* Crossfade text container — AnimatePresence for slide transitions */}
            <div className="relative min-h-[280px] sm:min-h-[260px] lg:min-h-[300px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeSlide}
                  initial={hasMounted ? { opacity: 0, y: 24 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: easeOut }}
                >
                  {(() => {
                    const s = SLIDES[activeSlide];
                    const lines = s.title.split('\n');
                    /* On first mount, use entrance delays; on slide change, use stagger delays */
                    const isEntrance = !hasMounted;
                    return (
                      <>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-foreground">
                          {lines.map((line, idx) => (
                            <motion.span
                              key={`${activeSlide}-line-${idx}`}
                              className="block"
                              initial={{ opacity: 0, y: isEntrance ? 20 : 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: isEntrance ? 0.5 : 0.35,
                                delay: isEntrance ? 0.2 : SLIDE_LINE_DELAYS[idx] ?? 0,
                                ease: easeOut,
                              }}
                            >
                              {line}
                            </motion.span>
                          ))}
                          <motion.span
                            className="block text-[0.8em] mt-2 font-semibold"
                            style={{ color: s.accentColor }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.4,
                              delay: isEntrance ? 0.7 : SLIDE_LINE_DELAYS[2],
                              ease: easeOut,
                            }}
                          >
                            {s.subtitle}
                          </motion.span>
                        </h1>

                        <motion.p
                          className="max-w-lg text-base text-muted-foreground leading-relaxed mt-5"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 0.4,
                            delay: isEntrance ? 0.8 : SLIDE_LINE_DELAYS[3],
                            ease: easeOut,
                          }}
                        >
                          {s.description
                            .replace('{count}', String(productCount))
                            .replace('{brands}', String(brandCount))}
                        </motion.p>

                        <motion.div
                          className="flex flex-wrap gap-3 pt-5"
                          initial={{ opacity: 0, y: isEntrance ? 12 : 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: isEntrance ? 0.9 : SLIDE_LINE_DELAYS[4],
                            ease: easeOut,
                          }}
                        >
                          <Button
                            asChild
                            size="lg"
                            className="gap-2 rounded-2xl h-12 px-7 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                            style={{ backgroundColor: s.accentColor, color: 'hsl(220 100% 12%)' }}
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
                      </>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Trust signals — entrance */}
            <motion.div
              className="flex flex-wrap gap-5 text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.0, ease: easeOut }}
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
                <span>{brandCount} brands available</span>
              </div>
            </motion.div>

            {/* Slide controls — entrance */}
            <motion.div
              className="flex items-center gap-3 pt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.0, ease: easeOut }}
            >
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
                    className="relative min-w-10 min-h-10 flex items-center justify-center"
                  >
                    <span
                      className="relative rounded-full overflow-hidden transition-all duration-300"
                      style={i === activeSlide
                        ? { width: '1.5rem', height: '0.5rem', backgroundColor: 'hsl(var(--border))' }
                        : { width: '0.5rem', height: '0.5rem', backgroundColor: 'hsl(var(--border))' }
                      }
                    >
                    {/* Active dot: animated width pill with progress fill */}
                    {i === activeSlide && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ backgroundColor: slide.accentColor }}
                          layoutId="hero-dot-active"
                          transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
                        />
                        {/* Progress fill line */}
                        <motion.div
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
                          initial={{ width: '0%' }}
                          animate={{ width: isPaused ? undefined : '100%' }}
                          transition={{
                            duration: AUTO_ROTATE_MS / 1000,
                            ease: 'linear',
                          }}
                          key={`progress-${activeSlide}-${isPaused}`}
                        />
                      </>
                    )}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/40 bg-card/60 text-muted-foreground backdrop-blur-sm transition-all duration-150 hover:border-border hover:text-foreground"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
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
                      initial={{ opacity: 0, y: 24, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 + i * 0.1, ease: easeOut }}
                    >
                      <Link
                        to={`/product/${product.id}`}
                        className="group relative rounded-2xl border border-border/30 bg-card/80 backdrop-blur-sm overflow-hidden hover:border-border/60 hover:bg-card transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 block"
                      >
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
                <div className="flex lg:hidden gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
                  {showcaseProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      className="flex-none w-36 snap-start"
                      initial={{ opacity: 0, y: 24, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 + i * 0.1, ease: easeOut }}
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
          display: flex;
          align-items: center;
          justify-content: center;
          animation: hero-float-up linear infinite;
        }
        .hero-float-lime {
          background: rgba(216, 237, 98, 0.07);
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
