import { storageService } from "./storageService"

type CheckoutTransaction = {
  checkoutSessionId: string
  idempotencyKey: string
  paymentAttemptId?: string
  status: "ACTIVE" | "PROCESSING" | "COMPLETED" | "EXPIRED"
}

const key = "nova-checkout-transaction"

export const checkoutSessionStorage = {
  get(): CheckoutTransaction | undefined {
    return storageService.get<CheckoutTransaction>(key)
  },
  set(value: CheckoutTransaction): boolean {
    return storageService.set(key, value)
  },
  remove(): void {
    storageService.remove(key)
  },
}
