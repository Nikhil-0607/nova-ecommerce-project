import type { Order } from "../types/order"
import type { SellerOrder } from "../types/seller"
import { inventoryService } from "./inventoryService"

const orders = new Map<string, SellerOrder>()
export const sellerOrderService = {
  splitOrder(order: Order): SellerOrder[] {
    const groups = new Map<string, typeof order.items>()
    order.items.forEach((item) => {
      const sellerId = item.sellerId ?? "seller-demo"
      groups.set(sellerId, [...(groups.get(sellerId) ?? []), item])
    })
    return [...groups.entries()].map(([sellerId, items]) => {
      const itemIds = items.map((item) => `${item.productId}:${item.variantId ?? "product"}`)
      const sellerOrder: SellerOrder = {
        id: `seller-order-${order.id}-${sellerId}`,
        orderId: order.id,
        sellerId,
        itemIds,
        lines: items.map((item) => ({ itemId: `${item.productId}:${item.variantId ?? "product"}`, sku: item.sku, quantity: item.quantity })),
        status: "UNALLOCATED",
        warehouseId: "warehouse-main",
        total: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
        createdAt: order.createdAt,
      }
      orders.set(sellerOrder.id, sellerOrder)
      return sellerOrder
    })
  },
  getSellerOrders(sellerId: string): SellerOrder[] { return [...orders.values()].filter((order) => order.sellerId === sellerId) },
  transition(id: string, sellerId: string, next: SellerOrder["status"]): SellerOrder {
    const current = orders.get(id)
    if (!current || current.sellerId !== sellerId) throw new Error("Seller order access denied")
    const allowed: Record<SellerOrder["status"], SellerOrder["status"][]> = { UNALLOCATED: ["RESERVED"], RESERVED: ["PICKED"], PICKED: ["PACKED"], PACKED: ["SHIPPED"], SHIPPED: ["DELIVERED"], DELIVERED: ["RETURN_REQUESTED"], RETURN_REQUESTED: ["RETURNED"], RETURNED: [] }
    if (!allowed[current.status].includes(next)) throw new Error(`Invalid fulfillment transition: ${current.status} to ${next}`)
    const updated = { ...current, status: next }
    orders.set(id, updated)
    return updated
  },
  reserveOrder(order: SellerOrder): SellerOrder {
    order.lines.forEach((line) => inventoryService.reserve(line.sku, order.sellerId, line.quantity))
    return sellerOrderService.transition(order.id, order.sellerId, "RESERVED")
  },
}
