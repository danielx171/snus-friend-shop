import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import { EasterOverlay } from "@/components/easter/EasterOverlay";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
// Critical path pages — eagerly loaded for instant first paint
import HomePage from "./pages/HomePage";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

// Lazy-load all other pages — they're not part of the main landing flow
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutHandoff = lazy(() => import("./pages/CheckoutHandoff"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const UpdatePasswordPage = lazy(() => import("./pages/UpdatePasswordPage"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const BrandHub = lazy(() => import("./pages/BrandHub"));
const BrandsIndex = lazy(() => import("./pages/BrandsIndex"));
const MembershipPage = lazy(() => import("./pages/MembershipPage"));
const RewardsPage = lazy(() => import("./pages/RewardsPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const BundleBuilder = lazy(() => import("./pages/BundleBuilder"));
const LeaderboardPage = lazy(() => import("./pages/LeaderboardPage"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const FlavorQuizPage = lazy(() => import("./pages/FlavorQuizPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
import OpsAuthGuard from "./components/auth/OpsAuthGuard";
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

// Lazy-load ops pages — they are admin-only and rarely visited
const OpsLogin = lazy(() => import("./pages/ops/OpsLogin"));
const OpsDashboard = lazy(() => import("./pages/ops/OpsDashboard"));
const WebhookInbox = lazy(() => import("./pages/ops/WebhookInbox"));
const SyncStatus = lazy(() => import("./pages/ops/SyncStatus"));
const SkuMappings = lazy(() => import("./pages/ops/SkuMappings"));
const OpsUsers = lazy(() => import("./pages/ops/OpsUsers"));

const App = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <OrganizationSchema />
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/produkter" element={<Navigate to="/nicotine-pouches" replace />} />
          <Route path="/nicotine-pouches" element={<ProductListing />} />
          <Route path="/produkt/:id" element={<ProduktRedirect />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutHandoff />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/brands" element={<BrandsIndex />} />
          <Route path="/brand/:brandSlug" element={<BrandHub />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/bundle-builder" element={<BundleBuilder />} />
          {/* /faq, /contact, /shipping, /returns, /about, /terms, /privacy, /cookies, /whats-new
              are now handled by Vike SSG — see pages/<name>/+Page.tsx */}
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/flavor-quiz" element={<FlavorQuizPage />} />
          <Route path="/community" element={<CommunityPage />} />

          <Route path="/ops/login" element={<Suspense><OpsLogin /></Suspense>} />
          <Route path="/ops" element={<Suspense><OpsAuthGuard><OpsDashboard /></OpsAuthGuard></Suspense>} />
          <Route path="/ops/webhooks" element={<Suspense><OpsAuthGuard><WebhookInbox /></OpsAuthGuard></Suspense>} />
          <Route path="/ops/sync" element={<Suspense><OpsAuthGuard><SyncStatus /></OpsAuthGuard></Suspense>} />
          <Route path="/ops/mappings" element={<Suspense><OpsAuthGuard><SkuMappings /></OpsAuthGuard></Suspense>} />
          <Route path="/ops/users" element={<Suspense><OpsAuthGuard><OpsUsers /></OpsAuthGuard></Suspense>} />

          <Route path="/mappings" element={<Navigate to="/ops/mappings" replace />} />

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
