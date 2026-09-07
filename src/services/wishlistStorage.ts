import type { Wishlist } from "../types/wishlist"
import { storageService } from "./storageService"
import { getWishlistItemKey } from "../utils/wishlistIdentity"

const guestStorageKey = "nova-wishlist-guest"
const userStorageKey = "nova-wishlist-users"

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

const normalize = (value: unknown): Wishlist => {
  if (!isRecord(value) || !Array.isArray(value.items)) return { items: [], updatedAt: new Date().toISOString() }
  const seen = new Set<string>()
  const items = value.items.flatMap((item): Wishlist["items"] => {
    if (!isRecord(item) || typeof item.productId !== "string" || !item.productId.trim()) return []
    const variantId = typeof item.variantId === "string" && item.variantId.trim() ? item.variantId : undefined
    const id = getWishlistItemKey(item.productId, variantId)
    if (seen.has(id)) return []
    seen.add(id)
    return [{
      id,
      productId: item.productId,
      ...(variantId ? { variantId } : {}),
      addedAt: typeof item.addedAt === "string" ? item.addedAt : new Date().toISOString(),
    }]
  })
  return { items, updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : new Date().toISOString() }
}

export const wishlistStorage = {
  getGuest(): Wishlist {
    const current = storageService.get<unknown>(guestStorageKey)
    const legacy = current === undefined ? storageService.get<unknown>("nova-wishlist") : undefined
    return normalize(current ?? legacy)
  },
  setGuest(wishlist: Wishlist): boolean {
    return storageService.set(guestStorageKey, normalize(wishlist))
  },
  removeGuest(): void {
    storageService.remove(guestStorageKey)
    storageService.remove("nova-wishlist")
  },
  getUser(userId: string): Wishlist {
    const stored = storageService.get<Record<string, unknown>>(userStorageKey)
    return normalize(stored?.[userId])
  },
  setUser(userId: string, wishlist: Wishlist): boolean {
    const stored = storageService.get<Record<string, unknown>>(userStorageKey) ?? {}
    return storageService.set(userStorageKey, { ...stored, [userId]: normalize(wishlist) })
  },
  removeUser(userId: string): void {
    const stored = storageService.get<Record<string, unknown>>(userStorageKey) ?? {}
    const { [userId]: _removed, ...remaining } = stored
    storageService.set(userStorageKey, remaining)
  },
}
