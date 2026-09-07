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
import WishlistPage from "../pages/WishlistPage";
import CartPage from "../pages/CartPage";
import {
  Checkout,
  Offers,
  Account,
  Orders,
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
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/brands" element={<BrandDirectoryPage />} />
          <Route path="/brand/:brandId" element={<BrandPage />} />
          <Route path="/account/*" element={<Account />} />
          <Route path="/orders" element={<Orders />} />
          <Route
            path="/orders/:orderId"
            element={<Placeholder title="Order Details" />}
          />
          <Route
            path="/notifications"
            element={<Placeholder title="Notifications" />}
          />
          <Route path="/help" element={<Help />} />
          <Route path="/login" element={<Account />} />
          <Route
            path="/register"
            element={<Placeholder title="Create Account" />}
          />
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
          <Route
            path="/seller/dashboard"
            element={<Placeholder title="Seller Dashboard" />}
          />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route
            path="*"
            element={<Placeholder title="404 — Page not found" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
