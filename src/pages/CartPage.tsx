import { Layout } from '@/components/layout/Layout';
import { useCart, SubscriptionFrequency } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Truck, ArrowRight, RefreshCw } from 'lucide-react';
import { packSizeMultipliers } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { useTranslation } from '@/hooks/useTranslation';
import { SEO } from '@/components/seo/SEO';
import { formatMarketPrice } from '@/lib/market';

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    updateSubscription,
  } = useCart();
  const { t, formatPrice, market } = useTranslation();

  // Market-aware shipping logic
  const localTotal = totalPrice * market.rateFromGBP;
  const hasFreeShipping = localTotal >= market.freeShippingThreshold;
  const amountToFreeShipping = Math.max(0, market.freeShippingThreshold - localTotal);
  const shippingProgress = Math.min(100, (localTotal / market.freeShippingThreshold) * 100);
  const shippingCostGBP = market.shippingCost / market.rateFromGBP;

  const formatLocalAmount = (amount: number): string => {
    return formatMarketPrice(amount, market, market.currencyCode === 'GBP' ? 2 : 0);
  };

  // Get recommended products from Shopify (different from cart items)
  const { data: catalogProducts = [] } = useCatalogProducts();
  const cartProductIds = new Set(items.map(item => item.product.id));
  const recommendedProducts = catalogProducts
    .filter(p => !cartProductIds.has(p.id))
    .slice(0, 4);

  if (items.length === 0) {
    return (
      <>
        <SEO
          title={`${t('cart.title')} | SnusFriend`}
          description={t('cart.emptyDescription')}
        />
        <Layout showNicotineWarning={false}>
          <div className="container py-16 text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-2">{t('cart.empty')}</h1>
            <p className="text-muted-foreground mb-8">
              {t('cart.emptyDescription')}
            </p>
            <Button asChild size="lg">
              <Link to="/nicotine-pouches">{t('cart.browseProducts')}</Link>
            </Button>
          </div>
        </Layout>
      </>
    );
  }

  const itemLabel = totalItems === 1 ? t('cart.item') : t('cart.items');

  return (
    <>
      <SEO
        title={`${t('cart.title')} (${totalItems} ${itemLabel}) | SnusFriend`}
        description={t('cart.emptyDescription')}
      />
      <Layout showNicotineWarning={false}>
        <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              {t('cart.title')}
              <span className="text-muted-foreground font-normal ml-2">
                ({totalItems} {itemLabel})
              </span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Free Shipping Progress */}
              <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Truck className="h-5 w-5 text-primary" />
                    {hasFreeShipping ? (
                      <span className="font-semibold text-primary">
                        {t('cart.freeShippingAchieved')}
                      </span>
                    ) : (
                      <span className="text-sm text-foreground">
                        {t('cart.freeShippingProgress', { amount: formatLocalAmount(amountToFreeShipping) })}
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Cart Items List */}
              {items.map((item) => {
                const packCount = packSizeMultipliers[item.packSize];
                const unitPrice = item.product.prices[item.packSize] / packCount;
                const itemTotal = item.product.prices[item.packSize] * item.quantity;
                const canLabel = packCount === 1 ? t('cart.can') : t('cart.cans');

                return (
                  <Card key={`${item.product.id}-${item.packSize}`}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <Link to={`/product/${item.product.id}`} className="shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl"
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2">
                            <div>
                              <Link
                                to={`/product/${item.product.id}`}
                                className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                              >
                                {item.product.name}
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                {item.product.brand} • {packCount} {canLabel}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-foreground">{formatPrice(itemTotal)}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatPrice(unitPrice)}/{t('cart.can')}
                              </p>
                            </div>
                          </div>

                          {/* Subscription Badge */}
                          {item.isSubscription && (
                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="gap-1">
                                <RefreshCw className="h-3 w-3" />
                                {t('cart.subscription')}
                              </Badge>
                              <Select
                                value={item.subscriptionFrequency}
                                onValueChange={(value) =>
                                  updateSubscription(
                                    item.product.id,
                                    item.packSize,
                                    true,
                                    value as SubscriptionFrequency
                                  )
                                }
                              >
                                <SelectTrigger className="h-7 w-auto text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="14days">{t('cart.freq.14days')}</SelectItem>
                                  <SelectItem value="1month">{t('cart.freq.1month')}</SelectItem>
                                  <SelectItem value="2months">{t('cart.freq.2months')}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {/* Quantity Controls */}
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateQuantity(item.product.id, item.packSize, item.quantity - 1)
                                }
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateQuantity(item.product.id, item.packSize, item.quantity + 1)
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => removeFromCart(item.product.id, item.packSize)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              {t('cart.remove')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4">{t('cart.orderSummary')}</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                      <span className="font-medium">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('cart.delivery')}</span>
                      <span className="font-medium">
                        {hasFreeShipping ? (
                          <span className="text-primary">{t('cart.free')}</span>
                        ) : (
                          formatPrice(shippingCostGBP)
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base">
                      <span className="font-bold">{t('cart.total')}</span>
                      <span className="font-bold">
                        {formatPrice(totalPrice + (hasFreeShipping ? 0 : shippingCostGBP))}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t('cart.includingVat')}</p>
                  </div>

                  <Button asChild size="lg" className="w-full mt-6 gap-2">
                    <Link to="/checkout">
                      {t('cart.proceedToCheckout')}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    {t('cart.secureCheckout')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recommendations */}
          {recommendedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {t('cart.recommendations')}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {recommendedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </Layout>
    </>
  );
}
