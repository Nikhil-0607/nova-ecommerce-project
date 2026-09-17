import type { CustomerMembership, MembershipPlan } from "../types/engagement"
import { storageService } from "./storageService"

const plans: MembershipPlan[] = [
  { id: "nova-core", name: "NOVA Core", price: 999, benefits: ["Early access", "Free standard delivery"], active: true },
  { id: "nova-plus", name: "NOVA Plus", price: 1999, benefits: ["Priority delivery", "Member-only offers"], active: true },
]
export const membershipService = {
  getPlans(): MembershipPlan[] { return plans },
  getMembership(customerId: string): CustomerMembership | undefined { return storageService.get<CustomerMembership>(`nova-membership-${customerId}`) },
  join(customerId: string, planId: string): CustomerMembership {
    if (!plans.some((plan) => plan.id === planId && plan.active)) throw new Error("Membership plan unavailable")
    const membership = { customerId, planId, status: "ACTIVE" as const, startedAt: new Date().toISOString() }
    storageService.set(`nova-membership-${customerId}`, membership)
    return membership
  },
}
