import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, Truck } from 'lucide-react';
import { packSizeLabels, packSizeMultipliers } from '@/data/products';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { formatPrice, formatPricePerUnit } from '@/lib/format';
import { useTranslation } from '@/hooks/useTranslation';

const FREE_SHIPPING_THRESHOLD = 149;

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { t } = useTranslation();

  const vatAmount = Math.round(totalPrice * 0.25);
  const priceExVat = totalPrice - vatAmount;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const shippingProgress = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {t('cart.title')}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{t('cart.empty')}</p>
            <Button onClick={closeCart} asChild className="rounded-xl">
              <Link to="/">{t('cart.startShopping')}</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="py-3">
              {remainingForFreeShipping > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      {t('cart.freeShippingProgress', { amount: formatPrice(remainingForFreeShipping, 0) })}
                    </span>
                  </div>
                  <Progress value={shippingProgress} className="h-2" />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm bg-primary/10 rounded-xl p-3">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium">{t('cart.freeShippingAchieved')}</span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-2.5">
                {items.map((item) => {
                  const pricePerCan = item.product.prices[item.packSize] / packSizeMultipliers[item.packSize];
                  const lineTotal = item.product.prices[item.packSize] * item.quantity;
                  return (
                    <div
                      key={`${item.product.id}-${item.packSize}`}
                      className="flex gap-3 rounded-xl border border-border bg-card p-2.5"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[10px] text-muted-foreground">
                              {item.product.brand}
                            </p>
                            <p className="font-medium text-sm leading-tight">
                              {item.product.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {packSizeLabels[item.packSize]} · {formatPricePerUnit(pricePerCan)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              removeFromCart(item.product.id, item.packSize)
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-0.5">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 rounded-md"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.packSize,
                                  item.quantity - 1
                                )
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-7 text-center text-xs font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 rounded-md"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.packSize,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="font-semibold text-sm">
                            {formatPrice(lineTotal)} kr
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border pt-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                  <span>{formatPrice(priceExVat)} kr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.vat')}</span>
                  <span>{formatPrice(vatAmount)} kr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.shipping')}</span>
                  <span className={remainingForFreeShipping === 0 ? 'text-primary' : ''}>
                    {remainingForFreeShipping === 0 ? t('cart.free') : '49 kr'}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold text-base">
                  <span>{t('cart.total')}</span>
                  <span>{formatPrice(totalPrice)} kr</span>
                </div>
              </div>
              <Button className="mt-3 w-full rounded-xl" size="default">
                {t('cart.checkout')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="mt-1.5 w-full text-sm"
                onClick={closeCart}
              >
                {t('cart.continueShopping')}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
