import { useState } from 'react';
import { Product, PackSize, packSizeLabels, packSizeMultipliers } from '@/data/products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const packSizes: PackSize[] = ['pack1', 'pack3', 'pack5', 'pack10', 'pack30'];

const strengthLevels: Record<Product['strength'], number> = {
  'Normal': 1,
  'Stark': 2,
  'Extra Stark': 3,
  'Ultra Stark': 4,
};

export function ProductCard({ product }: ProductCardProps) {
  const [selectedPack, setSelectedPack] = useState<PackSize>('pack1');
  const { addToCart } = useCart();

  const currentPrice = product.prices[selectedPack];
  const pricePerCan = (currentPrice / packSizeMultipliers[selectedPack]).toFixed(2);
  const strengthLevel = strengthLevels[product.strength];

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
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.badges.includes('Nytt pris') && (
              <Badge className="bg-primary text-primary-foreground text-xs rounded-full px-2.5">
                Nytt pris
              </Badge>
            )}
            {product.badges.includes('Nyhet') && (
              <Badge className="bg-secondary text-secondary-foreground text-xs rounded-full px-2.5">
                Nyhet
              </Badge>
            )}
            {product.badges.includes('Populär') && (
              <Badge variant="outline" className="bg-card/95 text-xs rounded-full px-2.5">
                Populär
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Brand & Name */}
          <div className="mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {product.brand}
            </p>
            <h3 className="font-semibold text-foreground line-clamp-1 text-base">
              {product.name}
            </h3>
          </div>

          {/* Strength indicator - visual bars */}
          <div className="mb-3 flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={cn(
                    'h-2 w-4 rounded-sm transition-colors',
                    level <= strengthLevel
                      ? strengthLevel >= 4 ? 'bg-destructive' :
                        strengthLevel >= 3 ? 'bg-chart-1' :
                        strengthLevel >= 2 ? 'bg-chart-2' : 'bg-chart-3'
                      : 'bg-muted'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{product.strength}</span>
          </div>

          {/* Ratings */}
          <div className="mb-3 flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="text-xs text-muted-foreground">
              ({product.ratings})
            </span>
          </div>

          {/* Pack Size Selector */}
          <div className="mb-3 flex flex-wrap gap-1">
            {packSizes.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedPack(size);
                }}
                className={cn(
                  'rounded-lg px-2 py-1 text-xs font-medium transition-all',
                  selectedPack === size
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {packSizeLabels[size]}
              </button>
            ))}
          </div>

          {/* Prices */}
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <span className="text-xl font-bold text-foreground">
                {currentPrice.toFixed(2)} kr
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {pricePerCan} kr/st
            </span>
          </div>

          {/* Add to Cart */}
          <Button
            onClick={handleAddToCart}
            className="w-full gap-2 rounded-xl"
            size="default"
          >
            <ShoppingCart className="h-4 w-4" />
            Köp
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
}
