export function getCartItemKey(productId: string, variantId?: string): string {
  return `${productId}:${variantId ?? "product"}`
}
