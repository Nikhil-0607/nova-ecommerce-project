import { Link } from "react-router-dom"
import type { Brand } from "../../types/brand"

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link className="brand-card" to={`/brand/${brand.slug}`} aria-label={`View ${brand.name} products`}>
      <div className="brand-logo" aria-hidden="true">{brand.logo}</div>
      <div>
        <h2>{brand.name}</h2>
        <p>{brand.productCount ?? 0} products</p>
      </div>
    </Link>
  )
}
