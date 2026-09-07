import type { Session, SessionStatus, User } from "../types/auth"
import { storageService } from "./storageService"

const storageKey = "nova-session"
type SessionRecord = Session & { updatedAt: string }

export const sessionService = {
  initialize(): { user?: User; sessionStatus: SessionStatus } {
    const session = storageService.get<SessionRecord>(storageKey)
    const expiryTime = session?.expiresAt ? new Date(session.expiresAt).getTime() : undefined
    const invalidExpiry = expiryTime !== undefined && Number.isNaN(expiryTime)
    const expired = expiryTime !== undefined && !invalidExpiry && expiryTime <= Date.now()
    if (!session?.user || expired || invalidExpiry) {
      if (session && (expired || invalidExpiry)) storageService.remove(storageKey)
      return { sessionStatus: "unauthenticated" }
    }
    return { user: session.user, sessionStatus: "authenticated" }
  },
  getCurrentUser(): User | undefined {
    return this.initialize().user
  },
  save(user: User, expiresAt?: string): void {
    storageService.set(storageKey, { user, expiresAt, updatedAt: new Date().toISOString() } satisfies SessionRecord)
  },
  remove(): void {
    storageService.remove(storageKey)
  },
  getStatus(): SessionStatus {
    return this.initialize().sessionStatus
  },
}
