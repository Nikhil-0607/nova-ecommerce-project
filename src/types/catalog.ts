import type { StockStatus } from "./product"

export type NumericRange = {
  min?: number
  max?: number
}

export type ProductFilterParams = {
  category?: string
  brand: string[]
  price?: NumericRange
  discount?: number
  color: string[]
  size: string[]
  rating?: number
  availability: StockStatus[]
  fit: string[]
  material: string[]
  pattern: string[]
  occasion: string[]
}

export type MultiSelectFilterKey = "brand" | "color" | "size" | "availability" | "fit" | "material" | "pattern" | "occasion"
export type FilterKey = MultiSelectFilterKey

export type SortValue = "recommended" | "popularity" | "newest" | "price_asc" | "price_desc" | "rating" | "discount"

export type SortOption = {
  value: SortValue
  label: string
}

export type PaginationState = {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  cursor?: string
  nextCursor?: string
}

export type SearchSuggestionType = "product" | "category" | "brand" | "recent" | "trending"

export type SearchQuery = {
  query: string
  limit?: number
}

export type SearchSuggestion = {
  id: string
  label: string
  type: SearchSuggestionType
  subtitle?: string
  productId?: string
  route?: string
}

export type SearchSuggestionGroup = {
  type: SearchSuggestionType
  label: string
  suggestions: SearchSuggestion[]
}

export type RecentSearch = {
  query: string
  searchedAt: string
}

export type TrendingSearch = {
  query: string
  label: string
}
