import type { Order } from "../../types/order"

export default function OrderTimeline({ order }: { order: Order }) {
  const steps = ["Order placed", "Payment confirmed", "Processing", "Shipped", "Delivered"]
  const current = order.status === "cancelled" ? 0 : order.status === "pending" ? 0 : order.status === "confirmed" ? 1 : order.status === "processing" ? 2 : order.status === "shipped" ? 3 : 4
  return <ol aria-label="Order timeline" className="steps">{steps.map((step, index) => <li key={step} aria-current={index === current ? "step" : undefined}><strong>{index <= current ? "✓" : "○"} {step}</strong></li>)}</ol>
}
