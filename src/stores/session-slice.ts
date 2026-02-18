import type { StateCreator } from "zustand"
import type { SessionState } from "@/lib/types"
import { DEFAULT_SESSION_STATE } from "@/lib/constants"

export interface SessionSlice {
  session: SessionState
  updateSession: (partial: Partial<SessionState>) => void
  resetSession: () => void
}

export const createSessionSlice: StateCreator<SessionSlice, [], [], SessionSlice> = (set) => ({
  session: { ...DEFAULT_SESSION_STATE },
  updateSession: (partial) =>
    set((state) => ({ session: { ...state.session, ...partial } })),
  resetSession: () => set({ session: { ...DEFAULT_SESSION_STATE } }),
})
