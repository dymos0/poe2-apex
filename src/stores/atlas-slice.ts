import type { StateCreator } from "zustand"
import type { AtlasNode } from "@/lib/types"

export interface AtlasSlice {
  nodes: AtlasNode[]
  waystoneTier: number
  completionPercent: number
  toggleNode: (id: string) => void
  setWaystoneTier: (tier: number) => void
  setCompletion: (percent: number) => void
}

export const createAtlasSlice: StateCreator<AtlasSlice, [], [], AtlasSlice> = (set) => ({
  nodes: [],
  waystoneTier: 1,
  completionPercent: 0,
  toggleNode: (id) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, allocated: !n.allocated } : n
      ),
    })),
  setWaystoneTier: (tier) => set({ waystoneTier: tier }),
  setCompletion: (percent) => set({ completionPercent: percent }),
})
