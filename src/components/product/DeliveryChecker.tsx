import { useState } from "react"
import { deliveryService, type DeliveryCheckResult } from "../../services/deliveryService"

export default function DeliveryChecker({ productId }: { productId: string }) {
  const [postalCode, setPostalCode] = useState("")
  const [result, setResult] = useState<DeliveryCheckResult>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const check = async () => {
    setLoading(true)
    setError("")
    setResult(undefined)
    try { setResult(await deliveryService.checkDeliveryAvailability(postalCode, productId)) }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to check delivery.") }
    finally { setLoading(false) }
  }
  return <section className="delivery-checker" aria-labelledby="delivery-title">
    <h3 id="delivery-title">Check delivery</h3>
    <div className="delivery-input"><label htmlFor="postal-code">PIN code</label><input id="postal-code" inputMode="numeric" maxLength={6} value={postalCode} onChange={(event) => setPostalCode(event.target.value.replace(/\D/g, ""))} placeholder="Enter 6-digit PIN" /><button type="button" className="btn" onClick={() => void check()} disabled={loading}>{loading ? "CHECKING…" : "CHECK"}</button></div>
    {error && <p className="delivery-error" role="alert">{error}</p>}
    {result && <p className={result.available ? "delivery-success" : "delivery-error"} role="status">{result.message}{result.estimatedDays ? ` Estimated delivery in ${result.estimatedDays} days.` : ""}</p>}
  </section>
}
