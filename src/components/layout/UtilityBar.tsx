import { Star, Truck, Zap, User, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { LanguageSelector } from './LanguageSelector';

export function UtilityBar() {
  const { totalItems, totalPrice, openCart } = useCart();

  return (
    <div className="border-b border-border bg-secondary/30">
      <div className="container flex h-8 items-center justify-between text-[11px]">
        {/* Trust props - Left side */}
        <div className="hidden md:flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Truck className="h-3 w-3 text-primary" />
            <span>Fri frakt fr. 149 kr</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Zap className="h-3 w-3 text-primary" />
            <span>Snabba leveranser</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span>4,7 på Trustpilot</span>
          </div>
        </div>

        {/* Mobile - simplified */}
        <div className="flex md:hidden items-center gap-1.5 text-muted-foreground">
          <Truck className="h-3 w-3 text-primary" />
          <span>Fri frakt fr. 149 kr</span>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Button variant="ghost" size="sm" className="h-6 gap-1 text-[11px] px-2">
            <User className="h-3 w-3" />
            <span className="hidden sm:inline">Logga in</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 gap-1 text-[11px] px-2"
            onClick={openCart}
          >
            <ShoppingCart className="h-3 w-3" />
            {totalItems > 0 ? (
              <span className="font-medium">{formatPrice(totalPrice)} kr</span>
            ) : (
              <span className="hidden sm:inline">0,00 kr</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
