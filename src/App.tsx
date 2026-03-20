import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "next-themes";
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
import OpsAuthGuard from "./components/auth/OpsAuthGuard";

// Lazy-load ops pages — they are admin-only and rarely visited
const OpsLogin = lazy(() => import("./pages/ops/OpsLogin"));
const OpsDashboard = lazy(() => import("./pages/ops/OpsDashboard"));
const WebhookInbox = lazy(() => import("./pages/ops/WebhookInbox"));
const SyncStatus = lazy(() => import("./pages/ops/SyncStatus"));
const SkuMappings = lazy(() => import("./pages/ops/SkuMappings"));
const OpsUsers = lazy(() => import("./pages/ops/OpsUsers"));
import { AgeGate } from "@/components/compliance/AgeGate";
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
    <AgeGate>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <CartProvider>
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
              {/* Info / legal pages — placeholder content, needs real copy before go-live */}
              <Route path="/contact" element={<InfoPage title="Contact Us" />} />
              <Route path="/faq" element={<InfoPage title="Frequently Asked Questions" />} />
              <Route path="/shipping" element={<InfoPage title="Shipping Information" />} />
              <Route path="/returns" element={<InfoPage title="Returns & Refunds" />} />
              <Route path="/about" element={<InfoPage title="About SnusFriend" />} />
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
          </BrowserRouter>
            </CartProvider>
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </AgeGate>
  </ThemeProvider>
);

export default App;
