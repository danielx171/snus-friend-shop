import { useState } from 'react';
import { Product, PackSize, packSizeMultipliers, BadgeKey, FlavorKey } from '@/data/products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart, Award } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

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

const cardPackSizes: PackSize[] = ['pack1', 'pack3', 'pack5', 'pack10'];


const badgePriority: BadgeKey[] = ['new', 'newPrice', 'popular'];

function getDisplayBadges(badges: BadgeKey[]): BadgeKey[] {
  return badgePriority.filter((b) => badges.includes(b)).slice(0, 2);
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedPack, setSelectedPack] = useState<PackSize>('pack1');
  const { addToCart } = useCart();
  const { t, formatPrice, formatPriceWithUnit, translateFlavor, translateStrength, translateBadge } = useTranslation();

  const currentPrice = product.prices[selectedPack];
  const pricePerCan = currentPrice / packSizeMultipliers[selectedPack];
  const displayBadges = getDisplayBadges(product.badgeKeys);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedPack);
  };

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-border/30 bg-card/80 backdrop-blur-sm transition-[transform,box-shadow] duration-200 ease-out hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/8 hover:border-primary/30">
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted/20">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className={cn('h-full w-full bg-gradient-to-br flex items-center justify-center', flavorGradients[product.flavorKey] ?? defaultGradient)}>
              <span className="text-white/80 font-bold text-lg text-center px-4 drop-shadow">{product.name}</span>
            </div>
          )}
          {/* Badges */}
          {displayBadges.length > 0 && (
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
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
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Brand + Name */}
          <div className="mb-2 min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">{product.brand}</p>
            <h3 className="font-semibold text-foreground line-clamp-2 text-sm leading-snug min-h-[2.5rem] mt-0.5">{product.name}</h3>
          </div>

          {/* Strength indicator */}
          <div className="mb-2.5 flex items-center gap-1.5 min-w-0">
            <span
              className={cn(
                'inline-block h-2 w-2 rounded-full shrink-0',
                product.strengthKey === 'normal' && 'bg-green-500',
                product.strengthKey === 'strong' && 'bg-yellow-500',
                product.strengthKey === 'extraStrong' && 'bg-[hsl(var(--chart-4))]',
                product.strengthKey === 'ultraStrong' && 'bg-red-500',
              )}
            />
            <span className="text-[11px] text-muted-foreground truncate">{translateStrength(product.strengthKey)}</span>
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
                  className={cn(
                    'rounded-lg px-2 py-1 text-[10px] font-medium transition-all duration-150 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    selectedPack === size
                      ? 'bg-primary text-primary-foreground glow-primary'
                      : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-border/30'
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
            <span className="text-xs text-muted-foreground shrink-0">{formatPriceWithUnit(pricePerCan)}</span>
          </div>

          {/* Loyalty pill */}
          <div className="mb-3 flex items-center gap-1.5">
            <Award className="h-3 w-3 text-primary shrink-0" />
            <span className="text-[10px] text-muted-foreground">Earn {Math.floor(currentPrice * 10)} points</span>
          </div>

          {/* CTA — hidden by default, slides up on card hover */}
          <div className="translate-y-2 opacity-0 transition-[transform,opacity] duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              onClick={handleAddToCart}
              className="w-full gap-2 rounded-xl text-sm hover:shadow-md transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-ring"
              size="sm"
            >
              <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline truncate">{t('product.addToCart')}</span>
              <span className="sm:hidden">{t('product.buy')}</span>
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
