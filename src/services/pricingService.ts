import type { Cart } from "../types/cart"
import type { CheckoutCoupon, CheckoutPricing } from "../types/checkout"

export type AuthoritativePricing = CheckoutPricing & {
  pricingVersion: string
  validatedAt: string
}

export const pricingService = {
  estimate(cart: Cart, deliveryFee = 0, coupon?: CheckoutCoupon): CheckoutPricing {
    const totalMRP = cart.items.reduce((sum, item) => sum + item.mrp * item.quantity, 0)
    const productDiscount = cart.items.reduce((sum, item) => sum + item.discountAmount * item.quantity, 0)
    const couponDiscount = coupon?.discountAmount ?? 0
    return {
      totalMRP,
      productDiscount,
      couponDiscount,
      deliveryFee,
      tax: 0,
      convenienceFee: 0,
      total: Math.max(0, cart.subtotal - couponDiscount + deliveryFee),
      currency: cart.currency,
    }
  },
  validateEstimate(estimate: CheckoutPricing): AuthoritativePricing {
    return { ...estimate, pricingVersion: "mock-v1", validatedAt: new Date().toISOString() }
  },
}
