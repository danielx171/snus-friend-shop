import { useState } from 'react';
import { Product, PackSize, packSizeMultipliers, BadgeKey, FlavorKey, RETAIL_PACK_SIZES } from '@/data/products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart, PackageX, Bell } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

const LOW_STOCK_THRESHOLD = 20;

const flavorGradients: Partial<Record<FlavorKey, string>> = {
  mint: 'from-emerald-400 to-green-600',
  berry: 'from-purple-400 to-fuchsia-600',
  citrus: 'from-orange-300 to-amber-500',
  fruit: 'from-orange-300 to-amber-500',
  coffee: 'from-amber-700 to-stone-800',
  cola: 'from-amber-700 to-stone-800',
};
const defaultGradient = 'from-slate-300 to-slate-500';

interface ProductCardProps {
  product: Product;
}

const cardPackSizes = RETAIL_PACK_SIZES;

const badgePriority: BadgeKey[] = ['new', 'newPrice', 'popular'];

function getDisplayBadges(badges: BadgeKey[]): BadgeKey[] {
  return badgePriority.filter((b) => badges.includes(b)).slice(0, 2);
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedPack, setSelectedPack] = useState<PackSize>('pack1');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyStatus, setNotifyStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const { addToCart } = useCart();
  const { t, formatPrice, formatPriceWithUnit, translateFlavor, translateStrength, translateBadge } = useTranslation();

  const currentPrice = product.prices[selectedPack];
  const pricePerCan = currentPrice / packSizeMultipliers[selectedPack];
  const displayBadges = getDisplayBadges(product.badgeKeys);

  const isOutOfStock = typeof product.stock === 'number' && product.stock === 0;
  const isLowStock = typeof product.stock === 'number' && product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, selectedPack);
  };

  const handleNotifyMe = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!notifyEmail || !notifyEmail.includes('@')) return;
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

  return (
    <Card className={cn(
      'product-card group relative overflow-hidden rounded-2xl border-border/30 bg-card/80 backdrop-blur-sm transition-[transform,box-shadow] duration-200 ease-out hover:scale-[1.02] hover:shadow-[0_8px_30px_hsl(30_40%_50%/0.08)] hover:border-primary/30',
      isOutOfStock && 'opacity-70'
    )}>
      <Link to={`/product/${product.id}`}>
        <div className="product-card-image relative aspect-square overflow-hidden bg-muted/20">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className={cn(
                'h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-105',
                isOutOfStock && 'grayscale'
              )}
              loading="lazy"
            />
          ) : (
            <div className={cn('h-full w-full bg-gradient-to-br flex items-center justify-center', flavorGradients[product.flavorKey] ?? defaultGradient)}>
              <span className="text-white/80 font-bold text-lg text-center px-4 drop-shadow">{product.name}</span>
            </div>
          )}

          {/* Stock / product badges — out of stock takes priority */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {isOutOfStock ? (
              <Badge className="text-[10px] font-semibold rounded-full px-2.5 py-0.5 shadow-xs border-0 bg-destructive/90 text-destructive-foreground">
                Out of Stock
              </Badge>
            ) : (
              <>
                {isLowStock && (
                  <Badge className="text-[10px] font-semibold rounded-full px-2.5 py-0.5 shadow-xs border border-amber-500/30 bg-amber-500/10 text-amber-700">
                    Low Stock
                  </Badge>
                )}
                {displayBadges.map((badge) => (
                  <Badge
                    key={badge}
                    className={cn(
                      'text-[10px] font-semibold rounded-full px-2.5 py-0.5 shadow-xs border-0',
                      badge === 'new' && 'bg-chart-2 text-primary-foreground',
                      badge === 'newPrice' && 'bg-primary text-primary-foreground',
                      badge === 'popular' && 'bg-card/90 text-foreground border border-border/40'
                    )}
                  >
                    {translateBadge(badge)}
                  </Badge>
                ))}
              </>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Brand + Name */}
          <div className="mb-2 min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">{product.brand}</p>
            <h3 className="font-semibold text-foreground line-clamp-2 text-sm leading-snug min-h-[2.5rem] mt-0.5">{product.name}</h3>
          </div>

          {/* Attribute pills */}
          <div className="mb-2.5 flex flex-wrap gap-1">
            <span className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border',
              product.strengthKey === 'normal' && 'bg-green-500/10 text-green-700 border-green-500/20',
              product.strengthKey === 'strong' && 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
              product.strengthKey === 'extraStrong' && 'bg-[hsl(var(--chart-4)/0.1)] text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4)/0.2)]',
              product.strengthKey === 'ultraStrong' && 'bg-red-500/10 text-red-700 border-red-500/20',
            )}>
              <span className={cn(
                'h-1.5 w-1.5 rounded-full shrink-0',
                product.strengthKey === 'normal' && 'bg-green-500',
                product.strengthKey === 'strong' && 'bg-yellow-500',
                product.strengthKey === 'extraStrong' && 'bg-[hsl(var(--chart-4))]',
                product.strengthKey === 'ultraStrong' && 'bg-red-500',
              )} />
              {translateStrength(product.strengthKey)}
            </span>
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-muted/40 text-muted-foreground border border-border/30">
              {translateFlavor(product.flavorKey)}
            </span>
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-muted/40 text-muted-foreground border border-border/30">
              {product.nicotineContent}mg
            </span>
          </div>

          {/* Rating */}
          <div className="mb-3 flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary shrink-0" />
            <span className="text-[10px] text-muted-foreground">({product.ratings})</span>
          </div>

          {/* Pack sizes */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {cardPackSizes.map((size) => {
              const packNum = size.replace('pack', '');
              return (
                <button
                  key={size}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedPack(size); }}
                  disabled={isOutOfStock}
                  className={cn(
                    'rounded-lg px-2 py-1 text-[10px] font-medium transition-all duration-150 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    selectedPack === size
                      ? 'bg-primary text-primary-foreground glow-primary'
                      : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-border/30',
                    isOutOfStock && 'pointer-events-none'
                  )}
                >
                  {t(`pack.${packNum}`)}
                </button>
              );
            })}
          </div>

          {/* Price block */}
          <div className="mb-3.5 flex items-baseline justify-between gap-2 min-w-0">
            <span className="text-lg font-bold text-foreground truncate">{formatPrice(currentPrice)}</span>
            <div className="flex flex-col items-end shrink-0">
              <span className="text-xs text-muted-foreground">{formatPriceWithUnit(pricePerCan)}</span>
              {product.comparePrice && product.comparePrice > pricePerCan && (
                <span className="text-[10px] text-muted-foreground/50 line-through">
                  {formatPrice(product.comparePrice)}/can
                </span>
              )}
            </div>
          </div>

          {/* CTA */}
          {isOutOfStock ? (
            <div className="space-y-2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              {notifyStatus === 'sent' ? (
                <div className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/5 p-2">
                  <Bell className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-xs text-foreground">We'll email you when it's back!</span>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNotifyMe(e as unknown as React.MouseEvent)}
                    className="flex-1 min-w-0 rounded-xl border border-border/30 bg-background px-2.5 py-1.5 text-xs placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button
                    onClick={handleNotifyMe}
                    disabled={notifyStatus === 'sending' || !notifyEmail.includes('@')}
                    size="sm"
                    className="rounded-xl text-xs gap-1 shrink-0"
                  >
                    <Bell className="h-3 w-3" />
                    Notify
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={handleAddToCart}
              className="w-full gap-2 rounded-xl text-sm hover:shadow-md transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-ring"
              size="sm"
            >
              <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline truncate">{t('product.addToCart')}</span>
              <span className="sm:hidden">{t('product.buy')}</span>
            </Button>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
