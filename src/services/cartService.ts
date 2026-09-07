import type { Cart, CartItem } from "../types/cart"
import type { Product, ProductVariant } from "../types/product"
import { cartStorage } from "./cartStorage"
import { productService } from "./productService"

const now = () => new Date().toISOString()

const emptyCart = (): Cart => ({
  id: "guest-cart",
  items: [],
  subtotal: 0,
  discount: 0,
  deliveryFee: 0,
  tax: 0,
  total: 0,
  currency: "INR",
  createdAt: now(),
  updatedAt: now(),
})

const recalculate = (cart: Cart): Cart => {
  const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const discount = cart.items.reduce((sum, item) => sum + item.discountAmount * item.quantity, 0)
  const tax = 0
  return { ...cart, subtotal, discount, tax, total: subtotal + cart.deliveryFee + tax, updatedAt: now() }
}

const read = (): Cart => cartStorage.get() ?? emptyCart()

const toItem = (product: Product, variant?: ProductVariant, quantity = 1): CartItem => ({
  id: `${product.id}:${variant?.id ?? product.sku}`,
  productId: product.id,
  variantId: variant?.id,
  sku: variant?.sku ?? product.sku,
  productName: product.name,
  brandName: product.brand,
  image: variant?.image ?? product.thumbnail,
  size: variant?.size,
  color: variant?.color,
  quantity,
  unitPrice: variant?.price ?? product.price,
  mrp: product.mrp,
  discountAmount: Math.max(0, product.mrp - (variant?.price ?? product.price)),
  stockStatus: variant?.stockStatus ?? product.stockStatus,
})

export const cartService = {
  getCart(): Cart {
    return read()
  },
  async addItem(productId: string, variantId?: string, quantity = 1): Promise<Cart> {
    const product = await productService.getProductById(productId)
    if (!product) return read()
    const variant = variantId ? product.variants.find((item) => item.id === variantId) : undefined
    const cart = read()
    const newItem = toItem(product, variant, quantity)
    const existing = cart.items.find((item) => item.id === newItem.id)
    const items = existing
      ? cart.items.map((item) => item.id === newItem.id ? { ...item, quantity: item.quantity + quantity } : item)
      : [...cart.items, newItem]
    const next = recalculate({ ...cart, items })
    cartStorage.set(next)
    return next
  },
  updateQuantity(itemId: string, quantity: number): Cart {
    const cart = read()
    const items = quantity > 0
      ? cart.items.map((item) => item.id === itemId ? { ...item, quantity } : item)
      : cart.items.filter((item) => item.id !== itemId)
    const next = recalculate({ ...cart, items })
    cartStorage.set(next)
    return next
  },
  removeItem(itemId: string): Cart {
    return this.updateQuantity(itemId, 0)
  },
  clearCart(): Cart {
    const next = emptyCart()
    cartStorage.set(next)
    return next
  },
  getCheckoutCart(): Cart {
    return read()
  },
}
