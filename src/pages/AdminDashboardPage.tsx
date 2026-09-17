import { useState } from "react"
import { useStore } from "../context/StoreContext"
import { adminService } from "../services/adminService"
import { sellerService } from "../services/sellerService"
import { Link } from "react-router-dom"

export default function AdminDashboardPage() {
  const { user, notify } = useStore()
  const [reason, setReason] = useState("")
  const [message, setMessage] = useState("")
  const approveFirst = async () => {
    if (!user) return
    try {
      adminService.require(user.role, "PRODUCT_APPROVE", reason)
      const products = await sellerService.getSellerProducts("seller-demo")
      const product = products[0]
      if (!product) return
      await sellerService.moderateProduct("ADMIN", product.productId, "APPROVED", reason)
      adminService.record(user.id, "PRODUCT_APPROVED", product.productId, reason)
      setMessage("Product approval recorded with audit event.")
    } catch { setMessage("Approval requires an admin role and a reason.") }
  }
  return <section className="section container"><span className="eyebrow">ENTERPRISE OPERATIONS</span><h1>Admin governance</h1><nav className="panel" aria-label="Admin operations"><Link className="auth-link" to="/admin/sellers">Sellers</Link> <Link className="auth-link" to="/admin/products">Products</Link> <Link className="auth-link" to="/admin/orders">Orders</Link> <Link className="auth-link" to="/admin/inventory">Inventory</Link> <Link className="auth-link" to="/admin/audit">Audit</Link> <Link className="auth-link" to="/admin/marketing">Marketing</Link></nav><div className="stats">{[["Seller catalog", "Approval"], ["Inventory", "Visibility"], ["Orders", "Investigation"], ["Audit", `${adminService.getAudit().length} events`]].map(([label, value]) => <div className="stat" key={label}><small>{label}</small><strong>{value}</strong></div>)}</div><div className="panel"><h2>Product moderation</h2><label htmlFor="admin-reason">Reason required for privileged actions</label><input id="admin-reason" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Enter an audit reason" /><button className="btn" type="button" onClick={() => void approveFirst()}>APPROVE FIRST PRODUCT</button>{message && <p role="status">{message}</p>}</div><div className="panel"><h2>Audit events</h2>{adminService.getAudit().map((event) => <p key={event.id}>{event.action} · {event.resource} · {event.reason}</p>)}</div></section>
}
