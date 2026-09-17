export type ApiErrorCode =
  | "AUTH_INVALID_CREDENTIALS"
  | "AUTH_SESSION_EXPIRED"
  | "VALIDATION_ERROR"
  | "RESOURCE_NOT_FOUND"
  | "PRODUCT_UNAVAILABLE"
  | "OUT_OF_STOCK"
  | "CART_CONFLICT"
  | "COUPON_INVALID"
  | "COUPON_EXPIRED"
  | "RATE_LIMITED"
  | "SERVER_ERROR"
  | "CHECKOUT_EXPIRED"
  | "ADDRESS_UNSERVICEABLE"
  | "DELIVERY_UNAVAILABLE"
  | "PRICE_CHANGED"
  | "INVENTORY_CHANGED"
  | "PAYMENT_FAILED"
  | "PAYMENT_PENDING"
  | "ORDER_CREATION_FAILED"

export type ApiFieldError = {
  field: string
  message: string
}

export type ApiError = {
  code: ApiErrorCode
  message: string
  status: number
  fieldErrors?: ApiFieldError[]
  recoveryAction?: string
  retryable?: boolean
}
