import { useState } from 'react';
import { Product, PackSize, packSizeMultipliers, BadgeKey } from '@/data/products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

interface ProductCardProps {
  product: Product;
}

// Show fewer pack sizes on card, "Fler" for rest
const cardPackSizes: PackSize[] = ['pack1', 'pack3', 'pack5', 'pack10'];

const strengthLevels: Record<Product['strengthKey'], number> = {
  'normal': 1,
  'strong': 2,
  'extraStrong': 3,
  'ultraStrong': 4,
};

// Badge priority order: new, newPrice, popular (max 2)
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
  const strengthLevel = strengthLevels[product.strengthKey];
  const displayBadges = getDisplayBadges(product.badgeKeys);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedPack);
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-xl border-border rounded-2xl bg-card">
      <Link to={`/produkt/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Badges - max 2, ordered by priority */}
          {displayBadges.length > 0 && (
            <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1">
              {displayBadges.map((badge) => (
                <Badge
                  key={badge}
                  className={cn(
                    'text-[10px] font-semibold rounded-full px-2 py-0.5',
                    badge === 'new' && 'bg-secondary text-secondary-foreground',
                    badge === 'newPrice' && 'bg-primary text-primary-foreground',
                    badge === 'popular' && 'bg-card/95 text-foreground border border-border'
                  )}
                >
                  {translateBadge(badge)}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <CardContent className="p-3.5">
          {/* Brand & Name */}
          <div className="mb-1.5 min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">
              {product.brand}
            </p>
            <h3 className="font-semibold text-foreground line-clamp-2 text-sm leading-tight min-h-[2.5rem]">
              {product.name}
            </h3>
          </div>

          {/* Strength indicator - visual bars */}
          <div className="mb-2 flex items-center gap-1.5 min-w-0">
            <div className="flex gap-0.5 shrink-0">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={cn(
                    'h-1.5 w-3 rounded-sm transition-colors',
                    level <= strengthLevel
                      ? strengthLevel >= 4 ? 'bg-destructive' :
                        strengthLevel >= 3 ? 'bg-chart-1' :
                        strengthLevel >= 2 ? 'bg-chart-2' : 'bg-chart-3'
                      : 'bg-muted'
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground truncate">{translateStrength(product.strengthKey)}</span>
          </div>

          {/* Ratings */}
          <div className="mb-2 flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary shrink-0" />
            <span className="text-[10px] text-muted-foreground">
              ({product.ratings})
            </span>
          </div>

          {/* Pack Size Selector - compact */}
          <div className="mb-2.5 flex flex-wrap gap-1">
            {cardPackSizes.map((size) => {
              const packNum = size.replace('pack', '');
              return (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedPack(size);
                  }}
                  className={cn(
                    'rounded-md px-1.5 py-0.5 text-[10px] font-medium transition-all shrink-0',
                    selectedPack === size
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {t(`pack.${packNum}`)}
                </button>
              );
            })}
          </div>

          {/* Prices - localized currency */}
          <div className="mb-3 flex items-baseline justify-between gap-2 min-w-0">
            <span className="text-lg font-bold text-foreground truncate">
              {formatPrice(currentPrice)}
            </span>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatPriceWithUnit(pricePerCan)}
            </span>
          </div>

          {/* Add to Cart - responsive CTA */}
          <Button
            onClick={handleAddToCart}
            className="w-full gap-2 rounded-xl text-sm"
            size="sm"
          >
            <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline truncate">{t('product.addToCart')}</span>
            <span className="sm:hidden">{t('product.buy')}</span>
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
}
