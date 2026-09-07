import type { User } from "../../types/auth"

export type ProfileFormValues = {
  firstName: string
  lastName: string
  phone: string
}

type ProfileFormProps = {
  values: ProfileFormValues
  errors: Partial<Record<keyof ProfileFormValues, string>>
  email: string
  submitting: boolean
  onChange: (values: ProfileFormValues) => void
  onSubmit: () => void
}

export function profileValues(user: User): ProfileFormValues {
  return { firstName: user.firstName, lastName: user.lastName, phone: user.phone ?? "" }
}

export default function ProfileForm({ values, errors, email, submitting, onChange, onSubmit }: ProfileFormProps) {
  return (
    <form className="auth-form profile-form" onSubmit={(event) => { event.preventDefault(); onSubmit() }} noValidate>
      <div className="auth-form-row">
        <div className="auth-field">
          <label htmlFor="profile-first-name">First name</label>
          <input id="profile-first-name" value={values.firstName} onChange={(event) => onChange({ ...values, firstName: event.target.value })} autoComplete="given-name" aria-invalid={Boolean(errors.firstName)} aria-describedby={errors.firstName ? "profile-first-name-error" : undefined} />
          {errors.firstName && <p className="auth-field-error" id="profile-first-name-error">{errors.firstName}</p>}
        </div>
        <div className="auth-field">
          <label htmlFor="profile-last-name">Last name</label>
          <input id="profile-last-name" value={values.lastName} onChange={(event) => onChange({ ...values, lastName: event.target.value })} autoComplete="family-name" aria-invalid={Boolean(errors.lastName)} aria-describedby={errors.lastName ? "profile-last-name-error" : undefined} />
          {errors.lastName && <p className="auth-field-error" id="profile-last-name-error">{errors.lastName}</p>}
        </div>
      </div>
      <div className="auth-field">
        <label htmlFor="profile-email">Email address</label>
        <input id="profile-email" type="email" value={email} readOnly aria-describedby="profile-email-help" />
        <p className="profile-help" id="profile-email-help">Your sign-in email is managed by your account security settings.</p>
      </div>
      <div className="auth-field">
        <label htmlFor="profile-phone">Phone number <span className="profile-optional">(optional)</span></label>
        <input id="profile-phone" type="tel" value={values.phone} onChange={(event) => onChange({ ...values, phone: event.target.value })} autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "profile-phone-error" : undefined} />
        {errors.phone && <p className="auth-field-error" id="profile-phone-error">{errors.phone}</p>}
      </div>
      <button className="btn" type="submit" disabled={submitting}>{submitting ? "SAVING..." : "SAVE PROFILE"}</button>
    </form>
  )
}
