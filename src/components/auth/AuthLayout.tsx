import type { ReactNode } from "react"
import SEO from "../seo/SEO"

export default function AuthLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <SEO title={`${title} | NOVA`} description={`${title} to your NOVA account.`} robots="noindex,nofollow" />
      <section className="section container auth-page">
        <div className="auth-card">
          <div className="auth-brand">NOVA</div>
          <h1>{title}</h1>
          {children}
        </div>
      </section>
    </>
  )
}
