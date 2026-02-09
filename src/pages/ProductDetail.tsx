import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products, PackSize, packSizeMultipliers } from '@/data/products';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Check,
  Truck,
  Package,
  RefreshCw,
} from 'lucide-react';
import { useCart, SubscriptionFrequency } from '@/context/CartContext';
import { AgeGate } from '@/components/compliance/AgeGate';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { ProductSchema } from '@/components/seo/ProductSchema';
import { ProductCard } from '@/components/product/ProductCard';

const packSizes: PackSize[] = ['pack1', 'pack5', 'pack10', 'pack30'];

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const [selectedPack, setSelectedPack] = useState<PackSize>('pack10');
  const [purchaseMode, setPurchaseMode] = useState<'once' | 'subscribe'>('once');
  const [subscriptionFrequency, setSubscriptionFrequency] = useState<SubscriptionFrequency>('1month');
  const { t, formatPrice, formatPriceWithUnit, translateFlavor, translateStrength, translateFormat, translateBadge, translateCategory } = useTranslation();

  if (!product) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {t('detail.productNotFound')}
          </h1>
          <Button asChild>
            <Link to="/nicotine-pouches">{t('detail.backToProducts')}</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const currentPrice = product.prices[selectedPack];
  const pricePerCan = currentPrice / packSizeMultipliers[selectedPack];
  // 10% discount for subscriptions
  const subscriptionPrice = Math.round(currentPrice * 0.9 * 100) / 100;
  const subscriptionPricePerCan = subscriptionPrice / packSizeMultipliers[selectedPack];

  const displayPrice = purchaseMode === 'subscribe' ? subscriptionPrice : currentPrice;
  const displayPricePerCan = purchaseMode === 'subscribe' ? subscriptionPricePerCan : pricePerCan;

  // Get product description (fallback to generic description key)
  const productDescription = t(product.descriptionKey) !== product.descriptionKey 
    ? t(product.descriptionKey) 
    : t('detail.genericDescription', { name: product.name, brand: product.brand });

  // Get related products from same brand
  const relatedProducts = products
    .filter(p => p.brand === product.brand && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(
      product,
      selectedPack,
      1,
      purchaseMode === 'subscribe',
      purchaseMode === 'subscribe' ? subscriptionFrequency : undefined
    );
  };

  return (
    <Layout showNicotineWarning={false}>
      <ProductSchema product={product} selectedPackSize={selectedPack} />
      <AgeGate />
      
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            to="/nicotine-pouches"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            {t('detail.backToProducts')}
          </Link>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT COLUMN - Product Image */}
          <div className="order-1">
            <div className="sticky top-32">
              <Card className="overflow-hidden rounded-3xl border-border shadow-lg">
                <div className="relative aspect-square bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                  {/* Badges */}
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {product.badgeKeys.slice(0, 2).map((badge) => (
                      <Badge
                        key={badge}
                        className={cn(
                          'text-sm rounded-full px-3 py-1',
                          badge === 'newPrice' && 'bg-primary text-primary-foreground',
                          badge === 'new' && 'bg-secondary text-secondary-foreground',
                          badge === 'popular' && 'bg-card text-foreground border border-border',
                          badge === 'limited' && 'bg-destructive text-destructive-foreground'
                        )}
                      >
                        {translateBadge(badge)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Trust badges below image */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 p-3">
                  <Truck className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-xs text-muted-foreground text-center line-clamp-2">Free delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 p-3">
                  <Package className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-xs text-muted-foreground text-center line-clamp-2">Fast dispatch</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 p-3">
                  <RefreshCw className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-xs text-muted-foreground text-center line-clamp-2">Easy returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Product Info */}
          <div className="space-y-6 order-2 min-w-0">
            {/* Header */}
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                {product.brand}
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3 break-words">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <Star className="h-4 w-4 text-muted" />
                  <span className="ml-1 text-sm text-muted-foreground">
                    ({product.ratings} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Attribute badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {translateFlavor(product.flavorKey)}
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {translateFormat(product.formatKey)}
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {translateStrength(product.strengthKey)}
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {product.nicotineContent}mg
              </Badge>
            </div>

            {/* Short description */}
            <p className="text-muted-foreground leading-relaxed">
              {productDescription}
            </p>

            {/* Buy Once / Subscribe Toggle */}
            <div>
              <Tabs value={purchaseMode} onValueChange={(v) => setPurchaseMode(v as 'once' | 'subscribe')}>
                <TabsList className="grid w-full grid-cols-2 h-12">
                  <TabsTrigger value="once" className="text-sm h-10 data-[state=active]:bg-background">
                    Buy once
                  </TabsTrigger>
                  <TabsTrigger value="subscribe" className="text-sm h-10 data-[state=active]:bg-background gap-1">
                    <RefreshCw className="h-4 w-4" />
                    Subscribe & Save 10%
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Subscription frequency selector */}
              {purchaseMode === 'subscribe' && (
                <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <Label className="text-sm font-medium mb-2 block">Delivery frequency</Label>
                  <Select
                    value={subscriptionFrequency}
                    onValueChange={(v) => setSubscriptionFrequency(v as SubscriptionFrequency)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="14days">Every 14 days</SelectItem>
                      <SelectItem value="1month">Every month</SelectItem>
                      <SelectItem value="2months">Every 2 months</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    Cancel or pause anytime. Free delivery on all subscriptions.
                  </p>
                </div>
              )}
            </div>

            {/* Pack Size Selector */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Select pack size</h3>
              <RadioGroup
                value={selectedPack}
                onValueChange={(v) => setSelectedPack(v as PackSize)}
                className="grid grid-cols-2 gap-3"
              >
                {packSizes.map((size) => {
                  const price = product.prices[size];
                  const subPrice = Math.round(price * 0.9 * 100) / 100;
                  const perCan = (purchaseMode === 'subscribe' ? subPrice : price) / packSizeMultipliers[size];
                  const isSelected = selectedPack === size;
                  const packCount = packSizeMultipliers[size];
                  
                  return (
                    <Label
                      key={size}
                      htmlFor={`pack-${size}`}
                      className={cn(
                        'flex flex-col items-center justify-center rounded-xl border-2 p-4 cursor-pointer transition-all text-center',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 bg-card'
                      )}
                    >
                      <RadioGroupItem value={size} id={`pack-${size}`} className="sr-only" />
                      <span className="font-bold text-lg text-foreground">
                        {packCount} {packCount === 1 ? 'can' : 'cans'}
                      </span>
                      <span className="text-xl font-bold text-primary mt-1">
                        {formatPrice(purchaseMode === 'subscribe' ? subPrice : price)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatPrice(perCan)}/can
                      </span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary mt-2" />
                      )}
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(displayPrice)}
              </span>
              {purchaseMode === 'subscribe' && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(currentPrice)}
                </span>
              )}
              <span className="text-sm text-muted-foreground">
                ({formatPrice(displayPricePerCan)}/can)
              </span>
            </div>

            {/* CTA Button */}
            <Button
              size="lg"
              className="w-full gap-2 rounded-xl h-14 text-lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {purchaseMode === 'subscribe' ? 'Subscribe' : 'Add to Cart'}
            </Button>
          </div>
        </div>

        {/* Product Information Accordions */}
        <div className="mt-12 max-w-3xl">
          <h2 className="text-xl font-bold text-foreground mb-4">More information</h2>
          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="specs" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
                Product specifications
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Brand</span>
                    <span className="font-medium">{product.brand}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Format</span>
                    <span className="font-medium">{translateFormat(product.formatKey)}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Pouches/can</span>
                    <span className="font-medium">{product.portionsPerCan}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Nicotine/pouch</span>
                    <span className="font-medium">{product.nicotineContent}mg</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Strength</span>
                    <span className="font-medium">{translateStrength(product.strengthKey)}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Flavor</span>
                    <span className="font-medium">{translateFlavor(product.flavorKey)}</span>
                  </div>
                  <div className="flex justify-between col-span-2">
                    <span className="text-muted-foreground">{t('detail.manufacturer')}</span>
                    <span className="font-medium">{product.manufacturer}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="about" className="rounded-xl border border-border bg-card px-4">
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
                <div className="space-y-3 text-muted-foreground text-sm">
                  <p>• {t('detail.freeShippingThreshold', { amount: formatPrice(25) })}</p>
                  <p>• {t('detail.deliveryTime')}</p>
                  <p>• {t('detail.fastDelivery')}</p>
                  <p>• {t('detail.returnPolicy')}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {t('detail.aboutBrand')} {product.brand}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card p-4 lg:hidden z-40">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-2xl font-bold text-foreground">{formatPrice(displayPrice)}</span>
            <span className="block text-xs text-muted-foreground truncate">
              {formatPrice(displayPricePerCan)}/{t('cart.can')}
              {purchaseMode === 'subscribe' && ' • Subscribe'}
            </span>
          </div>
          <Button
            size="lg"
            className="gap-2 rounded-xl shrink-0"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5" />
            {purchaseMode === 'subscribe' ? t('product.subscribe') : t('product.addToCart')}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
