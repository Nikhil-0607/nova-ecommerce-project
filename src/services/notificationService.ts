import type { Notification } from "../types/postPurchase"

export const notificationService = {
  getNotifications(): Notification[] {
    return [{ id: "notification-demo", title: "NOVA orders", message: "Your order updates will appear here.", href: "/orders", read: false, createdAt: new Date().toISOString() }]
  },
}
