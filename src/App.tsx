import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import MarketplacePage from "./pages/marketplace/MarketplacePage";
import ProductDetailsPage from "./pages/marketplace/ProductDetailsPage";
import CartPage from "./pages/cart/CartPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import PaymentSuccessPage from "./pages/checkout/PaymentSuccessPage";
import PaymentFailedPage from "./pages/checkout/PaymentFailedPage";
import OrdersPage from "./pages/orders/OrdersPage";
import ChatPage from "./pages/chat/ChatPage";
import FarmerDashboardPage from "./pages/farmer/FarmerDashboardPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              
              {/* Marketplace */}
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              
              {/* Buyer */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/payment-failed" element={<PaymentFailedPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              
              {/* Chat */}
              <Route path="/chat" element={<ChatPage />} />
              
              {/* Farmer */}
              <Route path="/farmer/dashboard" element={<FarmerDashboardPage />} />
              <Route path="/farmer/products" element={<FarmerDashboardPage />} />
              <Route path="/farmer/orders" element={<FarmerDashboardPage />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
