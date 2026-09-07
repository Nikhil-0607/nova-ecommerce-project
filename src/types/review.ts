export type ReviewSort = "newest" | "highest_rating" | "lowest_rating" | "helpful"

export type Review = {
  id: string
  productId: string
  rating: 1 | 2 | 3 | 4 | 5
  title: string
  body: string
  reviewerName: string
  verifiedPurchase: boolean
  helpfulCount: number
  createdAt: string
  images?: string[]
}

export type RatingBreakdown = {
  rating: 1 | 2 | 3 | 4 | 5
  count: number
  percentage: number
}

export type ReviewSummary = {
  averageRating: number
  totalReviews: number
  breakdown: RatingBreakdown[]
}

export type ReviewQuery = {
  rating?: 1 | 2 | 3 | 4 | 5
  sort?: ReviewSort
  page?: number
  pageSize?: number
}

export type PaginatedReviews = {
  reviews: Review[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}
