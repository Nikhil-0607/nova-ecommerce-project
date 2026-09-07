import { useId, useState } from "react"

type PasswordFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  autoComplete: "current-password" | "new-password"
}

export default function PasswordField({ label, value, onChange, error, autoComplete }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const inputId = useId()
  const errorId = `${inputId}-error`
  return (
    <div className="auth-field">
      <label htmlFor={inputId}>{label}</label>
      <div className="password-input">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
        <button type="button" className="password-toggle" onClick={() => setVisible((current) => !current)} aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}>
          {visible ? "HIDE" : "SHOW"}
        </button>
      </div>
      {error && <p className="auth-field-error" id={errorId}>{error}</p>}
    </div>
  )
}
