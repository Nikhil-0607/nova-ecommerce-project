import type { AuthResult, LoginCredentials, RegisterPayload, User } from "../types/auth"
import type { ApiError } from "../types/api"
import { sessionService } from "./sessionService"

const wait = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

const createUser = (payload: RegisterPayload, id: string): User => {
  const now = new Date().toISOString()
  return {
    id,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    emailVerified: false,
    phoneVerified: false,
    role: "CUSTOMER",
    createdAt: now,
    updatedAt: now,
  }
}

const invalidCredentials = (): ApiError => ({
  code: "AUTH_INVALID_CREDENTIALS",
  message: "The demo credentials are invalid.",
  status: 401,
})

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    await wait()
    if (!credentials.email.trim() || !credentials.password) throw invalidCredentials()
    const user = createUser({ firstName: "Demo", lastName: "Customer", email: credentials.email }, "demo-customer")
    sessionService.save(user)
    return { user, sessionStatus: "authenticated" }
  },
  async register(payload: RegisterPayload): Promise<AuthResult> {
    await wait()
    if (!payload.firstName.trim() || !payload.lastName.trim() || !payload.email.trim()) {
      throw { code: "VALIDATION_ERROR", message: "First name, last name and email are required.", status: 400 } satisfies ApiError
    }
    const user = createUser(payload, `customer-${Date.now()}`)
    sessionService.save(user)
    return { user, sessionStatus: "authenticated" }
  },
  async logout(): Promise<void> {
    await wait(80)
    sessionService.remove()
  },
  async getCurrentUser(): Promise<User | undefined> {
    await wait(40)
    return sessionService.getCurrentUser()
  },
  async refreshSession(): Promise<AuthResult | undefined> {
    await wait(80)
    const user = sessionService.getCurrentUser()
    return user ? { user, sessionStatus: "authenticated" } : undefined
  },
  async forgotPassword(email: string): Promise<void> {
    await wait()
    if (!email.trim()) throw invalidCredentials()
  },
  async resetPassword(token: string, password: string): Promise<void> {
    await wait()
    if (!token.trim() || password.length < 8) throw { code: "VALIDATION_ERROR", message: "A valid token and password are required.", status: 400 } satisfies ApiError
  },
  async verifyEmail(token: string): Promise<void> {
    await wait()
    if (!token.trim()) throw { code: "VALIDATION_ERROR", message: "A verification token is required.", status: 400 } satisfies ApiError
  },
}
