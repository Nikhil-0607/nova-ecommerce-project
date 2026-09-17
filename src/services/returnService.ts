import type { Order } from "../types/order"
import type { ReturnRequest } from "../types/postPurchase"

const slots = ["12 Sep · 10 AM – 1 PM", "13 Sep · 2 PM – 5 PM", "14 Sep · 10 AM – 1 PM"]
export const returnService = {
  getPickupSlots(): string[] { return slots },
  checkEligibility(order: Order, itemIds: string[]): { eligible: boolean; message: string } {
    if (order.status !== "delivered") return { eligible: false, message: "Only delivered items are eligible for return." }
    if (!itemIds.length) return { eligible: false, message: "Select at least one item." }
    return { eligible: true, message: "Items are provisionally eligible within the return window." }
  },
  createReturn(order: Order, itemIds: string[], reason: string, pickupSlot: string, refundMethod: string): ReturnRequest {
    const amount = order.items.filter((item) => itemIds.includes(`${item.productId}:${item.variantId ?? "product"}`)).reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    return { id: `RET-${Date.now()}`, orderId: order.id, itemIds, reason, pickupSlot, refundMethod, refundAmount: amount, status: "REQUESTED", createdAt: new Date().toISOString() }
  },
}
