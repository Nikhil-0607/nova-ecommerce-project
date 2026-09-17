import type { ProductVariant } from "./product"

export type SellerStatus = "ONBOARDING" | "ACTIVE" | "SUSPENDED" | "REJECTED"
export type ProductApprovalStatus = "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED"
export type InventoryStatus = "AVAILABLE" | "RESERVED" | "PICKED" | "PACKED" | "SHIPPED" | "RETURNED" | "DAMAGED"
export type FulfillmentStatus = "UNALLOCATED" | "RESERVED" | "PICKED" | "PACKED" | "SHIPPED" | "DELIVERED" | "RETURN_REQUESTED" | "RETURNED"
export type SettlementStatus = "PENDING" | "PROCESSING" | "SETTLED" | "ON_HOLD"

export type Seller = {
  id: string
  name: string
  email: string
  status: SellerStatus
  createdAt: string
}

export type SellerApplication = {
  id: string
  sellerId?: string
  businessName: string
  contactEmail: string
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED"
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

export type SellerProduct = {
  productId: string
  sellerId: string
  approvalStatus: ProductApprovalStatus
  rejectionReason?: string
  variants: ProductVariant[]
  updatedAt: string
}

export type SkuInventory = {
  sku: string
  sellerId: string
  productId: string
  variantId?: string
  warehouseId: string
  available: number
  reserved: number
  damaged: number
  status: InventoryStatus
}

export type Warehouse = {
  id: string
  sellerId: string
  name: string
  postalCode: string
  active: boolean
}

export type SellerOrder = {
  id: string
  orderId: string
  sellerId: string
  itemIds: string[]
  status: FulfillmentStatus
  warehouseId: string
  total: number
  createdAt: string
  lines: Array<{ itemId: string; sku: string; quantity: number }>
}

export type Settlement = {
  id: string
  sellerId: string
  sellerOrderId: string
  amount: number
  status: SettlementStatus
  updatedAt: string
}
