import type { Address } from "../types/address"
import type { ApiError } from "../types/api"
import type { CartItem } from "../types/cart"
import type { Order, OrderAddressSnapshot, OrderItem } from "../types/order"
import { cartService } from "./cartService"
import { customerService } from "./customerService"
import { orderStorage } from "./orderStorage"
import { sessionService } from "./sessionService"

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
    const cleared = cartService.clearCart(userId)
    if (cleared.items.length > 0) {
      throw orderError("SERVER_ERROR", "Your order was saved, but the cart could not be cleared.", 500)
    }
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
}
