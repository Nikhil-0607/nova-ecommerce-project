import type { StockStatus } from "./product"

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"

export type OrderItem = {
  readonly productId: string
  readonly variantId?: string
  readonly sku: string
  readonly productName: string
  readonly brandName: string
  readonly image: string
  readonly size?: string
  readonly color?: string
  readonly quantity: number
  readonly unitPrice: number
  readonly mrp: number
  readonly discountAmount: number
  readonly stockStatus?: StockStatus
}

export type OrderAddressSnapshot = {
  readonly fullName: string
  readonly phone: string
  readonly addressLine1: string
  readonly addressLine2?: string
  readonly landmark?: string
  readonly city: string
  readonly state: string
  readonly postalCode: string
  readonly country: string
  readonly addressType?: string
}

export type OrderTotals = {
  readonly subtotal: number
  readonly discount: number
  readonly deliveryFee: number
  readonly tax: number
  readonly total: number
  readonly currency: string
}

export type OrderDeliveryMetadata = {
  readonly estimatedDeliveryDate?: string
  readonly shippedAt?: string
  readonly deliveredAt?: string
  readonly trackingReference?: string
}

export type OrderPaymentMetadata = {
  readonly method?: string
  readonly providerReference?: string
}

export type Order = OrderTotals & {
  readonly id: string
  readonly orderNumber: string
  readonly userId: string
  readonly status: OrderStatus
  readonly paymentStatus: PaymentStatus
  readonly items: readonly OrderItem[]
  readonly shippingAddress: OrderAddressSnapshot
  readonly createdAt: string
  readonly updatedAt: string
  readonly delivery?: OrderDeliveryMetadata
  readonly payment?: OrderPaymentMetadata
}
