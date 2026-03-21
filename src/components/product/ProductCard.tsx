import React, { useState, useRef, useCallback } from 'react';
import { Product, PackSize, packSizeMultipliers, BadgeKey, FlavorKey, RETAIL_PACK_SIZES } from '@/data/products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Bell, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

const LOW_STOCK_THRESHOLD = 20;

const strengthColors: Record<string, string> = {
  normal: '#4ade80',
  mild: '#4ade80',
  strong: '#facc15',
  extraStrong: '#f97316',
  ultraStrong: '#ef4444',
};

const flavorAccents: Partial<Record<FlavorKey, string>> = {
  mint: '#10b981',
  berry: '#d946ef',
  citrus: '#f59e0b',
  fruit: '#f59e0b',
  coffee: '#92400e',
  cola: '#78350f',
};

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

const cardPackSizes = RETAIL_PACK_SIZES;

const badgePriority: BadgeKey[] = ['new', 'newPrice', 'popular'];

function getDisplayBadges(badges: BadgeKey[]): BadgeKey[] {
  return badgePriority.filter((b) => badges.includes(b)).slice(0, 2);
}

function ProductCardInner({ product, variant = 'default' }: ProductCardProps) {
  const [selectedPack, setSelectedPack] = useState<PackSize>('pack1');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyStatus, setNotifyStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [justAdded, setJustAdded] = useState(false);
  const addedTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const { addToCart } = useCart();
  const { t, formatPrice, formatPriceWithUnit, translateFlavor, translateStrength, translateBadge } = useTranslation();
  const isCompact = variant === 'compact';

  const currentPrice = isCompact ? product.prices.pack1 : product.prices[selectedPack];
  const pricePerCan = isCompact ? product.prices.pack1 : currentPrice / packSizeMultipliers[selectedPack];
  const displayBadges = getDisplayBadges(product.badgeKeys);

  const isOutOfStock = typeof product.stock === 'number' && product.stock === 0;
  const isLowStock = typeof product.stock === 'number' && product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;
  const accentColor = flavorAccents[product.flavorKey];
  const strengthColor = strengthColors[product.strengthKey] ?? strengthColors.normal;

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || justAdded) return;
    addToCart(product, selectedPack);

    if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    setJustAdded(true);
    addedTimerRef.current = setTimeout(() => setJustAdded(false), 1500);

    window.dispatchEvent(new CustomEvent('cart-item-added', { detail: { name: product.name } }));
  }, [isOutOfStock, justAdded, addToCart, product, selectedPack]);

  const handleNotifyMe = useCallback(async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
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
  }, [notifyEmail, product.id]);

  return (
    <div className="group">
    <Card className={cn(
      'product-card relative overflow-hidden rounded-2xl border-white/[0.06] bg-card/90 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-[250ms] ease-out group-hover:translate-y-[-4px] group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.3)] group-hover:border-white/[0.12]',
      isOutOfStock && 'opacity-60'
    )}>
      <Link to={`/product/${product.id}`} aria-label={product.name}>
        {/* Image area */}
        <div
          className="product-card-image relative overflow-hidden"
          style={{
            aspectRatio: isCompact ? '3/2' : '1',
            background: 'radial-gradient(circle at 50% 40%, rgba(30,50,90,0.4), rgba(15,30,65,0.2))',
          }}
        >
          {/* Radial glow behind can — CSS only */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-[250ms] ease-out"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(100,150,255,0.12), transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
          <div className="h-full w-full relative z-10 transition-transform duration-[250ms] ease-out group-hover:scale-[1.05] group-hover:rotate-[10deg]">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className={cn(
                'h-full w-full object-contain p-4',
                isOutOfStock && 'grayscale opacity-60'
              )}
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center p-4">
              <span
                className="font-bold text-base text-center leading-snug"
                style={{ color: accentColor ?? 'hsl(var(--foreground))' }}
              >
                {product.name}
              </span>
            </div>
          )}
          </div>

          {/* Strength-coded accent line at bottom of image */}
          {!isOutOfStock && (
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{ backgroundColor: strengthColor }}
            />
          )}

          {/* Badges */}
          <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1">
            {isOutOfStock ? (
              <Badge className="text-[10px] font-semibold rounded-full px-2 py-0.5 shadow-sm border-0 bg-background/80 text-muted-foreground backdrop-blur-sm">
                Out of Stock
              </Badge>
            ) : (
              <>
                {isLowStock && (
                  <Badge className="text-[10px] font-semibold rounded-full px-2 py-0.5 shadow-sm border border-amber-500/30 bg-amber-500/15 text-amber-400 backdrop-blur-sm">
                    Low Stock
                  </Badge>
                )}
                {displayBadges.map((badge) => (
                  <Badge
                    key={badge}
                    className={cn(
                      'text-[10px] font-semibold rounded-full px-2 py-0.5 shadow-sm border-0 backdrop-blur-sm',
                      badge === 'new' && 'bg-chart-2/90 text-primary-foreground',
                      badge === 'newPrice' && 'bg-primary/90 text-primary-foreground',
                      badge === 'popular' && 'bg-background/80 text-foreground border border-border/40'
                    )}
                  >
                    {translateBadge(badge)}
                  </Badge>
                ))}
              </>
            )}
          </div>
        </div>

        <CardContent className={isCompact ? 'p-2.5' : 'p-3.5'}>
          {/* Brand + Name */}
          <div className="mb-2.5 min-w-0">
            <p className="text-[10px] text-muted-foreground/70 uppercase tracking-widest truncate transition-opacity duration-[250ms] ease-out group-hover:opacity-100 opacity-70">{product.brand}</p>
            <h3 className="font-semibold text-foreground line-clamp-2 text-sm leading-snug min-h-[2.5rem] mt-0.5">{product.name}</h3>
          </div>

          {/* Attribute pills */}
          <div className={cn('mb-2.5 flex gap-1', isCompact ? 'flex-nowrap overflow-hidden' : 'flex-wrap')}>
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border shrink-0 bg-accent/10 border-accent/20 text-accent">
              <span className={cn(
                'h-1.5 w-1.5 rounded-full shrink-0',
                product.strengthKey === 'normal' && 'bg-green-400',
                product.strengthKey === 'strong' && 'bg-yellow-400',
                product.strengthKey === 'extraStrong' && 'bg-orange-400',
                product.strengthKey === 'ultraStrong' && 'bg-red-400',
              )} />
              {translateStrength(product.strengthKey)}
            </span>
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-white/[0.05] text-muted-foreground border border-white/[0.08] shrink-0">
              {translateFlavor(product.flavorKey)}
            </span>
            {!isCompact && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-transparent text-muted-foreground/60 border border-white/[0.06]">
                {product.nicotineContent}mg
              </span>
            )}
          </div>

          {/* Pack sizes — hidden in compact */}
          {!isCompact && (
            <div className="mb-3 flex flex-wrap gap-1">
              {cardPackSizes.map((size) => {
                const packNum = size.replace('pack', '');
                return (
                  <button
                    key={size}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedPack(size); }}
                    disabled={isOutOfStock}
                    className={cn(
                      'rounded-lg px-2 py-0.5 text-[10px] font-medium transition-all duration-150 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      selectedPack === size
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted/20 text-muted-foreground hover:bg-muted/40 border border-border/20',
                      isOutOfStock && 'pointer-events-none'
                    )}
                  >
                    {t(`pack.${packNum}`)}
                  </button>
                );
              })}
            </div>
          )}

          {/* Price block */}
          <div className={cn('flex items-baseline justify-between gap-2 min-w-0', isCompact ? 'mb-2' : 'mb-3')}>
            <span className={cn('font-bold text-foreground truncate', isCompact ? 'text-base' : 'text-xl')}>{formatPrice(currentPrice)}</span>
            <div className="flex flex-col items-end shrink-0">
              <span className="text-xs text-muted-foreground">{formatPriceWithUnit(pricePerCan)}</span>
              {!isCompact && product.comparePrice && product.comparePrice > pricePerCan && (
                <span className="text-[10px] text-muted-foreground/40 line-through">
                  {formatPrice(product.comparePrice)}/can
                </span>
              )}
            </div>
          </div>

          {/* CTA */}
          {isOutOfStock ? (
            isCompact ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5 rounded-xl text-xs border-border/30"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                asChild
              >
                <Link to={`/product/${product.id}`}>
                  <Bell className="h-3 w-3" />
                  Notify Me
                </Link>
              </Button>
            ) : (
              <div className="space-y-2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                {notifyStatus === 'sent' ? (
                  <div className="flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/5 p-2">
                    <Bell className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="text-xs text-foreground">We'll notify you when it's back!</span>
                  </div>
                ) : (
                  <div className="flex gap-1.5">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleNotifyMe(e); }}
                      className="flex-1 min-w-0 rounded-xl border border-border/30 bg-background/80 px-2.5 py-1.5 text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                    />
                    <Button
                      onClick={handleNotifyMe}
                      disabled={notifyStatus === 'sending' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notifyEmail.trim())}
                      size="sm"
                      className="rounded-xl text-xs gap-1 shrink-0"
                    >
                      <Bell className="h-3 w-3" />
                      Notify
                    </Button>
                  </div>
                )}
              </div>
            )
          ) : (
            <Button
              onClick={handleAddToCart}
              className={cn(
                'w-full rounded-xl font-medium transition-all duration-[250ms] ease-out focus-visible:ring-2 focus-visible:ring-ring group-hover:brightness-110',
                isCompact ? 'gap-1 text-xs' : 'gap-2 text-sm',
                justAdded && 'bg-[#22c55e] hover:bg-[#22c55e] text-white',
                justAdded && 'atc-press'
              )}
              size="sm"
            >
              {justAdded ? (
                <span className="flex items-center gap-1.5">
                  <Check className={cn('shrink-0', isCompact ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
                  <span className="truncate">Added!</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <ShoppingCart className={cn('shrink-0', isCompact ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
                  {isCompact ? (
                    <span className="hidden sm:inline truncate">{t('product.buy')}</span>
                  ) : (
                    <>
                      <span className="hidden sm:inline truncate">{t('product.addToCart')}</span>
                      <span className="sm:hidden">{t('product.buy')}</span>
                    </>
                  )}
                </span>
              )}
            </Button>
          )}
        </CardContent>
      </Link>
    </Card>
    </div>
  );
}

export const ProductCard = React.memo(ProductCardInner);
