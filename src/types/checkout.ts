import type { Address } from "./address"
import type { Cart, CartItem } from "./cart"
import type { Order } from "./order"
import type { PaymentMethodOption } from "./payment"

export type CheckoutStep = "ADDRESS" | "DELIVERY" | "REVIEW" | "PAYMENT" | "PROCESSING" | "SUCCESS"
export type CheckoutStatus = "IDLE" | "LOADING" | "READY" | "ERROR"
export type CheckoutSessionStatus = "ACTIVE" | "PROCESSING" | "COMPLETED" | "EXPIRED"

export type CheckoutErrorCode =
  | "CART_CHANGED"
  | "PRICE_CHANGED"
  | "INVENTORY_CHANGED"
  | "ADDRESS_UNSERVICEABLE"
  | "DELIVERY_UNAVAILABLE"
  | "COUPON_INVALID"
  | "COUPON_EXPIRED"
  | "CHECKOUT_EXPIRED"
  | "VALIDATION_ERROR"

export type CheckoutError = {
  code: CheckoutErrorCode
  message: string
  recovery: string
  retryable?: boolean
}

export type DeliveryOption = {
  id: string
  name: string
  description: string
  fee: number
  estimatedDeliveryDate: string
  available: boolean
}

export type CheckoutPricing = {
  totalMRP: number
  productDiscount: number
  couponDiscount: number
  deliveryFee: number
  tax: number
  convenienceFee: number
  total: number
  currency: string
  pricingVersion?: string
  validatedAt?: string
}

export type CheckoutCoupon = {
  code: string
  discountAmount: number
}

export type CheckoutState = {
  cart: Cart
  cartItems: CartItem[]
  addresses: Address[]
  selectedAddressId: string
  deliveryOptions: DeliveryOption[]
  selectedDeliveryOptionId: string
  pricing: CheckoutPricing
  coupon?: CheckoutCoupon
  paymentMethod?: import("./payment").PaymentMethod
  paymentMethods: PaymentMethodOption[]
  currentStep: CheckoutStep
  status: CheckoutStatus
  sessionStatus: CheckoutSessionStatus
  checkoutSessionId: string
  idempotencyKey: string
  error?: CheckoutError
  order?: Order
}
