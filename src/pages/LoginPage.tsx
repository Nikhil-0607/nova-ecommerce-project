import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import AuthError from "../components/auth/AuthError"
import AuthLayout from "../components/auth/AuthLayout"
import LoginForm, { type LoginFormValues } from "../components/auth/LoginForm"
import { useStore } from "../context/StoreContext"
import { analytics } from "../services/analyticsService"
import { authService } from "../services/authService"
import type { ApiError } from "../types/api"
import { getSafeInternalRedirect } from "../utils/authRedirect"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export default function LoginPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { login, notify, authStatus } = useStore()
  const [values, setValues] = useState<LoginFormValues>({ email: "", password: "", rememberMe: false })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>({})
  const [serverError, setServerError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (authStatus === "loading") {
    return <AuthLayout title="Checking your session"><p className="auth-intro">Please wait while we restore your session.</p></AuthLayout>
  }
  if (authStatus === "authenticated") {
    return <AuthLayout title="Already signed in"><p className="auth-intro">You are already signed in to NOVA.</p><button className="btn full" type="button" onClick={() => navigate(getSafeInternalRedirect(params.get("redirect"), "/account"), { replace: true })}>CONTINUE</button></AuthLayout>
  }

  const submit = async () => {
    const nextErrors: Partial<Record<keyof LoginFormValues, string>> = {}
    if (!values.email.trim()) nextErrors.email = "Enter your email address."
    else if (!emailPattern.test(values.email)) nextErrors.email = "Enter a valid email address."
    if (!values.password) nextErrors.password = "Enter your password."
    setErrors(nextErrors)
    setServerError("")
    if (Object.keys(nextErrors).length > 0) return
    analytics.track("LOGIN_STARTED", {})
    setSubmitting(true)
    try {
      const result = await authService.login({ email: values.email.trim(), password: values.password })
      login(result.user)
      analytics.track("LOGIN_SUCCESS", { userId: result.user.id })
      notify("Welcome back to NOVA")
      navigate(getSafeInternalRedirect(params.get("redirect"), "/account"), { replace: true })
    } catch (error) {
      const apiError = error as Partial<ApiError>
      const message = apiError.code === "AUTH_INVALID_CREDENTIALS" ? "Email or password is incorrect." : "We couldn't sign you in. Please try again."
      setServerError(message)
      analytics.track("LOGIN_FAILED", { code: apiError.code ?? "SERVER_ERROR" })
    } finally {
      setSubmitting(false)
    }
  }

  return <AuthLayout title="Welcome back"><p className="auth-intro">Sign in to continue your NOVA journey.</p>{serverError && <AuthError message={serverError} />}<LoginForm values={values} errors={errors} submitting={submitting} onChange={setValues} onSubmit={() => void submit()} /></AuthLayout>
}
