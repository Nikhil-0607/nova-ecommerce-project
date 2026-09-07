export default function Skeleton({ className = "" }: { className?: string }) {
  return <span className={`skeleton ${className}`} aria-hidden="true" />
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="product-grid" aria-label="Loading products">
      {Array.from({ length: count }, (_, index) => (
        <article className="product-card skeleton-card" key={index}>
          <Skeleton className="skeleton-media" />
          <div className="product-info">
            <Skeleton className="skeleton-line skeleton-line-short" />
            <Skeleton className="skeleton-line" />
            <Skeleton className="skeleton-line skeleton-line-price" />
          </div>
        </article>
      ))}
    </div>
  )
}
