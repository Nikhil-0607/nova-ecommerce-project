import { useEffect, type ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useStore } from "../../context/StoreContext"
import { analytics } from "../../services/analyticsService"
import { getCurrentInternalPath } from "../../utils/authRedirect"

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { authStatus } = useStore()
  const location = useLocation()
  const redirect = getCurrentInternalPath(location.pathname, location.search, location.hash)

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      analytics.track("PROTECTED_ROUTE_REDIRECTED", { path: redirect })
    }
  }, [authStatus, redirect])

  if (authStatus === "loading") {
    return <section className="section container route-loading" aria-live="polite"><h1>Checking your session</h1><p>Please wait a moment...</p></section>
  }
  if (authStatus !== "authenticated") {
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />
  }
  return <>{children}</>
}
