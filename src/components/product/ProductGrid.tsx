import type { Product } from "../../types/product";
import ProductCard from "./ProductCard";
export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="product-grid" role="list">
      {products.map((p) => (
        <div key={`${p.id}:${p.selectedVariant?.id ?? "product"}`} role="listitem">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
