export default function AuthError({ message }: { message: string }) {
  return <div className="auth-error" role="alert">{message}</div>
}
