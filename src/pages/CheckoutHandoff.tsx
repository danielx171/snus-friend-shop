import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ShoppingBag, Lock, Truck, RotateCcw, Shield, CreditCard,
  Tag, ChevronRight, Check, ExternalLink,
} from 'lucide-react';
import { packSizeMultipliers } from '@/data/products';
import { EmptyState } from '@/components/ui/states/EmptyState';
import { SEO } from '@/components/seo/SEO';

export default function CheckoutHandoff() {
  const { items, totalPrice } = useCart();
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const discountAmount = discountApplied ? totalPrice * 0.1 : 0;
  const hasFreeShipping = totalPrice >= 25;
  const shippingCost = hasFreeShipping ? 0 : 3.99;
  const finalTotal = totalPrice - discountAmount + shippingCost;

  const applyDiscount = () => {
    if (discountCode.toUpperCase() === 'WELCOME10') setDiscountApplied(true);
  };

  if (items.length === 0) {
    return (
      <>
        <SEO title="Checkout | SnusFriend" description="Complete your SnusFriend order." />
        <Layout showNicotineWarning={false}>
          <div className="container py-16">
            <EmptyState variant="cart" actionLabel="Browse Products" actionHref="/nicotine-pouches" />
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <SEO title="Checkout | SnusFriend" description="Review your order and proceed to secure checkout." />
      <Layout showNicotineWarning={false}>
        <div className="container py-8 lg:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-2">Review Your Order</h1>
              <p className="text-muted-foreground">Almost there — just one more step to checkout</p>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Order Summary */}
              <div className="lg:col-span-3 space-y-6">
                <Card className="border-border/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      Your Items ({items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {items.map((item) => {
                      const packCount = packSizeMultipliers[item.packSize];
                      const lineTotal = item.product.prices[item.packSize] * item.quantity;
                      return (
                        <div key={`${item.product.id}-${item.packSize}`} className="flex gap-4 py-3 border-b border-border/10 last:border-0">
                          <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-xl shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                            <p className="font-medium text-sm text-foreground">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">{packCount} {packCount === 1 ? 'can' : 'cans'} × {item.quantity}</p>
                            {item.isSubscription && (
                              <Badge variant="outline" className="mt-1 text-[10px] rounded-full border-primary/30 text-primary">Subscribe & Save</Badge>
                            )}
                          </div>
                          <p className="font-semibold text-sm">£{lineTotal.toFixed(2)}</p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Discount Code */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="discount" className="border border-border/30 rounded-xl px-4">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Tag className="h-4 w-4 text-primary" />
                        Have a discount code?
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex gap-2 pb-3">
                        <Input
                          placeholder="Enter code (try WELCOME10)"
                          value={discountCode}
                          onChange={e => setDiscountCode(e.target.value)}
                          disabled={discountApplied}
                          className="rounded-xl"
                        />
                        <Button variant="outline" onClick={applyDiscount} disabled={discountApplied || !discountCode} className="rounded-xl border-border/30">
                          {discountApplied ? <Check className="h-4 w-4" /> : 'Apply'}
                        </Button>
                      </div>
                      {discountApplied && <p className="text-xs text-primary pb-2">10% discount applied!</p>}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Reassurance */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Truck, title: 'Free Delivery', desc: 'On orders over £25' },
                    { icon: RotateCcw, title: 'Easy Returns', desc: '14-day hassle-free returns' },
                    { icon: Shield, title: 'Genuine Products', desc: '100% authentic guaranteed' },
                    { icon: Lock, title: 'Secure Checkout', desc: '256-bit SSL encryption' },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-3 rounded-xl border border-border/20 bg-card/60 p-4">
                      <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{title}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar - Totals + CTA */}
              <div className="lg:col-span-2">
                <Card className="border-border/30 sticky top-24">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Order Total</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>£{totalPrice.toFixed(2)}</span>
                      </div>
                      {discountApplied && (
                        <div className="flex justify-between text-primary">
                          <span>Discount (10%)</span>
                          <span>-£{discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className={hasFreeShipping ? 'text-primary' : ''}>
                          {hasFreeShipping ? 'Free' : `£${shippingCost.toFixed(2)}`}
                        </span>
                      </div>
                      <Separator className="bg-border/20" />
                      <div className="flex justify-between font-bold text-lg pt-1">
                        <span>Total</span>
                        <span>£{finalTotal.toFixed(2)}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Including VAT</p>
                    </div>

                    <Button className="w-full h-13 rounded-2xl text-base gap-2 glow-primary hover:shadow-lg transition-shadow">
                      <Lock className="h-4 w-4" />
                      Proceed to Secure Checkout
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                      You'll be redirected to our secure payment partner to complete your order.
                    </p>

                    {/* Payment badges */}
                    <div className="flex items-center justify-center gap-3 pt-2 border-t border-border/20">
                      {['Visa', 'MC', 'Amex', 'Klarna'].map(name => (
                        <div key={name} className="flex items-center justify-center h-8 px-3 rounded-md bg-muted/20 border border-border/20">
                          <span className="text-[10px] font-bold text-muted-foreground">{name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      Secure payment powered by SSL encryption
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
