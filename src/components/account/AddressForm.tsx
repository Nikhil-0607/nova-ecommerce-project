import type { Address, AddressType } from "../../types/address"

export type AddressFormValues = Omit<Address, "id" | "isDefault">
export type AddressFormErrors = Partial<Record<keyof AddressFormValues, string>>

type Props = {
  values: AddressFormValues
  errors: AddressFormErrors
  submitting: boolean
  onChange: (values: AddressFormValues) => void
  onSubmit: () => void
  onCancel: () => void
}

const fields: Array<{ key: keyof AddressFormValues; label: string; autoComplete?: string }> = [
  { key: "fullName", label: "Full name", autoComplete: "name" },
  { key: "addressLine1", label: "Address line 1", autoComplete: "street-address" },
  { key: "addressLine2", label: "Address line 2", autoComplete: "address-line2" },
  { key: "city", label: "City", autoComplete: "address-level2" },
  { key: "state", label: "State / region", autoComplete: "address-level1" },
  { key: "postalCode", label: "Postal code", autoComplete: "postal-code" },
  { key: "country", label: "Country", autoComplete: "country-name" },
  { key: "phone", label: "Phone", autoComplete: "tel" },
]

export default function AddressForm({ values, errors, submitting, onChange, onSubmit, onCancel }: Props) {
  const update = (key: keyof AddressFormValues, value: string) => onChange({ ...values, [key]: value })
  return (
    <form className="auth-form address-form" onSubmit={(event) => { event.preventDefault(); onSubmit() }} noValidate>
      <div className="auth-form-row">
        {fields.slice(0, 2).map((field) => (
          <div className="auth-field" key={field.key}>
            <label htmlFor={`address-${field.key}`}>{field.label}{["fullName", "addressLine1"].includes(field.key) && " *"}</label>
            <input id={`address-${field.key}`} value={values[field.key]} onChange={(event) => update(field.key, event.target.value)} autoComplete={field.autoComplete} aria-invalid={Boolean(errors[field.key])} aria-describedby={errors[field.key] ? `address-${field.key}-error` : undefined} />
            {errors[field.key] && <p className="auth-field-error" id={`address-${field.key}-error`}>{errors[field.key]}</p>}
          </div>
        ))}
      </div>
      {fields.slice(2).map((field) => (
        <div className="auth-field" key={field.key}>
          <label htmlFor={`address-${field.key}`}>{field.label}{["addressLine1", "city", "state", "postalCode", "country"].includes(field.key) && " *"}{field.key === "phone" && " (optional)"}</label>
          <input id={`address-${field.key}`} value={values[field.key]} onChange={(event) => update(field.key, event.target.value)} autoComplete={field.autoComplete} aria-invalid={Boolean(errors[field.key])} aria-describedby={errors[field.key] ? `address-${field.key}-error` : undefined} />
          {errors[field.key] && <p className="auth-field-error" id={`address-${field.key}-error`}>{errors[field.key]}</p>}
        </div>
      ))}
      <div className="auth-field">
        <label htmlFor="address-type">Address type</label>
        <select id="address-type" value={values.addressType} onChange={(event) => update("addressType", event.target.value as AddressType)}>
          <option value="HOME">Home</option><option value="WORK">Work</option><option value="OTHER">Other</option>
        </select>
      </div>
      <div className="account-form-actions">
        <button className="btn" type="submit" disabled={submitting}>{submitting ? "SAVING..." : "SAVE ADDRESS"}</button>
        <button className="btn secondary" type="button" onClick={onCancel} disabled={submitting}>CANCEL</button>
      </div>
    </form>
  )
}
