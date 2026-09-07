import ProductGrid from "../product/ProductGrid"
import type { Product } from "../../types/product"

export default function RecentlyViewedSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null
  return (
    <section className="recommendation-section" aria-labelledby="recently-viewed-title">
      <div className="recommendation-heading">
        <div>
          <h2 id="recently-viewed-title">Recently Viewed</h2>
          <p>Pick up where you left off.</p>
        </div>
      </div>
      <ProductGrid products={products} />
    </section>
  )
}
