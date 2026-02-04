import { ShoppingCart, Search, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export function Header() {
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-sm">
            SF
          </div>
          <span className="hidden sm:block text-lg font-bold text-foreground tracking-tight">
            SnusFriend
          </span>
        </Link>

        {/* Search - Desktop */}
        <div className="hidden md:flex flex-1 max-w-lg mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('search.placeholder')}
              className="w-full pl-10 h-10 rounded-xl bg-background border-border focus:border-primary"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" className="hidden md:flex rounded-xl h-9 w-9">
            <User className="h-4.5 w-4.5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-xl h-9 w-9"
            onClick={openCart}
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden rounded-xl h-9 w-9">
                <Menu className="h-4.5 w-4.5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-5 pt-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder={t('search.placeholder')} className="pl-10 rounded-xl" />
                </div>
                <nav className="flex flex-col gap-0.5">
                  <Link
                    to="/produkter"
                    className="flex items-center rounded-xl px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.allProducts')}
                  </Link>
                  <Link
                    to="/produkter?badge=Nytt+pris"
                    className="flex items-center rounded-xl px-4 py-2.5 text-sm font-medium text-primary hover:bg-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.newPrice')}
                  </Link>
                  <Link
                    to="/produkter?badge=Nyhet"
                    className="flex items-center rounded-xl px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.news')}
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
