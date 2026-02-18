import { useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router"
import {
  Sparkles, Plus, Trash2, Gem, Shield, Shirt, ArrowLeft,
  Heart, Zap, Wind,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageContainer } from "@/components/layout/page-container"
import { RiskIndicator } from "@/components/shared/risk-indicator"
import { usePageContext } from "@/hooks/use-page-context"
import { useAiChat } from "@/hooks/use-ai-chat"
import { useStore } from "@/stores"
import type { RiskLevel, SkillGem } from "@/lib/types"
import { GEAR_SLOTS } from "@/lib/constants"

function getResistRisk(value: number): RiskLevel {
  if (value >= 75) return "safe"
  if (value >= 50) return "warning"
  return "danger"
}

export function BuildDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { askAi } = useAiChat()
  const builds = useStore((s) => s.builds)
  const updateBuild = useStore((s) => s.updateBuild)

  const build = useMemo(() => builds.find((b) => b.id === id), [builds, id])

  // Skill gem add form
  const [newGemName, setNewGemName] = useState("")
  const [newGemIsSupport, setNewGemIsSupport] = useState(false)

  // Inline edit states
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesValue, setNotesValue] = useState("")

  usePageContext({
    page: "build-detail",
    label: build ? `Build: ${build.name}` : "Build Detail",
    data: { buildId: id ?? "" },
  })

  if (!build) {
    return (
      <PageContainer title="Build Not Found" description="This build does not exist.">
        <Button variant="outline" className="gap-1.5" onClick={() => navigate("/build")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Builds
        </Button>
      </PageContainer>
    )
  }

  function handleAddGem() {
    if (!newGemName.trim() || !build) return
    const gem: SkillGem = {
      id: crypto.randomUUID(),
      name: newGemName.trim(),
      isSupport: newGemIsSupport,
      level: 1,
      quality: 0,
    }
    updateBuild(build.id, { skillGems: [...build.skillGems, gem] })
    setNewGemName("")
    setNewGemIsSupport(false)
  }

  function handleRemoveGem(gemId: string) {
    if (!build) return
    updateBuild(build.id, {
      skillGems: build.skillGems.filter((g) => g.id !== gemId),
    })
  }

  function handleSaveNotes() {
    if (!build) return
    updateBuild(build.id, { notes: notesValue })
    setEditingNotes(false)
  }

  return (
    <PageContainer
      title={build.name}
      description={`${build.class}${build.ascendancy ? ` / ${build.ascendancy}` : ""} -- Level ${build.level}`}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/build")}>
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            All Builds
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => askAi(`Analyze my build "${build.name}" (${build.class}/${build.ascendancy}, main skill: ${build.mainSkill || "not set"}). What improvements should I prioritize?`)}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Ask AI
          </Button>
        </div>
      }
    >
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skill Gems</TabsTrigger>
          <TabsTrigger value="defenses">Defenses</TabsTrigger>
          <TabsTrigger value="gear">Gear</TabsTrigger>
        </TabsList>

        {/* -- Overview Tab -- */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Character Info
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() =>
                    askAi(`Review my ${build.class} ${build.ascendancy || ""} build overview. Main skill: ${build.mainSkill || "not set"}, Level ${build.level}. Suggest the best next steps.`)
                  }
                >
                  <Sparkles className="h-3 w-3" />
                  AI
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Class</p>
                  <p className="text-sm font-medium">{build.class}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ascendancy</p>
                  <p className="text-sm font-medium">{build.ascendancy || "None"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Level</p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      value={build.level}
                      onChange={(e) => updateBuild(build.id, { level: Number(e.target.value) || 1 })}
                      className="h-8 w-20"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Main Skill</p>
                  <Input
                    value={build.mainSkill}
                    onChange={(e) => updateBuild(build.id, { mainSkill: e.target.value })}
                    placeholder="Main skill..."
                    className="h-8"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Notes</p>
                  {!editingNotes && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => {
                        setNotesValue(build.notes)
                        setEditingNotes(true)
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </div>
                {editingNotes ? (
                  <div className="space-y-2">
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={notesValue}
                      onChange={(e) => setNotesValue(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveNotes}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingNotes(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {build.notes || "No notes."}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* -- Skill Gems Tab -- */}
        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Gem className="h-4 w-4 text-primary" />
                  Skill Gems
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() =>
                    askAi(`What are the best support gems for ${build.mainSkill || "my main skill"} on a ${build.class} ${build.ascendancy || ""}?`)
                  }
                >
                  <Sparkles className="h-3 w-3" />
                  AI
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add gem form */}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label htmlFor="gem-name" className="mb-1 block text-xs text-muted-foreground">
                    Gem Name
                  </label>
                  <Input
                    id="gem-name"
                    placeholder="e.g. Lightning Arrow"
                    value={newGemName}
                    onChange={(e) => setNewGemName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddGem()}
                    className="h-8"
                  />
                </div>
                <label className="flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs">
                  <input
                    type="checkbox"
                    checked={newGemIsSupport}
                    onChange={(e) => setNewGemIsSupport(e.target.checked)}
                    className="accent-primary"
                  />
                  Support
                </label>
                <Button size="sm" onClick={handleAddGem} disabled={!newGemName.trim()}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add
                </Button>
              </div>

              <Separator />

              {build.skillGems.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No skill gems added yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {build.skillGems.map((gem) => (
                    <li
                      key={gem.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Gem className={`h-4 w-4 ${gem.isSupport ? "text-rarity-gem" : "text-primary"}`} />
                        <span className="text-sm font-medium">{gem.name}</span>
                        {gem.isSupport && (
                          <Badge variant="secondary" className="text-[10px]">Support</Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveGem(gem.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* -- Defenses Tab -- */}
        <TabsContent value="defenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Defense Profile
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() =>
                    askAi(`Analyze the defenses on my ${build.class} ${build.ascendancy || ""} build. Life: ${build.defenses.life}, ES: ${build.defenses.energyShield}, Armour: ${build.defenses.armour}, Evasion: ${build.defenses.evasion}. Resists: Fire ${build.defenses.fireRes}%, Cold ${build.defenses.coldRes}%, Lightning ${build.defenses.lightningRes}%, Chaos ${build.defenses.chaosRes}%. What layers am I missing?`)
                  }
                >
                  <Sparkles className="h-3 w-3" />
                  AI
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pool stats */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {([
                  { key: "life" as const, label: "Life", icon: Heart, color: "text-defense-life" },
                  { key: "energyShield" as const, label: "Energy Shield", icon: Zap, color: "text-defense-es" },
                  { key: "armour" as const, label: "Armour", icon: Shield, color: "text-defense-armour" },
                  { key: "evasion" as const, label: "Evasion", icon: Wind, color: "text-defense-evasion" },
                ] as const).map(({ key, label, icon: Icon, color }) => (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className={`h-3.5 w-3.5 ${color}`} />
                      <span className="text-xs text-muted-foreground">{label}</span>
                    </div>
                    <Input
                      type="number"
                      min={0}
                      value={build.defenses[key]}
                      onChange={(e) =>
                        updateBuild(build.id, {
                          defenses: { ...build.defenses, [key]: Number(e.target.value) || 0 },
                        })
                      }
                      className="h-8"
                    />
                  </div>
                ))}
              </div>

              <Separator />

              {/* Resistance checks */}
              <div>
                <h3 className="mb-3 text-sm font-medium">Resistance Checks</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {([
                    { key: "fireRes" as const, label: "Fire" },
                    { key: "coldRes" as const, label: "Cold" },
                    { key: "lightningRes" as const, label: "Lightning" },
                    { key: "chaosRes" as const, label: "Chaos" },
                  ] as const).map(({ key, label }) => (
                    <div key={key} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{label} Res</span>
                        <RiskIndicator level={getResistRisk(build.defenses[key])} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={-60}
                          max={90}
                          value={build.defenses[key]}
                          onChange={(e) =>
                            updateBuild(build.id, {
                              defenses: { ...build.defenses, [key]: Number(e.target.value) || 0 },
                            })
                          }
                          className="h-8"
                        />
                        <span className="text-xs text-muted-foreground">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Recovery */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Block %</span>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={build.defenses.blockChance}
                    onChange={(e) =>
                      updateBuild(build.id, {
                        defenses: { ...build.defenses, blockChance: Number(e.target.value) || 0 },
                      })
                    }
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Regen/sec</span>
                  <Input
                    type="number"
                    min={0}
                    value={build.defenses.regenPerSec}
                    onChange={(e) =>
                      updateBuild(build.id, {
                        defenses: { ...build.defenses, regenPerSec: Number(e.target.value) || 0 },
                      })
                    }
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Leech %</span>
                  <Input
                    type="number"
                    min={0}
                    value={build.defenses.leechRate}
                    onChange={(e) =>
                      updateBuild(build.id, {
                        defenses: { ...build.defenses, leechRate: Number(e.target.value) || 0 },
                      })
                    }
                    className="h-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* -- Gear Tab -- */}
        <TabsContent value="gear" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Shirt className="h-4 w-4 text-primary" />
                  Gear Slots
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() =>
                    askAi(`What gear upgrades should I prioritize for my ${build.class} ${build.ascendancy || ""} using ${build.mainSkill || "my main skill"}?`)
                  }
                >
                  <Sparkles className="h-3 w-3" />
                  AI
                </Button>
              </CardTitle>
              <CardDescription>Track your equipped items for each slot.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {GEAR_SLOTS.map((slot) => {
                  const gear = build.gearSlots.find((g) => g.slot === slot)
                  return (
                    <div
                      key={slot}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">{slot}</p>
                        <Input
                          placeholder="Item name..."
                          value={gear?.itemName ?? ""}
                          onChange={(e) => {
                            const existing = build.gearSlots.find((g) => g.slot === slot)
                            if (existing) {
                              updateBuild(build.id, {
                                gearSlots: build.gearSlots.map((g) =>
                                  g.slot === slot ? { ...g, itemName: e.target.value } : g
                                ),
                              })
                            } else {
                              updateBuild(build.id, {
                                gearSlots: [
                                  ...build.gearSlots,
                                  {
                                    slot,
                                    itemName: e.target.value,
                                    rarity: "normal",
                                    targetAffixes: [],
                                    currentAffixes: [],
                                  },
                                ],
                              })
                            }
                          }}
                          className="mt-1 h-7 text-xs"
                        />
                      </div>
                      {gear?.rarity && gear.rarity !== "normal" && (
                        <Badge variant="outline" className="ml-2 text-[10px]">
                          {gear.rarity}
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
