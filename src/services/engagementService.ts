import type { CustomerPreferences, EngagementAlert, LoyaltyAccount, LoyaltyEntry, MarketingConsent } from "../types/engagement"
import { storageService } from "./storageService"

const key = (name: string, customerId: string) => `nova-${name}-${customerId}`
const now = () => new Date().toISOString()
const defaults = (customerId: string): MarketingConsent => ({ customerId, email: true, push: true, sms: false, personalizedRecommendations: true, updatedAt: now() })

export const engagementService = {
  getPreferences(customerId: string): CustomerPreferences { return storageService.get<CustomerPreferences>(key("preferences", customerId)) ?? { categories: [], brands: [], sizes: [] } },
  savePreferences(customerId: string, preferences: CustomerPreferences): CustomerPreferences { const next = { ...preferences, categories: [...new Set(preferences.categories)], brands: [...new Set(preferences.brands)], sizes: [...new Set(preferences.sizes)] }; storageService.set(key("preferences", customerId), next); return next },
  getConsent(customerId: string): MarketingConsent { return storageService.get<MarketingConsent>(key("consent", customerId)) ?? defaults(customerId) },
  saveConsent(customerId: string, updates: Partial<Omit<MarketingConsent, "customerId" | "updatedAt">>): MarketingConsent { const next = { ...engagementService.getConsent(customerId), ...updates, customerId, updatedAt: now() }; storageService.set(key("consent", customerId), next); return next },
  getAlerts(customerId: string): EngagementAlert[] { return storageService.get<EngagementAlert[]>(key("alerts", customerId)) ?? [] },
  upsertAlert(customerId: string, productId: string, type: EngagementAlert["type"]): EngagementAlert { const alerts = engagementService.getAlerts(customerId).filter((alert) => !(alert.productId === productId && alert.type === type)); const alert = { id: `alert-${Date.now()}`, customerId, productId, type, active: true, createdAt: now() } satisfies EngagementAlert; storageService.set(key("alerts", customerId), [...alerts, alert]); return alert },
  getLoyalty(customerId: string): LoyaltyAccount { return storageService.get<LoyaltyAccount>(key("loyalty", customerId)) ?? { customerId, points: 0, tier: "BRONZE", updatedAt: now() } },
  getLoyaltyHistory(customerId: string): LoyaltyEntry[] { return storageService.get<LoyaltyEntry[]>(key("loyalty-history", customerId)) ?? [] },
  recordPoints(customerId: string, points: number, reason: string, orderId?: string): LoyaltyAccount { const account = engagementService.getLoyalty(customerId); const nextPoints = Math.max(0, account.points + points); const tier = nextPoints >= 1000 ? "GOLD" : nextPoints >= 500 ? "SILVER" : "BRONZE"; const entry = { id: `loyalty-${Date.now()}`, customerId, points, reason, ...(orderId ? { orderId } : {}), createdAt: now() } satisfies LoyaltyEntry; storageService.set(key("loyalty-history", customerId), [...engagementService.getLoyaltyHistory(customerId), entry]); const next = { customerId, points: nextPoints, tier, updatedAt: now() } satisfies LoyaltyAccount; storageService.set(key("loyalty", customerId), next); return next },
  reversePoints(customerId: string, points: number, reason: string, orderId?: string): LoyaltyAccount { return engagementService.recordPoints(customerId, -Math.abs(points), reason, orderId) },
}
