import type { OrderItem as Snapshot } from "../../types/order"

export default function OrderItem({ item }: { item: Snapshot }) {
  return <article className="cart-item"><img src={item.image} alt={item.productName} /><div><strong>{item.brandName}</strong><p>{item.productName}</p>{(item.size || item.color) && <p>{item.size && `Size: ${item.size}`}{item.size && item.color && " · "}{item.color && `Color: ${item.color}`}</p>}<p>Qty: {item.quantity}</p><strong>₹{item.unitPrice.toLocaleString("en-IN")}</strong></div></article>
}
