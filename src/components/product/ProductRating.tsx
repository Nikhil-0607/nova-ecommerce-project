type ProductRatingProps = {
  rating: number
  reviewCount: number
}

export default function ProductRating({ rating, reviewCount }: ProductRatingProps) {
  return (
    <div className="rating" aria-label={`${rating} out of 5 stars from ${reviewCount} reviews`}>
      <span className="rating-value">★ {rating.toFixed(1)}</span>
      <span className="review-count">| {reviewCount} reviews</span>
    </div>
  )
}
