import type { Order } from "../types/order"
import type { ExchangeRequest } from "../types/postPurchase"

export const exchangeService = {
  checkEligibility(order: Order, itemId: string): boolean {
    return order.status === "delivered" && order.items.some((item) => `${item.productId}:${item.variantId ?? "product"}` === itemId)
  },
  getOptions(): string[] { return ["Replacement size S", "Replacement size M", "Replacement size L", "Replacement size XL"] },
  createExchange(order: Order, itemId: string, reason: string, replacementVariant: string, pickupSlot: string): ExchangeRequest {
    return { id: `EXC-${Date.now()}`, orderId: order.id, itemId, reason, replacementVariant, pickupSlot, status: "REQUESTED", createdAt: new Date().toISOString() }
  },
}
