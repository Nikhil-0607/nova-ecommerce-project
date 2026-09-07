import type { StockStatus } from "./product"

export type CartItem = {
  id: string
  productId: string
  variantId?: string
  sku: string
  productName: string
  brandName: string
  image: string
  size?: string
  color?: string
  quantity: number
  unitPrice: number
  mrp: number
  discountAmount: number
  stockStatus: StockStatus
  maxQuantity?: number
  priceCapturedAt?: string
  availableQuantity?: number
}

export type CartCoupon = {
  code: string
  discountAmount: number
}

export type Cart = {
  id: string
  userId?: string
  items: CartItem[]
  subtotal: number
  discount: number
  deliveryFee: number
  tax: number
  total: number
  currency: string
  coupon?: CartCoupon
  createdAt: string
  updatedAt: string
}
