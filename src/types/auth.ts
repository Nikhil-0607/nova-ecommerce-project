export type UserRole = "CUSTOMER" | "ADMIN" | "SELLER"
export type SessionStatus = "authenticated" | "unauthenticated" | "loading"

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatarUrl?: string
  emailVerified: boolean
  phoneVerified: boolean
  role: UserRole
  createdAt: string
  updatedAt: string
}

export type AuthState = {
  user?: User
  isAuthenticated: boolean
  isLoading: boolean
  sessionStatus: SessionStatus
}

export type Session = {
  user: User
  expiresAt?: string
}

export type LoginCredentials = {
  email: string
  password: string
}

export type RegisterPayload = {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

export type AuthResult = {
  user: User
  sessionStatus: "authenticated"
}
