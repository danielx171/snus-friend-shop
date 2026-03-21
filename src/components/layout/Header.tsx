import { ShoppingCart, Search, Menu, User, Coins, Check } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete';
import { supabase } from '@/integrations/supabase/client';
import { useSnusPoints } from '@/hooks/useSnusPoints';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { totalItems, totalPrice, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { formatPrice } = useTranslation();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const { data: pointsData } = useSnusPoints(userId);

  const navLinks = [
    { href: '/nicotine-pouches', label: 'Nicotine Pouches' },
    { href: '/brands', label: 'Brands' },
    { href: '/nicotine-pouches?badge=newPrice', label: 'Offers' },
    { href: '/nicotine-pouches?badge=new', label: 'New' },
    { href: '/nicotine-pouches?badge=popular', label: 'Bestsellers' },
    { href: '/membership', label: 'Snus Family' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/30 glass-panel-strong">
      <div className="container flex h-[72px] items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <Logo size={38} className="text-primary" />
          <span className="hidden sm:block text-xl font-semibold text-foreground tracking-tight">
            SnusFriend
          </span>
        </Link>

        {/* Search - Desktop */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <SearchAutocomplete />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl h-10 w-10 text-muted-foreground hover:text-primary"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          {userId && pointsData && (
            <Link
              to="/membership"
              className="hidden md:flex items-center gap-1.5 rounded-xl bg-primary/8 px-3 h-9 text-sm font-medium text-primary hover:bg-primary/12 transition-colors"
            >
              <Coins className="h-4 w-4" />
              <span>{pointsData.balance} SP</span>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="hidden md:flex rounded-xl h-10 w-10 text-muted-foreground hover:text-primary" asChild>
            <Link to="/account" aria-label="Account">
              <User className="h-5 w-5" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="relative rounded-xl h-10 gap-2 px-3 text-muted-foreground hover:text-primary"
            onClick={openCart}
            aria-label={`Cart with ${totalItems} items`}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <>
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground glow-primary">
                  {totalItems}
                </span>
                <span className="hidden lg:inline text-sm font-medium text-foreground">
                  {formatPrice(totalPrice)}
                </span>
              </>
            )}
          </Button>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden rounded-xl h-10 w-10 text-muted-foreground hover:text-primary" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 glass-panel-strong border-border/30" aria-label="Navigation menu">
              <div className="flex flex-col gap-6 pt-6">
                <SearchAutocomplete onClose={() => setMobileMenuOpen(false)} autoFocus={false} />
                <nav className="flex flex-col gap-0.5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="flex items-center rounded-xl px-4 py-3.5 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    to="/account"
                    className="flex items-center rounded-xl px-4 py-3.5 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2.5" />
                    My Account
                  </Link>
                  {userId && pointsData && (
                    <Link
                      to="/membership"
                      className="flex items-center rounded-xl px-4 py-3.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Coins className="h-4 w-4 mr-2.5" />
                      {pointsData.balance} SnusPoints
                    </Link>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {searchOpen && (
        <div className="md:hidden border-t border-border/20 p-4 glass-panel">
          <SearchAutocomplete onClose={() => setSearchOpen(false)} autoFocus />
        </div>
      )}
    </header>
  );
}
