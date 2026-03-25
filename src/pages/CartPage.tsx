import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
// Select removed — subscription feature not yet implemented
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Truck, ArrowRight } from 'lucide-react';
import { packSizeMultipliers } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { useTranslation } from '@/hooks/useTranslation';
import { SEO } from '@/components/seo/SEO';
import { formatMarketPrice } from '@/lib/market';
import { getCartTotals } from '@/lib/cart-utils';

export default function CartPage() {
  const {
    items,
    totalItems,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const { t, formatPrice, market } = useTranslation();

  const { subtotal, shipping, finalTotal, freeShipping, progress } = getCartTotals(
    items,
    market,
  );

  const localSubtotal = subtotal * market.rateFromGBP;
  const amountToFreeShipping = Math.max(0, market.freeShippingThreshold - localSubtotal);
  const shippingProgress = progress;

  const formatLocalAmount = (amount: number): string => {
    return formatMarketPrice(amount, market, market.currencyCode === 'GBP' ? 2 : 0);
  };

  // Get recommended products from catalog (different from cart items)
  const { data: catalogProducts = [] } = useCatalogProducts();
  const cartProductIds = new Set(items.map(item => item.product.id));
  const recommendedProducts = catalogProducts
    .filter(p => !cartProductIds.has(p.id))
    .slice(0, 4);

  if (items.length === 0) {
    return (
      <>
        <SEO
          title="Your Cart | SnusFriend"
          description="Review your nicotine pouch order before checkout."
          metaRobots="noindex,nofollow"
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
        title="Your Cart | SnusFriend"
        description="Review your nicotine pouch order before checkout."
        metaRobots="noindex,nofollow"
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
                    {freeShipping ? (
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
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl"
                            />
                          ) : (
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                              <span className="text-[10px] text-center text-muted-foreground px-1 line-clamp-2">{item.product.name}</span>
                            </div>
                          )}
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
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('cart.delivery')}</span>
                      <span className="font-medium">
                        {freeShipping ? (
                          <span className="text-primary">{t('cart.free')}</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base">
                      <span className="font-bold">{t('cart.total')}</span>
                      <span className="font-bold">
                        {formatPrice(finalTotal)}
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

                  <Button variant="outline" asChild className="w-full mt-3">
                    <Link to="/nicotine-pouches">
                      Continue Shopping
                    </Link>
                  </Button>
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
