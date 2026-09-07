import type { ApiError } from "../types/api"
import { products } from "../mock/products"
import type { Wishlist, WishlistItem } from "../types/wishlist"
import { getWishlistItemKey } from "../utils/wishlistIdentity"
import { wishlistStorage } from "./wishlistStorage"

export type WishlistScope = "guest" | { userId: string }

const error = (code: ApiError["code"], message: string, status: number): never => {
  throw { code, message, status } satisfies ApiError
}
const productExists = (productId: string, variantId?: string): boolean => {
  const product = products.find((item) => item.id === productId || item.slug === productId)
  return Boolean(product && (!variantId || product.variants.some((variant) => variant.id === variantId)))
}

const validWishlist = (wishlist: Wishlist): Wishlist => {
  const items = wishlist.items.filter((item) => productExists(item.productId, item.variantId))
  return { items, updatedAt: wishlist.updatedAt }
}

const read = (scope: WishlistScope): Wishlist =>
  validWishlist(scope === "guest" ? wishlistStorage.getGuest() : wishlistStorage.getUser(scope.userId))

const write = (scope: WishlistScope, wishlist: Wishlist): void => {
  const success = scope === "guest"
    ? wishlistStorage.setGuest(wishlist)
    : wishlistStorage.setUser(scope.userId, wishlist)
  if (!success) error("SERVER_ERROR", "Wishlist storage is unavailable.", 500)
}

const item = (productId: string, variantId?: string): WishlistItem => ({
  id: getWishlistItemKey(productId, variantId),
  productId,
  ...(variantId ? { variantId } : {}),
  addedAt: new Date().toISOString(),
})

export const wishlistService = {
  getWishlist(scope: WishlistScope = "guest"): Wishlist {
    const wishlist = read(scope)
    write(scope, wishlist)
    return wishlist
  },
  addItem(scope: WishlistScope, productId: string, variantId?: string): Wishlist {
    if (!productExists(productId, variantId)) return error("RESOURCE_NOT_FOUND", "The wishlist item is no longer available.", 404)
    const wishlist = read(scope)
    const nextItem = item(productId, variantId)
    const next = wishlist.items.some((existing) => existing.id === nextItem.id)
      ? wishlist
      : { items: [...wishlist.items, nextItem], updatedAt: new Date().toISOString() }
    write(scope, next)
    return next
  },
  removeItem(scope: WishlistScope, productId: string, variantId?: string): Wishlist {
    const wishlist = read(scope)
    const next = { items: wishlist.items.filter((existing) => existing.id !== getWishlistItemKey(productId, variantId)), updatedAt: new Date().toISOString() }
    write(scope, next)
    return next
  },
  hasItem(scope: WishlistScope, productId: string, variantId?: string): boolean {
    return read(scope).items.some((item) => item.id === getWishlistItemKey(productId, variantId))
  },
  toggleItem(scope: WishlistScope, productId: string, variantId?: string): { wishlist: Wishlist; added: boolean } {
    return this.hasItem(scope, productId, variantId)
      ? { wishlist: this.removeItem(scope, productId, variantId), added: false }
      : { wishlist: this.addItem(scope, productId, variantId), added: true }
  },
  clearWishlist(scope: WishlistScope): void {
    write(scope, { items: [], updatedAt: new Date().toISOString() })
  },
  addToWishlist(productId: string, variantId?: string): Wishlist {
    return this.addItem("guest", productId, variantId)
  },
  removeFromWishlist(productId: string, variantId?: string): Wishlist {
    return this.removeItem("guest", productId, variantId)
  },
  isInWishlist(productId: string, variantId?: string): boolean {
    return this.hasItem("guest", productId, variantId)
  },
  mergeGuestWishlist(userId: string): Wishlist {
    const guest = read("guest")
    const userScope: WishlistScope = { userId }
    const current = read(userScope)
    const merged = new Map(current.items.map((entry) => [entry.id, entry]))
    guest.items.forEach((entry) => merged.set(entry.id, entry))
    const result = { items: [...merged.values()], updatedAt: new Date().toISOString() }
    write(userScope, result)
    wishlistStorage.removeGuest()
    return result
  },
}
