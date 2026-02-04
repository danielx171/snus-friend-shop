import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { packSizeLabels, packSizeMultipliers } from '@/data/products';
import { Link } from 'react-router-dom';

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, totalPrice } = useCart();

  const vatAmount = Math.round(totalPrice * 0.25);
  const priceExVat = totalPrice - vatAmount;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Din varukorg
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Din varukorg är tom</p>
            <Button onClick={closeCart} asChild>
              <Link to="/">Börja handla</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map((item) => {
                  const pricePerCan = Math.round(
                    item.product.prices[item.packSize] /
                      packSizeMultipliers[item.packSize]
                  );
                  return (
                    <div
                      key={`${item.product.id}-${item.packSize}`}
                      className="flex gap-4 rounded-lg border border-border bg-card p-3"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {item.product.brand}
                            </p>
                            <p className="font-medium text-sm">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {packSizeLabels[item.packSize]} · {pricePerCan} kr/st
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              removeFromCart(item.product.id, item.packSize)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
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
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
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
                          <p className="font-semibold">
                            {item.product.prices[item.packSize] * item.quantity} kr
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delsumma (exkl. moms)</span>
                  <span>{priceExVat} kr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Moms (25%)</span>
                  <span>{vatAmount} kr</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Totalt</span>
                  <span>{totalPrice} kr</span>
                </div>
              </div>
              <Button className="mt-4 w-full" size="lg">
                Till kassan
              </Button>
              <Button
                variant="ghost"
                className="mt-2 w-full"
                onClick={closeCart}
              >
                Fortsätt handla
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
