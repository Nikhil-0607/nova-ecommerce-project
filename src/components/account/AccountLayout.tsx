import type { ReactNode } from "react"
import { NavLink } from "react-router-dom"

const sections = [
  { to: "/account", label: "Profile", end: true },
  { to: "/account/addresses", label: "Addresses" },
  { to: "/account/security", label: "Security" },
  { to: "/account/preferences", label: "Preferences" },
  { to: "/account/notifications", label: "Notifications" },
]

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="account-layout">
      <aside className="account-nav" aria-label="Account navigation">
        <p className="eyebrow">YOUR NOVA ACCOUNT</p>
        <nav>
          {sections.map((section) => (
            <NavLink key={section.to} to={section.to} end={section.end}>
              {section.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="account-content">{children}</div>
    </div>
  )
}
