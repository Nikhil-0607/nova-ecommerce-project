import { useEffect, useState } from "react"
import type { Product } from "../../types/product"
import ProductGrid from "../product/ProductGrid"
import { ProductGridSkeleton } from "../common/Skeleton"

type RecommendationSectionProps = {
  title: string
  subtitle?: string
  loadProducts: () => Promise<Product[]>
}

export default function RecommendationSection({
  title,
  subtitle,
  loadProducts,
}: RecommendationSectionProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)
    void loadProducts()
      .then((result) => {
        if (active) setProducts(result)
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [loadProducts])

  if (!loading && !error && products.length === 0) return null

  return (
    <section className="recommendation-section" aria-labelledby={`${title.toLowerCase().replaceAll(" ", "-")}-title`}>
      <div className="recommendation-heading">
        <div>
          <h2 id={`${title.toLowerCase().replaceAll(" ", "-")}-title`}>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {loading && <ProductGridSkeleton count={4} />}
      {!loading && error && <div className="empty" role="alert"><h3>Recommendations unavailable</h3><p>Please try again later.</p></div>}
      {!loading && !error && <ProductGrid products={products} />}
    </section>
  )
}
