import type { Customer } from "../types/customer"
import type { User } from "../types/auth"
import type { Address } from "../types/address"
import { authService } from "./authService"
import { sessionService } from "./sessionService"
import { addressStorage } from "./addressStorage"

const wait = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms))
const addressError = (message: string): never => {
  throw { code: "RESOURCE_NOT_FOUND", message, status: 404 } satisfies { code: "RESOURCE_NOT_FOUND"; message: string; status: number }
}

const getAddressContext = async (): Promise<{ user: User; addresses: Address[] } | undefined> => {
  const user = await authService.getCurrentUser()
  return user ? { user, addresses: addressStorage.get(user.id) } : undefined
}

export const customerService = {
  async getCurrentCustomer(): Promise<Customer | undefined> {
    const current = await getAddressContext()
    return current ? { user: current.user, addresses: current.addresses } : undefined
  },
  async updateProfile(updates: Partial<Pick<User, "firstName" | "lastName" | "phone" | "avatarUrl">>): Promise<Customer | undefined> {
    const current = await authService.getCurrentUser()
    if (!current) return undefined
    const user: User = { ...current, ...updates, updatedAt: new Date().toISOString() }
    sessionService.save(user)
    return { user, addresses: addressStorage.get(user.id) }
  },
  async getAddresses(): Promise<Address[]> {
    await wait()
    const current = await getAddressContext()
    if (!current) return addressError("Customer session was not found.")
    return current.addresses
  },
  async addAddress(address: Omit<Address, "id" | "isDefault"> & { isDefault?: boolean }): Promise<Address> {
    await wait()
    const current = await getAddressContext()
    if (!current) return addressError("Customer session was not found.")
    const next: Address = {
      ...address,
      id: `address-${current.user.id}-${Date.now()}`,
      isDefault: address.isDefault === true || current.addresses.length === 0,
    }
    const addresses = next.isDefault
      ? [...current.addresses.map((item) => ({ ...item, isDefault: false })), next]
      : [...current.addresses, next]
    addressStorage.set(current.user.id, addresses)
    return next
  },
  async updateAddress(addressId: string, updates: Omit<Address, "id" | "isDefault"> & { isDefault?: boolean }): Promise<Address> {
    await wait()
    const current = await getAddressContext()
    if (!current) return addressError("Customer session was not found.")
    const existing = current.addresses.find((address) => address.id === addressId)
    if (!existing) return addressError("Address was not found.")
    const updated = { ...existing, ...updates, id: existing.id, isDefault: updates.isDefault ?? existing.isDefault }
    const addresses = current.addresses.map((address) => address.id === addressId ? updated : address)
    addressStorage.set(current.user.id, updated.isDefault ? addresses.map((address) => ({ ...address, isDefault: address.id === addressId })) : addresses)
    return updated
  },
  async deleteAddress(addressId: string): Promise<void> {
    await wait()
    const current = await getAddressContext()
    if (!current) return addressError("Customer session was not found.")
    const existing = current.addresses.find((address) => address.id === addressId)
    if (!existing) return addressError("Address was not found.")
    const remaining = current.addresses.filter((address) => address.id !== addressId)
    if (existing.isDefault && remaining.length > 0) remaining[0] = { ...remaining[0], isDefault: true }
    addressStorage.set(current.user.id, remaining)
  },
  async setDefaultAddress(addressId: string): Promise<Address> {
    await wait()
    const current = await getAddressContext()
    if (!current) return addressError("Customer session was not found.")
    if (!current.addresses.some((address) => address.id === addressId)) return addressError("Address was not found.")
    const addresses = current.addresses.map((address) => ({ ...address, isDefault: address.id === addressId }))
    addressStorage.set(current.user.id, addresses)
    return addresses.find((address) => address.id === addressId) as Address
  },
}
