import type { Review } from "../types/review"

const names = ["Mira Shah", "Arjun Mehta", "Sana Kapoor", "Dev Malhotra", "Ira Nair", "Kabir Rao"]
const content = [
  ["Beautiful quality", "The fabric feels considered and the fit is exactly as described. It has quickly become a wardrobe favourite."],
  ["A great everyday piece", "Comfortable, well made and easy to style. Delivery was quick and the packaging was neat."],
  ["Really impressed", "The colour is accurate to the images and the construction feels premium for the price."],
  ["Good, with a small caveat", "Lovely product overall. I would recommend checking the measurements before choosing your size."],
  ["Would buy again", "A versatile piece that looks polished without sacrificing comfort. Very happy with this purchase."],
]

const productIds = [
  "nv-men-001", "nv-men-002", "nv-women-001", "nv-women-002",
  "nv-kids-001", "nv-home-001", "nv-beauty-001", "nv-footwear-001",
  "nv-accessories-001", "nv-sports-001",
]

export const reviews: Review[] = productIds.flatMap((productId, productIndex) =>
  content.map(([title, body], reviewIndex) => ({
    id: `review-${productIndex + 1}-${reviewIndex + 1}`,
    productId,
    rating: ([5, 4, 5, 3, 4, 5] as const)[(productIndex + reviewIndex) % 6],
    title,
    body,
    reviewerName: names[(productIndex + reviewIndex) % names.length],
    verifiedPurchase: reviewIndex % 3 !== 2,
    helpfulCount: 4 + ((productIndex * 7 + reviewIndex * 3) % 28),
    createdAt: `2026-0${(reviewIndex % 8) + 1}-${String(((productIndex + reviewIndex) % 24) + 1).padStart(2, "0")}T10:00:00.000Z`,
  })),
)
