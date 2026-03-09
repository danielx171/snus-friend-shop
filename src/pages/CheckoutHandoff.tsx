import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { packSizeMultipliers } from '@/data/products';
import { useTranslation } from '@/hooks/useTranslation';
import { formatMarketPrice } from '@/lib/market';
import { getCartTotals } from '@/lib/cart-utils';
import { SEO } from '@/components/seo/SEO';
import { apiFetch } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export default function CheckoutHandoff() {
  const { items } = useCart();
  const { t, formatPrice, market } = useTranslation();
  const [isRedirectingToCheckout, setIsRedirectingToCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

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

  const resolveShopifyVariantId = (item: (typeof items)[number]): string | null => {
    const productRecord = item.product as unknown as Record<string, unknown>;
    const direct = productRecord.shopifyVariantId;
    if (typeof direct === 'string' && direct.trim().length > 0) return direct;

    const snakeCase = productRecord.shopify_variant_id;
    if (typeof snakeCase === 'string' && snakeCase.trim().length > 0) return snakeCase;

    const variantsByPack = productRecord.shopifyVariantIds;
    if (variantsByPack && typeof variantsByPack === 'object') {
      const packVariantId = (variantsByPack as Record<string, unknown>)[item.packSize];
      if (typeof packVariantId === 'string' && packVariantId.trim().length > 0) return packVariantId;
    }

    return null;
  };

  const handleProceedToCheckout = async () => {
    if (isRedirectingToCheckout) return;

    setCheckoutError(null);

    const payloadItems: Array<{ shopifyVariantId: string; quantity: number }> = [];
    const missingVariantMappings: string[] = [];

    items.forEach((item) => {
      const shopifyVariantId = resolveShopifyVariantId(item);
      if (!shopifyVariantId) {
        missingVariantMappings.push(item.product.name);
        return;
      }

      payloadItems.push({
        shopifyVariantId,
        quantity: item.quantity,
      });
    });

    if (missingVariantMappings.length > 0) {
      const message = `Missing Shopify variant mapping for: ${missingVariantMappings.join(', ')}`;
      setCheckoutError(message);
      toast({
        title: t('checkout.orderFailed'),
        description: message,
        variant: 'destructive',
      });
      return;
    }

    setIsRedirectingToCheckout(true);

    try {
      const response = await apiFetch<{ checkoutUrl: string }>('create-shopify-checkout', {
        method: 'POST',
        body: {
          items: payloadItems,
          totalPrice: finalTotal,
          currency: market.currencyCode,
          customer: {
            locale: market.locale,
          },
        },
      });

      if (!response?.checkoutUrl) {
        throw new Error('Missing checkoutUrl from create-shopify-checkout');
      }

      window.location.assign(response.checkoutUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create Shopify checkout';
      setCheckoutError(message);
      toast({
        title: t('checkout.orderFailed'),
        description: message,
        variant: 'destructive',
      });
      setIsRedirectingToCheckout(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <SEO title={`${t('checkout.title')} | SnusFriend`} description={t('checkout.emptyDescription')} />
        <Layout showNicotineWarning={false}>
          <div className="container py-16 text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-2">{t('cart.empty')}</h1>
            <p className="text-muted-foreground mb-8">{t('checkout.emptyDescription')}</p>
            <Button asChild size="lg">
              <Link to="/nicotine-pouches">{t('cart.browseProducts')}</Link>
            </Button>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <SEO title={`${t('checkout.title')} | SnusFriend`} description={t('checkout.emptyDescription')} />
      <Layout showNicotineWarning={false}>
        <div className="container py-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">{t('checkout.title')}</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
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

              {/* Cart Items (read-only) */}
              <div className="space-y-4">
                {items.map((item) => {
                  const packCount = packSizeMultipliers[item.packSize];
                  const itemTotal = item.product.prices[item.packSize] * item.quantity;
                  const canLabel = packCount === 1 ? t('cart.can') : t('cart.cans');

                  return (
                    <Card key={`${item.product.id}-${item.packSize}`}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground line-clamp-1">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.product.brand} • {packCount} {canLabel} × {item.quantity}
                            </p>
                            <p className="mt-1 font-medium text-foreground">{formatPrice(itemTotal)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
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
                      <span className="font-bold">{formatPrice(finalTotal)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t('cart.includingVat')}</p>
                  </div>

                  <Button
                    size="lg"
                    className="w-full mt-6 gap-2"
                    disabled={isRedirectingToCheckout}
                    onClick={handleProceedToCheckout}
                  >
                    {isRedirectingToCheckout ? t('checkout.processing') : t('cart.proceedToCheckout')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  {checkoutError && (
                    <p className="text-xs text-destructive mt-2">
                      {checkoutError}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    {t('cart.secureCheckout')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
