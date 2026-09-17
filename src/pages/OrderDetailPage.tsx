import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import SEO from "../components/seo/SEO"
import { useStore } from "../context/StoreContext"
import { orderService } from "../services/orderService"
import OrderItem from "../components/orders/OrderItem"
import OrderTimeline from "../components/orders/OrderTimeline"
import PriceBreakdown from "../components/orders/PriceBreakdown"
import OrderStatusBadge from "../components/orders/OrderStatusBadge"
import { analytics } from "../services/analyticsService"

export default function OrderDetailPage() {
  const { orderId = "" } = useParams()
  const { user } = useStore()
  const order = user ? orderService.getOrderById(user.id, orderId) : undefined
  useEffect(() => {
    if (order) analytics.track("ORDER_VIEWED", { orderId: order.id })
  }, [order?.id])

  if (!order) {
    return (
      <>
        <SEO title="Order unavailable | NOVA" description="This order is not available." robots="noindex,nofollow" />
        <section className="section container">
          <div className="empty" role="alert"><h1>Order not found</h1><p>This order may no longer be available.</p><Link to="/orders">BACK TO ORDERS</Link></div>
        </section>
      </>
    )
  }

  return (
    <>
      <SEO title={`Order ${order.orderNumber} | NOVA`} description="View your NOVA order details." robots="noindex,nofollow" />
      <section className="section container">
        <Link to="/orders">← Back to orders</Link>
        <h1>Order #{order.orderNumber}</h1>
        <OrderStatusBadge status={order.status} />
        <OrderTimeline order={order} />
        <div className="panel"><h2>Order actions</h2><Link className="btn secondary" to={`/orders/${order.id}/tracking`} onClick={() => analytics.track("TRACK_ORDER_CLICKED", { orderId: order.id })}>TRACK ORDER</Link> {order.status === "delivered" && <><Link className="btn secondary" to={`/orders/${order.id}/return`} onClick={() => analytics.track("RETURN_STARTED", { orderId: order.id })}>RETURN</Link><Link className="btn secondary" to={`/orders/${order.id}/exchange`} onClick={() => analytics.track("EXCHANGE_STARTED", { orderId: order.id })}>EXCHANGE</Link></>}<Link className="auth-link" to={`/orders/${order.id}/invoice`} onClick={() => analytics.track("INVOICE_VIEWED", { orderId: order.id })}>VIEW INVOICE</Link><Link className="auth-link" to={`/orders/${order.id}/support`} onClick={() => analytics.track("SUPPORT_REQUESTED", { orderId: order.id })}>CONTACT SUPPORT</Link></div>
        <div className="cart-layout">
          <div>
            {order.items.map((item) => (
              <OrderItem item={item} key={`${item.productId}:${item.variantId ?? "product"}`} />
            ))}
          </div>
          <PriceBreakdown order={order} />
        </div>
        <div className="panel"><h2>Shipping address</h2><p>{order.shippingAddress.fullName}<br />{order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 && <><br />{order.shippingAddress.addressLine2}</>}<br />{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />{order.shippingAddress.country}<br />{order.shippingAddress.phone}</p></div>
      </section>
    </>
  )
}
