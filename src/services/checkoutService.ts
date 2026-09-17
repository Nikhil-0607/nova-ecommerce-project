import type { Address } from "../types/address"
import type { Cart } from "../types/cart"
import type { CheckoutCoupon, CheckoutError, CheckoutPricing } from "../types/checkout"
import { deliveryService } from "./deliveryService"
import { couponService } from "./couponService"
import { pricingService } from "./pricingService"

const makeError = (code: CheckoutError["code"], message: string, recovery: string): CheckoutError => ({ code, message, recovery, retryable: false })

export const checkoutService = {
  validateCart(cart: Cart): CheckoutError | undefined {
    if (cart.items.length === 0) return makeError("VALIDATION_ERROR", "Your bag is empty.", "Return to your bag and add an item.")
    if (cart.items.some((item) => item.quantity < 1 || !Number.isInteger(item.quantity))) return makeError("INVENTORY_CHANGED", "One or more quantities are no longer valid.", "Review your bag before continuing.")
    if (cart.items.some((item) => item.stockStatus === "out-of-stock" || item.availableQuantity === 0)) return makeError("INVENTORY_CHANGED", "An item in your bag is unavailable.", "Review your bag for the latest availability.")
    return undefined
  },
  calculatePricing(cart: Cart, deliveryFee = 0, coupon?: CheckoutCoupon): CheckoutPricing {
    return pricingService.estimate(cart, deliveryFee, coupon)
  },
  applyCoupon(cart: Cart, code: string): CheckoutCoupon | CheckoutError {
    return couponService.applyCoupon(cart, code)
  },
  async validateAddress(address: Address, cart: Cart): Promise<CheckoutError | undefined> {
    const result = await deliveryService.checkEligibility(address.postalCode, cart.items)
    return result.available ? undefined : makeError("ADDRESS_UNSERVICEABLE", result.message, "Choose another saved address.")
  },
}
