export type AddressType = "HOME" | "WORK" | "OTHER"

export type Address = {
  id: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  landmark?: string
  city: string
  state: string
  postalCode: string
  country: string
  addressType: AddressType
  isDefault: boolean
}
