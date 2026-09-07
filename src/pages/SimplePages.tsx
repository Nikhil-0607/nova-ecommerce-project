import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
export function Checkout() {
  return (
    <section className="section container">
      <h1>Checkout</h1>
      <div className="steps">
        <b>1 Address</b>
        <span>→</span>
        <b>2 Delivery</b>
        <span>→</span>
        <b>3 Payment</b>
        <span>→</span>
        <b>4 Confirmation</b>
      </div>
      <div className="panel">
        <h2>Payment placeholder</h2>
        <p>UPI · Card · Net Banking · Wallet · Cash on Delivery</p>
        <p>No real payment gateway is connected in Phase 1.</p>
      </div>
    </section>
  );
}
export function Offers() {
  return (
    <section className="section container">
      <span className="eyebrow">LIMITED TIME</span>
      <h1>Offers</h1>
      <div className="offer-grid">
        {[
          "UP TO 70% OFF",
          "FLAT ₹500 OFF",
          "BUY MORE SAVE MORE",
          "NEW USER OFFER",
        ].map((x) => (
          <Link to="/search" key={x}>
            {x}
            <small>SHOP NOW →</small>
          </Link>
        ))}
      </div>
    </section>
  );
}
export function Brands() {
  return (
    <section className="section container">
      <h1>Top Brands</h1>
      <div className="brand-grid">
        {[
          "Aurora",
          "Vela",
          "North & Co.",
          "Serein",
          "Mono Studio",
          "Noma",
          "Aster",
          "Mysa",
          "Eden",
          "Casa Nova",
        ].map((b) => (
          <Link key={b} to={`/brand/${b.toLowerCase().replaceAll(" ", "-")}`}>
            {b}
          </Link>
        ))}
      </div>
    </section>
  );
}
export function Account() {
  const { isAuthenticated, login, logout } = useStore();
  const nav = useNavigate();
  return (
    <section className="section container">
      <h1>My Account</h1>
      {isAuthenticated ? (
        <div className="panel">
          <h2>Welcome to NOVA</h2>
          <p>
            Profile · Orders · Wishlist · Addresses · Payments · Coupons ·
            Security
          </p>
          <button className="btn" onClick={() => nav("/orders")}>
            VIEW ORDERS
          </button>{" "}
          <button className="btn secondary" onClick={logout}>
            LOGOUT
          </button>
        </div>
      ) : (
        <div className="panel">
          <h2>Sign in to continue</h2>
          <button className="btn" onClick={login}>
            MOCK LOGIN
          </button>
        </div>
      )}
    </section>
  );
}
export function Orders() {
  return (
    <section className="section container">
      <h1>Orders</h1>
      {["NV10234", "NV10211", "NV10198"].map((id, i) => (
        <div className="order-card" key={id}>
          <div>
            <b>Order #{id}</b>
            <p>
              {i + 1} Items · ₹{(3499 + i * 700).toLocaleString()}
            </p>
          </div>
          <span className="status">Delivered</span>
          <Link to={`/orders/${id}`}>VIEW DETAILS →</Link>
        </div>
      ))}
    </section>
  );
}
export function Help() {
  return (
    <section className="section container">
      <h1>Help Center</h1>
      <div className="help-grid">
        {[
          "Orders",
          "Payments",
          "Returns",
          "Shipping",
          "Account",
          "Products",
        ].map((x) => (
          <div className="panel" key={x}>
            <h3>{x}</h3>
            <p>FAQs and support for {x.toLowerCase()}.</p>
          </div>
        ))}
      </div>
    </section>
  );
}
export function Seller() {
  return (
    <section className="portal seller">
      <div className="container">
        <span className="eyebrow">NOVA BUSINESS</span>
        <h1>GROW YOUR BUSINESS WITH NOVA</h1>
        <p>Reach millions of customers with a premium digital storefront.</p>
        <Link className="btn" to="/seller/dashboard">
          START SELLING
        </Link>
      </div>
    </section>
  );
}
export function Admin() {
  return (
    <section className="section container">
      <span className="eyebrow">ENTERPRISE</span>
      <h1>NOVA Admin</h1>
      <div className="stats">
        {[
          ["Revenue", "₹48.2L"],
          ["Orders", "12,842"],
          ["Customers", "84,120"],
          ["Products", "8,451"],
          ["Returns", "2.4%"],
          ["Conversion", "4.8%"],
        ].map(([a, b]) => (
          <div className="stat" key={a}>
            <small>{a}</small>
            <strong>{b}</strong>
          </div>
        ))}
      </div>
      <div className="panel">
        <h2>Dashboard shell</h2>
        <p>
          Users · Products · Categories · Brands · Orders · Inventory · Sellers
          · Offers · Analytics · Audit Logs · Settings
        </p>
      </div>
    </section>
  );
}
export function Placeholder({ title }: { title: string }) {
  return (
    <section className="section container">
      <h1>{title}</h1>
      <div className="panel">
        <p>
          This Phase-1 route is wired and ready for the next implementation
          layer.
        </p>
        <Link to="/">Back to home</Link>
      </div>
    </section>
  );
}
