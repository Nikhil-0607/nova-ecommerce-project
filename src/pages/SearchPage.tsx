import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productService } from "../services/productService";
import type { Product } from "../types/product";
import ProductGrid from "../components/product/ProductGrid";
export default function SearchPage() {
  const [sp] = useSearchParams();
  const q = sp.get("q") || "";
  const [items, setItems] = useState<Product[]>([]);
  
  useEffect(() => {
    productService.search(q).then(setItems);
  }, [q]);
  
  return (
    <section className="section container">
      <div className="breadcrumb">Search / {q || "All products"}</div>
      <div className="listing-head">
        <div>
          <h1>Search results</h1>
          <p>
            {items.length} products {q && <>for “{q}”</>}
          </p>
        </div>
        <select>
          <option>Recommended</option>
          <option>Popularity</option>
          <option>Newest</option>
        </select>
      </div>
      {items.length ? (
        <ProductGrid products={items} />
      ) : (
        <div className="empty">
          <h2>No search results</h2>
          <p>Try another product, brand or category.</p>
        </div>
      )}
    </section>
  );
}
