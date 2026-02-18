import type { StateCreator } from "zustand"
import type { CraftingPlan, CraftingStep, WaystoneConfig } from "@/lib/types"

const DEFAULT_WAYSTONE: WaystoneConfig = {
  tier: 1,
  affixCount: 0,
  hasAbyssMod: false,
  liquidType: "none",
  liquidCount: 0,
  corrupted: false,
}

export interface CraftingSlice {
  plans: CraftingPlan[]
  activeWaystone: WaystoneConfig
  addPlan: (plan: CraftingPlan) => void
  updatePlan: (id: string, partial: Partial<CraftingPlan>) => void
  deletePlan: (id: string) => void
  updateWaystone: (partial: Partial<WaystoneConfig>) => void
  addStep: (planId: string, step: CraftingStep) => void
  toggleStepComplete: (planId: string, stepId: string) => void
}

export const createCraftingSlice: StateCreator<CraftingSlice, [], [], CraftingSlice> = (set) => ({
  plans: [],
  activeWaystone: { ...DEFAULT_WAYSTONE },
  addPlan: (plan) =>
    set((state) => ({ plans: [...state.plans, plan] })),
  updatePlan: (id, partial) =>
    set((state) => ({
      plans: state.plans.map((p) => (p.id === id ? { ...p, ...partial } : p)),
    })),
  deletePlan: (id) =>
    set((state) => ({ plans: state.plans.filter((p) => p.id !== id) })),
  updateWaystone: (partial) =>
    set((state) => ({ activeWaystone: { ...state.activeWaystone, ...partial } })),
  addStep: (planId, step) =>
    set((state) => ({
      plans: state.plans.map((p) =>
        p.id === planId ? { ...p, steps: [...p.steps, step] } : p
      ),
    })),
  toggleStepComplete: (planId, stepId) =>
    set((state) => ({
      plans: state.plans.map((p) =>
        p.id === planId
          ? {
              ...p,
              steps: p.steps.map((s) =>
                s.id === stepId ? { ...s, completed: !s.completed } : s
              ),
            }
          : p
      ),
    })),
})
