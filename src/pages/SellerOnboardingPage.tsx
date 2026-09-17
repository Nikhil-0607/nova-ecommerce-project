import { useState } from "react"
import { Link } from "react-router-dom"
import { sellerService } from "../services/sellerService"

export default function SellerOnboardingPage() {
  const [businessName, setBusinessName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [message, setMessage] = useState("")
  const submit = async () => {
    try {
      const application = await sellerService.submitApplication({ businessName, contactEmail })
      setMessage(`Application ${application.id} submitted for review.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We couldn't submit your application.")
    }
  }
  return <section className="section container"><span className="eyebrow">NOVA BUSINESS</span><h1>Seller onboarding</h1><div className="panel"><p>Submit your business details for mock review. Approval remains subject to admin governance.</p><label htmlFor="seller-business">Business name</label><input id="seller-business" value={businessName} onChange={(event) => setBusinessName(event.target.value)} /><label htmlFor="seller-email">Contact email</label><input id="seller-email" type="email" value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} /><button className="btn" type="button" onClick={() => void submit()}>SUBMIT APPLICATION</button>{message && <p role="status">{message}</p>}<Link className="auth-link" to="/seller/dashboard">OPEN SELLER WORKSPACE</Link></div></section>
}
