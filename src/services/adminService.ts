import { rolePermissions, type Permission, type AdminAuditEvent } from "../types/admin"
import type { UserRole } from "../types/auth"

const audit: AdminAuditEvent[] = []
export const adminService = {
  can(role: UserRole | undefined, permission: Permission): boolean {
    return rolePermissions[role ?? "CUSTOMER"].includes(permission)
  },
  require(role: UserRole | undefined, permission: Permission, reason: string): void {
    if (!adminService.can(role, permission) || !reason.trim()) throw new Error("Forbidden: permission and reason are required")
  },
  record(actorId: string, action: string, resource: string, reason: string): AdminAuditEvent {
    const event = { id: `audit-${Date.now()}`, actorId, action, resource, reason, createdAt: new Date().toISOString() }
    audit.push(event)
    return event
  },
  getAudit(): AdminAuditEvent[] { return [...audit] },
}
