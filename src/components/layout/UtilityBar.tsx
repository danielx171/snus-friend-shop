import { Star, Truck, CreditCard, User, ShoppingCart, Heart, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Link } from 'react-router-dom';
import { formatMarketPrice } from '@/lib/market';
import { useBrands } from '@/hooks/useBrands';
import { useTheme } from 'next-themes';

export function UtilityBar() {
  const { totalItems, totalPrice, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { t, formatPrice, market } = useTranslation();
  const { brands } = useBrands();
  const brandCount = brands.length || 91;
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'velo' || !theme;

  const freeShippingFormatted = formatMarketPrice(
    market.freeShippingThreshold,
    market,
    0
  );

  return (
    <div className="border-b border-border/20 bg-background">
      <div className="container flex h-9 items-center justify-between text-[11px]">
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Truck className="h-3 w-3 text-primary" />
            <span>{t('trust.freeShipping', { amount: freeShippingFormatted })}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CreditCard className="h-3 w-3 text-primary" />
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span>{brandCount} brands</span>
          </div>
        </div>

        <div className="flex md:hidden items-center gap-1.5 text-muted-foreground">
          <Truck className="h-3 w-3 text-primary" />
          <span>{t('trust.freeShipping', { amount: freeShippingFormatted })}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 text-muted-foreground hover:text-primary"
            onClick={() => setTheme(isDark ? 'light' : 'velo')}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="sm" className="h-9 gap-1 text-[11px] px-2.5 text-muted-foreground hover:text-primary relative" asChild>
            <Link to="/wishlist">
              <Heart className="h-3.5 w-3.5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-3.5 min-w-[14px] rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center px-0.5">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-9 gap-1 text-[11px] px-2.5 text-muted-foreground hover:text-primary" asChild>
            <Link to="/account">
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('auth.login')}</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-1 text-[11px] px-2.5 text-muted-foreground hover:text-primary"
            onClick={openCart}
          >
            <ShoppingCart className="h-3 w-3" />
            {totalItems > 0 ? (
              <span className="font-medium text-primary">{formatPrice(totalPrice)}</span>
            ) : (
              <span className="hidden sm:inline">{formatPrice(0)}</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
