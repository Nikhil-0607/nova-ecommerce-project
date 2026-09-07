import type { Customer } from "../types/customer"
import type { User } from "../types/auth"
import { authService } from "./authService"
import { sessionService } from "./sessionService"

export const customerService = {
  async getCurrentCustomer(): Promise<Customer | undefined> {
    const user = await authService.getCurrentUser()
    return user ? { user, addresses: [] } : undefined
  },
  async updateProfile(updates: Partial<Pick<User, "firstName" | "lastName" | "phone" | "avatarUrl">>): Promise<Customer | undefined> {
    const current = await authService.getCurrentUser()
    if (!current) return undefined
    const user: User = { ...current, ...updates, updatedAt: new Date().toISOString() }
    sessionService.save(user)
    return { user, addresses: [] }
  },
}
