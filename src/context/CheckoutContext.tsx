import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useStore } from "./StoreContext"
import { customerService } from "../services/customerService"
import { checkoutService } from "../services/checkoutService"
import { deliveryService } from "../services/deliveryService"
import { paymentService } from "../services/paymentService"
import { orderService } from "../services/orderService"
import { analytics } from "../services/analyticsService"
import { checkoutSessionStorage } from "../services/checkoutSessionStorage"
import { pricingService } from "../services/pricingService"
import type { Address } from "../types/address"
import type { CheckoutState, CheckoutStep, CheckoutStatus, DeliveryOption } from "../types/checkout"
import type { PaymentMethod } from "../types/payment"

type CheckoutContextValue = CheckoutState & {
  setStep: (step: CheckoutStep) => void
  selectAddress: (address: Address) => Promise<boolean>
  selectDelivery: (option: DeliveryOption) => void
  applyCoupon: (code: string) => void
  setPaymentMethod: (method: PaymentMethod) => void
  placeOrder: () => Promise<void>
  refresh: () => Promise<void>
  clearError: () => void
}

const Context = createContext<CheckoutContextValue | null>(null)
const newId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { orderId } = useParams()
  const { user, cartItems, cartSubtotal, cartTotal, clearCart } = useStore()
  const cart = useMemo(() => ({
    id: user ? `user-cart-${user.id}` : "guest-cart",
    userId: user?.id,
    items: cartItems,
    subtotal: cartSubtotal,
    discount: cartItems.reduce((sum, item) => sum + item.discountAmount * item.quantity, 0),
    deliveryFee: 0,
    tax: 0,
    total: cartTotal,
    currency: "INR",
    createdAt: "",
    updatedAt: "",
  }), [cartItems, cartSubtotal, cartTotal, user?.id])
  const [state, setState] = useState<CheckoutState>(() => {
    const saved = checkoutSessionStorage.get()
    return {
    cart, cartItems, addresses: [], selectedAddressId: "", deliveryOptions: [], selectedDeliveryOptionId: "",
    pricing: checkoutService.calculatePricing(cart), paymentMethods: [], currentStep: "ADDRESS", status: "LOADING",
    sessionStatus: saved?.status ?? "ACTIVE", checkoutSessionId: saved?.checkoutSessionId ?? newId("checkout"), idempotencyKey: saved?.idempotencyKey ?? newId("idem"),
    }
  })
  const submittingRef = useRef(false)

  const refresh = async () => {
    const validation = checkoutService.validateCart(cart)
    if (validation) {
      setState((current) => ({ ...current, cart, cartItems, status: "ERROR", error: validation }))
      return
    }
    if (!user) return
    setState((current) => ({ ...current, cart, cartItems, status: "LOADING", error: undefined }))
    try {
      const [addresses, paymentMethods] = await Promise.all([customerService.getAddresses(), paymentService.getPaymentMethods()])
      const selected = addresses.find((address) => address.isDefault)?.id ?? addresses[0]?.id ?? ""
      setState((current) => ({ ...current, cart, cartItems, addresses, paymentMethods, selectedAddressId: current.selectedAddressId || selected, pricing: checkoutService.calculatePricing(cart), status: "READY" }))
    } catch {
      setState((current) => ({ ...current, status: "ERROR", error: { code: "VALIDATION_ERROR", message: "We couldn't load checkout details.", recovery: "Try again." } }))
    }
  }

  useEffect(() => { void refresh() }, [user?.id, cartItems, cartSubtotal, cartTotal])
  useEffect(() => {
    if (cartItems.length > 0) analytics.track("CHECKOUT_STARTED", { itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0) })
  }, [])
  useEffect(() => {
    if (!user || !location.pathname.startsWith("/checkout/success/") || !orderId) return
    const existing = orderService.getOrderById(user.id, orderId)
    if (existing) setState((current) => ({ ...current, order: existing, currentStep: "SUCCESS", sessionStatus: "COMPLETED", status: "READY" }))
  }, [location.pathname, orderId, user?.id])

  const value = useMemo<CheckoutContextValue>(() => ({
    ...state,
    setStep: (currentStep) => setState((current) => ({ ...current, currentStep })),
    selectAddress: async (address) => {
      const error = checkoutService.validateCart(cart) ?? await checkoutService.validateAddress(address, cart)
      if (error) { setState((current) => ({ ...current, error, status: "ERROR" })); return false }
      const options = await deliveryService.getDeliveryOptions(address.postalCode, cart.items)
      const selected = options.find((option) => option.available)?.id ?? ""
      setState((current) => ({ ...current, selectedAddressId: address.id, deliveryOptions: options, selectedDeliveryOptionId: selected, pricing: checkoutService.calculatePricing(cart, options.find((option) => option.id === selected)?.fee ?? 0, current.coupon), error: undefined, status: "READY", currentStep: "DELIVERY" }))
      analytics.track("CHECKOUT_ADDRESS_SELECTED", { addressId: address.id })
      return true
    },
    selectDelivery: (option) => { analytics.track("CHECKOUT_DELIVERY_SELECTED", { deliveryOptionId: option.id }); setState((current) => ({ ...current, selectedDeliveryOptionId: option.id, pricing: checkoutService.calculatePricing(cart, option.fee, current.coupon), currentStep: "REVIEW" })) },
    applyCoupon: (code) => {
      const result = checkoutService.applyCoupon(cart, code)
      if ("recovery" in result) { setState((current) => ({ ...current, error: result, status: "ERROR" })); return }
      setState((current) => ({ ...current, coupon: result, pricing: checkoutService.calculatePricing(cart, current.pricing.deliveryFee, result), error: undefined, status: "READY" }))
    },
    setPaymentMethod: (paymentMethod) => setState((current) => ({ ...current, paymentMethod })),
    placeOrder: async () => {
      if (!user || !state.paymentMethod || !state.selectedAddressId || submittingRef.current) return
      const address = state.addresses.find((item) => item.id === state.selectedAddressId)
      if (!address) return
      setState((current) => ({ ...current, status: "LOADING", sessionStatus: "PROCESSING", currentStep: "PROCESSING", error: undefined }))
      submittingRef.current = true
      checkoutSessionStorage.set({ checkoutSessionId: state.checkoutSessionId, idempotencyKey: state.idempotencyKey, status: "PROCESSING" })
      try {
        const authoritativePricing = pricingService.validateEstimate(state.pricing)
        if (state.coupon) {
          const couponValidation = checkoutService.applyCoupon(cart, state.coupon.code)
          if ("recovery" in couponValidation) {
            setState((current) => ({ ...current, status: "ERROR", sessionStatus: "ACTIVE", error: couponValidation }))
            return
          }
        }
        analytics.track("PAYMENT_INITIATED", { method: state.paymentMethod })
        const paymentAttemptId = newId("payment")
        const intent = await paymentService.createPaymentIntent(authoritativePricing.total, authoritativePricing.currency, state.paymentMethod, `${state.idempotencyKey}-${paymentAttemptId}`)
        const payment = await paymentService.verifyPayment(await paymentService.processPayment(intent))
        if (payment.outcome === "FAILURE") { analytics.track("PAYMENT_FAILED", { code: "PAYMENT_DECLINED" }); throw paymentService.toError(payment) }
        if (payment.outcome === "PENDING") {
          analytics.track("PAYMENT_PENDING", {})
          checkoutSessionStorage.set({ checkoutSessionId: state.checkoutSessionId, idempotencyKey: state.idempotencyKey, paymentAttemptId, status: "PROCESSING" })
          setState((current) => ({ ...current, status: "ERROR", sessionStatus: "PROCESSING", error: { code: "CHECKOUT_EXPIRED", message: "Your payment is still being verified.", recovery: "Check payment status before retrying.", retryable: false } }))
          return
        }
        const order = await orderService.createOrderFromCheckout(user.id, address, {
          delivery: state.deliveryOptions.find((option) => option.id === state.selectedDeliveryOptionId),
          coupon: state.coupon,
          pricing: authoritativePricing,
          paymentMethod: state.paymentMethod,
          checkoutSessionId: state.checkoutSessionId,
          paymentAttemptId,
          idempotencyKey: state.idempotencyKey,
        })
        analytics.track("PAYMENT_SUCCEEDED", {})
        analytics.track("ORDER_CREATED", { orderId: order.id })
        analytics.track("ORDER_CONFIRMED", { orderId: order.id })
        clearCart()
        setState((current) => ({ ...current, order, status: "READY", sessionStatus: "COMPLETED", currentStep: "SUCCESS" }))
        checkoutSessionStorage.set({ checkoutSessionId: state.checkoutSessionId, idempotencyKey: state.idempotencyKey, paymentAttemptId, status: "COMPLETED" })
        navigate(`/checkout/success/${order.id}`)
      } catch (error) {
        const apiError = typeof error === "object" && error !== null && "code" in error && typeof error.code === "string" ? error as { code: string; message?: string; recoveryAction?: string } : undefined
        const orderFailure = apiError?.code === "SERVER_ERROR" || apiError?.code === "ORDER_CREATION_FAILED"
        setState((current) => ({ ...current, status: "ERROR", sessionStatus: orderFailure ? "PROCESSING" : "ACTIVE", currentStep: "PAYMENT", error: { code: orderFailure ? "CHECKOUT_EXPIRED" : "VALIDATION_ERROR", message: orderFailure ? "Your payment was received, and we're verifying the order status." : apiError?.message ?? "We couldn't complete payment.", recovery: orderFailure ? "Check your orders before trying again." : apiError?.recoveryAction ?? "Try another payment method.", retryable: !orderFailure } }))
      } finally {
        submittingRef.current = false
      }
    },
    refresh,
    clearError: () => setState((current) => ({ ...current, error: undefined, status: "READY" })),
  }), [state, cart, cartItems, user?.id])
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useCheckout() {
  const value = useContext(Context)
  if (!value) throw new Error("CheckoutProvider missing")
  return value
}
