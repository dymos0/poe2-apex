import type { StateCreator } from "zustand"
import type { TradeSearch } from "@/lib/types"

export interface TradeSlice {
  searches: TradeSearch[]
  activeSearchId: string | null
  addSearch: (search: TradeSearch) => void
  updateSearch: (id: string, partial: Partial<TradeSearch>) => void
  deleteSearch: (id: string) => void
  setActiveSearch: (id: string | null) => void
}

export const createTradeSlice: StateCreator<TradeSlice, [], [], TradeSlice> = (set) => ({
  searches: [],
  activeSearchId: null,
  addSearch: (search) =>
    set((state) => ({ searches: [...state.searches, search] })),
  updateSearch: (id, partial) =>
    set((state) => ({
      searches: state.searches.map((s) => (s.id === id ? { ...s, ...partial } : s)),
    })),
  deleteSearch: (id) =>
    set((state) => ({
      searches: state.searches.filter((s) => s.id !== id),
      activeSearchId: state.activeSearchId === id ? null : state.activeSearchId,
    })),
  setActiveSearch: (id) => set({ activeSearchId: id }),
})
