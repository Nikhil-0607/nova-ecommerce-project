import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import SEO from "../components/seo/SEO"
import { useStore } from "../context/StoreContext"
import { customerService } from "../services/customerService"
import { orderService } from "../services/orderService"
import type { Address } from "../types/address"
import type { Order } from "../types/order"

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { user, cartItems, cartSubtotal, cartTotal, clearCart } = useStore()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [order, setOrder] = useState<Order>()

  useEffect(() => {
    if (!user) return
    void customerService.getAddresses().then((result) => {
      setAddresses(result)
      setSelectedAddressId(result.find((address) => address.isDefault)?.id ?? result[0]?.id ?? "")
    }).catch(() => setError("We couldn't load your saved addresses. Please try again.")).finally(() => setLoading(false))
  }, [user?.id])

  const submit = async () => {
    const address = addresses.find((item) => item.id === selectedAddressId)
    if (!address) {
      setError("Select a delivery address to continue.")
      return
    }
    if (!user) return
    setSubmitting(true)
    setError("")
    try {
      const created = await orderService.createOrderFromCart(user.id, address)
      clearCart()
      setOrder(created)
    } catch {
      setError("We couldn't place your order. Your cart has been preserved.")
    } finally {
      setSubmitting(false)
    }
  }

  if (order) return <section className="section container"><SEO title="Order confirmed | NOVA" description="Your NOVA order has been placed." robots="noindex,nofollow" /><div className="panel"><h1>Order confirmed</h1><p>Your order <strong>#{order.orderNumber}</strong> has been placed.</p><Link className="btn" to={`/orders/${order.id}`}>VIEW ORDER</Link></div></section>
  if (!cartItems.length) return <section className="section container"><SEO title="Checkout | NOVA" description="Your NOVA checkout." robots="noindex,nofollow" /><div className="empty"><h1>Your bag is empty</h1><Link className="btn" to="/products">CONTINUE SHOPPING</Link></div></section>

  return (
    <section className="section container">
      <SEO title="Checkout | NOVA" description="Complete your NOVA order." robots="noindex,nofollow" />
      <h1>Checkout</h1>
      <div className="steps"><b>1 Address</b><span>→</span><b>2 Delivery</b><span>→</span><b>3 Payment</b><span>→</span><b>4 Confirmation</b></div>
      {error && <div className="panel auth-error" role="alert"><p>{error}</p></div>}
      {loading && <p role="status">Loading your saved addresses...</p>}
      {!loading && addresses.length === 0 && <div className="panel"><h2>No saved address</h2><p>Add an address in your account before checkout.</p><Link className="auth-link" to="/account/addresses">MANAGE ADDRESSES</Link></div>}
      {!loading && addresses.length > 0 && <div className="cart-layout"><div className="panel"><h2>Delivery address</h2><label htmlFor="checkout-address">Choose an address</label><select id="checkout-address" value={selectedAddressId} onChange={(event) => setSelectedAddressId(event.target.value)}>{addresses.map((address) => <option key={address.id} value={address.id}>{address.addressType}: {address.fullName}, {address.city} {address.postalCode}</option>)}</select><h2>Payment placeholder</h2><p>No payment credentials or real gateway are processed in this mock checkout.</p><button className="btn" type="button" onClick={() => void submit()} disabled={submitting}>{submitting ? "PLACING ORDER..." : "PLACE MOCK ORDER"}</button></div><aside className="summary"><h3>PRICE DETAILS</h3><p>Items <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span></p><p>Subtotal <span>{cartSubtotal.toLocaleString()}</span></p><h3>Total <span>₹{cartTotal.toLocaleString()}</span></h3></aside></div>}
    </section>
  )
}
