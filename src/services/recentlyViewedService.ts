import type { RecentlyViewedEntry } from "../types/recentlyViewed"

const storageKey = "nova-recently-viewed"
const maxHistory = 12

const isEntry = (value: unknown): value is RecentlyViewedEntry =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as Record<string, unknown>).productId === "string" &&
  typeof (value as Record<string, unknown>).viewedAt === "string"

const readEntries = (): RecentlyViewedEntry[] => {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isEntry)
  } catch {
    return []
  }
}

const writeEntries = (entries: RecentlyViewedEntry[]): void => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(entries))
  } catch {
    // Storage may be unavailable in private browsing or restricted environments.
  }
}

export const recentlyViewedService = {
  getRecentlyViewed(): RecentlyViewedEntry[] {
    return readEntries()
  },

  addRecentlyViewed(productId: string): RecentlyViewedEntry[] {
    const next = [
      { productId, viewedAt: new Date().toISOString() },
      ...readEntries().filter((entry) => entry.productId !== productId),
    ].slice(0, maxHistory)
    writeEntries(next)
    return next
  },

  removeRecentlyViewed(productId: string): RecentlyViewedEntry[] {
    const next = readEntries().filter((entry) => entry.productId !== productId)
    writeEntries(next)
    return next
  },

  clearRecentlyViewed(): void {
    writeEntries([])
  },
}
