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

export function ProductCard({ product }: ProductCardProps) {
  const [selectedPack, setSelectedPack] = useState<PackSize>('pack1');
  const { addToCart } = useCart();

  const currentPrice = product.prices[selectedPack];
  const pricePerCan = Math.round(currentPrice / packSizeMultipliers[selectedPack]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedPack);
  };

  const strengthColors: Record<Product['strength'], string> = {
    'Normal': 'bg-chart-3/20 text-accent-foreground',
    'Stark': 'bg-chart-2/20 text-secondary',
    'Extra Stark': 'bg-chart-1/30 text-secondary',
    'Ultra Stark': 'bg-destructive/20 text-destructive',
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg border-border">
      <Link to={`/produkt/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {product.badges.includes('Nytt pris') && (
              <Badge className="bg-primary text-primary-foreground text-xs">
                Nytt pris
              </Badge>
            )}
            {product.badges.includes('Nyhet') && (
              <Badge className="bg-secondary text-secondary-foreground text-xs">
                Nyhet
              </Badge>
            )}
            {product.badges.includes('Populär') && (
              <Badge variant="outline" className="bg-card/90 text-xs">
                Populär
              </Badge>
            )}
          </div>
          {/* Strength indicator */}
          <div className="absolute right-2 top-2">
            <span className={cn('rounded-full px-2 py-1 text-xs font-medium', strengthColors[product.strength])}>
              {product.strength}
            </span>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Brand & Name */}
          <div className="mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.brand}
            </p>
            <h3 className="font-semibold text-foreground line-clamp-1">
              {product.name}
            </h3>
          </div>

          {/* Ratings */}
          <div className="mb-3 flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="text-xs text-muted-foreground">
              ({product.ratings} omdömen)
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
                  'rounded-md px-2 py-1 text-xs font-medium transition-colors',
                  selectedPack === size
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {packSizeLabels[size]}
              </button>
            ))}
          </div>

          {/* Prices */}
          <div className="mb-3 flex items-baseline justify-between">
            <div>
              <span className="text-xl font-bold text-foreground">
                {currentPrice} kr
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {pricePerCan} kr/st
            </span>
          </div>

          {/* Add to Cart */}
          <Button
            onClick={handleAddToCart}
            className="w-full gap-2"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4" />
            Köp
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
}
