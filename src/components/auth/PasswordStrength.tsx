type PasswordStrengthProps = {
  password: string
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const score = [password.length >= 8, /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length
  const label = !password ? "Use at least 8 characters." : score < 2 ? "Password strength: weak" : score < 4 ? "Password strength: good" : "Password strength: strong"
  return <p className={`password-strength strength-${score}`} aria-live="polite">{label} Client-side guidance is not a security boundary.</p>
}
