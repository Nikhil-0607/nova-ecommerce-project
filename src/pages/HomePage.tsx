import { Link } from "react-router-dom";
import { products } from "../mock/products";
import ProductGrid from "../components/product/ProductGrid";

const cats = [
  ["MEN", "/men"],
  ["WOMEN", "/women"],
  ["KIDS", "/kids"],
  ["FOOTWEAR", "/category/footwear"],
  ["BEAUTY", "/beauty"],
  ["HOME", "/home"],
];

export default function HomePage() {

  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <div>
            <span className="eyebrow">THE NEW SEASON</span>
            <h1>
              Designed for the way
              <br />
              you move now.
            </h1>
            <p>
              Elevated essentials, effortless silhouettes and new-season color.
            </p>
            <div className="hero-actions">
              <Link className="btn" to="/women">
                SHOP WOMEN
              </Link>
              <Link className="btn secondary" to="/men">
                SHOP MEN
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section-head">
          <div>
            <span className="eyebrow">DISCOVER</span>
            <h2>Shop by category</h2>
          </div>
        </div>
        <div className="category-grid">
          {cats.map(([n, l], i) => (
            <Link key={n} to={l} className={`category-card c${i}`}>
              <span>{n}</span>
              <small>Explore collection →</small>
            </Link>
          ))}
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">TRENDING NOW</span>
              <h2>Editor’s picks</h2>
            </div>
            <Link to="/search">VIEW ALL</Link>
          </div>
          <ProductGrid products={products.slice(0, 8)} />
        </div>
      </section>
      <section className="sale">
        <div className="container sale-inner">
          <div>
            <span className="eyebrow">FLASH SALE</span>
            <h2>Limited time. Limited quantities.</h2>
            <div className="timer">02 : 14 : 32</div>
          </div>
          <Link className="btn light-btn" to="/offers">
            VIEW ALL DEALS
          </Link>
        </div>
      </section>
      <section className="section container">
        <div className="section-head">
          <div>
            <span className="eyebrow">NEW ARRIVALS</span>
            <h2>Fresh into NOVA</h2>
          </div>
        </div>
        <ProductGrid products={products.slice(8, 16)} />
      </section>
      <section className="editorial">
        <div className="container">
          <span className="eyebrow">THE STYLE EDIT</span>
          <h2>Wear the moment.</h2>
          <div className="editorial-grid">
            <Link to="/search?q=office">Office Essentials</Link>
            <Link to="/search?q=streetwear">Streetwear</Link>
            <Link to="/search?q=festive">Festive Collection</Link>
          </div>
        </div>
      </section>
      <section className="section container trust">
        <h2>WHY NOVA?</h2>
        <div>
          <span>✓ Authentic Products</span>
          <span>↺ Easy Returns</span>
          <span>🔒 Secure Payments</span>
          <span>⚡ Fast Delivery</span>
        </div>
      </section>
      <section className="newsletter">
        <div className="container">
          <span className="eyebrow">GET THE EDIT</span>
          <h2>New arrivals, exclusive drops and special offers.</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" />
            <button className="btn">SUBSCRIBE</button>
          </form>
        </div>
      </section>
    </>
  );
}
