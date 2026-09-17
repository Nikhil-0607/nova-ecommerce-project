import type { Product } from "../types/product"
import type { RecommendationResult } from "../types/engagement"
import { productService } from "./productService"
import { recommendationService } from "./recommendationService"
import { engagementService } from "./engagementService"

export const personalizationService = {
  async getRecommendations(customerId: string | undefined, contextProductId?: string, categoryId?: string, limit = 4): Promise<RecommendationResult> {
    try {
      if (customerId && !engagementService.getConsent(customerId).personalizedRecommendations) throw new Error("Personalization opted out")
      if (contextProductId) {
        const products = await recommendationService.getSimilarProducts(contextProductId, limit)
        if (products.length) return { products, strategy: "PERSONALIZED", fallback: false }
      }
      if (categoryId) {
        const products = await recommendationService.getCategoryRecommendations(categoryId, limit)
        if (products.length) return { products, strategy: "CATEGORY", fallback: true }
      }
      const products: Product[] = (await productService.getAll()).sort((left, right) => right.rating - left.rating || left.id.localeCompare(right.id)).slice(0, limit)
      return { products, strategy: "BEST_SELLING", fallback: true }
    } catch {
      return { products: [], strategy: "TRENDING", fallback: true }
    }
  },
}
