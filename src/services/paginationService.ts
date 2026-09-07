import type { PaginationState } from "../types/catalog"
import type { Product } from "../types/product"

export type PaginatedProducts = PaginationState & {
  products: Product[]
}

export function paginateProducts(products: Product[], page: number, pageSize: number): PaginatedProducts {
  const safePageSize = Math.max(1, pageSize)
  const totalPages = Math.max(1, Math.ceil(products.length / safePageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * safePageSize
  return {
    products: products.slice(start, start + safePageSize),
    page: safePage,
    pageSize: safePageSize,
    total: products.length,
    totalPages,
    hasNext: safePage < totalPages,
    hasPrevious: safePage > 1,
  }
}
