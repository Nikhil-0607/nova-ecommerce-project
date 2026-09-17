import type { Order } from "../types/order"
import type { Refund } from "../types/postPurchase"

export const refundService = {
  getRefund(order: Order): Refund {
    return { id: `REF-${order.id}`, orderId: order.id, amount: order.total, method: order.payment?.method ?? "Original payment method", status: order.paymentStatus === "refunded" ? "REFUNDED" : "REFUND_PENDING", reference: `MOCK-${order.id.slice(-8)}`, createdAt: order.updatedAt, expectedDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10) }
  },
}
