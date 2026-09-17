import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import SEO from "../components/seo/SEO"
import { useStore } from "../context/StoreContext"
import { orderService } from "../services/orderService"
import type { Order } from "../types/order"
import OrderCard from "../components/orders/OrderCard"

export default function OrdersPage() {
  const { user } = useStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")

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

  const filtered = orders.filter((order) => {
    const needle = query.trim().toLowerCase()
    const text = [order.orderNumber, order.id, ...order.items.flatMap((item) => [item.productName, item.brandName])].join(" ").toLowerCase()
    return (!needle || text.includes(needle)) && (status === "all" || order.status === status)
  })
  return (
    <>
      <SEO title="My Orders | NOVA" description="View your NOVA orders." robots="noindex,nofollow" />
      <section className="section container">
        <div className="section-head"><div><span className="eyebrow">ACCOUNT</span><h1>My Orders</h1></div><Link className="auth-link" to="/products">CONTINUE SHOPPING</Link></div>
        <div className="order-filters"><label htmlFor="order-search">Search orders</label><input id="order-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Order ID, product, brand" /><select aria-label="Filter orders by status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All orders</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></div>
        {loading && <p role="status">Loading your orders...</p>}
        {!loading && error && <div className="panel auth-error" role="alert"><p>{error}</p></div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="empty"><h2>{orders.length ? "No orders found" : "No orders yet"}</h2><p>{orders.length ? "Try a different order number, product, or status." : "Your purchased products will appear here."}</p><Link className="btn" to="/products">START SHOPPING</Link></div>
        )}
        {!loading && !error && filtered.map((order) => <OrderCard key={order.id} order={order} />)}
      </section>
    </>
  )
}
