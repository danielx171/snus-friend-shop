import { useState } from 'react';
import { Product, PackSize, packSizeLabels, packSizeMultipliers } from '@/data/products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { formatPrice, formatPricePerUnit } from '@/lib/format';
import { useTranslation } from '@/hooks/useTranslation';

interface ProductCardProps {
  product: Product;
}

// Show fewer pack sizes on card, "Fler" for rest
const cardPackSizes: PackSize[] = ['pack1', 'pack3', 'pack5', 'pack10'];

const strengthLevels: Record<Product['strength'], number> = {
  'Normal': 1,
  'Stark': 2,
  'Extra Stark': 3,
  'Ultra Stark': 4,
};

// Badge priority order: Nyhet, Nytt pris, Populär (max 2)
const badgePriority: Product['badges'][number][] = ['Nyhet', 'Nytt pris', 'Populär'];

function getDisplayBadges(badges: Product['badges']): Product['badges'][number][] {
  return badgePriority.filter((b) => badges.includes(b)).slice(0, 2);
}

// Map internal badge names to translation keys
const badgeTranslationKeys: Record<Product['badges'][number], string> = {
  'Nyhet': 'badge.new',
  'Nytt pris': 'badge.newPrice',
  'Populär': 'badge.popular',
  'Begränsat': 'badge.limited',
};

// Map internal strength names to translation keys
const strengthTranslationKeys: Record<Product['strength'], string> = {
  'Normal': 'strength.normal',
  'Stark': 'strength.strong',
  'Extra Stark': 'strength.extraStrong',
  'Ultra Stark': 'strength.ultraStrong',
};

export function ProductCard({ product }: ProductCardProps) {
  const [selectedPack, setSelectedPack] = useState<PackSize>('pack1');
  const { addToCart } = useCart();
  const { t } = useTranslation();

  const currentPrice = product.prices[selectedPack];
  const pricePerCan = currentPrice / packSizeMultipliers[selectedPack];
  const strengthLevel = strengthLevels[product.strength];
  const displayBadges = getDisplayBadges(product.badges);

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
                    badge === 'Nyhet' && 'bg-secondary text-secondary-foreground',
                    badge === 'Nytt pris' && 'bg-primary text-primary-foreground',
                    badge === 'Populär' && 'bg-card/95 text-foreground border border-border'
                  )}
                >
                  {t(badgeTranslationKeys[badge])}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <CardContent className="p-3.5">
          {/* Brand & Name */}
          <div className="mb-1.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {product.brand}
            </p>
            <h3 className="font-semibold text-foreground line-clamp-1 text-sm leading-tight">
              {product.name}
            </h3>
          </div>

          {/* Strength indicator - visual bars */}
          <div className="mb-2 flex items-center gap-1.5">
            <div className="flex gap-0.5">
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
            <span className="text-[10px] text-muted-foreground">{t(strengthTranslationKeys[product.strength])}</span>
          </div>

          {/* Ratings */}
          <div className="mb-2 flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-[10px] text-muted-foreground">
              ({product.ratings})
            </span>
          </div>

          {/* Pack Size Selector - compact */}
          <div className="mb-2.5 flex flex-wrap gap-1">
            {cardPackSizes.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedPack(size);
                }}
                className={cn(
                  'rounded-md px-1.5 py-0.5 text-[10px] font-medium transition-all',
                  selectedPack === size
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {packSizeLabels[size]}
              </button>
            ))}
          </div>

          {/* Prices - localized formatting */}
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(currentPrice)} kr
            </span>
            <span className="text-xs text-muted-foreground">
              {formatPricePerUnit(pricePerCan, t('products.perUnit'))}
            </span>
          </div>

          {/* Add to Cart - responsive CTA */}
          <Button
            onClick={handleAddToCart}
            className="w-full gap-2 rounded-xl text-sm"
            size="sm"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('product.addToCart')}</span>
            <span className="sm:hidden">{t('product.buy')}</span>
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
}
