import type { SessionStatus, User } from "../types/auth"
import { storageService } from "./storageService"

const storageKey = "nova-session"
type SessionRecord = { user: User; updatedAt: string }

export const sessionService = {
  initialize(): { user?: User; sessionStatus: SessionStatus } {
    const session = storageService.get<SessionRecord>(storageKey)
    return session?.user ? { user: session.user, sessionStatus: "authenticated" } : { sessionStatus: "unauthenticated" }
  },
  getCurrentUser(): User | undefined {
    return this.initialize().user
  },
  save(user: User): void {
    storageService.set(storageKey, { user, updatedAt: new Date().toISOString() } satisfies SessionRecord)
  },
  remove(): void {
    storageService.remove(storageKey)
  },
  getStatus(): SessionStatus {
    return this.initialize().sessionStatus
  },
}
