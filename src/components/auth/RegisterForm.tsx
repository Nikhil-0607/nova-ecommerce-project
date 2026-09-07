import { Link } from "react-router-dom"
import PasswordField from "./PasswordField"
import PasswordStrength from "./PasswordStrength"

export type RegisterFormValues = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  acceptedTerms: boolean
}

type RegisterFormProps = {
  values: RegisterFormValues
  errors: Partial<Record<keyof RegisterFormValues, string>>
  submitting: boolean
  onChange: (values: RegisterFormValues) => void
  onSubmit: () => void
}

export default function RegisterForm({ values, errors, submitting, onChange, onSubmit }: RegisterFormProps) {
  return (
    <form className="auth-form" onSubmit={(event) => { event.preventDefault(); onSubmit() }} noValidate>
      <div className="auth-form-row">
        <div className="auth-field"><label htmlFor="register-first-name">First name</label><input id="register-first-name" value={values.firstName} onChange={(event) => onChange({ ...values, firstName: event.target.value })} autoComplete="given-name" aria-invalid={Boolean(errors.firstName)} />{errors.firstName && <p className="auth-field-error">{errors.firstName}</p>}</div>
        <div className="auth-field"><label htmlFor="register-last-name">Last name</label><input id="register-last-name" value={values.lastName} onChange={(event) => onChange({ ...values, lastName: event.target.value })} autoComplete="family-name" aria-invalid={Boolean(errors.lastName)} />{errors.lastName && <p className="auth-field-error">{errors.lastName}</p>}</div>
      </div>
      <div className="auth-field"><label htmlFor="register-email">Email address</label><input id="register-email" type="email" value={values.email} onChange={(event) => onChange({ ...values, email: event.target.value })} autoComplete="email" aria-invalid={Boolean(errors.email)} />{errors.email && <p className="auth-field-error">{errors.email}</p>}</div>
      <PasswordField label="Password" value={values.password} onChange={(password) => onChange({ ...values, password })} error={errors.password} autoComplete="new-password" />
      <PasswordStrength password={values.password} />
      <PasswordField label="Confirm password" value={values.confirmPassword} onChange={(confirmPassword) => onChange({ ...values, confirmPassword })} error={errors.confirmPassword} autoComplete="new-password" />
      <label className="auth-checkbox"><input type="checkbox" checked={values.acceptedTerms} onChange={(event) => onChange({ ...values, acceptedTerms: event.target.checked })} aria-invalid={Boolean(errors.acceptedTerms)} /> I agree to the NOVA terms and privacy policy</label>
      {errors.acceptedTerms && <p className="auth-field-error">{errors.acceptedTerms}</p>}
      <button className="btn full" type="submit" disabled={submitting}>{submitting ? "CREATING ACCOUNT…" : "CREATE ACCOUNT"}</button>
      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </form>
  )
}
