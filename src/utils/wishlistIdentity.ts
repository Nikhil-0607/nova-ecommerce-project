export function getWishlistItemKey(productId: string, variantId?: string): string {
  return `${productId}:${variantId ?? "product"}`
}
