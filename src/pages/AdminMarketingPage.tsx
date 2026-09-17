import { useState } from "react"
import { useStore } from "../context/StoreContext"
import { adminService } from "../services/adminService"
import { marketingService } from "../services/marketingService"

export default function AdminMarketingPage() {
  const { user, notify } = useStore()
  const [name, setName] = useState("")
  const [reason, setReason] = useState("")
  const [message, setMessage] = useState("")
  const create = () => { try { adminService.require(user?.role, "FEATURE_FLAG_UPDATE", reason); const campaign = marketingService.createCampaign(user?.role, { name, productIds: [], audience: "All customers" }, reason); adminService.record(user?.id ?? "unknown", "CAMPAIGN_CREATED", campaign.id, reason); setMessage(`Campaign ${campaign.id} created.`) } catch { setMessage("Admin permission and an audit reason are required.") } }
  return <section className="section container"><span className="eyebrow">MARKETING OPERATIONS</span><h1>Campaigns & journeys</h1><div className="panel"><label htmlFor="campaign-name">Campaign name</label><input id="campaign-name" value={name} onChange={(event) => setName(event.target.value)} /><label htmlFor="campaign-reason">Reason</label><input id="campaign-reason" value={reason} onChange={(event) => setReason(event.target.value)} /><button className="btn" type="button" onClick={create}>CREATE CAMPAIGN</button>{message && <p role="status">{message}</p>}</div><div className="panel"><h2>Segments</h2>{marketingService.getSegments().map((segment) => <p key={segment.id}>{segment.name} · {segment.rule}</p>)}</div><div className="panel"><h2>Campaigns</h2>{marketingService.getCampaigns().map((campaign) => <p key={campaign.id}>{campaign.name} · {campaign.status}</p>) || <p>No campaigns yet.</p>}</div></section>
}
