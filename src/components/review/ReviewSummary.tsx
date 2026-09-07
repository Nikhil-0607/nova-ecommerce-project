import ProductRating from "../product/ProductRating"
import type { ReviewSummary as ReviewSummaryModel } from "../../types/review"

export default function ReviewSummary({ summary }: { summary: ReviewSummaryModel }) {
  return (
    <div className="review-summary">
      <div className="review-average">
        <strong>{summary.averageRating.toFixed(1)}</strong>
        <ProductRating rating={summary.averageRating} reviewCount={summary.totalReviews} />
      </div>
      <div className="rating-breakdown" aria-label="Rating breakdown">
        {summary.breakdown.map((item) => <div className="rating-breakdown-row" key={item.rating}>
          <span>{item.rating} star</span>
          <span className="rating-bar"><span style={{ width: `${item.percentage}%` }} /></span>
          <small>{item.count}</small>
        </div>)}
      </div>
    </div>
  )
}
