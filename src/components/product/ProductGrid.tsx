import type { Product } from "../../types/product";
import ProductCard from "./ProductCard";
export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="product-grid" role="list">
      {products.map((p) => (
        <div key={p.id} role="listitem">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
