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
  | "ACCOUNT_VIEWED"
  | "PROFILE_UPDATE_STARTED"
  | "PROFILE_UPDATE_SUCCESS"
  | "PROFILE_UPDATE_FAILED"
  | "ADDRESS_LIST_VIEWED"
  | "ADDRESS_ADD_STARTED"
  | "ADDRESS_ADD_SUCCESS"
  | "ADDRESS_ADD_FAILED"
  | "ADDRESS_EDIT_STARTED"
  | "ADDRESS_EDIT_SUCCESS"
  | "ADDRESS_EDIT_FAILED"
  | "ADDRESS_DELETE_STARTED"
  | "ADDRESS_DELETE_SUCCESS"
  | "ADDRESS_DELETE_FAILED"
  | "ADDRESS_DEFAULT_SET"
  | "WISHLIST_VIEWED"
  | "WISHLIST_ITEM_ADDED"
  | "WISHLIST_ITEM_REMOVED"
  | "WISHLIST_CLEARED"
  | "WISHLIST_MERGED"
  | "WISHLIST_MERGE_FAILED"

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
  ACCOUNT_VIEWED: Record<string, never>
  PROFILE_UPDATE_STARTED: Record<string, never>
  PROFILE_UPDATE_SUCCESS: { userId: string }
  PROFILE_UPDATE_FAILED: { code: string }
  ADDRESS_LIST_VIEWED: Record<string, never>
  ADDRESS_ADD_STARTED: Record<string, never>
  ADDRESS_ADD_SUCCESS: { addressId: string }
  ADDRESS_ADD_FAILED: { code: string }
  ADDRESS_EDIT_STARTED: { addressId: string }
  ADDRESS_EDIT_SUCCESS: { addressId: string }
  ADDRESS_EDIT_FAILED: { addressId: string; code: string }
  ADDRESS_DELETE_STARTED: { addressId: string }
  ADDRESS_DELETE_SUCCESS: { addressId: string }
  ADDRESS_DELETE_FAILED: { addressId: string; code: string }
  ADDRESS_DEFAULT_SET: { addressId: string }
  WISHLIST_VIEWED: Record<string, never>
  WISHLIST_ITEM_ADDED: { productId: string; variantId?: string }
  WISHLIST_ITEM_REMOVED: { productId: string; variantId?: string }
  WISHLIST_CLEARED: Record<string, never>
  WISHLIST_MERGED: { itemCount: number }
  WISHLIST_MERGE_FAILED: { code: string }
}

export const analytics = {
  track<TEvent extends AnalyticsEvent>(
    _event: TEvent,
    _payload: AnalyticsPayload[TEvent],
  ): void {
    // Intentionally no-op until a first-party analytics provider is selected.
  },
}
