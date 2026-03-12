import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import { Check, ChevronRight, CreditCard, Package, Tag, Truck, ShoppingBag } from 'lucide-react';
import { packSizeMultipliers } from '@/data/products';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from '@/hooks/use-toast';
import { SEO } from '@/components/seo/SEO';
import { getCartTotals, CartDeliveryOption } from '@/lib/cart-utils';
import { apiFetch } from '@/lib/api';

type CheckoutStep = 'shipping' | 'payment' | 'complete';

interface DeliveryOption {
  id: string;
  nameKey: string;
  description: string;
  priceGBP: number;
  eta: string;
}

const deliveryOptions: DeliveryOption[] = [
  { id: 'standard', nameKey: 'checkout.standardDelivery', description: 'Royal Mail Tracked 48', priceGBP: 3.99, eta: '3-5' },
  { id: 'express', nameKey: 'checkout.expressDelivery', description: 'Royal Mail Tracked 24', priceGBP: 5.99, eta: '1-2' },
  { id: 'next-day', nameKey: 'checkout.nextDayDelivery', description: 'DPD Next Day', priceGBP: 7.99, eta: '1' },
];

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const { t, formatPrice, market } = useTranslation(

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const [postcode, setPostcode] = useState('');
  const [postcodeValid, setPostcodeValid] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<string>('');
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '', lastName: '', address: '', city: '', email: '', phone: '',
  });

  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const validatePostcode = () => {
    const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
    if (postcodeRegex.test(postcode)) {
      setPostcodeValid(true);
    } else {
      toast({ title: t('checkout.invalidPostcode'), description: t('checkout.invalidPostcodeDesc'), variant: 'destructive' });
    }
  };

  const applyDiscount = () => {
    if (discountCode.toUpperCase() === 'WELCOME10') {
      setDiscountApplied(true);
      toast({ title: t('checkout.discountAppliedTitle'), description: t('checkout.discountAppliedDesc') });
    } else {
      toast({ title: t('checkout.invalidCode'), description: t('checkout.invalidCodeDesc'), variant: 'destructive' });
    }
  };

  const selectedOption = deliveryOptions.find((o) => o.id === selectedDelivery);

  const deliveryOptionForTotals: CartDeliveryOption | undefined = selectedOption
    ? {
        id: selectedOption.id,
        priceGBP: selectedOption.priceGBP,
      }
    : undefined;

  const appliedDiscountCode = discountApplied ? discountCode : undefined;

  const { subtotal, discount, shipping, finalTotal, freeShipping } = getCartTotals(
    items,
    market,
    deliveryOptionForTotals,
    appliedDiscountCode,
  );

  const deliveryPriceGBP = shipping;
  const discountAmount = discount;
  const hasFreeShipping = freeShipping;

  const canProceedToPayment = postcodeValid && selectedDelivery &&
    shippingDetails.firstName && shippingDetails.lastName &&
    shippingDetails.address && shippingDetails.city && shippingDetails.email;

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);
    try {
      // TODO: Fetch Shopify Checkout URL from backend and redirect user instead of local success step.
      await apiFetch('sync-nyehandel', {
        method: 'POST',
        body: {
          items,
          finalTotal,
          shippingDetails,
        },
      });
    } catch (error) {
      console.error('Failed to sync with Nyehandel:', error);
      toast({
        title: t('checkout.orderFailed'),
        description: t('checkout.orderFailedDesc'),
        variant: 'destructive',
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (items.length === 0 && currentStep !== 'complete') {
    return (
      <>
        <SEO title={`${t('checkout.title')} | SnusFriend`} description={t('checkout.emptyDescription')} />
        <Layout showNicotineWarning={false}>
          <div className="container py-16 text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-2">{t('cart.empty')}</h1>
            <p className="text-muted-foreground mb-8">{t('checkout.emptyDescription')}</p>
            <Button asChild size="lg"><Link to="/nicotine-pouches">{t('cart.browseProducts')}</Link></Button>
          </div>
        </Layout>
      </>
    );
  }

  if (currentStep === 'complete') {
    return (
      <>
        <SEO title={`${t('checkout.thankYou')} | SnusFriend`} description={t('checkout.confirmationSent')} />
        <Layout showNicotineWarning={false}>
          <div className="container py-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('checkout.thankYou')}</h1>
            <p className="text-muted-foreground mb-2">{t('checkout.confirmationSent')}</p>
            <p className="text-sm text-muted-foreground mb-8">Order #SF{Date.now()}</p>
            <Button asChild size="lg"><Link to="/">{t('cart.continueShopping')}</Link></Button>
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
              {/* Discount Code */}
              <Accordion type="single" collapsible>
                <AccordionItem value="discount" className="border rounded-xl px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span>{t('checkout.discountCode')}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex gap-2 pb-2">
                      <Input placeholder={t('checkout.enterCode')} value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} disabled={discountApplied} />
                      <Button variant="outline" onClick={applyDiscount} disabled={discountApplied || !discountCode}>
                        {discountApplied ? t('checkout.applied') : t('checkout.apply')}
                      </Button>
                    </div>
                    {discountApplied && <p className="text-sm text-primary">{t('checkout.discountApplied')}</p>}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Shipping */}
              <Card className={currentStep === 'payment' ? 'opacity-60' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">1</div>
                    {t('checkout.shipping')}
                    {currentStep === 'payment' && (
                      <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setCurrentStep('shipping')}>
                        {t('checkout.edit')}
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentStep === 'shipping' ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="postcode">{t('checkout.enterPostcode')}</Label>
                        <div className="flex gap-2">
                          <Input id="postcode" placeholder="e.g. SW1A 1AA" value={postcode} onChange={(e) => { setPostcode(e.target.value); setPostcodeValid(false); }} />
                          <Button onClick={validatePostcode}>{t('checkout.findAddress')}</Button>
                        </div>
                      </div>

                      {postcodeValid && (
                        <>
                          <div className="space-y-3">
                            <Label>{t('checkout.chooseDelivery')}</Label>
                            <RadioGroup value={selectedDelivery} onValueChange={setSelectedDelivery}>
                              {deliveryOptions.map((option) => (
                                <label
                                  key={option.id}
                                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                                    selectedDelivery === option.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                                  }`}
                                >
                                  <RadioGroupItem value={option.id} />
                                  <Truck className="h-5 w-5 text-muted-foreground" />
                                  <div className="flex-1">
                                    <p className="font-medium">{t(option.nameKey)}</p>
                                    <p className="text-sm text-muted-foreground">{option.description} • {option.eta} {t('checkout.businessDays')}</p>
                                  </div>
                                  <span className="font-semibold">
                                    {hasFreeShipping && option.id === 'standard' ? t('cart.free') : formatPrice(option.priceGBP)}
                                  </span>
                                </label>
                              ))}
                            </RadioGroup>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">{t('checkout.firstName')}</Label>
                              <Input id="firstName" value={shippingDetails.firstName} onChange={(e) => setShippingDetails((s) => ({ ...s, firstName: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">{t('checkout.lastName')}</Label>
                              <Input id="lastName" value={shippingDetails.lastName} onChange={(e) => setShippingDetails((s) => ({ ...s, lastName: e.target.value }))} />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                              <Label htmlFor="address">{t('checkout.address')}</Label>
                              <Input id="address" value={shippingDetails.address} onChange={(e) => setShippingDetails((s) => ({ ...s, address: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="city">{t('checkout.city')}</Label>
                              <Input id="city" value={shippingDetails.city} onChange={(e) => setShippingDetails((s) => ({ ...s, city: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="postcodeConfirm">{t('checkout.postcode')}</Label>
                              <Input id="postcodeConfirm" value={postcode} disabled />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">{t('checkout.email')}</Label>
                              <Input id="email" type="email" value={shippingDetails.email} onChange={(e) => setShippingDetails((s) => ({ ...s, email: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">{t('checkout.phone')}</Label>
                              <Input id="phone" type="tel" value={shippingDetails.phone} onChange={(e) => setShippingDetails((s) => ({ ...s, phone: e.target.value }))} />
                            </div>
                          </div>

                          <Button size="lg" className="w-full gap-2" disabled={!canProceedToPayment} onClick={() => setCurrentStep('payment')}>
                            {t('checkout.proceedToPayment')}
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      <p>{shippingDetails.firstName} {shippingDetails.lastName}</p>
                      <p>{shippingDetails.address}</p>
                      <p>{shippingDetails.city}, {postcode}</p>
                      <p className="mt-2">{selectedOption && t(selectedOption.nameKey)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment */}
              <Card className={currentStep === 'shipping' ? 'opacity-40 pointer-events-none' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-sm ${
                      currentStep === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>2</div>
                    {t('checkout.payment')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentStep === 'payment' && (
                    <>
                      <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                        <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                          selectedPayment === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}>
                          <RadioGroupItem value="card" />
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">{t('checkout.card')}</p>
                            <p className="text-sm text-muted-foreground">{t('checkout.cardDescription')}</p>
                          </div>
                        </label>

                        <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                          selectedPayment === 'klarna' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}>
                          <RadioGroupItem value="klarna" />
                          <Package className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">Klarna</p>
                            <p className="text-sm text-muted-foreground">{t('checkout.klarnaDescription')}</p>
                          </div>
                        </label>
                      </RadioGroup>

                      <Button
                        size="lg"
                        className="w-full"
                        disabled={selectedPayment === '' || isPlacingOrder}
                        onClick={handlePlaceOrder}
                      >
                        {isPlacingOrder
                          ? t('checkout.processing')
                          : `${t('checkout.placeOrder')} • ${formatPrice(finalTotal)}`}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>{t('cart.orderSummary')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item) => {
                      const packCount = packSizeMultipliers[item.packSize];
                      const canLabel = packCount === 1 ? t('cart.can') : t('cart.cans');
                      return (
                        <div key={`${item.product.id}-${item.packSize}`} className="flex gap-3">
                          <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">{packCount} {canLabel} × {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium">{formatPrice(item.product.prices[item.packSize] * item.quantity)}</p>
                        </div>
                      );
                    })}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    {discountApplied && (
                      <div className="flex justify-between text-primary">
                        <span>{t('checkout.discount')} (10%)</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('cart.delivery')}</span>
                      <span>
                        {deliveryPriceGBP === 0 ? (
                          <span className="text-primary">{t('cart.free')}</span>
                        ) : selectedDelivery ? (
                          formatPrice(deliveryPriceGBP)
                        ) : (
                          t('checkout.calculatedAtNextStep')
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base font-bold">
                      <span>{t('cart.total')}</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t('cart.includingVat')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
