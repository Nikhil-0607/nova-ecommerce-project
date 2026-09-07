import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { useStore } from "../../context/StoreContext";

export default function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  const liked = wishlist.some((x) => x.id === product.id);

  return (
    <article className="product-card">
      {/* Product Image */}
      <div className="product-media">
        <Link to={`/product/${product.id}`} className="product-image-link">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
          />
        </Link>

        {product.badges?.[0] && (
          <span className="badge">{product.badges[0]}</span>
        )}

        <button
          type="button"
          className={`heart ${liked ? "liked" : ""}`}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWishlist(product)}
        >
          {liked ? "♥" : "♡"}
        </button>

        {/* Hover Add to Bag */}
        <button
          type="button"
          className="quick-add"
          onClick={() => addToCart(product)}
        >
          ADD TO BAG
        </button>
      </div>

      {/* Product Details */}
      <div className="product-info">
        <Link
          to={`/product/${product.id}`}
          className="product-details-link"
        >
          <h3 className="brand">{product.brand}</h3>

          <p className="product-name">{product.name}</p>
        </Link>

        <div className="rating">
          <span className="rating-value">
            ★ {product.rating}
          </span>

          <span className="review-count">
            | {product.reviewCount}
          </span>
        </div>

        <div className="price-row">
          <strong>₹{product.price.toLocaleString()}</strong>

          {product.mrp > product.price && (
            <>
              <s>₹{product.mrp.toLocaleString()}</s>

              <em>{product.discount}% OFF</em>
            </>
          )}
        </div>

        {/* Mobile / non-hover fallback */}
        <button
          type="button"
          className="btn small mobile-add"
          onClick={() => addToCart(product)}
        >
          ADD TO BAG
        </button>
      </div>
    </article>
  );
}