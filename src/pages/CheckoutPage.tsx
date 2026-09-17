import { useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import SEO from "../components/seo/SEO"
import { useCheckout } from "../context/CheckoutContext"
import { useStore } from "../context/StoreContext"
import type { PaymentMethod } from "../types/payment"

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`

function Summary() {
  const { cartItems, pricing, coupon } = useCheckout()
  return <aside className="summary" aria-label="Order summary">
    <h2>PRICE DETAILS</h2>
    <p>Items <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span></p>
    <p>MRP <span>{money(pricing.totalMRP)}</span></p>
    <p>Product discount <span>-{money(pricing.productDiscount)}</span></p>
    {coupon && <p>Coupon ({coupon.code}) <span>-{money(pricing.couponDiscount)}</span></p>}
    <p>Delivery <span>{pricing.deliveryFee ? money(pricing.deliveryFee) : "FREE"}</span></p>
    <h3>Total <span>{money(pricing.total)}</span></h3>
  </aside>
}

export default function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { order, cartItems, addresses, selectedAddressId, deliveryOptions, selectedDeliveryOptionId, pricing, paymentMethods, status, error, paymentMethod, setStep, selectAddress, selectDelivery, applyCoupon, setPaymentMethod, placeOrder, refresh } = useCheckout()
  const { user } = useStore()
  const [couponCode, setCouponCode] = useState("")
  const path = location.pathname
  const isSuccess = path.startsWith("/checkout/success")
  const step = path.includes("/delivery") ? "DELIVERY" : path.includes("/review") ? "REVIEW" : path.includes("/payment") ? "PAYMENT" : "ADDRESS"

  if (!user) return <section className="section container"><div className="empty"><h1>Sign in to checkout</h1><Link className="btn" to="/login?redirect=/checkout">SIGN IN</Link></div></section>
  if (isSuccess && order) return <section className="section container"><SEO title="Order confirmed | NOVA" description="Your order confirmation." robots="noindex,nofollow" /><div className="panel"><span className="eyebrow">NOVA ORDER</span><h1>Order confirmed</h1><p>Your order <strong>#{order.orderNumber}</strong> is confirmed.</p><p>Payment status: {order.paymentStatus}</p><p>Total: {money(order.total)}</p><Link className="btn" to={`/orders/${order.id}`}>VIEW ORDER</Link> <Link className="btn secondary" to="/products">CONTINUE SHOPPING</Link></div></section>
  if (!cartItems.length) return <section className="section container"><SEO title="Checkout | NOVA" description="Your checkout." robots="noindex,nofollow" /><div className="empty"><h1>Your bag is empty</h1><Link className="btn" to="/products">CONTINUE SHOPPING</Link></div></section>

  const message = error ? <div className="panel auth-error" role="alert"><p>{error.message}</p><p>{error.recovery}</p><button className="btn secondary" type="button" onClick={() => void refresh()}>TRY AGAIN</button></div> : null
  return <section className="section container">
    <SEO title="Checkout | NOVA" description="Complete your NOVA order." robots="noindex,nofollow" />
    <div className="section-head"><div><span className="eyebrow">SECURE CHECKOUT</span><h1>Checkout</h1></div><Link className="auth-link" to="/cart">EDIT CART</Link></div>
    <nav className="steps" aria-label="Checkout progress"><b aria-current={step === "ADDRESS" ? "step" : undefined}>1 Address</b><span>→</span><b aria-current={step === "DELIVERY" ? "step" : undefined}>2 Delivery</b><span>→</span><b aria-current={step === "REVIEW" ? "step" : undefined}>3 Review</b><span>→</span><b aria-current={step === "PAYMENT" ? "step" : undefined}>4 Payment</b></nav>
    {message}
    <div className="cart-layout">
      <div className="panel">
        {step === "ADDRESS" && <AddressStep addresses={addresses} selectedAddressId={selectedAddressId} onSelect={(id) => { const address = addresses.find((item) => item.id === id); if (address) void selectAddress(address).then((valid) => { if (valid) navigate("/checkout/delivery") }) }} />}
        {step === "DELIVERY" && <DeliveryStep options={deliveryOptions} selectedId={selectedDeliveryOptionId} onSelect={(id) => { const option = deliveryOptions.find((item) => item.id === id); if (option) { selectDelivery(option); navigate("/checkout/review") } }} onBack={() => { setStep("ADDRESS"); navigate("/checkout/address") }} />}
        {step === "REVIEW" && <ReviewStep pricing={pricing} couponCode={couponCode} setCouponCode={setCouponCode} applyCoupon={applyCoupon} onEditAddress={() => navigate("/checkout/address")} onEditDelivery={() => navigate("/checkout/delivery")} onContinue={() => navigate("/checkout/payment")} />}
        {step === "PAYMENT" && <PaymentStep methods={paymentMethods} method={paymentMethod} setMethod={setPaymentMethod} submitting={status === "LOADING"} onBack={() => navigate("/checkout/review")} onPlace={() => void placeOrder()} />}
      </div>
      <Summary />
    </div>
  </section>
}

function AddressStep({ addresses, selectedAddressId, onSelect }: { addresses: Awaited<ReturnType<typeof import("../services/customerService").customerService.getAddresses>>; selectedAddressId: string; onSelect: (id: string) => void }) {
  const navigate = useNavigate()
  return <><h2>Delivery address</h2><p>Select where you would like your order delivered.</p>{addresses.length === 0 && <div className="empty"><p>No saved addresses yet.</p><Link className="btn" to="/account/addresses">ADD ADDRESS</Link></div>}{addresses.map((address) => <label className="panel" style={{ display: "block", marginBottom: 12 }} key={address.id}><input type="radio" name="checkout-address" checked={selectedAddressId === address.id} onChange={() => onSelect(address.id)} /> <strong>{address.addressType}</strong><br />{address.fullName}, {address.addressLine1}, {address.city}, {address.postalCode}</label>)}{addresses.length > 0 && <button className="btn secondary" type="button" onClick={() => navigate("/account/addresses")}>ADD OR EDIT ADDRESS</button>}</>
}

function DeliveryStep({ options, selectedId, onSelect, onBack }: { options: { id: string; name: string; description: string; fee: number; estimatedDeliveryDate: string; available: boolean }[]; selectedId: string; onSelect: (id: string) => void; onBack: () => void }) {
  return <><h2>Delivery method</h2>{options.map((option) => <label className="panel" style={{ display: "block", marginBottom: 12 }} key={option.id}><input type="radio" name="delivery-option" checked={selectedId === option.id} disabled={!option.available} onChange={() => onSelect(option.id)} /> <strong>{option.name}</strong> — {option.fee ? money(option.fee) : "FREE"}<p>{option.description} Arrives by {option.estimatedDeliveryDate}.</p></label>)}<button className="btn secondary" type="button" onClick={onBack}>BACK</button></>
}

function ReviewStep({ pricing, couponCode, setCouponCode, applyCoupon, onEditAddress, onEditDelivery, onContinue }: { pricing: { total: number }; couponCode: string; setCouponCode: (value: string) => void; applyCoupon: (value: string) => void; onEditAddress: () => void; onEditDelivery: () => void; onContinue: () => void }) {
  return <><h2>Review order</h2><p>Review your address, delivery method, items, and provisional total before payment.</p><button className="auth-link" type="button" onClick={onEditAddress}>CHANGE ADDRESS</button> <button className="auth-link" type="button" onClick={onEditDelivery}>CHANGE DELIVERY</button><div className="auth-field"><label htmlFor="coupon-code">Coupon code</label><input id="coupon-code" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Try NOVA10" /><button className="btn secondary" type="button" onClick={() => applyCoupon(couponCode)}>APPLY COUPON</button></div><p>Frontend pricing is provisional and will be validated by the future backend.</p><button className="btn" type="button" onClick={onContinue}>CONTINUE TO PAYMENT ({money(pricing.total)})</button></>
}

function PaymentStep({ methods, method, setMethod, submitting, onBack, onPlace }: { methods: { id: PaymentMethod; name: string; description: string; available: boolean }[]; method?: PaymentMethod; setMethod: (method: PaymentMethod) => void; submitting: boolean; onBack: () => void; onPlace: () => void }) {
  return <><h2>Payment</h2><p>Demo payment methods only. No credentials are stored or sent to a gateway.</p>{methods.map((item) => <label style={{ display: "block", margin: "12px 0" }} key={item.id}><input type="radio" name="payment-method" checked={method === item.id} disabled={!item.available} onChange={() => setMethod(item.id)} /> {item.name} <small>{item.description}</small></label>)}<button className="btn secondary" type="button" onClick={onBack}>BACK</button> <button className="btn" type="button" disabled={!method || submitting} onClick={onPlace}>{submitting ? "PROCESSING..." : "PAY AND PLACE ORDER"}</button></>
}
