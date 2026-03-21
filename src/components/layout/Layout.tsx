import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';
import { UtilityBar } from './UtilityBar';
import { MainNav } from './MainNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { NicotineWarning } from '@/components/compliance/NicotineWarning';
import { PREVIEW_MODE } from '@/config/brand';

interface LayoutProps {
  children: React.ReactNode;
  showNicotineWarning?: boolean;
}

export function Layout({ children, showNicotineWarning = true }: LayoutProps) {
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {PREVIEW_MODE && !bannerDismissed && (
        <div className="relative bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-800">
          Preview mode — this site is not yet open for orders
          <button
            onClick={() => setBannerDismissed(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-amber-100"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <UtilityBar />
      <Header />
      <MainNav />
      {showNicotineWarning && <NicotineWarning />}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="flex-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CartDrawer />
    </div>
  );
}
