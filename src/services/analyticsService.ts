export type AnalyticsEvent =
  | "PRODUCT_VIEWED"
  | "SEARCH_PERFORMED"
  | "FILTER_APPLIED"
  | "SORT_CHANGED"
  | "PRODUCT_WISHLISTED"
  | "ADD_TO_CART"
  | "CATEGORY_VIEWED"
  | "BRAND_VIEWED"
  | "LOGIN_STARTED"
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "REGISTRATION_STARTED"
  | "REGISTRATION_SUCCESS"
  | "REGISTRATION_FAILED"
  | "LOGOUT"
  | "WISHLIST_ADDED"
  | "WISHLIST_REMOVED"
  | "CART_ITEM_ADDED"
  | "CART_ITEM_REMOVED"
  | "CART_QUANTITY_CHANGED"
  | "CART_VIEWED"
  | "COUPON_APPLIED"
  | "COUPON_REMOVED"
  | "ADDRESS_ADDED"
  | "ADDRESS_UPDATED"
  | "ADDRESS_DELETED"
  | "PROFILE_UPDATED"
  | "PASSWORD_CHANGED"
  | "SESSION_RESTORED"
  | "LOGOUT_STARTED"
  | "LOGOUT_SUCCESS"
  | "LOGOUT_FAILED"
  | "PROTECTED_ROUTE_REDIRECTED"

export type AnalyticsPayload = {
  PRODUCT_VIEWED: { productId: string }
  SEARCH_PERFORMED: { query: string }
  FILTER_APPLIED: { filter: string }
  SORT_CHANGED: { sort: string }
  PRODUCT_WISHLISTED: { productId: string; added: boolean }
  ADD_TO_CART: { productId: string }
  CATEGORY_VIEWED: { categoryId: string }
  BRAND_VIEWED: { brandId: string }
  LOGIN_STARTED: Record<string, never>
  LOGIN_SUCCESS: { userId: string }
  LOGIN_FAILED: { code: string }
  REGISTRATION_STARTED: Record<string, never>
  REGISTRATION_SUCCESS: { userId: string }
  REGISTRATION_FAILED: { code: string }
  LOGOUT: { userId?: string }
  WISHLIST_ADDED: { productId: string; variantId?: string }
  WISHLIST_REMOVED: { productId: string; variantId?: string }
  CART_ITEM_ADDED: { productId: string; variantId?: string; quantity: number }
  CART_ITEM_REMOVED: { productId: string; variantId?: string }
  CART_QUANTITY_CHANGED: { productId: string; variantId?: string; quantity: number }
  CART_VIEWED: { itemCount: number }
  COUPON_APPLIED: { code: string }
  COUPON_REMOVED: { code: string }
  ADDRESS_ADDED: { addressId: string }
  ADDRESS_UPDATED: { addressId: string }
  ADDRESS_DELETED: { addressId: string }
  PROFILE_UPDATED: { userId: string }
  PASSWORD_CHANGED: { userId: string }
  SESSION_RESTORED: { authenticated: boolean }
  LOGOUT_STARTED: Record<string, never>
  LOGOUT_SUCCESS: Record<string, never>
  LOGOUT_FAILED: { code: string }
  PROTECTED_ROUTE_REDIRECTED: { path: string }
}

export const analytics = {
  track<TEvent extends AnalyticsEvent>(
    _event: TEvent,
    _payload: AnalyticsPayload[TEvent],
  ): void {
    // Intentionally no-op until a first-party analytics provider is selected.
  },
}
