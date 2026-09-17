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
  | "CHECKOUT_STARTED"
  | "CHECKOUT_ADDRESS_SELECTED"
  | "CHECKOUT_DELIVERY_SELECTED"
  | "CHECKOUT_REVIEWED"
  | "PAYMENT_INITIATED"
  | "PAYMENT_SUCCEEDED"
  | "PAYMENT_FAILED"
  | "PAYMENT_PENDING"
  | "ORDER_CREATED"
  | "ORDER_CONFIRMED"
  | "CHECKOUT_ABANDONED"
  | "ORDER_VIEWED"
  | "TRACK_ORDER_CLICKED"
  | "CANCEL_ORDER_STARTED"
  | "RETURN_STARTED"
  | "EXCHANGE_STARTED"
  | "INVOICE_VIEWED"
  | "BUY_AGAIN_CLICKED"
  | "SUPPORT_REQUESTED"
  | "REFUND_VIEWED"
  | "PREFERENCE_UPDATED"
  | "CONSENT_UPDATED"
  | "ALERT_CREATED"
  | "LOYALTY_POINTS_EARNED"
  | "MEMBERSHIP_JOINED"
  | "CAMPAIGN_CREATED"
  | "CAMPAIGN_LAUNCHED"
  | "JOURNEY_ACTIVATED"
  | "EXPERIMENT_ACTIVATED"

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
  CHECKOUT_STARTED: { itemCount: number }
  CHECKOUT_ADDRESS_SELECTED: { addressId: string }
  CHECKOUT_DELIVERY_SELECTED: { deliveryOptionId: string }
  CHECKOUT_REVIEWED: Record<string, never>
  PAYMENT_INITIATED: { method: string }
  PAYMENT_SUCCEEDED: Record<string, never>
  PAYMENT_FAILED: { code: string }
  PAYMENT_PENDING: Record<string, never>
  ORDER_CREATED: { orderId: string }
  ORDER_CONFIRMED: { orderId: string }
  CHECKOUT_ABANDONED: Record<string, never>
  ORDER_VIEWED: { orderId: string }
  TRACK_ORDER_CLICKED: { orderId: string }
  CANCEL_ORDER_STARTED: { orderId: string }
  RETURN_STARTED: { orderId: string }
  EXCHANGE_STARTED: { orderId: string }
  INVOICE_VIEWED: { orderId: string }
  BUY_AGAIN_CLICKED: { orderId: string; productId: string }
  SUPPORT_REQUESTED: { orderId: string }
  REFUND_VIEWED: { orderId: string }
  PREFERENCE_UPDATED: Record<string, never>
  CONSENT_UPDATED: { email: boolean; push: boolean; personalizedRecommendations: boolean }
  ALERT_CREATED: { type: string }
  LOYALTY_POINTS_EARNED: { points: number }
  MEMBERSHIP_JOINED: { planId: string }
  CAMPAIGN_CREATED: { campaignId: string }
  CAMPAIGN_LAUNCHED: { campaignId: string }
  JOURNEY_ACTIVATED: { journeyId: string }
  EXPERIMENT_ACTIVATED: { experimentId: string }
}

export type AnalyticsProvider = {
  track<TEvent extends AnalyticsEvent>(event: TEvent, payload: AnalyticsPayload[TEvent]): void
}

const noopProvider: AnalyticsProvider = {
  track: () => undefined,
}

let provider: AnalyticsProvider = noopProvider

export const analytics = {
  setProvider(nextProvider: AnalyticsProvider): void {
    provider = nextProvider
  },
  track<TEvent extends AnalyticsEvent>(
    event: TEvent,
    payload: AnalyticsPayload[TEvent],
  ): void {
    provider.track(event, payload)
  },
}
