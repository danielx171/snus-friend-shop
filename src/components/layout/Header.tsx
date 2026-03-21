import { ShoppingCart, Search, Menu, User, Coins, Check } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete';
import { supabase } from '@/integrations/supabase/client';
import { useSnusPoints } from '@/hooks/useSnusPoints';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Header() {
  const { totalItems, totalPrice, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [toastData, setToastData] = useState<{ name: string; id: number } | null>(null);
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

  // Listen for add-to-cart events for bounce + toast
  const handleCartItemAdded = useCallback((e: Event) => {
    const name = (e as CustomEvent).detail?.name ?? 'Item';
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 300);
    setToastData({ name, id: Date.now() });
  }, []);

  useEffect(() => {
    window.addEventListener('cart-item-added', handleCartItemAdded);
    return () => window.removeEventListener('cart-item-added', handleCartItemAdded);
  }, [handleCartItemAdded]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastData) return;
    const timer = setTimeout(() => setToastData(null), 3000);
    return () => clearTimeout(timer);
  }, [toastData]);

  // Scroll-aware header style
  const [scrolled, setScrolled] = useState(false);
  const rafRef = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 60);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
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
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 ease-in-out',
        scrolled
          ? 'border-b border-white/[0.08] backdrop-blur-lg'
          : 'border-b border-border/30 glass-panel-strong'
      )}
      style={scrolled ? { backgroundColor: 'rgba(10, 15, 30, 0.85)' } : undefined}
    >
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
            <motion.div
              animate={cartBounce ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <ShoppingCart className="h-5 w-5" />
            </motion.div>
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

      {/* Add-to-cart toast */}
      <AnimatePresence>
        {toastData && (
          <motion.div
            key={toastData.id}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 shadow-2xl"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#22c55e]">
              <Check className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm text-white font-medium max-w-[200px] truncate">
              {toastData.name} added to cart
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
