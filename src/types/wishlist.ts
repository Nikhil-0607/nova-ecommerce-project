export type WishlistItem = {
  id: string
  productId: string
  variantId?: string
  addedAt: string
}

export type Wishlist = {
  items: WishlistItem[]
  updatedAt: string
}
