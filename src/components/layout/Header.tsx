import { ShoppingCart, Search, Menu, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export function Header() {
  const { totalItems, totalPrice, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { t, formatPrice } = useTranslation();

  const navLinks = [
    { href: '/nicotine-pouches', label: 'Nicotine Pouches' },
    { href: '/brands', label: 'Brands' },
    { href: '/nicotine-pouches?badge=newPrice', label: 'Offers' },
    { href: '/nicotine-pouches?badge=new', label: 'New' },
    { href: '/nicotine-pouches?badge=popular', label: 'Bestsellers' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-[72px] items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-xs">
            SF
          </div>
          <span className="hidden sm:block text-xl font-semibold text-foreground tracking-tight">
            SnusFriend
          </span>
        </Link>

        {/* Search - Desktop */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <Input
              placeholder="Search products..."
              className="w-full pl-11 h-11 rounded-2xl bg-background/80 border-border/50 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 shadow-xs transition-shadow hover:shadow-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl h-10 w-10 text-muted-foreground hover:text-foreground"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Account */}
          <Button variant="ghost" size="icon" className="hidden md:flex rounded-xl h-10 w-10 text-muted-foreground hover:text-foreground" asChild>
            <Link to="/account">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          
          {/* Cart */}
          <Button
            variant="ghost"
            className="relative rounded-xl h-10 gap-2 px-3 text-muted-foreground hover:text-foreground"
            onClick={openCart}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <>
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground shadow-sm">
                  {totalItems}
                </span>
                <span className="hidden lg:inline text-sm font-medium text-foreground">
                  {formatPrice(totalPrice)}
                </span>
              </>
            )}
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden rounded-xl h-10 w-10 text-muted-foreground hover:text-foreground">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 border-border/40">
              <div className="flex flex-col gap-6 pt-6">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                  <Input placeholder="Search products..." className="pl-10 rounded-2xl h-11 bg-background/80 border-border/50" />
                </div>
                <nav className="flex flex-col gap-0.5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="flex items-center rounded-xl px-4 py-3.5 text-sm font-medium text-foreground hover:bg-accent/50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    to="/account"
                    className="flex items-center rounded-xl px-4 py-3.5 text-sm font-medium text-foreground hover:bg-accent/50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2.5" />
                    My Account
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="md:hidden border-t border-border/30 p-4 bg-card/95 backdrop-blur-xl">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <Input placeholder="Search products..." className="pl-10 rounded-2xl h-11 bg-background/80 border-border/50" autoFocus />
          </div>
        </div>
      )}
    </header>
  );
}
