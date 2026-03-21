import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PackSize, packSizeMultipliers, FlavorKey, RETAIL_PACK_SIZES } from '@/data/products';
import { useCatalogProducts, useCatalogProduct } from '@/hooks/useCatalog';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ChevronLeft, Star, ShoppingCart, Check, Truck, Package, RefreshCw, PackageX, Bell, Info,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { AgeGate } from '@/components/compliance/AgeGate';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { ProductSchema } from '@/components/seo/ProductSchema';
import { ProductCard } from '@/components/product/ProductCard';
import { PDPSkeleton } from '@/components/product/PDPSkeleton';
import { Input } from '@/components/ui/input';
import { apiFetch } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const flavorGradients: Partial<Record<FlavorKey, string>> = {
  mint: 'from-emerald-400 to-green-600',
  berry: 'from-purple-400 to-fuchsia-600',
  citrus: 'from-orange-300 to-amber-500',
  fruit: 'from-orange-300 to-amber-500',
  coffee: 'from-amber-700 to-stone-800',
  cola: 'from-amber-700 to-stone-800',
};
const defaultGradient = 'from-slate-300 to-slate-500';

const packSizes = RETAIL_PACK_SIZES;

const easeOut = [0, 0, 0.2, 1] as const;

export default function ProductDetail() {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);
  const { data: product, isLoading, isError } = useCatalogProduct(id);
  const { data: allProducts = [] } = useCatalogProducts();
  const { addToCart } = useCart();
  const [selectedPack, setSelectedPack] = useState<PackSize>('pack10');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyStatus, setNotifyStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const { t, formatPrice, formatPriceWithUnit, translateFlavor, translateStrength, translateFormat, translateBadge, translateCategory } = useTranslation();

  if (isLoading) {
    return <Layout><PDPSkeleton /></Layout>;
  }

  if (isError) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Unable to load product</h1>
          <p className="text-muted-foreground mb-6 text-sm">There was a problem fetching this product. Please try again.</p>
          <Button asChild variant="outline" className="rounded-xl border-border/30">
            <Link to="/nicotine-pouches">{t('detail.backToProducts')}</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">{t('detail.productNotFound')}</h1>
          <Button asChild variant="outline" className="rounded-xl border-border/30">
            <Link to="/nicotine-pouches">{t('detail.backToProducts')}</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const currentPrice = product.prices[selectedPack];
  const pricePerCan = currentPrice / packSizeMultipliers[selectedPack];

  const productDescription = product.description
    || (t(product.descriptionKey) !== product.descriptionKey ? t(product.descriptionKey) : null)
    || t('detail.genericDescription', { name: product.name, brand: product.brand });

  const relatedProducts = allProducts
    .filter(p => p.brand === product.brand && p.id !== product.id)
    .slice(0, 4);

  const isOutOfStock = typeof product.stock === 'number' && product.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedPack);
  };

  const handleNotifyMe = async () => {
    if (!notifyEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notifyEmail.trim())) return;
    setNotifyStatus('sending');
    try {
      await apiFetch('save-waitlist-email', {
        method: 'POST',
        body: { email: notifyEmail, source: `restock-${product.id}` },
      });
      setNotifyStatus('sent');
    } catch {
      setNotifyStatus('error');
    }
  };

  const tagLabels = [translateFlavor(product.flavorKey), translateFormat(product.formatKey), translateStrength(product.strengthKey), `${product.nicotineContent}mg`];

  return (
    <AgeGate>
    <Layout showNicotineWarning={false}>
      <ProductSchema product={product} selectedPackSize={selectedPack} />

      <div className="container py-10">
        <nav className="mb-8">
          <Link to="/nicotine-pouches" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="mr-1 h-4 w-4" />
            {t('detail.backToProducts')}
          </Link>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* LEFT — Product Image */}
          <div className="order-1">
            <div className="sticky top-32">
              {/* 1. Product image entrance */}
              <div
                className="pdp-image-entrance"
              >
                <Card className="overflow-hidden rounded-2xl border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.2)] bg-transparent">
                  <div
                    className="relative aspect-square group/img"
                    style={{ background: 'radial-gradient(circle at 50% 40%, rgba(40,60,100,0.3), rgba(15,25,55,0.15))' }}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover pdp-image-hover"
                        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))', boxShadow: '0 0 40px rgba(80, 120, 255, 0.15)' }}
                        loading="eager"
                      />
                    ) : (
                      <div className={cn('h-full w-full bg-gradient-to-br flex items-center justify-center', flavorGradients[product.flavorKey] ?? defaultGradient)}>
                        <span className="text-white/80 font-bold text-2xl text-center px-6 drop-shadow">{product.name}</span>
                      </div>
                    )}
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      {product.badgeKeys.slice(0, 2).map((badge) => (
                        <Badge
                          key={badge}
                          className={cn(
                            'text-sm rounded-full px-3.5 py-1 shadow-xs border-0',
                            badge === 'newPrice' && 'bg-primary text-primary-foreground',
                            badge === 'new' && 'bg-chart-2 text-primary-foreground',
                            badge === 'popular' && 'bg-card/90 text-foreground border border-border/40',
                            badge === 'limited' && 'bg-destructive text-destructive-foreground'
                          )}
                        >
                          {translateBadge(badge)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
                {/* Gallery dot indicators */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="block w-2 h-2 rounded-full bg-accent" style={{ width: 8 }} />
                  <span className="block w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="block w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
              </motion.div>

              {/* 2. Trust badges */}
              <motion.div
                className="mt-5 grid grid-cols-3 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2, ease: easeOut }}
              >
                {[
                  { icon: Truck, label: 'Free delivery' },
                  { icon: Package, label: 'Fast dispatch' },
                  { icon: RefreshCw, label: 'Easy returns' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 rounded-2xl glass-panel p-4">
                    <Icon className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-xs text-muted-foreground text-center line-clamp-2">{label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* RIGHT — Product Info */}
          <div className="space-y-7 order-2 min-w-0">
            {/* 3. Brand + title */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: easeOut }}
            >
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1.5">{product.brand}</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 break-words tracking-tight">{product.name}</h1>
              {product.ratings > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4].map(i => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
                    <Star className="h-4 w-4 text-muted/40" />
                    <span className="ml-2 text-sm text-muted-foreground">({product.ratings} reviews)</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* 4. Tags with stagger */}
            <div className="flex flex-wrap gap-2">
              {tagLabels.map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.05, ease: easeOut }}
                >
                  <Badge variant="outline" className="rounded-full px-3.5 py-1.5 border-border/30 text-foreground">
                    {label}
                  </Badge>
                </motion.div>
              ))}
            </div>

            {/* 5. Description */}
            <motion.p
              className="text-muted-foreground leading-relaxed text-[15px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.35, ease: easeOut }}
            >
              {productDescription}
            </motion.p>

            {/* 6. Pack Size */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4, ease: easeOut }}
            >
              <h3 className="text-sm font-medium text-foreground mb-3.5">Select pack size</h3>
              <RadioGroup value={selectedPack} onValueChange={(v) => setSelectedPack(v as PackSize)} className="grid grid-cols-2 gap-3">
                {packSizes.map((size) => {
                  const price = product.prices[size];
                  const perCan = price / packSizeMultipliers[size];
                  const isSelected = selectedPack === size;
                  const packCount = packSizeMultipliers[size];
                  const singlePrice = product.prices.pack1;
                  const savings = singlePrice * packCount - price;
                  const savingsPct = Math.round((savings / (singlePrice * packCount)) * 100);
                  const isBestValue = size === 'pack10';

                  return (
                    <Label
                      key={size}
                      htmlFor={`pack-${size}`}
                      className={cn(
                        'flex flex-col items-center justify-center rounded-xl border-2 px-4 py-3 cursor-pointer transition-all duration-150 text-center relative',
                        isSelected
                          ? 'border-accent bg-accent/[0.08] text-foreground'
                          : 'border-white/[0.08] bg-transparent text-muted-foreground hover:border-white/20 hover:bg-white/[0.03]'
                      )}
                    >
                      <RadioGroupItem value={size} id={`pack-${size}`} className="sr-only" />
                      {/* Animated check icon */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            className="absolute top-2 right-2 text-accent"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25, duration: 0.2 }}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {isBestValue && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-accent bg-accent/15 rounded-full px-2 py-0.5 whitespace-nowrap">
                          Best value
                        </span>
                      )}
                      <span className="font-bold text-lg text-foreground">{packCount} {packCount === 1 ? 'can' : 'cans'}</span>
                      <span className="text-xl font-bold text-accent mt-1">{formatPrice(price)}</span>
                      <span className="text-xs text-muted-foreground mt-0.5">{formatPrice(perCan)}/can</span>
                      {savings > 0.01 && (
                        <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 rounded-full px-2 py-0.5 mt-1.5">
                          Save {savingsPct}%
                        </span>
                      )}
                    </Label>
                  );
                })}
              </RadioGroup>
            </motion.div>

            {/* Price with animated transition */}
            <div>
              <div className="flex items-baseline gap-3 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={selectedPack}
                    className="text-3xl font-bold text-foreground"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: easeOut }}
                  >
                    {formatPrice(currentPrice)}
                  </motion.span>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`per-${selectedPack}`}
                    className="text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    ({formatPrice(pricePerCan)}/can)
                  </motion.span>
                </AnimatePresence>
              </div>
              {(() => {
                const bulkSavings = product.prices.pack1 * packSizeMultipliers[selectedPack] - currentPrice;
                return bulkSavings > 0.01 ? (
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={`savings-${selectedPack}`}
                      className="text-sm text-emerald-400 mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      You save {formatPrice(bulkSavings)} compared to buying {packSizeMultipliers[selectedPack]} single cans
                    </motion.p>
                  </AnimatePresence>
                ) : null;
              })()}
            </div>

            {/* SnusPoints earn indicator */}
            {!isOutOfStock && (
              <div className="flex items-center gap-2">
                <Star className="h-3.5 w-3.5 fill-[hsl(var(--chart-4))] text-[hsl(var(--chart-4))] shrink-0" />
                <span className="text-sm font-medium text-[hsl(var(--chart-4))]">
                  Earn{' '}
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={selectedPack}
                      className="inline-block"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.3, ease: easeOut }}
                    >
                      {Math.round(currentPrice * 10)}
                    </motion.span>
                  </AnimatePresence>
                  {' '}SnusPoints with this purchase
                </span>
                <Link
                  to="/membership#points"
                  className="group relative"
                  title="10 pts per €1 spent. 500 pts = free mystery box month!"
                >
                  <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-[hsl(var(--chart-4))] transition-colors" />
                </Link>
              </div>
            )}

            {/* 7. CTA */}
            {isOutOfStock ? (
              <div className="space-y-4">
                <Button disabled variant="outline" size="lg" className="w-full gap-2.5 rounded-2xl h-14 text-lg opacity-60 cursor-not-allowed">
                  <PackageX className="h-5 w-5" />
                  Out of Stock
                </Button>
                {notifyStatus === 'sent' ? (
                  <div className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/5 p-4">
                    <Bell className="h-5 w-5 text-primary shrink-0" />
                    <p className="text-sm text-foreground">We'll notify you when this product is back in stock.</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border/30 glass-panel p-4 space-y-3">
                    <p className="text-sm text-muted-foreground">Get notified when this product is back in stock:</p>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        className="rounded-xl"
                        onKeyDown={(e) => e.key === 'Enter' && handleNotifyMe()}
                      />
                      <Button
                        onClick={handleNotifyMe}
                        disabled={notifyStatus === 'sending' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notifyEmail.trim())}
                        className="rounded-xl shrink-0 gap-2"
                      >
                        <Bell className="h-4 w-4" />
                        {notifyStatus === 'sending' ? 'Saving...' : 'Notify Me'}
                      </Button>
                    </div>
                    {notifyStatus === 'error' && (
                      <p className="text-xs text-destructive">Something went wrong. Please try again.</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5, ease: easeOut }}
              >
                <Button size="lg" className="w-full gap-2.5 rounded-2xl h-14 text-lg glow-primary hover:shadow-lg transition-shadow" onClick={handleAddToCart}>
                  <ShoppingCart className="h-5 w-5" />
                  {t('product.addToCart')}
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Accordions */}
        <div className="mt-16 max-w-3xl">
          <h2 className="text-xl font-bold text-foreground mb-5 tracking-tight">More information</h2>
          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="specs" className="rounded-2xl border border-border/30 glass-panel px-5">
              <AccordionTrigger className="text-base font-medium hover:no-underline py-5 [&[data-state=open]>svg]:rotate-180 [&>svg]:transition-transform [&>svg]:duration-200">Product specifications</AccordionTrigger>
              <AccordionContent className="pb-5">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    ['Brand', product.brand],
                    ['Format', translateFormat(product.formatKey)],
                    ['Pouches/can', String(product.portionsPerCan)],
                    ['Nicotine/pouch', `${product.nicotineContent}mg`],
                    ['Strength', translateStrength(product.strengthKey)],
                    ['Flavor', translateFlavor(product.flavorKey)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between border-b border-border/20 pb-3">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between col-span-2">
                    <span className="text-muted-foreground">{t('detail.manufacturer')}</span>
                    <span className="font-medium">{product.manufacturer}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="about" className="rounded-2xl border border-border/30 glass-panel px-5">
              <AccordionTrigger className="text-base font-medium hover:no-underline py-5 [&[data-state=open]>svg]:rotate-180 [&>svg]:transition-transform [&>svg]:duration-200">{t('detail.aboutBrand')} {product.brand}</AccordionTrigger>
              <AccordionContent className="pb-5">
                <p className="text-muted-foreground leading-relaxed">{t('detail.brandDescription', { brand: product.brand, manufacturer: product.manufacturer })}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="delivery" className="rounded-2xl border border-border/30 glass-panel px-5">
              <AccordionTrigger className="text-base font-medium hover:no-underline py-5 [&[data-state=open]>svg]:rotate-180 [&>svg]:transition-transform [&>svg]:duration-200">{t('detail.deliveryReturns')}</AccordionTrigger>
              <AccordionContent className="pb-5">
                <div className="space-y-3 text-muted-foreground text-sm">
                  <p>• {t('detail.freeShippingThreshold', { amount: formatPrice(25) })}</p>
                  <p>• {t('detail.deliveryTime')}</p>
                  <p>• {t('detail.fastDelivery')}</p>
                  <p>• {t('detail.returnPolicy')}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* 8. Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <motion.h2
              className="text-2xl font-bold text-foreground mb-8 tracking-tight"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: easeOut }}
            >
              More from {product.brand}
            </motion.h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: easeOut }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky CTA */}
      {!isOutOfStock && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border/20 glass-panel-strong p-4 lg:hidden z-40">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="text-2xl font-bold text-foreground">{formatPrice(currentPrice)}</span>
              <span className="block text-xs text-muted-foreground truncate">
                {formatPrice(pricePerCan)}/{t('cart.can')}
              </span>
            </div>
            <Button size="lg" className="gap-2 rounded-2xl shrink-0 glow-primary" onClick={handleAddToCart}>
              <ShoppingCart className="h-5 w-5" />
              {t('product.addToCart')}
            </Button>
          </div>
        </div>
      )}
    </Layout>
    </AgeGate>
  );
}
