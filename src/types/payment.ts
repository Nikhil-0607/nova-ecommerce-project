export type PaymentMethod = "CARD" | "UPI" | "NET_BANKING" | "WALLET" | "COD"
export type PaymentOutcome = "SUCCESS" | "FAILURE" | "PENDING"

export type PaymentMethodOption = {
  id: PaymentMethod
  name: string
  description: string
  available: boolean
}

export type PaymentIntent = {
  id: string
  amount: number
  currency: string
  paymentMethod: PaymentMethod
  idempotencyKey: string
}

export type PaymentResult = {
  outcome: PaymentOutcome
  paymentIntentId: string
  message: string
}
