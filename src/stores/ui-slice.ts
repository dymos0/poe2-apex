import type { StateCreator } from "zustand"

export interface UISlice {
  aiPanelOpen: boolean
  sidebarCollapsed: boolean
  toggleAiPanel: () => void
  setAiPanelOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  aiPanelOpen: false,
  sidebarCollapsed: false,
  toggleAiPanel: () => set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),
  setAiPanelOpen: (open) => set({ aiPanelOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
})
