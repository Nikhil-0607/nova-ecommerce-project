import type { Product } from "./product"

export type RecommendationType = "similar" | "recommended" | "category"

export type RecommendationResult = {
  type: RecommendationType
  title: string
  subtitle?: string
  products: Product[]
  sourceProductId?: string
  sourceCategoryId?: string
}
