import { Layout } from '@/components/layout/Layout';
import { useCart, SubscriptionFrequency } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Truck, ArrowRight, RefreshCw } from 'lucide-react';
import { packSizeMultipliers, products } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { useTranslation } from '@/hooks/useTranslation';
import { SEO } from '@/components/seo/SEO';

const frequencyLabels: Record<SubscriptionFrequency, string> = {
  once: 'One-time purchase',
  '14days': 'Every 14 days',
  '1month': 'Every month',
  '2months': 'Every 2 months',
};

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    updateSubscription,
    hasReachedFreeShipping,
    amountToFreeShipping,
    freeShippingThreshold,
  } = useCart();
  const { t, formatPrice } = useTranslation();

  // Get recommended products (different from cart items)
  const cartProductIds = new Set(items.map(item => item.product.id));
  const recommendedProducts = products
    .filter(p => !cartProductIds.has(p.id))
    .slice(0, 4);

  const shippingProgress = Math.min(100, (totalPrice / freeShippingThreshold) * 100);

  if (items.length === 0) {
    return (
      <>
        <SEO
          title="Your Cart | SnusFriend"
          description="Review your cart and proceed to checkout."
        />
        <Layout showNicotineWarning={false}>
          <div className="container py-16 text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything yet.
            </p>
            <Button asChild size="lg">
              <Link to="/nicotine-pouches">Browse Products</Link>
            </Button>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`Your Cart (${totalItems} items) | SnusFriend`}
        description="Review your cart and proceed to checkout."
      />
      <Layout showNicotineWarning={false}>
        <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Your cart
              <span className="text-muted-foreground font-normal ml-2">
                ({totalItems} {totalItems === 1 ? 'item' : 'items'})
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
                    {hasReachedFreeShipping ? (
                      <span className="font-semibold text-primary">
                        🎉 You've unlocked free delivery!
                      </span>
                    ) : (
                      <span className="text-sm text-foreground">
                        Add {formatPrice(amountToFreeShipping)} more for <strong>free delivery</strong>
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
                                {item.product.brand} • {packCount} {packCount === 1 ? 'can' : 'cans'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-foreground">{formatPrice(itemTotal)}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatPrice(unitPrice)}/can
                              </p>
                            </div>
                          </div>

                          {/* Subscription Badge */}
                          {item.isSubscription && (
                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="gap-1">
                                <RefreshCw className="h-3 w-3" />
                                Subscription
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
                                  <SelectItem value="14days">Every 14 days</SelectItem>
                                  <SelectItem value="1month">Every month</SelectItem>
                                  <SelectItem value="2months">Every 2 months</SelectItem>
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
                              Remove
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
                  <h2 className="text-lg font-bold text-foreground mb-4">Order Summary</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="font-medium">
                        {hasReachedFreeShipping ? (
                          <span className="text-primary">Free</span>
                        ) : (
                          formatPrice(3.99)
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base">
                      <span className="font-bold">Total</span>
                      <span className="font-bold">
                        {formatPrice(totalPrice + (hasReachedFreeShipping ? 0 : 3.99))}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Including VAT</p>
                  </div>

                  <Button asChild size="lg" className="w-full mt-6 gap-2">
                    <Link to="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Secure checkout powered by Stripe
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recommendations */}
          {recommendedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Don't miss out these products!
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
