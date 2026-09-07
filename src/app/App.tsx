import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/HomePage";
import ListingPage from "../pages/ListingPage";
import SearchPage from "../pages/SearchPage";
import ProductPage from "../pages/ProductPage";
import WishlistPage from "../pages/WishlistPage";
import CartPage from "../pages/CartPage";
import {
  Checkout,
  Offers,
  Brands,
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
          <Route path="/category/:categoryId" element={<ListingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/brand/:brandId" element={<SearchPage />} />
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
