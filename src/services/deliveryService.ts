import type { CartItem } from "../types/cart"
import type { DeliveryOption } from "../types/checkout"
import { featureFlags } from "../types/featureFlags"

export type DeliveryCheckResult = {
  available: boolean
  message: string
  estimatedDays?: number
}

const wait = (ms = 320) => new Promise((resolve) => setTimeout(resolve, ms))

export const deliveryService = {
  async checkDeliveryAvailability(postalCode: string, productId: string): Promise<DeliveryCheckResult> {
    await wait()
    if (!/^\d{6}$/.test(postalCode)) throw new Error("Enter a valid 6-digit PIN code.")
    const available = !postalCode.startsWith("9") && productId.length > 0
    return available
      ? { available: true, message: "Delivery available to this PIN code.", estimatedDays: 4 }
      : { available: false, message: "Delivery is not currently available to this PIN code." }
  },
  async checkEligibility(postalCode: string, items: CartItem[]): Promise<{ available: boolean; message: string }> {
    await wait()
    if (!/^\d{6}$/.test(postalCode)) return { available: false, message: "Enter a valid 6-digit PIN code." }
    if (items.length === 0) return { available: false, message: "Your bag is empty." }
    if (postalCode.startsWith("9") || items.some((item) => item.stockStatus === "out-of-stock")) {
      return { available: false, message: "Delivery is not available for this bag and PIN code." }
    }
    return { available: true, message: "Delivery is available." }
  },
  async getDeliveryOptions(postalCode: string, items: CartItem[]): Promise<DeliveryOption[]> {
    const eligibility = await deliveryService.checkEligibility(postalCode, items)
    const standardDate = new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10)
    const expressDate = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)
    return [
      { id: "standard", name: "Standard delivery", description: eligibility.message, fee: 0, estimatedDeliveryDate: standardDate, available: eligibility.available },
      { id: "express", name: "Express delivery", description: "Faster delivery to your selected address.", fee: 99, estimatedDeliveryDate: expressDate, available: eligibility.available && featureFlags.enableExpressDelivery },
    ]
  },
}
