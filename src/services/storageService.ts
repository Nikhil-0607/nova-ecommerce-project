const canUseStorage = (): boolean =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined"

export const storageService = {
  get<T>(key: string): T | undefined {
    if (!canUseStorage()) return undefined
    try {
      const raw = window.localStorage.getItem(key)
      if (!raw) return undefined
      return JSON.parse(raw) as T
    } catch {
      return undefined
    }
  },
  set<T>(key: string, value: T): boolean {
    if (!canUseStorage()) return false
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },
  remove(key: string): void {
    if (!canUseStorage()) return
    try {
      window.localStorage.removeItem(key)
    } catch {
      // Storage may be unavailable in restricted browser contexts.
    }
  },
  clear(): void {
    if (!canUseStorage()) return
    try {
      window.localStorage.clear()
    } catch {
      // Storage may be unavailable in restricted browser contexts.
    }
  },
}
