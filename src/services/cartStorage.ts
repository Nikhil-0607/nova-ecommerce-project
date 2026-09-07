import type { Cart } from "../types/cart"
import { storageService } from "./storageService"

const storageKey = "nova-cart"

export const cartStorage = {
  get(): Cart | undefined {
    return storageService.get<Cart>(storageKey)
  },
  set(cart: Cart): boolean {
    return storageService.set(storageKey, cart)
  },
  remove(): void {
    storageService.remove(storageKey)
  },
}
