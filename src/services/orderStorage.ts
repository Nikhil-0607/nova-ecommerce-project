import type {
  Order,
  OrderAddressSnapshot,
  OrderDeliveryMetadata,
  OrderItem,
  OrderPaymentMetadata,
  OrderStatus,
  PaymentStatus,
} from "../types/order"
import type { CheckoutCoupon, CheckoutPricing, DeliveryOption } from "../types/checkout"
import type { PaymentMethod } from "../types/payment"
import type { StockStatus } from "../types/product"
import { storageService } from "./storageService"

const storageKey = "nova-orders-users"

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

const isNonNegativeNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0

const isPositiveInteger = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value > 0

const isOrderStatus = (value: unknown): value is OrderStatus =>
  value === "pending" ||
  value === "confirmed" ||
  value === "processing" ||
  value === "shipped" ||
  value === "delivered" ||
  value === "cancelled"

const isPaymentStatus = (value: unknown): value is PaymentStatus =>
  value === "pending" ||
  value === "paid" ||
  value === "failed" ||
  value === "refunded"

const isStockStatus = (value: unknown): value is StockStatus =>
  value === "in-stock" ||
  value === "low-stock" ||
  value === "out-of-stock" ||
  value === "coming-soon"

const normalizeAddress = (value: unknown): OrderAddressSnapshot | undefined => {
  if (!isRecord(value)) return undefined
  const required = ["fullName", "phone", "addressLine1", "city", "state", "postalCode", "country"]
  if (required.some((key) => typeof value[key] !== "string" || !value[key])) return undefined
  return {
    fullName: value.fullName as string,
    phone: value.phone as string,
    addressLine1: value.addressLine1 as string,
    ...(typeof value.addressLine2 === "string" ? { addressLine2: value.addressLine2 } : {}),
    ...(typeof value.landmark === "string" ? { landmark: value.landmark } : {}),
    city: value.city as string,
    state: value.state as string,
    postalCode: value.postalCode as string,
    country: value.country as string,
    ...(typeof value.addressType === "string" ? { addressType: value.addressType } : {}),
  }
}

const normalizeItem = (value: unknown): OrderItem | undefined => {
  if (!isRecord(value)) return undefined
  const requiredStrings = ["productId", "sku", "productName", "brandName", "image"]
  if (requiredStrings.some((key) => typeof value[key] !== "string" || !value[key])) return undefined
  if (!isPositiveInteger(value.quantity)) return undefined
  if (!isNonNegativeNumber(value.unitPrice) || !isNonNegativeNumber(value.mrp) || !isNonNegativeNumber(value.discountAmount)) return undefined
  if (value.stockStatus !== undefined && !isStockStatus(value.stockStatus)) return undefined
  return {
    productId: value.productId as string,
    ...(typeof value.sellerId === "string" ? { sellerId: value.sellerId } : {}),
    ...(typeof value.variantId === "string" ? { variantId: value.variantId } : {}),
    sku: value.sku as string,
    productName: value.productName as string,
    brandName: value.brandName as string,
    image: value.image as string,
    ...(typeof value.size === "string" ? { size: value.size } : {}),
    ...(typeof value.color === "string" ? { color: value.color } : {}),
    quantity: value.quantity,
    unitPrice: value.unitPrice,
    mrp: value.mrp,
    discountAmount: value.discountAmount,
    ...(value.stockStatus ? { stockStatus: value.stockStatus } : {}),
  }
}

const normalizeMetadata = (value: unknown): OrderDeliveryMetadata | undefined => {
  if (!isRecord(value)) return undefined
  return {
    ...(typeof value.estimatedDeliveryDate === "string" ? { estimatedDeliveryDate: value.estimatedDeliveryDate } : {}),
    ...(typeof value.shippedAt === "string" ? { shippedAt: value.shippedAt } : {}),
    ...(typeof value.deliveredAt === "string" ? { deliveredAt: value.deliveredAt } : {}),
    ...(typeof value.trackingReference === "string" ? { trackingReference: value.trackingReference } : {}),
  }
}

const normalizePayment = (value: unknown): OrderPaymentMetadata | undefined => {
  if (!isRecord(value)) return undefined
  return {
    ...(typeof value.method === "string" ? { method: value.method } : {}),
    ...(typeof value.providerReference === "string" ? { providerReference: value.providerReference } : {}),
    ...(isPaymentStatus(value.status) ? { status: value.status } : {}),
  }
}

