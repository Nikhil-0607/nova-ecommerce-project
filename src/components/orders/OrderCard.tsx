import { Link } from "react-router-dom"
import type { Order } from "../../types/order"
import OrderStatusBadge from "./OrderStatusBadge"

export default function OrderCard({ order }: { order: Order }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
  return <article className="order-card"><div><strong>Order #{order.orderNumber}</strong><p>Placed {new Date(order.createdAt).toLocaleDateString()} · {itemCount} items · {order.currency} {order.total.toLocaleString("en-IN")}</p>{order.items[0] && <p>{order.items[0].productName}{order.items.length > 1 ? ` + ${order.items.length - 1} more` : ""}</p>}</div><OrderStatusBadge status={order.status} /><div><Link className="btn secondary" to={`/orders/${order.id}`}>VIEW ORDER</Link> <Link className="auth-link" to={`/orders/${order.id}/tracking`}>TRACK</Link></div></article>
}
