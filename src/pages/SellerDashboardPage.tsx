import { useState } from "react"
import { Link } from "react-router-dom"
import { useStore } from "../context/StoreContext"
import { sellerService } from "../services/sellerService"
import { inventoryService } from "../services/inventoryService"
import { sellerOrderService } from "../services/sellerOrderService"
import type { SellerProduct } from "../types/seller"
import { warehouseService } from "../services/warehouseService"
import { settlementService } from "../services/settlementService"

export default function SellerDashboardPage() {
  const { user, notify } = useStore()
  const [products, setProducts] = useState<SellerProduct[]>([])
  if (!user) return null
  const load = async () => setProducts(await sellerService.getSellerProducts(user.id === "demo-seller" ? "seller-demo" : user.id))
  const sellerId = "seller-demo"
  const orders = sellerOrderService.getSellerOrders(sellerId)
  return <section className="section container"><div className="section-head"><div><span className="eyebrow">SELLER WORKSPACE</span><h1>Seller operations</h1></div><Link className="auth-link" to="/seller/onboarding">Seller onboarding</Link></div><div className="stats"><div className="stat"><small>Products</small><strong>{products.length}</strong></div><div className="stat"><small>Seller orders</small><strong>{orders.length}</strong></div><div className="stat"><small>Warehouses</small><strong>{warehouseService.getWarehouses(sellerId).length}</strong></div><div className="stat"><small>Settlements</small><strong>{settlementService.getSettlements(sellerId).length}</strong></div></div><div className="panel"><button className="btn" type="button" onClick={() => void load()}>LOAD CATALOG</button><p>Catalog approval and inventory operations are service-backed mock workflows.</p>{products.map((product) => <div className="order-card" key={product.productId}><div><strong>{product.productId}</strong><p>Approval: {product.approvalStatus}</p></div><button className="btn secondary" type="button" onClick={() => { try { inventoryService.adjust(product.variants[0]?.sku ?? product.productId, sellerId, 1, "Seller stock adjustment"); notify("Inventory adjusted") } catch { notify("Inventory adjustment failed") } }}>ADJUST STOCK</button></div>)}</div></section>
}
