import { useEffect, useState } from "react"
import { reviewService } from "../../services/reviewService"
import type { ReviewSort, ReviewSummary } from "../../types/review"
import ReviewList from "./ReviewList"
import ReviewSummaryComponent from "./ReviewSummary"
import Skeleton from "../common/Skeleton"

export default function ProductReviews({ productId }: { productId: string }) {
  const [summary, setSummary] = useState<ReviewSummary>()
  const [reviews, setReviews] = useState<Awaited<ReturnType<typeof reviewService.getProductReviews>>["reviews"]>([])
  const [sort, setSort] = useState<ReviewSort>("newest")
  const [rating, setRating] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)
    void Promise.all([
      reviewService.getReviewSummary(productId),
      reviewService.getProductReviews(productId, { sort, rating: rating ? Number(rating) as 1 | 2 | 3 | 4 | 5 : undefined, page, pageSize: 5 }),
    ]).then(([nextSummary, result]) => {
      if (active) {
        setSummary(nextSummary)
        setReviews(result.reviews)
        setTotalPages(result.totalPages)
      }
    }).catch(() => {
      if (active) setError(true)
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [page, productId, rating, sort])

  const setReviewSort = (nextSort: ReviewSort) => { setSort(nextSort); setPage(1) }
  const setReviewRating = (nextRating: string) => { setRating(nextRating); setPage(1) }

  return <section className="reviews-section" aria-labelledby="reviews-title">
    <h2 id="reviews-title">Customer reviews</h2>
    {loading && <div className="review-loading"><Skeleton className="skeleton-line" /><Skeleton className="skeleton-line" /><Skeleton className="skeleton-line" /></div>}
    {!loading && error && <div className="empty" role="alert"><h3>Reviews unavailable</h3><p>We couldn't load reviews right now. Please try again later.</p></div>}
    {!loading && !error && summary && summary.totalReviews === 0 && <div className="empty"><h3>No reviews yet</h3><p>Be the first to share your experience.</p></div>}
    {!loading && !error && summary && summary.totalReviews > 0 && <>
      <ReviewSummaryComponent summary={summary} />
      <div className="review-controls">
        <label>Filter by rating<select value={rating} onChange={(event) => setReviewRating(event.target.value)}><option value="">All ratings</option><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select></label>
        <label>Sort reviews<select value={sort} onChange={(event) => setReviewSort(event.target.value as ReviewSort)}><option value="newest">Newest</option><option value="highest_rating">Highest rating</option><option value="lowest_rating">Lowest rating</option><option value="helpful">Most helpful</option></select></label>
      </div>
      {reviews.length > 0 ? <ReviewList reviews={reviews} /> : <div className="empty"><p>No reviews match this rating.</p></div>}
      {totalPages > 1 && <nav className="review-pagination" aria-label="Review pages"><button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button><span>Page {page} of {totalPages}</span><button type="button" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>Next</button></nav>}
    </>}
  </section>
}
