import { Star, Truck, CreditCard, User, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import { Link } from 'react-router-dom';
import { formatMarketPrice } from '@/lib/market';

export function UtilityBar() {
  const { totalItems, totalPrice } = useCart();
  const { t, formatPrice, market } = useTranslation();
  const { openCart } = useCart();

  const freeShippingFormatted = formatMarketPrice(
    market.freeShippingThreshold,
    market,
    market.currencyCode === 'GBP' ? 0 : 0
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
            <span>{t('trust.klarna')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span>{t('trust.trustpilot')}</span>
          </div>
        </div>

        <div className="flex md:hidden items-center gap-1.5 text-muted-foreground">
          <Truck className="h-3 w-3 text-primary" />
          <span>{t('trust.freeShipping', { amount: freeShippingFormatted })}</span>
        </div>

        <div className="flex items-center gap-1">
          <LanguageSelector />
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-[11px] px-2 text-muted-foreground hover:text-primary" asChild>
            <Link to="/account">
              <User className="h-3 w-3" />
              <span className="hidden sm:inline">{t('auth.login')}</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-[11px] px-2 text-muted-foreground hover:text-primary"
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
