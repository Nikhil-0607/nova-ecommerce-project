import type { SortValue } from "../types/catalog"
import type { Product } from "../types/product"

const score = (product: Product) => product.rating * 20 + product.reviewCount / 100 + (product.badges.length ? 5 : 0)

export const sortProducts = (products: Product[], sort: SortValue): Product[] =>
  [...products].sort((left, right) => {
    switch (sort) {
      case "popularity":
        return score(right) - score(left)
      case "newest":
        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      case "price_asc":
        return left.price - right.price
      case "price_desc":
        return right.price - left.price
      case "rating":
        return right.rating - left.rating || right.reviewCount - left.reviewCount
      case "discount":
        return right.discountPercentage - left.discountPercentage
      case "recommended":
      default:
        return score(right) - score(left)
    }
  })
