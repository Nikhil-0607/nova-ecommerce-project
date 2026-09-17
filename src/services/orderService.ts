import type { Address } from "../types/address"
import type { ApiError } from "../types/api"
import type { CartItem } from "../types/cart"
import type { Order, OrderAddressSnapshot, OrderItem } from "../types/order"
import { cartService } from "./cartService"
import { customerService } from "./customerService"
import { orderStorage } from "./orderStorage"
import { sessionService } from "./sessionService"
import type { CheckoutCoupon, CheckoutPricing, DeliveryOption } from "../types/checkout"
import type { PaymentMethod } from "../types/payment"
import { sellerOrderService } from "./sellerOrderService"

const orderError = (code: ApiError["code"], message: string, status: number): ApiError => ({
  code,
  message,
  status,
})

const snapshotAddress = (address: Address): OrderAddressSnapshot => ({
  fullName: address.fullName,
  phone: address.phone,
  addressLine1: address.addressLine1,
  ...(address.addressLine2 ? { addressLine2: address.addressLine2 } : {}),
  ...(address.landmark ? { landmark: address.landmark } : {}),
  city: address.city,
  state: address.state,
  postalCode: address.postalCode,
  country: address.country,
  addressType: address.addressType,
})

const snapshotItem = (item: CartItem): OrderItem => ({
  productId: item.productId,
  ...(item.sellerId ? { sellerId: item.sellerId } : {}),
  ...(item.variantId ? { variantId: item.variantId } : {}),
  sku: item.sku,
  productName: item.productName,
  brandName: item.brandName,
  image: item.image,
  ...(item.size ? { size: item.size } : {}),
  ...(item.color ? { color: item.color } : {}),
  quantity: item.quantity,
  unitPrice: item.unitPrice,
  mrp: item.mrp,
  discountAmount: item.discountAmount,
  stockStatus: item.stockStatus,
})

const createOrderNumber = (): string =>
  `NV${Date.now().toString().slice(-8)}`

