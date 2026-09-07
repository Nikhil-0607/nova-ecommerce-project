import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="logo light">
            NOVA
          </Link>

          <p>
            Modern fashion, thoughtfully curated for every style and occasion.
          </p>

          <div className="footer-socials">
            <a href="#" aria-label="Instagram">
              Instagram
            </a>
            <a href="#" aria-label="Facebook">
              Facebook
            </a>
            <a href="#" aria-label="Pinterest">
              Pinterest
            </a>
          </div>
        </div>

        {/* Shop */}
        <div className="footer-column">
          <h4>Shop</h4>
          <Link to="/men">Men</Link>
          <Link to="/women">Women</Link>
          <Link to="/kids">Kids</Link>
          <Link to="/beauty">Beauty</Link>
        </div>

        {/* Customer Care */}
        <div className="footer-column">
          <h4>Customer Care</h4>
          <Link to="/help">Contact Us</Link>
          <Link to="/help">FAQs</Link>
          <Link to="/orders">Track Order</Link>
          <Link to="/returns">Returns & Exchanges</Link>
        </div>

        {/* Business */}
        <div className="footer-column">
          <h4>Business</h4>
          <Link to="/seller">Sell With Us</Link>
          <Link to="/brands">Our Brands</Link>
          <Link to="/admin">Admin Portal</Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>© 2026 NOVA. All rights reserved.</p>

          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>

          <span className="footer-trust">
            Secure Payments · Trusted Shopping
          </span>
        </div>
      </div>
    </footer>
  );
}