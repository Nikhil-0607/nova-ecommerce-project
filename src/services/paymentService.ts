import type { PaymentIntent, PaymentMethod, PaymentMethodOption, PaymentResult } from "../types/payment"
import type { ApiError } from "../types/api"
import { featureFlags } from "../types/featureFlags"

const wait = (ms = 240) => new Promise((resolve) => setTimeout(resolve, ms))

const methods: PaymentMethodOption[] = [
  { id: "CARD", name: "Card", description: "Demo card payment", available: true },
  { id: "UPI", name: "UPI", description: "Demo UPI payment", available: true },
  { id: "NET_BANKING", name: "Net banking", description: "Demo bank payment", available: true },
  { id: "WALLET", name: "Wallet", description: "Demo wallet payment", available: true },
  { id: "COD", name: "Cash on delivery", description: "Pay at delivery", available: true },
]

export const paymentService = {
  async getPaymentMethods(): Promise<PaymentMethodOption[]> {
    await wait()
    return methods.map((method) => ({
      ...method,
      available: method.id === "COD" ? featureFlags.enableCOD : method.id === "UPI" ? featureFlags.enableUPI : method.id === "WALLET" ? featureFlags.enableWallet : method.available,
    }))
  },
  async createPaymentIntent(amount: number, currency: string, paymentMethod: PaymentMethod, idempotencyKey: string): Promise<PaymentIntent> {
    await wait()
    return { id: `pay-${Date.now()}`, amount, currency, paymentMethod, idempotencyKey }
  },
  async processPayment(intent: PaymentIntent): Promise<PaymentResult> {
    await wait()
    const outcome: PaymentResult["outcome"] = intent.idempotencyKey.includes("test-failure")
      ? "FAILURE"
      : intent.idempotencyKey.includes("test-pending") ? "PENDING" : "SUCCESS"
    return {
      outcome,
      paymentIntentId: intent.id,
      message: outcome === "SUCCESS" ? "Demo payment approved." : outcome === "PENDING" ? "Demo payment is being verified." : "Demo payment was declined.",
    }
  },
  async verifyPayment(result: PaymentResult): Promise<PaymentResult> {
    await wait(160)
    return result
  },
  async getPaymentStatus(paymentIntentId: string): Promise<PaymentResult> {
    await wait(160)
    return { outcome: "SUCCESS", paymentIntentId, message: "Demo payment verified." }
  },
  toError(result: PaymentResult): ApiError {
    return {
      code: result.outcome === "PENDING" ? "PAYMENT_PENDING" : "PAYMENT_FAILED",
      message: result.message,
      status: result.outcome === "PENDING" ? 202 : 402,
      recoveryAction: result.outcome === "PENDING" ? "Check payment status before retrying." : "Try another payment method.",
      retryable: result.outcome === "FAILURE",
    }
  },
}
