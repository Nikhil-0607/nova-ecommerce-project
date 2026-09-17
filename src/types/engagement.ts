import type { Product } from "./product"

export type MarketingConsent = {
  customerId: string
  email: boolean
  push: boolean
  sms: boolean
  personalizedRecommendations: boolean
  updatedAt: string
}
export type CustomerPreferences = {
  categories: string[]
  brands: string[]
  sizes: string[]
  priceRange?: { min: number; max: number }
}
export type EngagementAlert = {
  id: string
  customerId: string
  productId: string
  type: "PRICE_DROP" | "BACK_IN_STOCK"
  active: boolean
  createdAt: string
}
export type LoyaltyAccount = {
  customerId: string
  points: number
  tier: "BRONZE" | "SILVER" | "GOLD"
  updatedAt: string
}
export type LoyaltyEntry = {
  id: string
  customerId: string
  points: number
  reason: string
  orderId?: string
  createdAt: string
}
export type MembershipPlan = { id: string; name: string; price: number; benefits: string[]; active: boolean }
export type CustomerMembership = { customerId: string; planId: string; status: "ACTIVE" | "PAUSED" | "CANCELLED"; startedAt: string }
export type Campaign = { id: string; name: string; productIds: string[]; status: "DRAFT" | "ACTIVE" | "PAUSED"; audience: string; updatedAt: string }
export type Segment = { id: string; name: string; rule: string; size: number }
export type Journey = { id: string; name: string; trigger: string; status: "DRAFT" | "ACTIVE" | "PAUSED"; segmentId: string }
export type Experiment = { id: string; name: string; placement: string; variants: string[]; status: "DRAFT" | "ACTIVE" | "PAUSED" }
export type RecommendationResult = { products: Product[]; strategy: "PERSONALIZED" | "CATEGORY" | "TRENDING" | "BEST_SELLING"; fallback: boolean }
