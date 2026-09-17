import type { Order } from "../../types/order"

const money = (currency: string, value: number) => `${currency} ${value.toLocaleString("en-IN")}`
export default function PriceBreakdown({ order }: { order: Order }) {
  return <div className="summary"><h2>PRICE DETAILS</h2><p>Subtotal <span>{money(order.currency, order.subtotal)}</span></p><p>Discount <span>-{money(order.currency, order.discount)}</span></p>{order.coupon && <p>Coupon ({order.coupon.code}) <span>-{money(order.currency, order.coupon.discountAmount)}</span></p>}<p>Delivery <span>{money(order.currency, order.deliveryFee)}</span></p><p>Tax <span>{money(order.currency, order.tax)}</span></p><h3>Total <span>{money(order.currency, order.total)}</span></h3></div>
}
