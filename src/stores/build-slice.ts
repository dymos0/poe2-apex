import type { StateCreator } from "zustand"
import type { Build } from "@/lib/types"

export interface BuildSlice {
  builds: Build[]
  activeBuildId: string | null
  addBuild: (build: Build) => void
  updateBuild: (id: string, partial: Partial<Build>) => void
  deleteBuild: (id: string) => void
  setActiveBuild: (id: string | null) => void
  getActiveBuild: () => Build | undefined
}

export const createBuildSlice: StateCreator<BuildSlice, [], [], BuildSlice> = (set, get) => ({
  builds: [],
  activeBuildId: null,
  addBuild: (build) =>
    set((state) => ({ builds: [...state.builds, build] })),
  updateBuild: (id, partial) =>
    set((state) => ({
      builds: state.builds.map((b) =>
        b.id === id ? { ...b, ...partial, updatedAt: Date.now() } : b
      ),
    })),
  deleteBuild: (id) =>
    set((state) => ({
      builds: state.builds.filter((b) => b.id !== id),
      activeBuildId: state.activeBuildId === id ? null : state.activeBuildId,
    })),
  setActiveBuild: (id) => set({ activeBuildId: id }),
  getActiveBuild: () => {
    const { builds, activeBuildId } = get()
    return builds.find((b) => b.id === activeBuildId)
  },
})
