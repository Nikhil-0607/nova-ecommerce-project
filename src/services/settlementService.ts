import type { SellerOrder, Settlement } from "../types/seller"

const settlements = new Map<string, Settlement>()
export const settlementService = {
  getSettlements(sellerId: string): Settlement[] { return [...settlements.values()].filter((settlement) => settlement.sellerId === sellerId) },
  createForOrder(order: SellerOrder): Settlement {
    const settlement: Settlement = { id: `settlement-${order.id}`, sellerId: order.sellerId, sellerOrderId: order.id, amount: order.total, status: "PENDING", updatedAt: new Date().toISOString() }
    settlements.set(settlement.id, settlement)
    return settlement
  },
  transition(id: string, sellerId: string, status: Settlement["status"]): Settlement {
    const settlement = settlements.get(id)
    if (!settlement || settlement.sellerId !== sellerId) throw new Error("Settlement access denied")
    const updated = { ...settlement, status, updatedAt: new Date().toISOString() }
    settlements.set(id, updated)
    return updated
  },
}
