import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ProductGrid from "../components/product/ProductGrid";
import { productService } from "../services/productService";
import type { Product } from "../types/product";

export default function ListingPage() {

  const { categoryId } = useParams();
  const loc = useLocation();
  const routeCat = loc.pathname.split("/")[1];
  const cat = categoryId || routeCat;
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    productService.byCategory(cat).then((r) => {
      setItems(r.length ? r : []);
      setLoading(false);
    });
  }, [cat]);

  return (
    <section className="section container">
      <div className="breadcrumb">Home / {cat}</div>
      <div className="listing-head">
        <div>
          <span className="eyebrow">COLLECTION</span>
          <h1>{cat.toUpperCase()}</h1>
          <p>{items.length} products</p>
        </div>
        <select aria-label="Sort">
          <option>Recommended</option>
          <option>Newest</option>
          <option>Price Low to High</option>
          <option>Price High to Low</option>
        </select>
      </div>
      {loading ? (
        <div className="skeleton-grid">Loading products…</div>
      ) : items.length ? (
        <ProductGrid products={items} />
      ) : (
        <div className="empty">
          <h2>Collection coming soon</h2>
          <p>Explore our latest products through search.</p>
        </div>
      )}
    </section>
  );
}
