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
import { Link, useNavigate } from 'react-router-dom';
import { Check, ChevronRight, CreditCard, Package, Tag, Truck, ShoppingBag } from 'lucide-react';
import { packSizeMultipliers } from '@/data/products';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from '@/hooks/use-toast';
import { SEOHead } from '@/components/seo/SEOHead';

type CheckoutStep = 'shipping' | 'payment' | 'complete';

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
  eta: string;
}

const mockDeliveryOptions: DeliveryOption[] = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: 'Royal Mail Tracked 48',
    price: 3.99,
    eta: '3-5 business days',
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: 'Royal Mail Tracked 24',
    price: 5.99,
    eta: '1-2 business days',
  },
  {
    id: 'next-day',
    name: 'Next Day Delivery',
    description: 'DPD Next Day (order before 2pm)',
    price: 7.99,
    eta: 'Next business day',
  },
];

export default function CheckoutPage() {
  const {
    items,
    totalPrice,
    hasReachedFreeShipping,
    clearCart,
  } = useCart();
  const { formatPrice } = useTranslation();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  // Shipping form
  const [postcode, setPostcode] = useState('');
  const [postcodeValid, setPostcodeValid] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<string>('');
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    email: '',
    phone: '',
  });

  // Payment
  const [selectedPayment, setSelectedPayment] = useState<string>('');

  const validatePostcode = () => {
    // Simple UK postcode validation
    const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
    if (postcodeRegex.test(postcode)) {
      setPostcodeValid(true);
    } else {
      toast({
        title: 'Invalid postcode',
        description: 'Please enter a valid UK postcode.',
        variant: 'destructive',
      });
    }
  };

  const applyDiscount = () => {
    if (discountCode.toUpperCase() === 'WELCOME10') {
      setDiscountApplied(true);
      toast({
        title: 'Discount applied!',
        description: '10% off your order.',
      });
    } else {
      toast({
        title: 'Invalid code',
        description: 'This discount code is not valid.',
        variant: 'destructive',
      });
    }
  };

  const deliveryPrice = hasReachedFreeShipping
    ? 0
    : mockDeliveryOptions.find((o) => o.id === selectedDelivery)?.price || 0;
  
  const discountAmount = discountApplied ? totalPrice * 0.1 : 0;
  const finalTotal = totalPrice - discountAmount + deliveryPrice;

  const canProceedToPayment =
    postcodeValid &&
    selectedDelivery &&
    shippingDetails.firstName &&
    shippingDetails.lastName &&
    shippingDetails.address &&
    shippingDetails.city &&
    shippingDetails.email;

  const canPlaceOrder = selectedPayment !== '';

  const handlePlaceOrder = () => {
    // Mock order placement
    setCurrentStep('complete');
    clearCart();
    toast({
      title: 'Order placed successfully!',
      description: 'You will receive a confirmation email shortly.',
    });
  };

  if (items.length === 0 && currentStep !== 'complete') {
    return (
      <>
        <SEOHead
          title="Checkout | SnusFriend"
          description="Complete your order securely."
        />
        <Layout showNicotineWarning={false}>
          <div className="container py-16 text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some products before checking out.
            </p>
            <Button asChild size="lg">
              <Link to="/nicotine-pouches">Browse Products</Link>
            </Button>
          </div>
        </Layout>
      </>
    );
  }

  if (currentStep === 'complete') {
    return (
      <>
        <SEOHead
          title="Order Complete | SnusFriend"
          description="Thank you for your order!"
        />
        <Layout showNicotineWarning={false}>
          <div className="container py-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Thank you for your order!</h1>
            <p className="text-muted-foreground mb-2">
              Order confirmation has been sent to your email.
            </p>
            <p className="text-sm text-muted-foreground mb-8">Order #SF{Date.now()}</p>
            <Button asChild size="lg">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Checkout | SnusFriend"
        description="Complete your order securely."
      />
      <Layout showNicotineWarning={false}>
        <div className="container py-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Steps */}
            <div className="lg:col-span-2 space-y-6">
              {/* Discount Code Accordion */}
              <Accordion type="single" collapsible>
                <AccordionItem value="discount" className="border rounded-xl px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span>Have a discount code?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex gap-2 pb-2">
                      <Input
                        placeholder="Enter code"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        disabled={discountApplied}
                      />
                      <Button
                        variant="outline"
                        onClick={applyDiscount}
                        disabled={discountApplied || !discountCode}
                      >
                        {discountApplied ? 'Applied' : 'Apply'}
                      </Button>
                    </div>
                    {discountApplied && (
                      <p className="text-sm text-primary">✓ WELCOME10 - 10% discount applied</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Shipping Section */}
              <Card className={currentStep === 'payment' ? 'opacity-60' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                      1
                    </div>
                    Shipping
                    {currentStep === 'payment' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto"
                        onClick={() => setCurrentStep('shipping')}
                      >
                        Edit
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentStep === 'shipping' ? (
                    <>
                      {/* Postcode Input */}
                      <div className="space-y-2">
                        <Label htmlFor="postcode">Enter your postcode</Label>
                        <div className="flex gap-2">
                          <Input
                            id="postcode"
                            placeholder="e.g. SW1A 1AA"
                            value={postcode}
                            onChange={(e) => {
                              setPostcode(e.target.value);
                              setPostcodeValid(false);
                            }}
                          />
                          <Button onClick={validatePostcode}>Find Address</Button>
                        </div>
                      </div>

                      {postcodeValid && (
                        <>
                          {/* Delivery Options */}
                          <div className="space-y-3">
                            <Label>Choose delivery option</Label>
                            <RadioGroup
                              value={selectedDelivery}
                              onValueChange={setSelectedDelivery}
                            >
                              {mockDeliveryOptions.map((option) => (
                                <label
                                  key={option.id}
                                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                                    selectedDelivery === option.id
                                      ? 'border-primary bg-primary/5'
                                      : 'border-border hover:border-primary/50'
                                  }`}
                                >
                                  <RadioGroupItem value={option.id} />
                                  <Truck className="h-5 w-5 text-muted-foreground" />
                                  <div className="flex-1">
                                    <p className="font-medium">{option.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {option.description} • {option.eta}
                                    </p>
                                  </div>
                                  <span className="font-semibold">
                                    {hasReachedFreeShipping && option.id === 'standard'
                                      ? 'Free'
                                      : formatPrice(option.price)}
                                  </span>
                                </label>
                              ))}
                            </RadioGroup>
                          </div>

                          {/* Shipping Details Form */}
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First name</Label>
                              <Input
                                id="firstName"
                                value={shippingDetails.firstName}
                                onChange={(e) =>
                                  setShippingDetails((s) => ({ ...s, firstName: e.target.value }))
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last name</Label>
                              <Input
                                id="lastName"
                                value={shippingDetails.lastName}
                                onChange={(e) =>
                                  setShippingDetails((s) => ({ ...s, lastName: e.target.value }))
                                }
                              />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                              <Label htmlFor="address">Address</Label>
                              <Input
                                id="address"
                                value={shippingDetails.address}
                                onChange={(e) =>
                                  setShippingDetails((s) => ({ ...s, address: e.target.value }))
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                value={shippingDetails.city}
                                onChange={(e) =>
                                  setShippingDetails((s) => ({ ...s, city: e.target.value }))
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="postcodeConfirm">Postcode</Label>
                              <Input id="postcodeConfirm" value={postcode} disabled />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={shippingDetails.email}
                                onChange={(e) =>
                                  setShippingDetails((s) => ({ ...s, email: e.target.value }))
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone (optional)</Label>
                              <Input
                                id="phone"
                                type="tel"
                                value={shippingDetails.phone}
                                onChange={(e) =>
                                  setShippingDetails((s) => ({ ...s, phone: e.target.value }))
                                }
                              />
                            </div>
                          </div>

                          <Button
                            size="lg"
                            className="w-full gap-2"
                            disabled={!canProceedToPayment}
                            onClick={() => setCurrentStep('payment')}
                          >
                            Proceed to Payment
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      <p>
                        {shippingDetails.firstName} {shippingDetails.lastName}
                      </p>
                      <p>{shippingDetails.address}</p>
                      <p>
                        {shippingDetails.city}, {postcode}
                      </p>
                      <p className="mt-2">
                        {mockDeliveryOptions.find((o) => o.id === selectedDelivery)?.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Section */}
              <Card className={currentStep === 'shipping' ? 'opacity-40 pointer-events-none' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div
                      className={`flex items-center justify-center w-6 h-6 rounded-full text-sm ${
                        currentStep === 'payment'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      2
                    </div>
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentStep === 'payment' && (
                    <>
                      <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                        <label
                          className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                            selectedPayment === 'card'
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <RadioGroupItem value="card" />
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">Credit / Debit Card</p>
                            <p className="text-sm text-muted-foreground">Visa, Mastercard, Amex</p>
                          </div>
                        </label>

                        <label
                          className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                            selectedPayment === 'klarna'
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <RadioGroupItem value="klarna" />
                          <Package className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">Klarna</p>
                            <p className="text-sm text-muted-foreground">Pay in 3 interest-free instalments</p>
                          </div>
                        </label>
                      </RadioGroup>

                      <Button
                        size="lg"
                        className="w-full"
                        disabled={!canPlaceOrder}
                        onClick={handlePlaceOrder}
                      >
                        Place Order • {formatPrice(finalTotal)}
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
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item) => {
                      const packCount = packSizeMultipliers[item.packSize];
                      return (
                        <div key={`${item.product.id}-${item.packSize}`} className="flex gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {packCount} can{packCount > 1 ? 's' : ''} × {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-medium">
                            {formatPrice(item.product.prices[item.packSize] * item.quantity)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    {discountApplied && (
                      <div className="flex justify-between text-primary">
                        <span>Discount (10%)</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span>
                        {deliveryPrice === 0 ? (
                          <span className="text-primary">Free</span>
                        ) : selectedDelivery ? (
                          formatPrice(deliveryPrice)
                        ) : (
                          'Calculated at next step'
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base font-bold">
                      <span>Total</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Including VAT</p>
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
