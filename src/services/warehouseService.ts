import type { Warehouse } from "../types/seller"

const warehouses: Warehouse[] = [
  { id: "warehouse-main", sellerId: "seller-demo", name: "NOVA Main Fulfillment", postalCode: "560001", active: true },
]

export const warehouseService = {
  getWarehouses(sellerId: string): Warehouse[] { return warehouses.filter((warehouse) => warehouse.sellerId === sellerId) },
  getWarehouse(sellerId: string, warehouseId: string): Warehouse | undefined {
    return warehouseService.getWarehouses(sellerId).find((warehouse) => warehouse.id === warehouseId)
  },
}