const normalizeCheckout = (value: unknown): CheckoutPricing | undefined => {
  if (!isRecord(value)) return undefined
  const keys = ["totalMRP", "productDiscount", "couponDiscount", "deliveryFee", "tax", "convenienceFee", "total"]
  if (keys.some((key) => !isNonNegativeNumber(value[key])) || typeof value.currency !== "string") return undefined
  return {
    totalMRP: value.totalMRP as number,
    productDiscount: value.productDiscount as number,
    couponDiscount: value.couponDiscount as number,
    deliveryFee: value.deliveryFee as number,
    tax: value.tax as number,
    convenienceFee: value.convenienceFee as number,
    total: value.total as number,
    currency: value.currency,
  }
}

const normalizeOrder = (value: unknown, userId: string): Order | undefined => {
  if (!isRecord(value) || value.userId !== userId) return undefined
  const requiredStrings = ["id", "orderNumber", "userId", "currency", "createdAt", "updatedAt"]
  if (requiredStrings.some((key) => typeof value[key] !== "string" || !value[key])) return undefined
  if (!isOrderStatus(value.status) || !isPaymentStatus(value.paymentStatus)) return undefined
  if (!Array.isArray(value.items) || value.items.length === 0) return undefined
  const items = value.items.map(normalizeItem).filter((item): item is OrderItem => Boolean(item))
  const shippingAddress = normalizeAddress(value.shippingAddress)
  if (items.length !== value.items.length || !shippingAddress) return undefined
  const totals = ["subtotal", "discount", "deliveryFee", "tax", "total"]
  if (totals.some((key) => !isNonNegativeNumber(value[key]))) return undefined
  const subtotal = value.subtotal
  const discount = value.discount
  const deliveryFee = value.deliveryFee
  const tax = value.tax
  const total = value.total
  if (!isNonNegativeNumber(subtotal) || !isNonNegativeNumber(discount) || !isNonNegativeNumber(deliveryFee) || !isNonNegativeNumber(tax) || !isNonNegativeNumber(total)) return undefined
  const delivery = normalizeMetadata(value.delivery)
  const payment = normalizePayment(value.payment)
  const checkoutPricing = normalizeCheckout(value.checkoutPricing)
  return {
    id: value.id as string,
    orderNumber: value.orderNumber as string,
    userId,
    status: value.status,
    paymentStatus: value.paymentStatus,
    items,
    shippingAddress,
    subtotal,
    discount,
    deliveryFee,
    tax,
    total,
    currency: value.currency as string,
    createdAt: value.createdAt as string,
    updatedAt: value.updatedAt as string,
    ...(delivery ? { delivery } : {}),
    ...(payment ? { payment } : {}),
    ...(checkoutPricing ? { checkoutPricing } : {}),
    ...(isRecord(value.coupon) && typeof value.coupon.code === "string" && isNonNegativeNumber(value.coupon.discountAmount)
      ? { coupon: value.coupon as CheckoutCoupon } : {}),
    ...(isRecord(value.deliveryOption) && typeof value.deliveryOption.id === "string"
      ? { deliveryOption: value.deliveryOption as DeliveryOption } : {}),
    ...(value.paymentMethod === "CARD" || value.paymentMethod === "UPI" || value.paymentMethod === "NET_BANKING" || value.paymentMethod === "WALLET" || value.paymentMethod === "COD"
      ? { paymentMethod: value.paymentMethod as PaymentMethod } : {}),
    ...(typeof value.checkoutSessionId === "string" ? { checkoutSessionId: value.checkoutSessionId } : {}),
    ...(typeof value.paymentAttemptId === "string" ? { paymentAttemptId: value.paymentAttemptId } : {}),
    ...(typeof value.idempotencyKey === "string" ? { idempotencyKey: value.idempotencyKey } : {}),
  }
}

const readUsers = (): Record<string, unknown> => {
  const stored = storageService.get<unknown>(storageKey)
  return isRecord(stored) ? stored : {}
}

export const orderStorage = {
  getOrders(userId: string): Order[] {
    const stored = readUsers()[userId]
    if (!Array.isArray(stored)) return []
    return stored
      .map((order) => normalizeOrder(order, userId))
      .filter((order): order is Order => Boolean(order))
  },

  getOrderById(userId: string, orderId: string): Order | undefined {
    return orderStorage.getOrders(userId).find((order) => order.id === orderId)
  },

  saveOrder(userId: string, order: Order): boolean {
    if (order.userId !== userId || !normalizeOrder(order, userId)) return false
    const users = readUsers()
    const orders = orderStorage.getOrders(userId).filter((item) => item.id !== order.id)
    return storageService.set(storageKey, { ...users, [userId]: [...orders, order] })
  },
}
