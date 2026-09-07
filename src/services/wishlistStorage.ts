import type { Wishlist } from "../types/wishlist"
import { storageService } from "./storageService"

const storageKey = "nova-wishlist"

export const wishlistStorage = {
  get(): Wishlist | undefined {
    return storageService.get<Wishlist>(storageKey)
  },
  set(wishlist: Wishlist): boolean {
    return storageService.set(storageKey, wishlist)
  },
  remove(): void {
    storageService.remove(storageKey)
  },
}
