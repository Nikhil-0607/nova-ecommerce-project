type ProductBadgeProps = {
  badge?: string
}

const supportedBadges = new Set([
  "NEW",
  "BESTSELLER",
  "TRENDING",
  "EXCLUSIVE",
  "LIMITED",
  "SALE",
  "TOP RATED",
])

export default function ProductBadge({ badge }: ProductBadgeProps) {
  if (!badge || !supportedBadges.has(badge.toUpperCase())) return null

  return <span className={`badge badge-${badge.toLowerCase().replaceAll(" ", "-")}`}>{badge}</span>
}
