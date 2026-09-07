import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import AuthError from "../components/auth/AuthError"
import AuthLayout from "../components/auth/AuthLayout"
import RegisterForm, { type RegisterFormValues } from "../components/auth/RegisterForm"
import { useStore } from "../context/StoreContext"
import { analytics } from "../services/analyticsService"
import { authService } from "../services/authService"
import type { ApiError } from "../types/api"
import { getSafeInternalRedirect } from "../utils/authRedirect"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export default function RegisterPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { login, notify, authStatus } = useStore()
  const [values, setValues] = useState<RegisterFormValues>({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", acceptedTerms: false })
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormValues, string>>>({})
  const [serverError, setServerError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (authStatus === "loading") {
    return <AuthLayout title="Checking your session"><p className="auth-intro">Please wait while we restore your session.</p></AuthLayout>
  }
  if (authStatus === "authenticated") {
    return <AuthLayout title="Already signed in"><p className="auth-intro">You are already signed in to NOVA.</p><button className="btn full" type="button" onClick={() => navigate(getSafeInternalRedirect(params.get("redirect"), "/account"), { replace: true })}>CONTINUE</button></AuthLayout>
  }

  const submit = async () => {
    const nextErrors: Partial<Record<keyof RegisterFormValues, string>> = {}
    if (!values.firstName.trim()) nextErrors.firstName = "Enter your first name."
    if (!values.lastName.trim()) nextErrors.lastName = "Enter your last name."
    if (!emailPattern.test(values.email)) nextErrors.email = "Enter a valid email address."
    if (values.password.length < 8) nextErrors.password = "Use at least 8 characters."
    if (values.password !== values.confirmPassword) nextErrors.confirmPassword = "Passwords do not match."
    if (!values.acceptedTerms) nextErrors.acceptedTerms = "Accept the terms to continue."
    setErrors(nextErrors)
    setServerError("")
    if (Object.keys(nextErrors).length > 0) return
    analytics.track("REGISTRATION_STARTED", {})
    setSubmitting(true)
    try {
      const result = await authService.register({ firstName: values.firstName.trim(), lastName: values.lastName.trim(), email: values.email.trim() })
      login(result.user)
      analytics.track("REGISTRATION_SUCCESS", { userId: result.user.id })
      notify("Your NOVA account is ready")
      navigate(getSafeInternalRedirect(params.get("redirect"), "/account"), { replace: true })
    } catch (error) {
      const apiError = error as Partial<ApiError>
      setServerError(apiError.code === "VALIDATION_ERROR" ? "Please check your details and try again." : "We couldn't create your account. Please try again.")
      analytics.track("REGISTRATION_FAILED", { code: apiError.code ?? "SERVER_ERROR" })
    } finally {
      setSubmitting(false)
    }
  }

  return <AuthLayout title="Create your account"><p className="auth-intro">Save your favourites and move through checkout faster.</p>{serverError && <AuthError message={serverError} />}<RegisterForm values={values} errors={errors} submitting={submitting} onChange={setValues} onSubmit={() => void submit()} /></AuthLayout>
}
