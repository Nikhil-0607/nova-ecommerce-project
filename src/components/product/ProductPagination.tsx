import type { PaginationState } from "../../types/catalog"

type ProductPaginationProps = PaginationState & {
  onPageChange: (page: number) => void
}

const pageNumbers = (page: number, totalPages: number): Array<number | "..."> => {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1)
  const pages: Array<number | "..."> = [1]
  if (page > 3) pages.push("...")
  for (let value = Math.max(2, page - 1); value <= Math.min(totalPages - 1, page + 1); value += 1) pages.push(value)
  if (page < totalPages - 2) pages.push("...")
  pages.push(totalPages)
  return pages
}

export default function ProductPagination({ page, totalPages, hasNext, hasPrevious, onPageChange }: ProductPaginationProps) {
  if (totalPages <= 1) return null
  return (
    <nav className="product-pagination" aria-label="Product pages">
      <button type="button" disabled={!hasPrevious} onClick={() => onPageChange(page - 1)} aria-label="Previous page">Previous</button>
      {pageNumbers(page, totalPages).map((value, index) => value === "..." ? (
        <span key={`ellipsis-${index}`} aria-hidden="true">…</span>
      ) : (
        <button type="button" key={value} className={value === page ? "active" : ""} aria-current={value === page ? "page" : undefined} onClick={() => onPageChange(value)}>{value}</button>
      ))}
      <button type="button" disabled={!hasNext} onClick={() => onPageChange(page + 1)} aria-label="Next page">Next</button>
    </nav>
  )
}
