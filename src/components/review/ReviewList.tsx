import type { Review } from "../../types/review"

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  return <div className="review-list">
    {reviews.map((review) => <article className="review-item" key={review.id}>
      <div className="review-item-head">
        <div><strong>{review.reviewerName}</strong>{review.verifiedPurchase && <span className="verified-review">Verified purchase</span>}</div>
        <time dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString()}</time>
      </div>
      <div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
      <h3>{review.title}</h3>
      <p>{review.body}</p>
      <small className="helpful-count">{review.helpfulCount} people found this helpful</small>
    </article>)}
  </div>
}
