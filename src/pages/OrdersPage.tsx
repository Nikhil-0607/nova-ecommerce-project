import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import SEO from "../components/seo/SEO"
import { useStore } from "../context/StoreContext"
import { orderService } from "../services/orderService"
import type { Order } from "../types/order"

export default function OrdersPage() {
  const { user } = useStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) return
    setLoading(true)
    setError("")
    try {
      setOrders(orderService.getOrders(user.id))
    } catch {
      setError("We couldn't load your orders. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  return (
    <>
      <SEO title="My Orders | NOVA" description="View your NOVA orders." robots="noindex,nofollow" />
      <section className="section container">
        <h1>Orders</h1>
        {loading && <p role="status">Loading your orders...</p>}
        {!loading && error && <div className="panel auth-error" role="alert"><p>{error}</p></div>}
        {!loading && !error && orders.length === 0 && (
          <div className="empty"><h2>No orders yet</h2><p>Your completed purchases will appear here.</p><Link className="btn" to="/products">START SHOPPING</Link></div>
        )}
        {!loading && !error && orders.map((order) => (
          <div className="order-card" key={order.id}>
            <div>
              <b>Order #{order.orderNumber}</b>
              <p>{order.items.reduce((count, item) => count + item.quantity, 0)} Items · {order.currency} {order.total.toLocaleString()}</p>
            </div>
            <span className="status">{order.status}</span>
            <Link to={`/orders/${order.id}`}>VIEW DETAILS →</Link>
          </div>
        ))}
      </section>
    </>
  )
}
