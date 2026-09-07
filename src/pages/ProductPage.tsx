import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productService } from "../services/productService";
import { useStore } from "../context/StoreContext";
import type { Product } from "../types/product";
import ProductGrid from "../components/product/ProductGrid";
import { products } from "../mock/products";
export default function ProductPage() {

  const { productId = "" } = useParams();
  const [p, setP] = useState<Product>();
  const [size, setSize] = useState("M");
  const { addToCart, toggleWishlist, wishlist } = useStore();
  
  useEffect(() => {
    productService.getById(productId).then(setP);
  }, [productId]);
  if (!p)
    return <section className="section container">Loading product…</section>;
  const liked = wishlist.some((x) => x.id === p.id);
  
  return (
    <>
      <section className="section container">
        <div className="breadcrumb">
          Home / {p.category} / {p.name}
        </div>
        <div className="pdp">
          <div className="pdp-image">
            <img src={p.images[0]} alt={p.name} />
          </div>
          <div className="pdp-info">
            <span className="eyebrow">{p.brand}</span>
            <h1>{p.name}</h1>
            <div className="rating">
              ★ {p.rating} · {p.reviewCount} reviews
            </div>
            <div className="pdp-price">
              ₹{p.price.toLocaleString()} <s>₹{p.mrp.toLocaleString()}</s>{" "}
              <em>{p.discount}% OFF</em>
            </div>
            <p className="muted">Inclusive of all taxes</p>
            <h3>Select size</h3>
            <div className="sizes">
              {p.sizes.map((s) => (
                <button
                  className={size === s ? "active" : ""}
                  onClick={() => setSize(s)}
                  key={s}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="pdp-actions">
              <button className="btn" onClick={() => addToCart(p)}>
                ADD TO BAG
              </button>
              <button
                className="btn secondary"
                onClick={() => toggleWishlist(p)}
              >
                {liked ? "♥ WISHLISTED" : "♡ WISHLIST"}
              </button>
            </div>
            <div className="details">
              <h3>Product details</h3>
              <p>{p.description}</p>
              <p>✓ 100% authentic · ✓ Easy returns · ✓ Secure checkout</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <h2>Similar products</h2>
          <ProductGrid
            products={products.filter((x) => x.id !== p.id).slice(0, 4)}
          />
        </div>
      </section>
    </>
  );
}
