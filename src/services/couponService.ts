import type { Cart } from "../types/cart"
import type { CheckoutCoupon, CheckoutError } from "../types/checkout"

type CouponDefinition = {
  code: string
  discountRate: number
  maxDiscount: number
  minimumOrder: number
  expiresAt: string
}

const coupons: CouponDefinition[] = [{
  code: "NOVA10",
  discountRate: 0.1,
  maxDiscount: 500,
  minimumOrder: 500,
  expiresAt: "2099-12-31T23:59:59.000Z",
}]

const error = (code: CheckoutError["code"], message: string, recovery: string): CheckoutError => ({ code, message, recovery, retryable: false })

export const couponService = {
  validateCoupon(cart: Cart, code: string): CheckoutCoupon | CheckoutError {
    const coupon = coupons.find((item) => item.code === code.trim().toUpperCase())
    if (!coupon) return error("COUPON_INVALID", "This coupon is not valid.", "Check the code and try again.")
    if (new Date(coupon.expiresAt).getTime() <= Date.now()) return error("COUPON_EXPIRED", "This coupon has expired.", "Remove it or use another coupon.")
    if (cart.subtotal < coupon.minimumOrder) return error("COUPON_INVALID", `Add items worth ₹${coupon.minimumOrder.toLocaleString("en-IN")} to use this coupon.`, "Add more items or remove the coupon.")
    return { code: coupon.code, discountAmount: Math.min(Math.round(cart.subtotal * coupon.discountRate), coupon.maxDiscount) }
  },
  applyCoupon(cart: Cart, code: string): CheckoutCoupon | CheckoutError {
    return couponService.validateCoupon(cart, code)
  },
  removeCoupon(): undefined {
    return undefined
  },
  getCouponDetails(code: string): CouponDefinition | undefined {
    return coupons.find((item) => item.code === code.trim().toUpperCase())
  },
}
