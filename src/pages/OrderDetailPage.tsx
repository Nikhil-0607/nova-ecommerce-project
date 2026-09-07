import { Link, useParams } from "react-router-dom"
import SEO from "../components/seo/SEO"
import { useStore } from "../context/StoreContext"
import { orderService } from "../services/orderService"

export default function OrderDetailPage() {
  const { orderId = "" } = useParams()
  const { user } = useStore()
  const order = user ? orderService.getOrderById(user.id, orderId) : undefined

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
        <p className="status">{order.status}</p>
        <div className="cart-layout">
          <div>
            {order.items.map((item) => (
              <div className="cart-item" key={`${item.productId}:${item.variantId ?? "product"}`}>
                <img src={item.image} alt={item.productName} />
                <div><b>{item.brandName}</b><p>{item.productName}</p>{(item.size || item.color) && <p>{item.size && `Size: ${item.size}`}{item.size && item.color && " · "}{item.color && `Color: ${item.color}`}</p>}<p>Qty: {item.quantity}</p><strong>{order.currency} {item.unitPrice.toLocaleString()}</strong></div>
              </div>
            ))}
          </div>
          <aside className="summary">
            <h3>PRICE DETAILS</h3>
            <p>Subtotal <span>{order.currency} {order.subtotal.toLocaleString()}</span></p>
            <p>Discount <span>-{order.currency} {order.discount.toLocaleString()}</span></p>
            <p>Delivery <span>{order.currency} {order.deliveryFee.toLocaleString()}</span></p>
            <p>Tax <span>{order.currency} {order.tax.toLocaleString()}</span></p>
            <hr />
            <h3>Total <span>{order.currency} {order.total.toLocaleString()}</span></h3>
          </aside>
        </div>
        <div className="panel"><h2>Shipping address</h2><p>{order.shippingAddress.fullName}<br />{order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 && <><br />{order.shippingAddress.addressLine2}</>}<br />{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />{order.shippingAddress.country}<br />{order.shippingAddress.phone}</p></div>
      </section>
    </>
  )
}
