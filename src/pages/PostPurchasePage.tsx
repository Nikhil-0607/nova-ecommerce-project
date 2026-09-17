import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import SEO from "../components/seo/SEO"
import ShipmentCard from "../components/orders/ShipmentCard"
import { useStore } from "../context/StoreContext"
import { orderService } from "../services/orderService"
import { trackingService } from "../services/trackingService"
import { returnService } from "../services/returnService"
import { exchangeService } from "../services/exchangeService"
import { refundService } from "../services/refundService"
import { invoiceService } from "../services/invoiceService"
import { supportService } from "../services/supportService"
import { useNavigate, Navigate } from "react-router-dom"

export default function PostPurchasePage() {
  const { orderId = "", action = "" } = useParams()
  const { user, notify } = useStore()
  const navigate = useNavigate()
  const order = user ? orderService.getOrderById(user.id, orderId) : undefined
  const validActions = ["tracking", "return", "exchange", "refund", "invoice", "support"] as const
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [reason, setReason] = useState("Changed my mind")
  const [slot, setSlot] = useState(returnService.getPickupSlots()[0])
  const [method, setMethod] = useState("Original payment method")
  const [description, setDescription] = useState("")
  if (!order) return <section className="section container"><div className="empty" role="alert"><h1>Order unavailable</h1><p>This order is not available to your account.</p><Link to="/orders">BACK TO ORDERS</Link></div></section>
  if (!validActions.includes(action as typeof validActions[number])) return <Navigate to="/orders" replace />
  const itemIds = order.items.map((item) => `${item.productId}:${item.variantId ?? "product"}`)
  const submitReturn = () => { const result = returnService.checkEligibility(order, selectedItems); if (!result.eligible) { notify(result.message); return }; const request = returnService.createReturn(order, selectedItems, reason, slot, method); notify(`Return request ${request.id} created`); navigate(`/orders/${order.id}`) }
  const submitExchange = () => { const itemId = selectedItems[0]; if (!itemId || !exchangeService.checkEligibility(order, itemId)) { notify("Select an eligible delivered item."); return }; const request = exchangeService.createExchange(order, itemId, reason, exchangeService.getOptions()[0], slot); notify(`Exchange request ${request.id} created`); navigate(`/orders/${order.id}`) }
  const invoice = invoiceService.getInvoice(order)
  return <><SEO title={`${action || "Order"} | NOVA`} description="Manage your NOVA order." robots="noindex,nofollow" /><section className="section container"><Link to={`/orders/${order.id}`}>← Back to order</Link><h1>{action === "tracking" ? "Track order" : action === "return" ? "Request return" : action === "exchange" ? "Request exchange" : action === "refund" ? "Refund details" : action === "invoice" ? "Invoice" : "Contact support"}</h1>{action === "tracking" && trackingService.getShipments(order).map((shipment) => <ShipmentCard key={shipment.id} shipment={shipment} />)}{action === "invoice" && <div className="panel"><h2>Invoice</h2><p>Invoice number: {invoice.invoiceNumber}</p><p>Order: #{order.orderNumber}</p><p>Issued: {new Date(invoice.issuedAt).toLocaleDateString()}</p><button className="btn" type="button" onClick={() => window.print()}>PRINT / SAVE INVOICE</button></div>}{action === "refund" && <div className="panel"><h2>Refund status</h2><p>Amount: ₹{refundService.getRefund(order).amount.toLocaleString("en-IN")}</p><p>Status: {refundService.getRefund(order).status.replaceAll("_", " ")}</p><p>Reference: {refundService.getRefund(order).reference}</p></div>}{(action === "return" || action === "exchange") && <div className="panel"><h2>Select items</h2>{order.items.map((item, index) => { const id = itemIds[index]; return <label key={id} style={{ display: "block", margin: "12px 0" }}><input type={action === "exchange" ? "radio" : "checkbox"} name="item" checked={selectedItems.includes(id)} onChange={() => setSelectedItems(action === "exchange" ? [id] : selectedItems.includes(id) ? selectedItems.filter((value) => value !== id) : [...selectedItems, id])} /> {item.productName} · Qty {item.quantity}</label>})}<label>Reason<select value={reason} onChange={(event) => setReason(event.target.value)}><option>Wrong size</option><option>Damaged product</option><option>Changed my mind</option><option>Quality issue</option></select></label><label>Pickup slot<select value={slot} onChange={(event) => setSlot(event.target.value)}>{returnService.getPickupSlots().map((value) => <option key={value}>{value}</option>)}</select></label>{action === "return" && <label>Refund method<select value={method} onChange={(event) => setMethod(event.target.value)}><option>Original payment method</option><option>UPI</option><option>Store credit</option></select></label>}<button className="btn" type="button" onClick={action === "return" ? submitReturn : submitExchange}>SUBMIT {action.toUpperCase()} REQUEST</button></div>}{action === "support" && <div className="panel"><label>Issue details<textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={5} /></label><button className="btn" type="button" onClick={() => { const ticket = supportService.createTicket(order.id, "Other", description); notify(`Support ticket ${ticket.id} created`); navigate(`/orders/${order.id}`) }}>CREATE SUPPORT TICKET</button></div>}</section></>
}
