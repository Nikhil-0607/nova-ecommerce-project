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

export type ApiFieldError = {
  field: string
  message: string
}

export type ApiError = {
  code: ApiErrorCode
  message: string
  status: number
  fieldErrors?: ApiFieldError[]
}
