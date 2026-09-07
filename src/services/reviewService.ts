import { reviews } from "../mock/reviews"
import type { PaginatedReviews, RatingBreakdown, Review, ReviewQuery, ReviewSummary } from "../types/review"

const wait = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

const matchingReviews = (productId: string, query: ReviewQuery = {}) =>
  reviews.filter((review) => review.productId === productId && (!query.rating || review.rating === query.rating))

export const reviewService = {
  async getProductReviews(productId: string, query: ReviewQuery = {}): Promise<PaginatedReviews> {
    await wait()
    const pageSize = Math.max(1, query.pageSize ?? 5)
    const page = Math.max(1, query.page ?? 1)
    const sorted = [...matchingReviews(productId, query)].sort((left, right) => {
      if (query.sort === "highest_rating") return right.rating - left.rating
      if (query.sort === "lowest_rating") return left.rating - right.rating
      if (query.sort === "helpful") return right.helpfulCount - left.helpfulCount
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    })
    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
    const safePage = Math.min(page, totalPages)
    const start = (safePage - 1) * pageSize
    return {
      reviews: sorted.slice(start, start + pageSize),
      page: safePage,
      pageSize,
      total: sorted.length,
      totalPages,
      hasNext: safePage < totalPages,
      hasPrevious: safePage > 1,
    }
  },
  async getReviewSummary(productId: string): Promise<ReviewSummary> {
    await wait()
    const productReviews = matchingReviews(productId)
    const totalReviews = productReviews.length
    const breakdown: RatingBreakdown[] = ([5, 4, 3, 2, 1] as const).map((rating) => {
      const count = productReviews.filter((review) => review.rating === rating).length
      return { rating, count, percentage: totalReviews ? Math.round((count / totalReviews) * 100) : 0 }
    })
    const averageRating = totalReviews
      ? Number((productReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1))
      : 0
    return { averageRating, totalReviews, breakdown }
  },
  async getRatingBreakdown(productId: string): Promise<RatingBreakdown[]> {
    const summary = await this.getReviewSummary(productId)
    return summary.breakdown
  },
}
