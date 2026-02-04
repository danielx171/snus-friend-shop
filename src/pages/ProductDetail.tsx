import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products, PackSize, packSizeMultipliers } from '@/data/products';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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
import { useTranslation } from '@/hooks/useTranslation';

const packSizes: PackSize[] = ['pack1', 'pack3', 'pack5', 'pack10', 'pack30'];

// Map internal badge names to translation keys
const badgeTranslationKeys: Record<string, string> = {
  'Nyhet': 'badge.new',
  'Nytt pris': 'badge.newPrice',
  'Populär': 'badge.popular',
  'Begränsat': 'badge.limited',
};

// Map internal strength names to translation keys
const strengthTranslationKeys: Record<string, string> = {
  'Normal': 'strength.normal',
  'Stark': 'strength.strong',
  'Extra Stark': 'strength.extraStrong',
  'Ultra Stark': 'strength.ultraStrong',
};

// Map internal format names to translation keys
const formatTranslationKeys: Record<string, string> = {
  'Slim': 'format.slim',
  'Mini': 'format.mini',
  'Original': 'format.original',
  'Large': 'format.large',
};

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const [selectedPack, setSelectedPack] = useState<PackSize>('pack10');
  const { t, formatPrice, formatPriceWithUnit, translateFlavor } = useTranslation();

  if (!product) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {t('detail.productNotFound')}
          </h1>
          <Button asChild>
            <Link to="/">{t('detail.backToProducts')}</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const currentPrice = product.prices[selectedPack];
  const pricePerCan = currentPrice / packSizeMultipliers[selectedPack];

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
            {t('detail.backToProducts')}
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

            {/* Flavor chips */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">{t('detail.flavor')}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/20 px-3 py-1">
                  {translateFlavor(product.flavor)}
                </Badge>
              </div>
            </div>

            {/* Pack Size Selector */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">{t('product.selectPack')}</h3>
              <RadioGroup
                value={selectedPack}
                onValueChange={(v) => setSelectedPack(v as PackSize)}
                className="space-y-2"
              >
                {packSizes.map((size) => {
                  const price = product.prices[size];
                  const perCan = price / packSizeMultipliers[size];
                  const isSelected = selectedPack === size;
                  const packNum = size.replace('pack', '');
                  
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
                          {t(`pack.${packNum}`)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-foreground">
                          {formatPrice(price)}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {formatPriceWithUnit(perCan)}
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
                {t('product.subscribe')}
              </Button>
              <Button
                size="lg"
                className="flex-1 gap-2 rounded-xl"
                onClick={() => addToCart(product, selectedPack)}
              >
                <ShoppingCart className="h-5 w-5" />
                {t('product.buy')}
              </Button>
            </div>

            {/* Summary chips */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-lg px-3 py-1.5 text-xs">
                {t('detail.format')}: {t(formatTranslationKeys[product.format])}
              </Badge>
              <Badge variant="secondary" className="rounded-lg px-3 py-1.5 text-xs">
                {t('detail.strengthDef')}: {t(strengthTranslationKeys[product.strength])}
              </Badge>
              <Badge variant="secondary" className="rounded-lg px-3 py-1.5 text-xs">
                {t('detail.flavor')}: {translateFlavor(product.flavor)}
              </Badge>
              <Badge variant="secondary" className="rounded-lg px-3 py-1.5 text-xs">
                {product.nicotineContent} {t('detail.mgPerPortion')}
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
                        {t(badgeTranslationKeys[badge])}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Trust badges below image */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 p-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="text-xs text-muted-foreground text-center">{t('detail.freeShipping')}</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 p-3">
                  <Package className="h-5 w-5 text-primary" />
                  <span className="text-xs text-muted-foreground text-center">{t('detail.fastDelivery')}</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 p-3">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  <span className="text-xs text-muted-foreground text-center">{t('detail.easyReturns')}</span>
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
                {t('detail.detailsAbout')} {product.name}
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <ul className="space-y-3">
                  <li className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">{t('detail.category')}</span>
                    <span className="font-medium text-foreground">{product.category}</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">{t('detail.flavor')}</span>
                    <span className="font-medium text-foreground">{translateFlavor(product.flavor)}</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">{t('detail.strengthDef')}</span>
                    <span className="font-medium text-foreground">{t(strengthTranslationKeys[product.strength])}</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">{t('detail.format')}</span>
                    <span className="font-medium text-foreground">{t(formatTranslationKeys[product.format])}</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">{t('detail.nicotineContent')}</span>
                    <span className="font-medium text-foreground">{product.nicotineContent} {t('detail.mgPerPortion')}</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">{t('detail.portionsPerCan')}</span>
                    <span className="font-medium text-foreground">{product.portionsPerCan} {t('detail.pieces')}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">{t('detail.manufacturer')}</span>
                    <span className="font-medium text-foreground">{product.manufacturer}</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="taste" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
                {t('detail.tasteAndStrength')} {product.name}
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="brand" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
                {t('detail.aboutBrand')} {product.brand}
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('detail.brandDescription', { brand: product.brand, manufacturer: product.manufacturer })}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="delivery" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
                {t('detail.deliveryReturns')}
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4 text-muted-foreground">
                  <p>{t('detail.deliveryInfo')}</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t('detail.freeShippingThreshold')}</li>
                    <li>{t('detail.deliveryTime')}</li>
                    <li>{t('detail.returnPolicy')}</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
                {t('detail.faq')}
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">{t('detail.storageQuestion')}</h4>
                    <p className="text-sm text-muted-foreground">{t('detail.storageAnswer')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">{t('detail.durationQuestion')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('detail.durationAnswer', { portions: product.portionsPerCan })}
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
            <span className="text-2xl font-bold text-foreground">{formatPrice(currentPrice)}</span>
            <span className="block text-xs text-muted-foreground">{formatPriceWithUnit(pricePerCan)}</span>
          </div>
          <Button
            size="lg"
            className="gap-2 rounded-xl"
            onClick={() => addToCart(product, selectedPack)}
          >
            <ShoppingCart className="h-5 w-5" />
            {t('product.buy')}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
