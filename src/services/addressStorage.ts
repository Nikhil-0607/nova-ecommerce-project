import type { Address } from "../types/address"
import { storageService } from "./storageService"

const storageKey = "nova-customer-addresses"

export const addressStorage = {
  get(customerId: string): Address[] {
    return storageService.get<Record<string, Address[]>>(storageKey)?.[customerId] ?? []
  },
  set(customerId: string, addresses: Address[]): boolean {
    const stored = storageService.get<Record<string, Address[]>>(storageKey) ?? {}
    return storageService.set(storageKey, { ...stored, [customerId]: addresses })
  },
}
