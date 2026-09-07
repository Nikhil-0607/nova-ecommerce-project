import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../../types/product";
import { useStore } from "../../context/StoreContext";
import ProductBadge from "./ProductBadge";
import ProductPrice from "./ProductPrice";
import ProductRating from "./ProductRating";

export default function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWishlist, addToCart, notify } = useStore();
  const navigate = useNavigate();

  const liked = wishlist.some((x) => x.id === product.id);
  const isOutOfStock = product.stockStatus === "out-of-stock";
  const isLowStock = product.stockStatus === "low-stock";
  const isComingSoon = product.stockStatus === "coming-soon";

  return (
    <article className={`product-card ${isOutOfStock ? "is-out-of-stock" : ""}`}>
      <div className="product-media">
        <Link to={`/product/${product.id}`} className="product-image-link">
          <img
            src={product.thumbnail || product.images[0]}
            alt={product.name}
            loading="lazy"
          />
          {product.images[1] && <img className="secondary-image" src={product.images[1]} alt="" aria-hidden="true" loading="lazy" />}
        </Link>

        <ProductBadge badge={product.badges[0]} />

        <button
          type="button"
          className={`heart ${liked ? "liked" : ""}`}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWishlist(product)}
        >
          {liked ? "♥" : "♡"}
        </button>

        <button
          type="button"
          className="quick-view"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          QUICK VIEW
        </button>
      </div>

      <div className="product-info">
        <Link
          to={`/product/${product.id}`}
          className="product-details-link"
        >
          <h3 className="brand">{product.brand}</h3>

          <p className="product-name">{product.name}</p>
        </Link>

        <ProductRating rating={product.rating} reviewCount={product.reviewCount} />
        <ProductPrice
          price={product.price}
          mrp={product.mrp}
          discountPercentage={product.discountPercentage}
          currency={product.currency}
        />
        <div className="color-swatches" aria-label={`Available colors: ${product.colors.join(", ")}`}>
          {product.colors.slice(0, 3).map((color, index) => (
            <span className="color-swatch" key={color} title={color} style={{ backgroundColor: product.variants[index]?.colorCode }} />
          ))}
        </div>
        {isLowStock && <p className="stock-message">Only a few left</p>}
        {isOutOfStock && <p className="stock-message out-of-stock-message">Out of stock</p>}
        {isComingSoon && <p className="stock-message">Coming soon</p>}
        {isOutOfStock
          ? <button type="button" className="btn small mobile-add" onClick={() => notify(`We'll notify you when ${product.name} is back.`)}>NOTIFY ME</button>
          : <button type="button" className="btn small mobile-add" disabled={isComingSoon} onClick={() => addToCart(product)}>{isComingSoon ? "COMING SOON" : "ADD TO BAG"}</button>}
      </div>
    </article>
  );
}