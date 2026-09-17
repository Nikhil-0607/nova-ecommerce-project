export type FulfillmentStatus =
  | "PLACED" | "PAYMENT_CONFIRMED" | "PROCESSING" | "PACKED" | "SHIPPED"
  | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED" | "PARTIALLY_DELIVERED"
  | "FAILED_DELIVERY" | "COMPLETED"

export type ShipmentStatus = "PROCESSING" | "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED" | "FAILED_DELIVERY"
export type ShipmentEvent = { id: string; label: string; description: string; occurredAt: string; completed: boolean }
export type Shipment = {
  id: string
  orderId: string
  itemIds: string[]
  status: ShipmentStatus
  trackingId: string
  carrier: string
  estimatedDeliveryDate: string
  events: ShipmentEvent[]
}

export type PostPurchaseStatus =
  | "REQUESTED" | "APPROVED" | "PICKUP_SCHEDULED" | "PICKED_UP" | "RECEIVED"
  | "REFUND_INITIATED" | "REFUNDED" | "REJECTED"

export type ReturnRequest = {
  id: string
  orderId: string
  itemIds: string[]
  reason: string
  pickupSlot: string
  refundMethod: string
  refundAmount: number
  status: PostPurchaseStatus
  createdAt: string
}

export type ExchangeRequest = {
  id: string
  orderId: string
  itemId: string
  reason: string
  replacementVariant: string
  pickupSlot: string
  status: PostPurchaseStatus
  createdAt: string
}

export type Refund = {
  id: string
  orderId: string
  amount: number
  method: string
  status: "REFUND_PENDING" | "REFUND_INITIATED" | "REFUND_PROCESSING" | "REFUNDED" | "REFUND_FAILED"
  reference: string
  createdAt: string
  expectedDate: string
}

export type Invoice = {
  id: string
  orderId: string
  invoiceNumber: string
  issuedAt: string
}

export type SupportTicket = {
  id: string
  orderId: string
  category: string
  description: string
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED"
  createdAt: string
  updatedAt: string
}

export type Notification = {
  id: string
  title: string
  message: string
  href: string
  read: boolean
  createdAt: string
}
