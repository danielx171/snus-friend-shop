import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "next-themes";
import { CookieConsentProvider } from "@/hooks/useCookieConsent";
import HomePage from "./pages/HomePage";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutHandoff from "./pages/CheckoutHandoff";
import AccountPage from "./pages/AccountPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";
import InfoPage from "./pages/InfoPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import BrandHub from "./pages/BrandHub";
import BrandsIndex from "./pages/BrandsIndex";
import MembershipPage from "./pages/MembershipPage";
import RewardsPage from "./pages/RewardsPage";
import FaqPage from "./pages/FaqPage";
import OpsAuthGuard from "./components/auth/OpsAuthGuard";
import { CookieConsent } from "@/components/cookie/CookieConsent";
import { BackToTop } from "@/components/layout/BackToTop";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

// Lazy-load ops pages — they are admin-only and rarely visited
const OpsLogin = lazy(() => import("./pages/ops/OpsLogin"));
const OpsDashboard = lazy(() => import("./pages/ops/OpsDashboard"));
const WebhookInbox = lazy(() => import("./pages/ops/WebhookInbox"));
const SyncStatus = lazy(() => import("./pages/ops/SyncStatus"));
const SkuMappings = lazy(() => import("./pages/ops/SkuMappings"));
const OpsUsers = lazy(() => import("./pages/ops/OpsUsers"));
import { hasSupabaseEnv, missingSupabaseEnvVars } from "@/integrations/supabase/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Do not retry on client errors (4xx). Retrying auth failures or missing
      // resources wastes requests and delays showing the real error to the user.
      retry: (failureCount, error) => {
        if (error instanceof Error && /^apiFetch .+: [45]\d\d$/.test(error.message)) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

const MissingApiKeysScreen = () => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
    <div className="w-full max-w-xl rounded-lg border border-destructive/40 bg-card p-6">
      <h1 className="text-2xl font-semibold">Missing API Keys</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Frontend environment variables for Supabase are missing. Add the variables below and restart the Vite dev server.
      </p>
      <ul className="mt-4 list-disc pl-5 text-sm">
        {missingSupabaseEnvVars.map((envVar) => (
          <li key={envVar}>{envVar}</li>
        ))}
      </ul>
    </div>
  </div>
);

