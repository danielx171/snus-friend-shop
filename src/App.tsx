import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "next-themes";
import HomePage from "./pages/HomePage";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutHandoff from "./pages/CheckoutHandoff";
import AccountPage from "./pages/AccountPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";
import BrandHub from "./pages/BrandHub";
import BrandsIndex from "./pages/BrandsIndex";
import OpsAuthGuard from "./components/auth/OpsAuthGuard";
import OpsLogin from "./pages/ops/OpsLogin";
import OpsDashboard from "./pages/ops/OpsDashboard";
import WebhookInbox from "./pages/ops/WebhookInbox";
import SyncStatus from "./pages/ops/SyncStatus";
import SkuMappings from "./pages/ops/SkuMappings";
import OpsUsers from "./pages/ops/OpsUsers";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider
    attribute="class"
    defaultTheme="dark"
    enableSystem={false}
    themes={['dark', 'light', 'editorial']}
  >
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/produkter" element={<ProductListing />} />
              <Route path="/nicotine-pouches" element={<ProductListing />} />
              <Route path="/produkt/:id" element={<ProductDetail />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutHandoff />} />
              <Route path="/checkout/legacy" element={<CheckoutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot" element={<ForgotPasswordPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/brands" element={<BrandsIndex />} />
              <Route path="/brand/:brandSlug" element={<BrandHub />} />
              <Route path="/ops/login" element={<OpsLogin />} />
              <Route path="/ops" element={<OpsAuthGuard><OpsDashboard /></OpsAuthGuard>} />
              <Route path="/ops/webhooks" element={<OpsAuthGuard><WebhookInbox /></OpsAuthGuard>} />
              <Route path="/ops/sync" element={<OpsAuthGuard><SyncStatus /></OpsAuthGuard>} />
              <Route path="/ops/mappings" element={<OpsAuthGuard><SkuMappings /></OpsAuthGuard>} />
              <Route path="/ops/users" element={<OpsAuthGuard><OpsUsers /></OpsAuthGuard>} />

              <Route path="/mappings" element={<Navigate to="/ops/mappings" replace />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
