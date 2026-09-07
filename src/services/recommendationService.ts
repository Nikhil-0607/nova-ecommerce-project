import { productService } from "./productService"
import type { Product } from "../types/product"

const wait = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

const sharedTagCount = (left: Product, right: Product) =>
  right.tags.filter((tag) => left.tags.includes(tag)).length

const priceDistance = (left: Product, right: Product) =>
  Math.abs(left.price - right.price) / Math.max(left.price, 1)

const rankSimilar = (source: Product, candidates: Product[]): Product[] =>
  candidates
    .filter((candidate) => candidate.id !== source.id)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.subcategory === source.subcategory ? 8 : 0) +
        (candidate.brandId === source.brandId ? 3 : 0) +
        sharedTagCount(source, candidate) * 2 +
        (priceDistance(source, candidate) < 0.35 ? 2 : 0) +
        candidate.rating / 10,
    }))
    .sort((left, right) => right.score - left.score || left.candidate.id.localeCompare(right.candidate.id))
    .map(({ candidate }) => candidate)

export const recommendationService = {
  async getSimilarProducts(productId: string, limit = 4): Promise<Product[]> {
    await wait()
    const source = await productService.getProductById(productId)
    if (!source) return []
    const candidates = await productService.getProducts({ categoryId: source.categoryId })
    return rankSimilar(source, candidates).slice(0, limit)
  },

  async getRecommendedProducts(productId: string, limit = 4): Promise<Product[]> {
    await wait()
    const source = await productService.getProductById(productId)
    if (!source) return []
    const candidates = await productService.getProducts({ categoryId: source.categoryId })
    return candidates
      .filter((candidate) => candidate.id !== source.id)
      .sort((left, right) =>
        right.rating - left.rating ||
        right.reviewCount - left.reviewCount ||
        left.id.localeCompare(right.id),
      )
      .slice(0, limit)
  },

  async getCategoryRecommendations(categoryId: string, limit = 4): Promise<Product[]> {
    await wait()
    const candidates = await productService.getProducts({ categoryId })
    return [...candidates]
      .sort((left, right) =>
        right.rating - left.rating ||
        right.reviewCount - left.reviewCount ||
        left.id.localeCompare(right.id),
      )
      .slice(0, limit)
  },
}
