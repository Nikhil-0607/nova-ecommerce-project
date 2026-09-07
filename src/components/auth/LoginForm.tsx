import { Link } from "react-router-dom"
import PasswordField from "./PasswordField"

export type LoginFormValues = {
  email: string
  password: string
  rememberMe: boolean
}

type LoginFormProps = {
  values: LoginFormValues
  errors: Partial<Record<keyof LoginFormValues, string>>
  submitting: boolean
  onChange: (values: LoginFormValues) => void
  onSubmit: () => void
}

export default function LoginForm({ values, errors, submitting, onChange, onSubmit }: LoginFormProps) {
  return (
    <form className="auth-form" onSubmit={(event) => { event.preventDefault(); onSubmit() }} noValidate>
      <div className="auth-field">
        <label htmlFor="login-email">Email address</label>
        <input id="login-email" type="email" value={values.email} onChange={(event) => onChange({ ...values, email: event.target.value })} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "login-email-error" : undefined} />
        {errors.email && <p className="auth-field-error" id="login-email-error">{errors.email}</p>}
      </div>
      <PasswordField label="Password" value={values.password} onChange={(password) => onChange({ ...values, password })} error={errors.password} autoComplete="current-password" />
      <label className="auth-checkbox"><input type="checkbox" checked={values.rememberMe} onChange={(event) => onChange({ ...values, rememberMe: event.target.checked })} /> Remember me</label>
      <button className="btn full" type="submit" disabled={submitting}>{submitting ? "SIGNING IN…" : "SIGN IN"}</button>
      <Link className="auth-link" to="/forgot-password">Forgot password?</Link>
      <p className="auth-switch">New to NOVA? <Link to="/register">Create an account</Link></p>
    </form>
  )
}