export const orderService = {
  async createOrderFromCart(userId: string, address: Address): Promise<Order> {
    if (!userId.trim()) throw orderError("AUTH_SESSION_EXPIRED", "Please sign in to place an order.", 401)
    const sessionUser = sessionService.getCurrentUser()
    if (!sessionUser || sessionUser.id !== userId) throw orderError("AUTH_SESSION_EXPIRED", "Please sign in to place an order.", 401)
    const addresses = await customerService.getAddresses()
    if (!addresses.some((item) => item.id === address.id)) {
      throw orderError("VALIDATION_ERROR", "Select one of your saved addresses.", 400)
    }
    const cart = cartService.getCheckoutCart(userId)
    if (cart.items.length === 0) throw orderError("VALIDATION_ERROR", "Your cart is empty.", 400)

    const timestamp = new Date().toISOString()
    const order: Order = {
      id: `order-${userId}-${Date.now()}`,
      orderNumber: createOrderNumber(),
      userId,
      status: "pending",
      paymentStatus: "pending",
      items: cart.items.map(snapshotItem),
      shippingAddress: snapshotAddress(address),
      subtotal: cart.subtotal,
      discount: cart.discount,
      deliveryFee: cart.deliveryFee,
      tax: cart.tax,
      total: cart.total,
      currency: cart.currency,
      createdAt: timestamp,
      updatedAt: timestamp,
      delivery: {},
      payment: { method: "mock" },
    }

    if (!orderStorage.saveOrder(userId, order)) {
      throw orderError("SERVER_ERROR", "We couldn't save your order.", 500)
    }
    sellerOrderService.splitOrder(order)
    const cleared = cartService.clearCart(userId)
    if (cleared.items.length > 0) {
      throw orderError("SERVER_ERROR", "Your order was saved, but the cart could not be cleared.", 500)
    }
    return order
  },

  async createOrderFromCheckout(
    userId: string,
    address: Address,
    details: {
      delivery?: DeliveryOption
      coupon?: CheckoutCoupon
      pricing: CheckoutPricing
      paymentMethod: PaymentMethod
      checkoutSessionId?: string
      paymentAttemptId?: string
      idempotencyKey?: string
    },
  ): Promise<Order> {
    if (!userId.trim()) throw orderError("AUTH_SESSION_EXPIRED", "Please sign in to place an order.", 401)
    const sessionUser = sessionService.getCurrentUser()
    if (!sessionUser || sessionUser.id !== userId) throw orderError("AUTH_SESSION_EXPIRED", "Please sign in to place an order.", 401)
    const addresses = await customerService.getAddresses()
    if (!addresses.some((item) => item.id === address.id)) throw orderError("VALIDATION_ERROR", "Select one of your saved addresses.", 400)
    const cart = cartService.getCheckoutCart(userId)
    if (cart.items.length === 0) throw orderError("VALIDATION_ERROR", "Your cart is empty.", 400)
    if (details.idempotencyKey) {
      const existing = orderStorage.getOrders(userId).find((item) => item.idempotencyKey === details.idempotencyKey)
      if (existing) return existing
    }
    const validation = cart.items.some((item) => item.quantity < 1 || item.stockStatus === "out-of-stock")
    if (validation) throw orderError("OUT_OF_STOCK", "An item in your bag is no longer available.", 409)
    const timestamp = new Date().toISOString()
    const order: Order = {
      id: `order-${userId}-${Date.now()}`,
      orderNumber: createOrderNumber(),
      userId,
      status: "pending",
      paymentStatus: "paid",
      items: cart.items.map(snapshotItem),
      shippingAddress: snapshotAddress(address),
      subtotal: details.pricing.total - details.pricing.deliveryFee - details.pricing.tax - details.pricing.convenienceFee + details.pricing.couponDiscount,
      discount: details.pricing.productDiscount + details.pricing.couponDiscount,
      deliveryFee: details.pricing.deliveryFee,
      tax: details.pricing.tax,
      total: details.pricing.total,
      currency: details.pricing.currency,
      createdAt: timestamp,
      updatedAt: timestamp,
      payment: { method: details.paymentMethod, status: "paid" },
      ...(details.delivery ? { delivery: { estimatedDeliveryDate: details.delivery.estimatedDeliveryDate } } : {}),
      checkoutPricing: details.pricing,
      ...(details.coupon ? { coupon: details.coupon } : {}),
      ...(details.delivery ? { deliveryOption: details.delivery } : {}),
      paymentMethod: details.paymentMethod,
      ...(details.checkoutSessionId ? { checkoutSessionId: details.checkoutSessionId } : {}),
      ...(details.paymentAttemptId ? { paymentAttemptId: details.paymentAttemptId } : {}),
      ...(details.idempotencyKey ? { idempotencyKey: details.idempotencyKey } : {}),
    }
    if (!orderStorage.saveOrder(userId, order)) throw orderError("ORDER_CREATION_FAILED", "We couldn't save your order. Your payment is being verified.", 500)
    sellerOrderService.splitOrder(order)
    const cleared = cartService.clearCart(userId)
    if (cleared.items.length > 0) throw orderError("SERVER_ERROR", "Your order was saved, but the cart could not be cleared.", 500)
    return order
  },

  getOrders(userId: string): Order[] {
    if (!userId.trim()) return []
    return orderStorage.getOrders(userId)
  },

  getOrderById(userId: string, orderId: string): Order | undefined {
    if (!userId.trim() || !orderId.trim()) return undefined
    return orderStorage.getOrderById(userId, orderId)
  },

  searchOrders(userId: string, query: string): Order[] {
    const needle = query.trim().toLowerCase()
    if (!needle) return orderService.getOrders(userId)
    return orderService.getOrders(userId).filter((order) => [order.id, order.orderNumber, ...(order.delivery?.trackingReference ? [order.delivery.trackingReference] : []), ...order.items.flatMap((item) => [item.productName, item.brandName])].join(" ").toLowerCase().includes(needle))
  },

  cancelOrder(userId: string, orderId: string, itemIds?: string[]): Order | undefined {
    const order = orderService.getOrderById(userId, orderId)
    if (!order || !["pending", "confirmed", "processing"].includes(order.status)) return undefined
    const selected = itemIds && itemIds.length > 0 ? new Set(itemIds) : undefined
    const items = selected ? order.items.filter((item) => !selected.has(`${item.productId}:${item.variantId ?? "product"}`)) : []
    const updated: Order = {
      ...order,
      status: selected && items.length > 0 ? "processing" : "cancelled",
      updatedAt: new Date().toISOString(),
      ...(selected && items.length > 0 ? { items } : {}),
    }
    return orderStorage.saveOrder(userId, updated) ? updated : undefined
  },
}
