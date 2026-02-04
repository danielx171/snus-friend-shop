import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products, PackSize, packSizeLabels, packSizeMultipliers } from '@/data/products';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ChevronLeft,
  Star,
  ShoppingCart,
  Repeat,
  Check,
  Truck,
  Package,
  RefreshCw,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { AgeGate } from '@/components/compliance/AgeGate';
import { cn } from '@/lib/utils';

const packSizes: PackSize[] = ['pack1', 'pack3', 'pack5', 'pack10', 'pack30'];

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const [selectedPack, setSelectedPack] = useState<PackSize>('pack10');

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
  const pricePerCan = (currentPrice / packSizeMultipliers[selectedPack]).toFixed(2);

  return (
    <Layout showNicotineWarning={false}>
      <AgeGate />
      
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            to="/produkter"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Tillbaka till produkter
          </Link>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT COLUMN - Product Info */}
          <div className="space-y-6 order-2 lg:order-1">
            {/* Header */}
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                {product.brand}
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 text-muted" />
                  <span className="ml-1 text-sm text-muted-foreground">
                    ({product.ratings})
                  </span>
                </div>
              </div>
            </div>

            {/* Short description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Flavor chips (if we had multiple flavors) */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Smak</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/20 px-3 py-1">
                  {product.flavor}
                </Badge>
              </div>
            </div>

            {/* Pack Size Selector - Table style like Haypp */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Välj förpackning</h3>
              <RadioGroup
                value={selectedPack}
                onValueChange={(v) => setSelectedPack(v as PackSize)}
                className="space-y-2"
              >
                {packSizes.map((size) => {
                  const price = product.prices[size];
                  const perCan = (price / packSizeMultipliers[size]).toFixed(2);
                  const isSelected = selectedPack === size;
                  
                  return (
                    <Label
                      key={size}
                      htmlFor={`pack-${size}`}
                      className={cn(
                        'flex items-center justify-between rounded-xl border-2 p-4 cursor-pointer transition-all',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 bg-card'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={size} id={`pack-${size}`} className="sr-only" />
                        <div className={cn(
                          'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
                          isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                        )}>
                          {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                        </div>
                        <span className="font-medium text-foreground">
                          {packSizeLabels[size]}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-foreground">
                          {price.toFixed(2)} kr
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {perCan} kr/st
                        </span>
                      </div>
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 gap-2 rounded-xl"
              >
                <Repeat className="h-5 w-5" />
                Prenumerera
              </Button>
              <Button
                size="lg"
                className="flex-1 gap-2 rounded-xl"
                onClick={() => addToCart(product, selectedPack)}
              >
                <ShoppingCart className="h-5 w-5" />
                Köp
              </Button>
            </div>

            {/* Summary chips */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-lg px-3 py-1.5 text-xs">
                Format: {product.format}
              </Badge>
              <Badge variant="secondary" className="rounded-lg px-3 py-1.5 text-xs">
                Styrka: {product.strength}
              </Badge>
              <Badge variant="secondary" className="rounded-lg px-3 py-1.5 text-xs">
                Smak: {product.flavor}
              </Badge>
              <Badge variant="secondary" className="rounded-lg px-3 py-1.5 text-xs">
                {product.nicotineContent} mg/portion
              </Badge>
            </div>
          </div>

          {/* RIGHT COLUMN - Product Image */}
          <div className="order-1 lg:order-2">
            <div className="sticky top-32">
              <Card className="overflow-hidden rounded-3xl border-border shadow-lg">
                <div className="relative aspect-square bg-muted">
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
                          'text-sm rounded-full px-3 py-1',
                          badge === 'Nytt pris' && 'bg-primary text-primary-foreground',
                          badge === 'Nyhet' && 'bg-secondary text-secondary-foreground',
                          badge === 'Populär' && 'bg-card text-foreground border border-border',
                          badge === 'Begränsat' && 'bg-destructive text-destructive-foreground'
                        )}
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Trust badges below image */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 p-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="text-xs text-muted-foreground text-center">Fri frakt 149kr</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 p-3">
                  <Package className="h-5 w-5 text-primary" />
                  <span className="text-xs text-muted-foreground text-center">Snabb leverans</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 p-3">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  <span className="text-xs text-muted-foreground text-center">Enkel retur</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accordions - Product Information */}
        <div className="mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="details" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
                Detaljer om {product.name}
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <ul className="space-y-3">
                  <li className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Kategori</span>
                    <span className="font-medium text-foreground">{product.category}</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Smak</span>
                    <span className="font-medium text-foreground">{product.flavor}</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Styrka</span>
                    <span className="font-medium text-foreground">{product.strength}</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Format</span>
                    <span className="font-medium text-foreground">{product.format}</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Nikotinhalt</span>
                    <span className="font-medium text-foreground">{product.nicotineContent} mg/portion</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Antal prillor per dosa</span>
                    <span className="font-medium text-foreground">{product.portionsPerCan} st</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Tillverkare</span>
                    <span className="font-medium text-foreground">{product.manufacturer}</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="taste" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
                Smak och styrka hos {product.name}
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-muted-foreground leading-relaxed">
                  {product.name} från {product.brand} erbjuder en {product.flavor.toLowerCase()}-smak 
                  med {product.strength.toLowerCase()} styrka. Med ett nikotininnehåll på {product.nicotineContent} mg 
                  per portion ger denna produkt en {product.strength === 'Normal' ? 'balanserad' : 
                  product.strength === 'Stark' ? 'kraftfull' : 
                  product.strength === 'Extra Stark' ? 'intensiv' : 'extrem'} upplevelse.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="brand" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
                Om {product.brand}
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-muted-foreground leading-relaxed">
                  {product.brand} är ett ledande varumärke inom nikotinpåsar, tillverkat av {product.manufacturer}. 
                  Varumärket är känt för sin höga kvalitet och breda sortiment av smaker och styrkor.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="delivery" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
                Leverans & retur
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Vi erbjuder snabb leverans till hela Sverige. Beställningar lagda före kl. 15:00 
                    vardagar skickas samma dag.
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Fri frakt vid köp över 149 kr</li>
                    <li>Leverans inom 1-3 arbetsdagar</li>
                    <li>14 dagars öppet köp på oöppnade förpackningar</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
                Frågor & svar
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Hur förvarar jag produkten?</h4>
                    <p className="text-sm text-muted-foreground">
                      Förvara produkten svalt och torrt. Undvik direkt solljus och hög värme.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Hur länge håller en dosa?</h4>
                    <p className="text-sm text-muted-foreground">
                      En dosa innehåller {product.portionsPerCan} portioner. Hur länge den räcker beror 
                      på ditt användningsmönster.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card p-4 lg:hidden z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-2xl font-bold text-foreground">{currentPrice.toFixed(2)} kr</span>
            <span className="block text-xs text-muted-foreground">{pricePerCan} kr/st</span>
          </div>
          <Button
            size="lg"
            className="gap-2 rounded-xl"
            onClick={() => addToCart(product, selectedPack)}
          >
            <ShoppingCart className="h-5 w-5" />
            Köp
          </Button>
        </div>
      </div>
    </Layout>
  );
}
