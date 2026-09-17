import type { Order } from "../types/order"
import type { Invoice } from "../types/postPurchase"

export const invoiceService = {
  getInvoice(order: Order): Invoice { return { id: `invoice-${order.id}`, orderId: order.id, invoiceNumber: `INV-${order.orderNumber}`, issuedAt: order.createdAt } },
}
