import { wishlistStorage } from "./wishlistStorage"
import type { Wishlist, WishlistItem } from "../types/wishlist"

const emptyWishlist = (): Wishlist => ({ items: [], updatedAt: new Date().toISOString() })
const read = (): Wishlist => wishlistStorage.get() ?? emptyWishlist()
const identity = (productId: string, variantId?: string) => `${productId}:${variantId ?? "product"}`

export const wishlistService = {
  getWishlist(): Wishlist {
    return read()
  },
  addToWishlist(productId: string, variantId?: string): Wishlist {
    const wishlist = read()
    const item: WishlistItem = { id: identity(productId, variantId), productId, variantId, addedAt: new Date().toISOString() }
    const next = wishlist.items.some((existing) => existing.id === item.id)
      ? wishlist
      : { items: [...wishlist.items, item], updatedAt: new Date().toISOString() }
    wishlistStorage.set(next)
    return next
  },
  removeFromWishlist(productId: string, variantId?: string): Wishlist {
    const next = { items: read().items.filter((item) => item.id !== identity(productId, variantId)), updatedAt: new Date().toISOString() }
    wishlistStorage.set(next)
    return next
  },
  isInWishlist(productId: string, variantId?: string): boolean {
    return read().items.some((item) => item.id === identity(productId, variantId))
  },
  clearWishlist(): void {
    wishlistStorage.set(emptyWishlist())
  },
}
