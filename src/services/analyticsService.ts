export type AnalyticsEvent =
  | "PRODUCT_VIEWED"
  | "SEARCH_PERFORMED"
  | "FILTER_APPLIED"
  | "SORT_CHANGED"
  | "PRODUCT_WISHLISTED"
  | "ADD_TO_CART"
  | "CATEGORY_VIEWED"
  | "BRAND_VIEWED"

export type AnalyticsPayload = {
  PRODUCT_VIEWED: { productId: string }
  SEARCH_PERFORMED: { query: string }
  FILTER_APPLIED: { filter: string }
  SORT_CHANGED: { sort: string }
  PRODUCT_WISHLISTED: { productId: string; added: boolean }
  ADD_TO_CART: { productId: string }
  CATEGORY_VIEWED: { categoryId: string }
  BRAND_VIEWED: { brandId: string }
}

export const analytics = {
  track<TEvent extends AnalyticsEvent>(
    _event: TEvent,
    _payload: AnalyticsPayload[TEvent],
  ): void {
    // Intentionally no-op until a first-party analytics provider is selected.
  },
}
