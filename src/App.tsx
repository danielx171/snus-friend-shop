import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { Suspense } from "react";
import { EasterOverlay } from "@/components/easter/EasterOverlay";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
// Critical path pages — eagerly loaded for instant first paint
// Note: HomePage is now handled by Vike SSG (pages/index/+Page.tsx)
// Note: ProductListing is now handled by Vike (pages/nicotine-pouches/+Page.tsx)
import NotFound from "./pages/NotFound";

import { CookieConsentBanner } from "@/components/cookie-consent/CookieConsentBanner";
import { BackToTop } from "@/components/layout/BackToTop";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { PostHogPageView } from "@/components/analytics/PostHogPageView";
// Script injection is now handled by CookieConsentProvider directly.

/** Redirect legacy /produkt/:id to /product/:id (SEO: avoid duplicate content) */
function ProduktRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/product/${id}`} replace />;
}

const App = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <OrganizationSchema />
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Routes>
          {/* / (root) is now handled by Vike SSG — see pages/index/+Page.tsx */}
          {/* /produkter → /nicotine-pouches redirect is handled by pages/+config.ts */}
          {/* /nicotine-pouches is now handled by Vike — see pages/nicotine-pouches/+Page.tsx */}
          <Route path="/produkt/:id" element={<ProduktRedirect />} />
          {/* /product/:id is now handled by Vike — see pages/product/@id/+Page.tsx */}
          {/* /search is now handled by Vike — see pages/search/+Page.tsx */}
          {/* /cart is now handled by Vike — see pages/cart/+Page.tsx */}
          {/* /checkout is now handled by Vike — see pages/checkout/+Page.tsx */}
          {/* /login is now handled by Vike — see pages/login/+Page.tsx */}
          {/* /register is now handled by Vike — see pages/register/+Page.tsx */}
          {/* /forgot is now handled by Vike — see pages/forgot/+Page.tsx */}
          {/* /update-password is now handled by Vike — see pages/update-password/+Page.tsx */}
          {/* /account is now handled by Vike — see pages/account/+Page.tsx */}
          {/* /order-confirmation is now handled by Vike — see pages/order-confirmation/+Page.tsx */}
          {/* /brands is now handled by Vike SSG — see pages/brands/+Page.tsx */}
          {/* /brand/:brandSlug is now handled by Vike — see pages/brand/@brandSlug/+Page.tsx */}
          {/* /membership is now handled by Vike — see pages/membership/+Page.tsx */}
          {/* /rewards is now handled by Vike — see pages/rewards/+Page.tsx */}
          {/* /wishlist is now handled by Vike — see pages/wishlist/+Page.tsx */}
          {/* /bundle-builder is now handled by Vike — see pages/bundle-builder/+Page.tsx */}
          {/* /faq, /contact, /shipping, /returns, /about, /terms, /privacy, /cookies, /whats-new
              are now handled by Vike SSG — see pages/<name>/+Page.tsx */}
          {/* /leaderboard is now handled by Vike — see pages/leaderboard/+Page.tsx */}
          {/* /blog is now handled by Vike SSG — see pages/blog/+Page.tsx */}
          {/* /blog/:slug is now handled by Vike — see pages/blog/@slug/+Page.tsx */}
          {/* /flavor-quiz is now handled by Vike — see pages/flavor-quiz/+Page.tsx */}
          {/* /community is now handled by Vike — see pages/community/+Page.tsx */}
          {/* /ops/login is now handled by Vike — see pages/ops/login/+Page.tsx */}
          {/* /ops is now handled by Vike — see pages/ops/index/+Page.tsx */}
          {/* /ops/webhooks is now handled by Vike — see pages/ops/webhooks/+Page.tsx */}
          {/* /ops/sync is now handled by Vike — see pages/ops/sync/+Page.tsx */}
          {/* /ops/mappings is now handled by Vike — see pages/ops/mappings/+Page.tsx */}
          {/* /ops/users is now handled by Vike — see pages/ops/users/+Page.tsx */}
          {/* /mappings → /ops/mappings redirect is handled by pages/+config.ts */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <PostHogPageView />
      <CookieConsentBanner />
      <BackToTop />
      <InstallPrompt />
      <EasterOverlay />
    </BrowserRouter>
  );
};

export default App;
