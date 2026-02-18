import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { SessionSlice } from "./session-slice"
import type { BuildSlice } from "./build-slice"
import type { CraftingSlice } from "./crafting-slice"
import type { AtlasSlice } from "./atlas-slice"
import type { TradeSlice } from "./trade-slice"
import type { TeamSlice } from "./team-slice"
import type { ChatSlice } from "./chat-slice"
import type { UISlice } from "./ui-slice"
import { createSessionSlice } from "./session-slice"
import { createBuildSlice } from "./build-slice"
import { createCraftingSlice } from "./crafting-slice"
import { createAtlasSlice } from "./atlas-slice"
import { createTradeSlice } from "./trade-slice"
import { createTeamSlice } from "./team-slice"
import { createChatSlice } from "./chat-slice"
import { createUISlice } from "./ui-slice"

export type StoreState = SessionSlice &
  BuildSlice &
  CraftingSlice &
  AtlasSlice &
  TradeSlice &
  TeamSlice &
  ChatSlice &
  UISlice

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createSessionSlice(...a),
      ...createBuildSlice(...a),
      ...createCraftingSlice(...a),
      ...createAtlasSlice(...a),
      ...createTradeSlice(...a),
      ...createTeamSlice(...a),
      ...createChatSlice(...a),
      ...createUISlice(...a),
    }),
    {
      name: "poe2-apex-store",
      partialize: (state) => ({
        // Session slice
        session: state.session,
        // Build slice
        builds: state.builds,
        activeBuildId: state.activeBuildId,
        // Crafting slice
        plans: state.plans,
        activeWaystone: state.activeWaystone,
        // Atlas slice
        nodes: state.nodes,
        waystoneTier: state.waystoneTier,
        completionPercent: state.completionPercent,
        // Trade slice
        searches: state.searches,
        activeSearchId: state.activeSearchId,
        // Team slice
        teams: state.teams,
        activeTeamId: state.activeTeamId,
        // UI slice (only aiPanelOpen)
        aiPanelOpen: state.aiPanelOpen,
      }),
    }
  )
)
