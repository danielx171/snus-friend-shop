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

const cardPackSizes: PackSize[] = ['pack1', 'pack3', 'pack5', 'pack10'];

const strengthLevels: Record<Product['strengthKey'], number> = {
  'normal': 1, 'strong': 2, 'extraStrong': 3, 'ultraStrong': 4,
};

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
    <Card className="group overflow-hidden transition-all duration-300 hover:border-primary/30 border-border/30 rounded-2xl bg-card/80 backdrop-blur-sm hover:glow-primary">
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
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
          <div className="mb-2 min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">{product.brand}</p>
            <h3 className="font-semibold text-foreground line-clamp-2 text-sm leading-snug min-h-[2.5rem] mt-0.5">{product.name}</h3>
          </div>

          <div className="mb-2.5 flex items-center gap-2 min-w-0">
            <div className="flex gap-0.5 shrink-0">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={cn(
                    'h-1.5 w-3.5 rounded-full transition-colors',
                    level <= strengthLevel
                      ? strengthLevel >= 4 ? 'bg-destructive' :
                        strengthLevel >= 3 ? 'bg-chart-1' :
                        strengthLevel >= 2 ? 'bg-chart-5' : 'bg-muted-foreground'
                      : 'bg-muted/40'
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground truncate">{translateStrength(product.strengthKey)}</span>
          </div>

          <div className="mb-3 flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary shrink-0" />
            <span className="text-[10px] text-muted-foreground">({product.ratings})</span>
          </div>

          <div className="mb-3 flex flex-wrap gap-1.5">
            {cardPackSizes.map((size) => {
              const packNum = size.replace('pack', '');
              return (
                <button
                  key={size}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedPack(size); }}
                  className={cn(
                    'rounded-lg px-2 py-1 text-[10px] font-medium transition-all shrink-0',
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

          <div className="mb-3.5 flex items-baseline justify-between gap-2 min-w-0">
            <span className="text-lg font-bold text-foreground truncate">{formatPrice(currentPrice)}</span>
            <span className="text-xs text-muted-foreground shrink-0">{formatPriceWithUnit(pricePerCan)}</span>
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full gap-2 rounded-xl text-sm glow-primary hover:shadow-lg transition-shadow"
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
