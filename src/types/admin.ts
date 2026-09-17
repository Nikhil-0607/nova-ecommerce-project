import type { UserRole } from "./auth"

export type Permission =
  | "SELLER_VIEW"
  | "SELLER_APPROVE"
  | "PRODUCT_APPROVE"
  | "INVENTORY_ADJUST"
  | "ORDER_INVESTIGATE"
  | "SETTLEMENT_VIEW"
  | "FEATURE_FLAG_UPDATE"
  | "AUDIT_VIEW"

export type AdminAuditEvent = {
  id: string
  actorId: string
  action: string
  resource: string
  reason: string
  createdAt: string
}

export const rolePermissions: Record<UserRole, Permission[]> = {
  CUSTOMER: [],
  SELLER: ["SELLER_VIEW", "INVENTORY_ADJUST"],
  ADMIN: ["SELLER_VIEW", "SELLER_APPROVE", "PRODUCT_APPROVE", "INVENTORY_ADJUST", "ORDER_INVESTIGATE", "SETTLEMENT_VIEW", "FEATURE_FLAG_UPDATE", "AUDIT_VIEW"],
}
