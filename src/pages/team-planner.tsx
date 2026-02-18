import { useState, useMemo } from "react"
import {
  Users, Sparkles, Plus, Trash2, UserPlus, X, Edit2, Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { PageContainer } from "@/components/layout/page-container"
import { ClassIcon } from "@/components/shared/class-icon"
import { usePageContext } from "@/hooks/use-page-context"
import { useAiChat } from "@/hooks/use-ai-chat"
import { useStore } from "@/stores"
import type { Team, TeamMember, TeamRole, POE2Class } from "@/lib/types"
import { TEAM_ROLES, CLASSES } from "@/lib/constants"

export function TeamPlanner() {
  const { askAi } = useAiChat()
  const teams = useStore((s) => s.teams)
  const activeTeamId = useStore((s) => s.activeTeamId)
  const addTeam = useStore((s) => s.addTeam)
  const deleteTeam = useStore((s) => s.deleteTeam)
  const setActiveTeam = useStore((s) => s.setActiveTeam)
  const addMember = useStore((s) => s.addMember)
  const updateMember = useStore((s) => s.updateMember)
  const removeMember = useStore((s) => s.removeMember)

  // Team creation
  const [showNewTeam, setShowNewTeam] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")

  // Member add form
  const [showAddMember, setShowAddMember] = useState(false)
  const [memberName, setMemberName] = useState("")
  const [memberRole, setMemberRole] = useState<TeamRole>("carry")
  const [memberClass, setMemberClass] = useState<POE2Class>("Ranger")
  const [memberSkill, setMemberSkill] = useState("")

  // Inline edit
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)
  const [editRole, setEditRole] = useState<TeamRole>("carry")

  usePageContext({ page: "team", label: "Team Planner", data: {} })

  const activeTeam = useMemo(
    () => teams.find((t) => t.id === activeTeamId),
    [teams, activeTeamId],
  )

  // Role coverage analysis
  const roleCoverage = useMemo(() => {
    if (!activeTeam) return {}
    const coverage: Partial<Record<TeamRole, number>> = {}
    for (const member of activeTeam.members) {
      coverage[member.role] = (coverage[member.role] ?? 0) + 1
    }
    return coverage
  }, [activeTeam])

  function handleCreateTeam() {
    if (!newTeamName.trim()) return
    const team: Team = {
      id: crypto.randomUUID(),
      name: newTeamName.trim(),
      members: [],
      notes: "",
    }
    addTeam(team)
    setActiveTeam(team.id)
    setNewTeamName("")
    setShowNewTeam(false)
  }

  function handleAddMember() {
    if (!activeTeamId || !memberName.trim()) return
    const member: TeamMember = {
      id: crypto.randomUUID(),
      name: memberName.trim(),
      role: memberRole,
      class: memberClass,
      ascendancy: "",
      mainSkill: memberSkill.trim(),
      defenseContributions: [],
    }
    addMember(activeTeamId, member)
    setMemberName("")
    setMemberSkill("")
    setShowAddMember(false)
  }

  function handleSaveRoleEdit(memberId: string) {
    if (!activeTeamId) return
    updateMember(activeTeamId, memberId, { role: editRole })
    setEditingMemberId(null)
  }

  return (
    <PageContainer
      title="Team Planner"
      description="Coordinate team roles, builds, and gap analysis for group play."
      actions={
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() =>
            askAi(
              activeTeam
                ? `Analyze my team "${activeTeam.name}" with ${activeTeam.members.length} member(s): ${
                    activeTeam.members.map((m) => `${m.name} (${m.role}, ${m.class}, ${m.mainSkill || "no skill"})`).join("; ") || "no members"
                  }. What roles are we missing? What defensive contributions should each player bring?`
                : "What is the ideal team composition for endgame mapping in POE2?"
            )
          }
        >
          <Sparkles className="h-3.5 w-3.5" />
          Ask AI
        </Button>
      }
    >
      {/* Team list */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Teams</h2>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowNewTeam(!showNewTeam)}>
            <Plus className="h-3.5 w-3.5" />
            New Team
          </Button>
        </div>

        {showNewTeam && (
          <Card>
            <CardContent className="flex items-end gap-3 p-4">
              <div className="flex-1">
                <label className="mb-1 block text-xs text-muted-foreground">Team Name</label>
                <Input
                  placeholder="e.g. Map Group Alpha"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateTeam()}
                  className="h-8"
                />
              </div>
              <Button size="sm" onClick={handleCreateTeam} disabled={!newTeamName.trim()}>Create</Button>
              <Button size="sm" variant="outline" onClick={() => setShowNewTeam(false)}>Cancel</Button>
            </CardContent>
          </Card>
        )}

        {teams.length === 0 && !showNewTeam ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12">
              <Users className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No teams yet. Create one to start planning.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-wrap gap-2">
            {teams.map((team) => (
              <div key={team.id} className="flex items-center gap-1">
                <Button
                  variant={activeTeamId === team.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTeam(team.id)}
                >
                  {team.name}
                  <Badge variant="secondary" className="ml-1.5 text-[10px]">
                    {team.members.length}
                  </Badge>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteTeam(team.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {activeTeam && (
        <>
          <Separator />

          {/* Role Assignment Grid */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Role Assignment</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {TEAM_ROLES.map((role) => {
                const count = roleCoverage[role.key as TeamRole] ?? 0
                const membersInRole = activeTeam.members.filter((m) => m.role === role.key)
                return (
                  <Card key={role.key} className={count > 0 ? "ring-1 ring-primary/30" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{role.label}</p>
                        <Badge variant={count > 0 ? "default" : "outline"} className="text-[10px]">
                          {count}
                        </Badge>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">{role.description}</p>
                      {membersInRole.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {membersInRole.map((m) => (
                            <div key={m.id} className="flex items-center gap-1.5 text-xs">
                              <ClassIcon poe2Class={m.class} size={12} />
                              <span>{m.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>

          <Separator />

          {/* Team Members */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Members ({activeTeam.members.length})</h2>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowAddMember(!showAddMember)}>
                <UserPlus className="h-3.5 w-3.5" />
                Add Member
              </Button>
            </div>

            {showAddMember && (
              <Card>
                <CardContent className="space-y-3 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Player Name *</label>
                      <Input
                        placeholder="Character / player name"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Main Skill</label>
                      <Input
                        placeholder="e.g. Lightning Arrow"
                        value={memberSkill}
                        onChange={(e) => setMemberSkill(e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Role</label>
                    <div className="flex flex-wrap gap-2">
                      {TEAM_ROLES.map((r) => (
                        <Button
                          key={r.key}
                          variant={memberRole === r.key ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMemberRole(r.key as TeamRole)}
                        >
                          {r.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Class</label>
                    <div className="flex flex-wrap gap-2">
                      {CLASSES.map((cls) => (
                        <Button
                          key={cls}
                          variant={memberClass === cls ? "default" : "outline"}
                          size="sm"
                          className="gap-1"
                          onClick={() => setMemberClass(cls)}
                        >
                          <ClassIcon poe2Class={cls} size={14} />
                          {cls}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddMember} disabled={!memberName.trim()}>
                      <UserPlus className="mr-1 h-3.5 w-3.5" />
                      Add
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowAddMember(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTeam.members.length === 0 && !showAddMember ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">No members in this team yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {activeTeam.members.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <ClassIcon poe2Class={member.class} size={20} className="shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{member.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <Badge variant="secondary" className="text-[10px]">{member.class}</Badge>
                          {member.ascendancy && <Badge variant="outline" className="text-[10px]">{member.ascendancy}</Badge>}
                          {member.mainSkill && (
                            <span className="text-[11px] text-muted-foreground">Skill: {member.mainSkill}</span>
                          )}
                        </div>
                      </div>

                      {/* Role display / edit */}
                      {editingMemberId === member.id ? (
                        <div className="flex items-center gap-1">
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value as TeamRole)}
                            className="h-7 rounded border border-input bg-transparent px-2 text-xs"
                          >
                            {TEAM_ROLES.map((r) => (
                              <option key={r.key} value={r.key}>{r.label}</option>
                            ))}
                          </select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleSaveRoleEdit(member.id)}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setEditingMemberId(null)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <Badge
                          variant="default"
                          className="cursor-pointer text-xs"
                          onClick={() => {
                            setEditingMemberId(member.id)
                            setEditRole(member.role)
                          }}
                        >
                          {TEAM_ROLES.find((r) => r.key === member.role)?.label ?? member.role}
                          <Edit2 className="ml-1 h-2.5 w-2.5" />
                        </Badge>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeMember(activeTeam.id, member.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <Separator />

          {/* Gap Analysis */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Gap Analysis</h2>
            <Card>
              <CardContent className="p-4">
                {activeTeam.members.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Add team members to see gap analysis.</p>
                ) : (
                  <div className="space-y-3">
                    {TEAM_ROLES.map((role) => {
                      const count = roleCoverage[role.key as TeamRole] ?? 0
                      const isMissing = count === 0
                      return (
                        <div key={role.key} className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm font-medium ${isMissing ? "text-status-danger" : ""}`}>
                              {role.label}
                            </p>
                            <p className="text-[11px] text-muted-foreground">{role.description}</p>
                          </div>
                          <Badge variant={isMissing ? "destructive" : "default"} className="text-xs">
                            {isMissing ? "Missing" : `${count} assigned`}
                          </Badge>
                        </div>
                      )
                    })}
                    <Separator />
                    <p className="text-xs text-muted-foreground">
                      Tip: Each player should bring at least one unique defensive contribution (curse, exposure, aura, taunt).
                      Use the AI Coach to get specific recommendations for your comp.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </PageContainer>
  )
}
