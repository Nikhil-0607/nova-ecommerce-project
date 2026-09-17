import type { SupportTicket } from "../types/postPurchase"

export const supportService = {
  createTicket(orderId: string, category: string, description: string): SupportTicket {
    const now = new Date().toISOString()
    return { id: `TKT-${Date.now()}`, orderId, category, description, status: "OPEN", createdAt: now, updatedAt: now }
  },
}
