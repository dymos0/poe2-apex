import type { StateCreator } from "zustand"
import type { Team, TeamMember } from "@/lib/types"

export interface TeamSlice {
  teams: Team[]
  activeTeamId: string | null
  addTeam: (team: Team) => void
  updateTeam: (id: string, partial: Partial<Team>) => void
  deleteTeam: (id: string) => void
  setActiveTeam: (id: string | null) => void
  addMember: (teamId: string, member: TeamMember) => void
  updateMember: (teamId: string, memberId: string, partial: Partial<TeamMember>) => void
  removeMember: (teamId: string, memberId: string) => void
}

export const createTeamSlice: StateCreator<TeamSlice, [], [], TeamSlice> = (set) => ({
  teams: [],
  activeTeamId: null,
  addTeam: (team) =>
    set((state) => ({ teams: [...state.teams, team] })),
  updateTeam: (id, partial) =>
    set((state) => ({
      teams: state.teams.map((t) => (t.id === id ? { ...t, ...partial } : t)),
    })),
  deleteTeam: (id) =>
    set((state) => ({
      teams: state.teams.filter((t) => t.id !== id),
      activeTeamId: state.activeTeamId === id ? null : state.activeTeamId,
    })),
  setActiveTeam: (id) => set({ activeTeamId: id }),
  addMember: (teamId, member) =>
    set((state) => ({
      teams: state.teams.map((t) =>
        t.id === teamId ? { ...t, members: [...t.members, member] } : t
      ),
    })),
  updateMember: (teamId, memberId, partial) =>
    set((state) => ({
      teams: state.teams.map((t) =>
        t.id === teamId
          ? {
              ...t,
              members: t.members.map((m) =>
                m.id === memberId ? { ...m, ...partial } : m
              ),
            }
          : t
      ),
    })),
  removeMember: (teamId, memberId) =>
    set((state) => ({
      teams: state.teams.map((t) =>
        t.id === teamId
          ? { ...t, members: t.members.filter((m) => m.id !== memberId) }
          : t
      ),
    })),
})
