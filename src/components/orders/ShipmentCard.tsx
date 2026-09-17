import type { Shipment } from "../../types/postPurchase"

export default function ShipmentCard({ shipment }: { shipment: Shipment }) {
  return <div className="panel"><h3>{shipment.carrier}</h3><p>Tracking ID: <strong>{shipment.trackingId}</strong></p><p>Status: {shipment.status.replaceAll("_", " ")} · Estimated {shipment.estimatedDeliveryDate}</p><ol aria-label="Shipment tracking timeline" className="steps">{shipment.events.map((event) => <li key={event.id}><strong>{event.completed ? "✓" : "○"} {event.label}</strong><small> {event.description}</small></li>)}</ol></div>
}
