import type { SkuInventory } from "../types/seller"

const inventory = new Map<string, SkuInventory>()
const seed = (sku: string, productId: string, variantId?: string): SkuInventory => ({ sku, sellerId: "seller-demo", productId, variantId, warehouseId: "warehouse-main", available: 25, reserved: 0, damaged: 0, status: "AVAILABLE" })
const get = (sku: string) => inventory.get(sku) ?? (() => { const item = seed(sku, sku.split("-")[0]); inventory.set(sku, item); return item })()
const mutate = (sku: string, update: (item: SkuInventory) => SkuInventory): SkuInventory => { const next = update(get(sku)); inventory.set(sku, next); return next }

export const inventoryService = {
  getInventory(sku: string, sellerId: string): SkuInventory { const item = get(sku); if (item.sellerId !== sellerId) throw new Error("Inventory access denied"); return item },
  reserve(sku: string, sellerId: string, quantity: number): SkuInventory {
    const item = inventoryService.getInventory(sku, sellerId)
    if (!Number.isInteger(quantity) || quantity < 1 || item.available < quantity) throw new Error("Insufficient inventory")
    return mutate(sku, (current) => ({ ...current, available: current.available - quantity, reserved: current.reserved + quantity, status: "RESERVED" }))
  },
  release(sku: string, sellerId: string, quantity: number): SkuInventory {
    const item = inventoryService.getInventory(sku, sellerId)
    if (!Number.isInteger(quantity) || quantity < 1 || item.reserved < quantity) throw new Error("Cannot release more than reserved inventory")
    return mutate(sku, (current) => ({ ...current, available: current.available + quantity, reserved: Math.max(0, current.reserved - quantity), status: "AVAILABLE" }))
  },
  adjust(sku: string, sellerId: string, delta: number, reason: string): SkuInventory {
    if (!reason.trim() || !Number.isInteger(delta)) throw new Error("Adjustment reason and integer delta are required")
    inventoryService.getInventory(sku, sellerId)
    return mutate(sku, (current) => ({ ...current, available: Math.max(0, current.available + delta), status: current.reserved > 0 ? "RESERVED" : "AVAILABLE" }))
  },
  pick(sku: string, sellerId: string, quantity: number): SkuInventory { const item = inventoryService.getInventory(sku, sellerId); if (!Number.isInteger(quantity) || quantity < 1 || item.reserved < quantity) throw new Error("Cannot pick more than reserved inventory"); return mutate(sku, (current) => ({ ...current, reserved: current.reserved - quantity, status: "PICKED" })) },
  pack(sku: string, sellerId: string): SkuInventory { inventoryService.getInventory(sku, sellerId); return mutate(sku, (current) => ({ ...current, status: "PACKED" })) },
  ship(sku: string, sellerId: string): SkuInventory { inventoryService.getInventory(sku, sellerId); return mutate(sku, (current) => ({ ...current, status: "SHIPPED" })) },
  restock(sku: string, sellerId: string, quantity: number): SkuInventory { inventoryService.getInventory(sku, sellerId); if (!Number.isInteger(quantity) || quantity < 1) throw new Error("Restock quantity must be positive"); return mutate(sku, (current) => ({ ...current, available: current.available + quantity, status: "AVAILABLE" })) },
  damage(sku: string, sellerId: string, quantity: number): SkuInventory { inventoryService.getInventory(sku, sellerId); if (!Number.isInteger(quantity) || quantity < 1) throw new Error("Damage quantity must be positive"); return mutate(sku, (current) => ({ ...current, damaged: current.damaged + quantity, status: "DAMAGED" })) },
}
