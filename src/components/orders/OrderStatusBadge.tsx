import type { OrderStatus } from "../../types/order"

const labels: Record<OrderStatus, string> = {
  pending: "Payment pending", confirmed: "Confirmed", processing: "Processing", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled",
}
export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className="status" aria-label={`Order status: ${labels[status]}`}>{labels[status]}</span>
}
