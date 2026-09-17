import type { Order } from "../types/order"
import type { Shipment } from "../types/postPurchase"

const date = (days: number) => new Date(Date.now() + days * 86400000).toISOString()
export const trackingService = {
  getShipments(order: Order): Shipment[] {
    const status = order.status === "delivered" ? "DELIVERED" : order.status === "shipped" ? "SHIPPED" : "PROCESSING"
    return [{
      id: `shipment-${order.id}`,
      orderId: order.id,
      itemIds: order.items.map((item) => `${item.productId}:${item.variantId ?? "product"}`),
      status,
      trackingId: `TRK${order.id.replace(/\D/g, "").slice(-8).padStart(8, "0")}`,
      carrier: "NOVA Logistics (mock)",
      estimatedDeliveryDate: order.delivery?.estimatedDeliveryDate ?? date(4).slice(0, 10),
      events: [
        { id: "created", label: "Shipment created", description: "The shipment has been prepared.", occurredAt: order.createdAt, completed: true },
        { id: "transit", label: "In transit", description: "The package is moving through the network.", occurredAt: date(-1), completed: status !== "PROCESSING" },
        { id: "delivery", label: "Delivered", description: "Delivery will be confirmed by the mock carrier.", occurredAt: date(0), completed: status === "DELIVERED" },
      ],
    }]
  },
  getTracking(order: Order): Shipment[] {
    return trackingService.getShipments(order)
  },
}