const App = () => (
  !hasSupabaseEnv ? <MissingApiKeysScreen /> :
  <ThemeProvider
    attribute="class"
    defaultTheme="velo"
    enableSystem={false}
    themes={['velo']}
  >
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <CartProvider>
          <CookieConsentProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/produkter" element={<ProductListing />} />
              <Route path="/nicotine-pouches" element={<ProductListing />} />
              <Route path="/produkt/:id" element={<ProductDetail />} />
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
              {/* Info pages */}
              <Route path="/contact" element={<InfoPage title="Contact Us" content={<>
                <p>We're here to help. Reach us at <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a> and we'll get back to you within 24 hours on business days.</p>
                <p>For order-related queries, please include your order ID in the subject line so we can look into it faster.</p>
                <h2 className="text-foreground font-semibold text-lg mt-6">Business enquiries</h2>
                <p>For wholesale, partnerships, or brand enquiries, please also reach us at the address above with "Business" in the subject line.</p>
              </>} />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/shipping" element={<InfoPage title="Shipping Information" content={<>
                <h2 className="text-foreground font-semibold text-lg">Free delivery</h2>
                <p>All orders over €29 qualify for free standard delivery. No discount code needed — it's applied automatically at checkout.</p>
                <h2 className="text-foreground font-semibold text-lg mt-6">Delivery times</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Standard delivery: 3–5 business days</li>
                  <li>Orders placed before 2pm on business days are dispatched the same day</li>
                  <li>Orders placed after 2pm or on weekends are dispatched the next business day</li>
                </ul>
                <h2 className="text-foreground font-semibold text-lg mt-6">Tracking</h2>
                <p>Once your order ships, you'll receive an email with your tracking number. You can also view your tracking status in your account under Order History.</p>
                <h2 className="text-foreground font-semibold text-lg mt-6">Where do you ship?</h2>
                <p>We ship to the UK and most EU countries. The full list of supported countries is shown at checkout. We use Nylogistik for all fulfilment.</p>
              </>} />} />
              <Route path="/returns" element={<InfoPage title="Returns & Refunds" content={<>
                <h2 className="text-foreground font-semibold text-lg">Return window</h2>
                <p>You have 14 days from the date of delivery to request a return. Products must be unopened and in their original packaging.</p>
                <h2 className="text-foreground font-semibold text-lg mt-6">How to return</h2>
                <p>Email <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a> with your order ID and the reason for your return. We'll send you return instructions within 1 business day.</p>
                <h2 className="text-foreground font-semibold text-lg mt-6">Refunds</h2>
                <p>Once we receive and inspect the returned items, your refund will be processed within 5–7 business days to your original payment method.</p>
                <h2 className="text-foreground font-semibold text-lg mt-6">Return shipping costs</h2>
                <p>If an item is faulty, damaged, or incorrect, we cover the return shipping cost. For change-of-mind returns, the buyer is responsible for return shipping.</p>
              </>} />} />
              <Route path="/about" element={<InfoPage title="About SnusFriend" content={<>
                <p>SnusFriend was founded to make the best Scandinavian nicotine pouches accessible across the UK and Europe. We believe in giving smokers a genuinely better alternative — one that's smoke-free, tobacco-free, and actually enjoyable.</p>
                <h2 className="text-foreground font-semibold text-lg mt-6">Our range</h2>
                <p>We stock 500+ products from 40+ top brands including VELO, ZYN, Sting, LOOP, Lyft, Skruf, White Fox, Pablo, and many more. New products are added regularly as we expand our catalogue.</p>
                <h2 className="text-foreground font-semibold text-lg mt-6">SnusPoints loyalty</h2>
                <p>Every purchase earns you SnusPoints — 10 points per €1 spent. Points accumulate in your account and can be redeemed for discounts. Create a free account to start earning.</p>
                <h2 className="text-foreground font-semibold text-lg mt-6">Delivery</h2>
                <p>We ship across the UK and EU with free delivery on orders over €29. All orders are fulfilled by Nylogistik for fast, reliable dispatch.</p>
                <h2 className="text-foreground font-semibold text-lg mt-6">Get in touch</h2>
                <p>Questions? Email us at <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">support@snusfriend.com</a>.</p>
              </>} />} />
              {/* Legal pages — need solicitor sign-off before go-live */}
              <Route path="/terms" element={<InfoPage title="Terms & Conditions" legalWarning />} />
              <Route path="/privacy" element={<InfoPage title="Privacy Policy" legalWarning />} />
              <Route path="/cookies" element={<InfoPage title="Cookie Policy" legalWarning />} />

              <Route path="/ops/login" element={<Suspense><OpsLogin /></Suspense>} />
              <Route path="/ops" element={<Suspense><OpsAuthGuard><OpsDashboard /></OpsAuthGuard></Suspense>} />
              <Route path="/ops/webhooks" element={<Suspense><OpsAuthGuard><WebhookInbox /></OpsAuthGuard></Suspense>} />
              <Route path="/ops/sync" element={<Suspense><OpsAuthGuard><SyncStatus /></OpsAuthGuard></Suspense>} />
              <Route path="/ops/mappings" element={<Suspense><OpsAuthGuard><SkuMappings /></OpsAuthGuard></Suspense>} />
              <Route path="/ops/users" element={<Suspense><OpsAuthGuard><OpsUsers /></OpsAuthGuard></Suspense>} />

              <Route path="/mappings" element={<Navigate to="/ops/mappings" replace />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieConsent />
            <BackToTop />
            <InstallPrompt />
            </BrowserRouter>
          </CookieConsentProvider>
        </CartProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
