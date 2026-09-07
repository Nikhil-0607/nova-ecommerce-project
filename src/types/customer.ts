import type { Address } from "./address"
import type { User } from "./auth"

export type Customer = {
  user: User
  addresses: Address[]
}
