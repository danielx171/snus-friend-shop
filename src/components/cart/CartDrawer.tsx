import { useState, useEffect, useRef, useCallback } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, Truck } from 'lucide-react';
import { packSizeMultipliers } from '@/data/products';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/hooks/useTranslation';
import { formatMarketPrice } from '@/lib/market';
import { getCartTotals } from '@/lib/cart-utils';
import { cn } from '@/lib/utils';

/* ── Animated total that flips on change ── */
function AnimatedTotal({ value }: { value: string }) {
  const [display, setDisplay] = useState(value);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (value !== display) {
      setFlipping(true);
      const t = setTimeout(() => {
        setDisplay(value);
        setFlipping(false);
      }, 100);
      return () => clearTimeout(t);
    }
  }, [value, display]);

  return (
    <span
      className={cn(
        'inline-block transition-all duration-200',
        flipping && 'animate-number-flip'
      )}
    >
      {display}
    </span>
  );
}

/* ── Spring button wrapper ── */
function SpringButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  const [spring, setSpring] = useState(false);

  const handleClick = useCallback(() => {
    setSpring(true);
    onClick();
    setTimeout(() => setSpring(false), 200);
  }, [onClick]);

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(className, spring && 'animate-btn-spring')}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart } = useCart();
  const { t, formatPrice, formatPriceWithUnit, market } = useTranslation();

  /* ── Track items being removed for slide-out ── */
  const [removingKeys, setRemovingKeys] = useState<Set<string>>(new Set());

  const handleRemove = useCallback(
    (productId: string, packSize: string) => {
      const key = `${productId}-${packSize}`;
      setRemovingKeys((prev) => new Set(prev).add(key));
      setTimeout(() => {
        removeFromCart(productId, packSize as any);
        setRemovingKeys((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }, 200);
    },
    [removeFromCart]
  );

  const { subtotal, shipping, finalTotal, freeShipping, progress } = getCartTotals(
    items,
    market,
  );

  const localSubtotal = subtotal * market.rateFromGBP;
  const remainingForFreeShipping = Math.max(0, market.freeShippingThreshold - localSubtotal);
  const shippingProgress = progress;

  const formatLocalAmount = (amount: number): string => {
    return formatMarketPrice(amount, market, market.currencyCode === 'GBP' ? 2 : 0);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full flex-col sm:max-w-md glass-panel-strong border-border/20">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <ShoppingBag className="h-5 w-5 text-primary" />
            {t('cart.title')}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 && removingKeys.size === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/30 border border-border/20">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{t('cart.empty')}</p>
            <Button onClick={closeCart} asChild className="rounded-xl glow-primary">
              <Link to="/">{t('cart.startShopping')}</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="py-3">
              {!freeShipping ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      {t('cart.freeShippingProgress', { amount: formatLocalAmount(remainingForFreeShipping) })}
                    </span>
                  </div>
                  <Progress value={shippingProgress} className="h-2" />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm bg-primary/10 border border-primary/15 rounded-xl p-3">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium">{t('cart.freeShippingAchieved')}</span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-2.5">
                {items.map((item, index) => {
                  const pricePerCan = item.product.prices[item.packSize] / packSizeMultipliers[item.packSize];
                  const lineTotal = item.product.prices[item.packSize] * item.quantity;
                  const packNum = item.packSize.replace('pack', '');
                  const itemKey = `${item.product.id}-${item.packSize}`;
                  const isRemoving = removingKeys.has(itemKey);

                  return (
                    <div
                      key={itemKey}
                      className={cn(
                        'flex gap-3 rounded-xl border border-border/20 bg-card/60 p-2.5',
                        isRemoving
                          ? 'animate-cart-item-out'
                          : 'animate-cart-item-in'
                      )}
                      style={!isRemoving ? { animationDelay: `${index * 50}ms` } : undefined}
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted/30">
                        <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[10px] text-muted-foreground">{item.product.brand}</p>
                            <p className="font-medium text-sm leading-tight text-foreground">{item.product.name}</p>
                            <p className="text-[10px] text-muted-foreground">{t(`pack.${packNum}`)} · {formatPriceWithUnit(pricePerCan)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemove(item.product.id, item.packSize)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-0.5">
                            <SpringButton
                              className="h-6 w-6 rounded-md border-border/30"
                              onClick={() => updateQuantity(item.product.id, item.packSize, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </SpringButton>
                            <span className="w-7 text-center text-xs font-medium">{item.quantity}</span>
                            <SpringButton
                              className="h-6 w-6 rounded-md border-border/30"
                              onClick={() => updateQuantity(item.product.id, item.packSize, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </SpringButton>
                          </div>
                          <p className="font-semibold text-sm">{formatPrice(lineTotal)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border/20 pt-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                  <AnimatedTotal value={formatPrice(subtotal)} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.delivery')}</span>
                  <span className={freeShipping ? 'text-primary' : ''}>
                    {freeShipping ? t('cart.free') : formatPrice(shipping)}
                  </span>
                </div>
                <Separator className="my-2 bg-border/20" />
                <div className="flex justify-between font-semibold text-base">
                  <span>{t('cart.total')}</span>
                  <AnimatedTotal value={formatPrice(finalTotal)} />
                </div>
                <p className="text-xs text-muted-foreground">{t('cart.includingVat')}</p>
              </div>
              <Button asChild className="mt-3 w-full rounded-xl glow-primary" size="default">
                <Link to="/cart" onClick={closeCart}>{t('cart.checkout')}</Link>
              </Button>
              <Button variant="ghost" size="sm" className="mt-1.5 w-full text-sm hover:text-primary" onClick={closeCart}>
                {t('cart.continueShopping')}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
