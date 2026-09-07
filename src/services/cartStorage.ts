import type { Cart, CartCoupon } from "../types/cart"
import type { CartItem } from "../types/cart"
import type { StockStatus } from "../types/product"
import { storageService } from "./storageService"

const guestStorageKey = "nova-cart-guest"
const usersStorageKey = "nova-cart-users"
const legacyStorageKey = "nova-cart"

const emptyCart = (userId?: string): Cart => {
  const timestamp = new Date().toISOString()
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

const isStockStatus = (value: unknown): value is StockStatus =>
  value === "in-stock" ||
  value === "low-stock" ||
  value === "out-of-stock" ||
  value === "coming-soon"

const isNonNegativeNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0

const isPositiveInteger = (value: unknown): value is number =>
  Number.isInteger(value) && typeof value === "number" && value > 0

const isNonNegativeInteger = (value: unknown): value is number =>
  Number.isInteger(value) && typeof value === "number" && value >= 0

const normalizeItem = (value: unknown): CartItem | undefined => {
  if (!isRecord(value)) return undefined
  if (typeof value.id !== "string" || !value.id) return undefined
  if (typeof value.productId !== "string" || !value.productId) return undefined
  if (typeof value.sku !== "string" || !value.sku) return undefined
  if (typeof value.productName !== "string" || !value.productName) return undefined
  if (typeof value.brandName !== "string" || !value.brandName) return undefined
  if (typeof value.image !== "string" || !value.image) return undefined
  if (!isPositiveInteger(value.quantity)) return undefined
  if (!isNonNegativeNumber(value.unitPrice) || !isNonNegativeNumber(value.mrp)) return undefined
  if (!isNonNegativeNumber(value.discountAmount)) return undefined
  if (!isStockStatus(value.stockStatus)) return undefined

  return {
    id: value.id,
    productId: value.productId,
    ...(typeof value.variantId === "string" && value.variantId ? { variantId: value.variantId } : {}),
    sku: value.sku,
    productName: value.productName,
    brandName: value.brandName,
    image: value.image,
    ...(typeof value.size === "string" ? { size: value.size } : {}),
    ...(typeof value.color === "string" ? { color: value.color } : {}),
    quantity: value.quantity,
    unitPrice: value.unitPrice,
    mrp: value.mrp,
    discountAmount: value.discountAmount,
    stockStatus: value.stockStatus,
    ...(isPositiveInteger(value.maxQuantity) ? { maxQuantity: value.maxQuantity } : {}),
    ...(typeof value.priceCapturedAt === "string" ? { priceCapturedAt: value.priceCapturedAt } : {}),
    ...(isNonNegativeInteger(value.availableQuantity) ? { availableQuantity: value.availableQuantity } : {}),
  }
}

const normalizeCoupon = (value: unknown): CartCoupon | undefined => {
  if (!isRecord(value)) return undefined
  if (typeof value.code !== "string" || !value.code || !isNonNegativeNumber(value.discountAmount)) return undefined
  return { code: value.code, discountAmount: value.discountAmount }
}

const normalizeCart = (value: unknown, userId?: string): Cart => {
  const fallback = emptyCart(userId)
  if (!isRecord(value)) return fallback

  const items = Array.isArray(value.items)
    ? value.items.map(normalizeItem).filter((item): item is CartItem => Boolean(item))
    : []
  const createdAt = typeof value.createdAt === "string" ? value.createdAt : fallback.createdAt
  const updatedAt = typeof value.updatedAt === "string" ? value.updatedAt : fallback.updatedAt
  const currency = typeof value.currency === "string" && value.currency ? value.currency : fallback.currency
  const cartId = typeof value.id === "string" && value.id ? value.id : fallback.id
  const coupon = normalizeCoupon(value.coupon)

  return {
    id: cartId,
    ...(userId ? { userId } : {}),
    items,
    subtotal: isNonNegativeNumber(value.subtotal) ? value.subtotal : 0,
    discount: isNonNegativeNumber(value.discount) ? value.discount : 0,
    deliveryFee: isNonNegativeNumber(value.deliveryFee) ? value.deliveryFee : 0,
    tax: isNonNegativeNumber(value.tax) ? value.tax : 0,
    total: isNonNegativeNumber(value.total) ? value.total : 0,
    currency,
    ...(coupon ? { coupon } : {}),
    createdAt,
    updatedAt,
  }
}

const readStored = (key: string, userId?: string): Cart => {
  const stored = storageService.get<unknown>(key)
  return normalizeCart(stored, userId)
}

const readUsers = (): Record<string, unknown> => {
  const stored = storageService.get<unknown>(usersStorageKey)
  return isRecord(stored) ? stored : {}
}

const writeUser = (userId: string, cart: Cart): boolean => {
  const users = readUsers()
  return storageService.set(usersStorageKey, { ...users, [userId]: normalizeCart(cart, userId) })
}

export const cartStorage = {
  get(): Cart | undefined {
    const current = storageService.get<unknown>(guestStorageKey)
    if (current !== undefined) return readStored(guestStorageKey)

    const legacy = storageService.get<unknown>(legacyStorageKey)
    return legacy === undefined ? emptyCart() : normalizeCart(legacy)
  },
  set(cart: Cart): boolean {
    return storageService.set(guestStorageKey, normalizeCart(cart))
  },
  remove(): void {
    storageService.remove(guestStorageKey)
  },
  getGuest(): Cart {
    return readStored(guestStorageKey)
  },
  setGuest(cart: Cart): boolean {
    return storageService.set(guestStorageKey, normalizeCart(cart))
  },
  removeGuest(): void {
    storageService.remove(guestStorageKey)
  },
  getUser(userId: string): Cart {
    const users = readUsers()
    return normalizeCart(users[userId], userId)
  },
  setUser(userId: string, cart: Cart): boolean {
    return writeUser(userId, cart)
  },
  removeUser(userId: string): void {
    const users = readUsers()
    delete users[userId]
    storageService.set(usersStorageKey, users)
  },
}
