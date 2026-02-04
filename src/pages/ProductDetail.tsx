import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products, PackSize, packSizeLabels, packSizeMultipliers } from '@/data/products';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ChevronLeft,
  Star,
  ShoppingCart,
  Repeat,
  Truck,
  MapPin,
  Clock,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

const packSizes: PackSize[] = ['pack1', 'pack3', 'pack5', 'pack10', 'pack30'];

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const [selectedPack, setSelectedPack] = useState<PackSize>('pack1');
  const [postalCode, setPostalCode] = useState('');

  if (!product) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Produkten hittades inte
          </h1>
          <Button asChild>
            <Link to="/">Tillbaka till produkter</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const currentPrice = product.prices[selectedPack];
  const pricePerCan = Math.round(currentPrice / packSizeMultipliers[selectedPack]);

  const strengthColors: Record<typeof product.strength, string> = {
    'Normal': 'bg-chart-3/20 text-accent-foreground',
    'Stark': 'bg-chart-2/20 text-secondary',
    'Extra Stark': 'bg-chart-1/30 text-secondary',
    'Ultra Stark': 'bg-destructive/20 text-destructive',
  };

  return (
    <Layout>
      {/* Age Notice */}
      <div className="bg-secondary py-2">
        <div className="container text-center">
          <p className="text-sm text-secondary-foreground">
            🔞 Du måste vara 18 år eller äldre för att handla hos oss
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Tillbaka till produkter
          </Link>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              {product.badges.map((badge) => (
                <Badge
                  key={badge}
                  className={cn(
                    'text-sm',
                    badge === 'Nytt pris' && 'bg-primary text-primary-foreground',
                    badge === 'Nyhet' && 'bg-secondary text-secondary-foreground',
                    badge === 'Populär' && 'bg-card text-foreground',
                    badge === 'Begränsat' && 'bg-destructive text-destructive-foreground'
                  )}
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                {product.brand}
              </p>
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm text-muted-foreground">
                    ({product.ratings} omdömen)
                  </span>
                </div>
                <span className={cn('rounded-full px-3 py-1 text-sm font-medium', strengthColors[product.strength])}>
                  {product.strength}
                </span>
              </div>
            </div>

            {/* Nicotine Warning */}
            <div className="rounded-lg bg-destructive/10 p-4">
              <p className="text-sm text-destructive font-medium">
                ⚠️ Varning: Denna produkt innehåller nikotin ({product.nicotineContent} mg/portion) som är ett beroendeframkallande ämne.
              </p>
            </div>

            {/* Pack Size Selector */}
            <div>
              <h3 className="font-medium text-foreground mb-3">Välj förpackning</h3>
              <div className="flex flex-wrap gap-2">
                {packSizes.map((size) => {
                  const price = product.prices[size];
                  const perCan = Math.round(price / packSizeMultipliers[size]);
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedPack(size)}
                      className={cn(
                        'flex flex-col items-center rounded-lg border-2 px-4 py-3 transition-all',
                        selectedPack === size
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <span className="font-semibold text-foreground">
                        {packSizeLabels[size]}
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {price} kr
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {perCan} kr/st
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price & Actions */}
            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-foreground">
                      {currentPrice} kr
                    </span>
                    <span className="ml-2 text-muted-foreground">
                      ({pricePerCan} kr/st)
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    className="flex-1 gap-2"
                    size="lg"
                    onClick={() => addToCart(product, selectedPack)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Köp
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2" size="lg">
                    <Repeat className="h-5 w-5" />
                    Prenumerera
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Estimator */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Se när vi kan leverera till dig
                </h3>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Postnummer"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">Kontrollera</Button>
                </div>
                {postalCode.length >= 5 && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Beställ inom 2h 34min för leverans imorgon</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Detaljer</h2>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Specifications */}
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  <li className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">Kategori</span>
                    <span className="font-medium text-foreground">{product.category}</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">Smak</span>
                    <span className="font-medium text-foreground">{product.flavor}</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">Styrka</span>
                    <span className="font-medium text-foreground">{product.strength}</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">Format</span>
                    <span className="font-medium text-foreground">{product.format}</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">Nikotinhalt</span>
                    <span className="font-medium text-foreground">{product.nicotineContent} mg/portion</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">Antal prillor per dosa</span>
                    <span className="font-medium text-foreground">{product.portionsPerCan} st</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Tillverkare</span>
                    <span className="font-medium text-foreground">{product.manufacturer}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Beskrivning</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
