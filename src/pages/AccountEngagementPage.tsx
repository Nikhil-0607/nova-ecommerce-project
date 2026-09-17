import { useEffect, useState } from "react"
import { useStore } from "../context/StoreContext"
import AccountLayout from "../components/account/AccountLayout"
import SEO from "../components/seo/SEO"
import { engagementService } from "../services/engagementService"
import { membershipService } from "../services/membershipService"
import { productService } from "../services/productService"
import { searchService } from "../services/searchService"
import { recentlyViewedService } from "../services/recentlyViewedService"
import { analytics } from "../services/analyticsService"
import type { CustomerPreferences, MarketingConsent } from "../types/engagement"

export default function AccountEngagementPage() {
  const { user, notify } = useStore()
  const [preferences, setPreferences] = useState<CustomerPreferences>({ categories: [], brands: [], sizes: [] })
  const [consent, setConsent] = useState<MarketingConsent>()
  const [recent, setRecent] = useState<string[]>([])
  const [viewed, setViewed] = useState<string[]>([])
  const [alertProduct, setAlertProduct] = useState("")
  useEffect(() => {
    if (!user) return
    setPreferences(engagementService.getPreferences(user.id))
    setConsent(engagementService.getConsent(user.id))
    void searchService.getRecentSearches().then((items) => setRecent(items.map((item) => item.query)))
    setViewed(recentlyViewedService.getRecentlyViewed().map((item) => item.productId))
  }, [user?.id])
  if (!user || !consent) return null
  const membership = membershipService.getMembership(user.id)
  const createAlert = async () => {
    const product = await productService.getProductById(alertProduct.trim())
    if (!product) { notify("Enter a valid product ID"); return }
    const type = product.stockStatus === "out-of-stock" ? "BACK_IN_STOCK" : "PRICE_DROP"
    engagementService.upsertAlert(user.id, product.id, type)
    analytics.track("ALERT_CREATED", { type })
    notify("Alert saved")
  }
  return <><SEO title="Preferences | NOVA" description="Manage your NOVA engagement preferences." robots="noindex,nofollow" /><section className="section container"><AccountLayout><section className="account-section"><span className="eyebrow">ENGAGEMENT</span><h1>Preferences & rewards</h1><div className="panel"><h2>Marketing consent</h2><label><input type="checkbox" checked={consent.email} onChange={(event) => setConsent({ ...consent, email: event.target.checked })} /> Email offers</label><label><input type="checkbox" checked={consent.push} onChange={(event) => setConsent({ ...consent, push: event.target.checked })} /> Push notifications</label><label><input type="checkbox" checked={consent.personalizedRecommendations} onChange={(event) => setConsent({ ...consent, personalizedRecommendations: event.target.checked })} /> Personalized recommendations</label><button className="btn" type="button" onClick={() => { engagementService.saveConsent(user.id, consent); analytics.track("CONSENT_UPDATED", { email: consent.email, push: consent.push, personalizedRecommendations: consent.personalizedRecommendations }); notify("Preferences saved") }}>SAVE CONSENT</button></div><div className="panel"><h2>Price-drop and back-in-stock alerts</h2><label htmlFor="alert-product">Product ID</label><input id="alert-product" value={alertProduct} onChange={(event) => setAlertProduct(event.target.value)} placeholder="nv-men-001" /><button className="btn secondary" type="button" onClick={() => void createAlert()}>CREATE ALERT</button></div><div className="panel"><h2>Loyalty</h2><p>{engagementService.getLoyalty(user.id).points} points · {engagementService.getLoyalty(user.id).tier} tier</p><p>Points are mock rewards and never represent cash value.</p></div><div className="panel"><h2>Membership</h2>{membership ? <p>{membership.planId} · {membership.status}</p> : <button className="btn secondary" type="button" onClick={() => { const joined = membershipService.join(user.id, "nova-core"); analytics.track("MEMBERSHIP_JOINED", { planId: joined.planId }); notify("Membership activated") }}>JOIN NOVA CORE</button>}</div><div className="panel"><h2>Recently searched</h2><p>{recent.length ? recent.join(" · ") : "No recent searches."}</p><h2>Recently viewed</h2><p>{viewed.length ? viewed.join(" · ") : "No recently viewed products."}</p></div><button className="btn" type="button" onClick={() => { engagementService.savePreferences(user.id, preferences); analytics.track("PREFERENCE_UPDATED", {}); notify("Shopping preferences saved") }}>SAVE SHOPPING PREFERENCES</button></section></AccountLayout></section></>
}
