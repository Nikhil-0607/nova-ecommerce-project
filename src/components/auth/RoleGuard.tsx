import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useStore } from "../../context/StoreContext"
import type { UserRole } from "../../types/auth"

export default function RoleGuard({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
  const { user, authStatus } = useStore()
  const location = useLocation()
  if (authStatus === "loading") return <section className="section container" aria-live="polite"><h1>Checking permissions</h1></section>
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  if (!roles.includes(user.role)) return <section className="section container"><div className="empty" role="alert"><h1>Access denied</h1><p>You do not have permission to view this workspace.</p></div></section>
  return <>{children}</>
}
