import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import AccountLayout from "../components/account/AccountLayout"
import ProfileForm, { profileValues, type ProfileFormValues } from "../components/account/ProfileForm"
import SEO from "../components/seo/SEO"
import Skeleton from "../components/common/Skeleton"
import { useStore } from "../context/StoreContext"
import { analytics } from "../services/analyticsService"
import { customerService } from "../services/customerService"
import type { Customer } from "../types/customer"
import type { ApiError } from "../types/api"

const phonePattern = /^[+0-9() .-]{7,20}$/

function AccountPlaceholder({ title }: { title: string }) {
  return <section className="account-section"><h1>{title}</h1><div className="panel"><p>This account section is ready for a future NOVA experience.</p><Link className="auth-link" to="/account">Back to profile</Link></div></section>
}

export default function AccountPage() {
  const location = useLocation()
  const { updateUser, notify } = useStore()
  const [customer, setCustomer] = useState<Customer>()
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [values, setValues] = useState<ProfileFormValues>()
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormValues, string>>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    analytics.track("ACCOUNT_VIEWED", {})
    let active = true
    setLoading(true)
    void customerService.getCurrentCustomer().then((result) => {
      if (!active) return
      if (!result) {
        setLoadError("We couldn't load your account details. Please sign in again.")
        return
      }
      setCustomer(result)
      setValues(profileValues(result.user))
      setLoadError("")
    }).catch(() => {
      if (active) setLoadError("We couldn't load your account details. Please try again.")
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [])

  if (location.pathname !== "/account") {
    const title = location.pathname.split("/").at(-1)?.replaceAll("-", " ") ?? "Account"
    return <><SEO title={`${title.replace(/\b\w/g, (letter) => letter.toUpperCase())} | NOVA`} description="Your NOVA account." robots="noindex,nofollow" /><section className="section container"><AccountLayout><AccountPlaceholder title={title.replace(/\b\w/g, (letter) => letter.toUpperCase())} /></AccountLayout></section></>
  }

  const submit = async () => {
    if (!values) return
    const nextErrors: Partial<Record<keyof ProfileFormValues, string>> = {}
    if (!values.firstName.trim()) nextErrors.firstName = "Enter your first name."
    if (!values.lastName.trim()) nextErrors.lastName = "Enter your last name."
    if (values.phone.trim() && !phonePattern.test(values.phone.trim())) nextErrors.phone = "Enter a valid phone number."
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    analytics.track("PROFILE_UPDATE_STARTED", {})
    setSubmitting(true)
    try {
      const result = await customerService.updateProfile({ firstName: values.firstName.trim(), lastName: values.lastName.trim(), phone: values.phone.trim() || undefined })
      if (!result) throw { code: "RESOURCE_NOT_FOUND" } satisfies Partial<ApiError>
      setCustomer(result)
      setValues(profileValues(result.user))
      updateUser(result.user)
      analytics.track("PROFILE_UPDATE_SUCCESS", { userId: result.user.id })
      notify("Profile updated successfully")
    } catch (error) {
      const apiError = error as Partial<ApiError>
      analytics.track("PROFILE_UPDATE_FAILED", { code: apiError.code ?? "SERVER_ERROR" })
      notify("We couldn't update your profile. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <SEO title="My Account | NOVA" description="Manage your NOVA profile." robots="noindex,nofollow" />
      <section className="section container">
        <AccountLayout>
          <section className="account-section" aria-labelledby="account-title">
            <span className="eyebrow">ACCOUNT</span>
            <h1 id="account-title">My profile</h1>
            <p className="account-intro">Keep your NOVA profile details up to date.</p>
            {loading && <div className="panel account-loading" aria-live="polite"><Skeleton className="skeleton-line" /><Skeleton className="skeleton-line" /><p>Loading your profile...</p></div>}
            {!loading && loadError && <div className="panel auth-error" role="alert"><p>{loadError}</p></div>}
            {!loading && !loadError && customer && values && <div className="panel"><h2>Personal details</h2><ProfileForm values={values} errors={errors} email={customer.user.email} submitting={submitting} onChange={setValues} onSubmit={() => void submit()} /></div>}
          </section>
        </AccountLayout>
      </section>
    </>
  )
}
