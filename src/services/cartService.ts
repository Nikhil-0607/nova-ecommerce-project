import type { Cart, CartItem } from "../types/cart"
import type { Product, ProductVariant } from "../types/product"
import { getCartItemKey } from "../utils/cartIdentity"
import { cartStorage } from "./cartStorage"
import { productService } from "./productService"

const now = () => new Date().toISOString()

const emptyCart = (userId?: string): Cart => {
  const timestamp = now()
  return {
    id: userId ? `user-cart-${userId}` : "guest-cart",
    ...(userId ? { userId } : {}),
    items: [],
    subtotal: 0,
    discount: 0,
    deliveryFee: 0,
    tax: 0,
    total: 0,
    currency: "INR",
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

const recalculate = (cart: Cart): Cart => {
  const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const discount = cart.items.reduce((sum, item) => sum + item.discountAmount * item.quantity, 0)
  const tax = 0
  return {
    ...cart,
    subtotal,
    discount,
    tax,
    total: subtotal + cart.deliveryFee + tax,
    updatedAt: now(),
  }
}

const isPositiveInteger = (value: number): boolean =>
  Number.isInteger(value) && value > 0

const read = (userId?: string): Cart =>
  userId ? cartStorage.getUser(userId) : (cartStorage.get() ?? emptyCart())

const write = (cart: Cart, userId?: string): boolean =>
  userId ? cartStorage.setUser(userId, cart) : cartStorage.setGuest(cart)

const mergeQuantity = (item: CartItem, additionalQuantity: number): CartItem => {
  const maximum = maxAllowedQuantity(item)
  const quantity = maximum === undefined
    ? item.quantity + additionalQuantity
    : Math.min(maximum, item.quantity + additionalQuantity)
  return { ...item, quantity }
}

const maxAllowedQuantity = (item: CartItem): number | undefined => {
  if (item.maxQuantity !== undefined) return item.maxQuantity
  return item.availableQuantity
}

const isWithinQuantityLimit = (item: CartItem, quantity: number): boolean => {
  const maximum = maxAllowedQuantity(item)
  return maximum === undefined || quantity <= maximum
}

const toItem = (
  product: Product,
  variant: ProductVariant | undefined,
  quantity: number,
): CartItem => ({
  id: getCartItemKey(product.id, variant?.id),
  productId: product.id,
  ...(variant ? { variantId: variant.id } : {}),
  sku: variant?.sku ?? product.sku,
  productName: product.name,
  brandName: product.brand,
  image: variant?.image ?? product.thumbnail,
  ...(variant?.size ? { size: variant.size } : {}),
  ...(variant?.color ? { color: variant.color } : {}),
  quantity,
  unitPrice: variant?.price ?? product.price,
  mrp: product.mrp,
  discountAmount: Math.max(0, product.mrp - (variant?.price ?? product.price)),
  stockStatus: variant?.stockStatus ?? product.stockStatus,
})

export const cartService = {
  getCart(userId?: string): Cart {
    return read(userId)
  },

  async addItem(
    productId: string,
    variantId?: string,
    quantity = 1,
    userId?: string,
  ): Promise<Cart> {
    const current = read(userId)
    if (!isPositiveInteger(quantity)) return current

    const product = await productService.getProductById(productId)
    if (!product) return current

    const variant = variantId
      ? product.variants.find((item) => item.id === variantId)
      : undefined
    if (variantId && !variant) return current

    const newItem = toItem(product, variant, quantity)
    const existing = current.items.find((item) => (
      getCartItemKey(item.productId, item.variantId) === newItem.id
    ))
    const nextQuantity = (existing?.quantity ?? 0) + quantity
    if (existing && !isWithinQuantityLimit({ ...existing, ...newItem }, nextQuantity)) return current

    const items = existing
      ? current.items.map((item) => item.id === existing.id
        ? { ...item, id: newItem.id, quantity: nextQuantity }
        : item)
      : [...current.items, newItem]
    const next = recalculate({ ...current, items })
    return write(next, userId) ? next : current
  },

  updateQuantity(itemId: string, quantity: number, userId?: string): Cart {
    const current = read(userId)
    if (!isPositiveInteger(quantity)) return current

    const existing = current.items.find((item) => item.id === itemId)
    if (!existing || !isWithinQuantityLimit(existing, quantity)) return current

    const items = current.items.map((item) => (
      item.id === itemId ? { ...item, quantity } : item
    ))
    const next = recalculate({ ...current, items })
    return write(next, userId) ? next : current
  },

  removeItem(itemId: string, userId?: string): Cart {
    const current = read(userId)
    const items = current.items.filter((item) => item.id !== itemId)
    if (items.length === current.items.length) return current

    const next = recalculate({ ...current, items })
    return write(next, userId) ? next : current
  },

  clearCart(userId?: string): Cart {
    const current = read(userId)
    const next = emptyCart(userId)
    return write(next, userId) ? next : current
  },

  getCheckoutCart(userId?: string): Cart {
    return read(userId)
  },

  mergeGuestCart(userId: string): Cart {
    const guest = read()
    const current = read(userId)
    if (guest.items.length === 0) return current

    const merged = new Map<string, CartItem>()
    current.items.forEach((item) => {
      merged.set(getCartItemKey(item.productId, item.variantId), item)
    })
    guest.items.forEach((guestItem) => {
      const key = getCartItemKey(guestItem.productId, guestItem.variantId)
      const existing = merged.get(key)
      merged.set(key, existing ? mergeQuantity(existing, guestItem.quantity) : guestItem)
    })

    const next = recalculate({ ...current, items: [...merged.values()] })
    if (!write(next, userId)) {
      throw new Error("Unable to persist merged cart")
    }
    cartStorage.removeGuest()
    return next
  },
}
