import { Header } from './Header';
import { Footer } from './Footer';
import { UtilityBar } from './UtilityBar';
import { MainNav } from './MainNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { NicotineWarning } from '@/components/compliance/NicotineWarning';

interface LayoutProps {
  children: React.ReactNode;
  showNicotineWarning?: boolean;
}

export function Layout({ children, showNicotineWarning = true }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <UtilityBar />
      <Header />
      <MainNav />
      {showNicotineWarning && <NicotineWarning />}
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
