import ProductGrid from "../components/product/ProductGrid";
import { useStore } from "../context/StoreContext";
import { Link } from "react-router-dom";
export default function WishlistPage() {
  const { wishlist } = useStore();
  return (
    <section className="section container">
      <h1>Wishlist</h1>
      {wishlist.length ? (
        <ProductGrid products={wishlist} />
      ) : (
        <div className="empty">
          <h2>YOUR WISHLIST IS EMPTY</h2>
          <p>Save your favorite products here.</p>
          <Link className="btn" to="/">
            START SHOPPING
          </Link>
        </div>
      )}
    </section>
  );
}
