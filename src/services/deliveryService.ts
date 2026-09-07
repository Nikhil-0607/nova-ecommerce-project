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
}
