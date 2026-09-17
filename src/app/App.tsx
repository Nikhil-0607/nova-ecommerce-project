import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/HomePage";
import ListingPage from "../pages/ListingPage";
import ProductListingPage from "../pages/ProductListingPage";
import SearchPage from "../pages/SearchPage";
import BrandDirectoryPage from "../pages/BrandDirectoryPage";
import BrandPage from "../pages/BrandPage";
import ProductPage from "../pages/ProductPage";
import CategoryLandingPage from "../pages/CategoryLandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AccountPage from "../pages/AccountPage";
import AccountAddressesPage from "../pages/AccountAddressesPage";
import WishlistPage from "../pages/WishlistPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrdersPage from "../pages/OrdersPage";
import OrderDetailPage from "../pages/OrderDetailPage";
import { CheckoutProvider } from "../context/CheckoutContext";
import PostPurchasePage from "../pages/PostPurchasePage";
import SellerDashboardPage from "../pages/SellerDashboardPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import RoleGuard from "../components/auth/RoleGuard";
import SellerOnboardingPage from "../pages/SellerOnboardingPage";
import AccountEngagementPage from "../pages/AccountEngagementPage";
import AdminMarketingPage from "../pages/AdminMarketingPage";
import {
  Offers,
  Account,
  Help,
  Seller,
  Admin,
  Placeholder,
} from "../pages/SimplePages";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/men" element={<ListingPage />} />
          <Route path="/women" element={<ListingPage />} />
          <Route path="/kids" element={<ListingPage />} />
          <Route path="/home" element={<ListingPage />} />
          <Route path="/beauty" element={<ListingPage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/:categoryId" element={<ProductListingPage />} />
          <Route path="/category/:categoryId" element={<CategoryLandingPage />} />
          <Route path="/category/:categoryId/:subcategoryId" element={<ProductListingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:productId/reviews" element={<ProductPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout/*" element={<ProtectedRoute><CheckoutProvider><CheckoutPage /></CheckoutProvider></ProtectedRoute>} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/brands" element={<BrandDirectoryPage />} />
          <Route path="/brand/:brandId" element={<BrandPage />} />
          <Route path="/account/addresses" element={<ProtectedRoute><AccountAddressesPage /></ProtectedRoute>} />
          <Route path="/account/preferences" element={<ProtectedRoute><AccountEngagementPage /></ProtectedRoute>} />
          <Route path="/account/engagement" element={<ProtectedRoute><AccountEngagementPage /></ProtectedRoute>} />
          <Route path="/account/*" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route
            path="/orders/:orderId"
            element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>}
          />
          <Route path="/orders/:orderId/:action" element={<ProtectedRoute><PostPurchasePage /></ProtectedRoute>} />
          <Route
            path="/notifications"
            element={<Placeholder title="Notifications" />}
          />
          <Route path="/help" element={<Help />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/forgot-password"
            element={<Placeholder title="Forgot Password" />}
          />
          <Route
            path="/verify-otp"
            element={<Placeholder title="Verify OTP" />}
          />
          <Route
            path="/reset-password"
            element={<Placeholder title="Reset Password" />}
          />
          <Route path="/seller" element={<Seller />} />
          <Route path="/seller/onboarding" element={<ProtectedRoute><SellerOnboardingPage /></ProtectedRoute>} />
          <Route path="/returns" element={<Placeholder title="Returns & Exchanges" />} />
          <Route path="/privacy" element={<Placeholder title="Privacy Policy" />} />
          <Route path="/terms" element={<Placeholder title="Terms & Conditions" />} />
          <Route path="/seller/dashboard" element={<RoleGuard roles={["SELLER", "ADMIN"]}><SellerDashboardPage /></RoleGuard>} />
          <Route path="/admin" element={<RoleGuard roles={["ADMIN"]}><AdminDashboardPage /></RoleGuard>} />
          <Route path="/admin/marketing" element={<RoleGuard roles={["ADMIN"]}><AdminMarketingPage /></RoleGuard>} />
          <Route path="/admin/*" element={<RoleGuard roles={["ADMIN"]}><AdminDashboardPage /></RoleGuard>} />
          <Route
            path="*"
            element={<Placeholder title="404 — Page not found" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
