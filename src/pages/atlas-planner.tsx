import { useState } from "react"
import {
  Map, Sparkles, Plus, Minus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { PageContainer } from "@/components/layout/page-container"
import { usePageContext } from "@/hooks/use-page-context"
import { useAiChat } from "@/hooks/use-ai-chat"
import { useStore } from "@/stores"
import { CONTENT_ENCOUNTERS } from "@/lib/constants"

export function AtlasPlanner() {
  const { askAi } = useAiChat()
  const waystoneTier = useStore((s) => s.waystoneTier)
  const completionPercent = useStore((s) => s.completionPercent)
  const setWaystoneTier = useStore((s) => s.setWaystoneTier)
  const setCompletion = useStore((s) => s.setCompletion)

  // Local state for encounter preferences and tablet planner
  const [preferredEncounters, setPreferredEncounters] = useState<Set<string>>(new Set())
  const [tabletSlots, setTabletSlots] = useState<[string, string, string]>(["", "", ""])

  usePageContext({ page: "atlas", label: "Atlas Planner", data: {} })

  function toggleEncounter(encounter: string) {
    setPreferredEncounters((prev) => {
      const next = new Set(prev)
      if (next.has(encounter)) {
        next.delete(encounter)
      } else {
        next.add(encounter)
      }
      return next
    })
  }

  function handleTabletChange(index: number, value: string) {
    setTabletSlots((prev) => {
      const next = [...prev] as [string, string, string]
      next[index] = value
      return next
    })
  }

  return (
    <PageContainer
      title="Atlas Planner"
      description="Plan your Atlas passive tree, waystone tiers, and content targeting."
      actions={
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() =>
            askAi(
              `My Atlas is at ${completionPercent}% completion, farming Tier ${waystoneTier} waystones. Preferred mechanics: ${
                preferredEncounters.size > 0 ? [...preferredEncounters].join(", ") : "none selected"
              }. What is the optimal Atlas passive tree and routing strategy?`
            )
          }
        >
          <Sparkles className="h-3.5 w-3.5" />
          Ask AI
        </Button>
      }
    >
      {/* Waystone Tier & Completion */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Map className="h-4 w-4 text-primary" />
              Waystone Tier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setWaystoneTier(Math.max(1, waystoneTier - 1))}
                disabled={waystoneTier <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <span className="text-3xl font-bold tabular-nums">{waystoneTier}</span>
                <p className="text-xs text-muted-foreground">
                  Area Level ~{waystoneTier <= 1 ? 65 : Math.min(80, 64 + waystoneTier)}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setWaystoneTier(Math.min(16, waystoneTier + 1))}
                disabled={waystoneTier >= 16}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3 flex gap-1">
              {Array.from({ length: 16 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setWaystoneTier(i + 1)}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    i + 1 <= waystoneTier ? "bg-primary" : "bg-muted"
                  }`}
                  title={`Tier ${i + 1}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Atlas Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold tabular-nums">{completionPercent}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(100, completionPercent)}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3">
              <label className="mb-1 block text-xs text-muted-foreground">Set completion %</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={completionPercent}
                onChange={(e) => setCompletion(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                className="h-8 w-24"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Content Encounter Preferences */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Content Encounter Preferences</h2>
          <p className="text-sm text-muted-foreground">
            Select the mechanics you want to target. The AI will optimize routing based on your picks.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {CONTENT_ENCOUNTERS.map((encounter) => {
            const isSelected = preferredEncounters.has(encounter)
            return (
              <button
                key={encounter}
                type="button"
                onClick={() => toggleEncounter(encounter)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                {encounter}
              </button>
            )
          })}
        </div>

        {preferredEncounters.size > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Selected:</span>
            {[...preferredEncounters].map((e) => (
              <Badge key={e} variant="secondary" className="text-xs">
                {e}
              </Badge>
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* Tablet Slot Planner */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Precursor Tablet Slots</h2>
          <p className="text-sm text-muted-foreground">
            Up to 3 tablets per map. Slot availability scales with map modifier count (6-mod map = all 3 slots).
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Slot {i + 1}</span>
                  <Badge variant={tabletSlots[i] ? "secondary" : "outline"} className="text-[10px]">
                    {tabletSlots[i] ? "Assigned" : "Empty"}
                  </Badge>
                </div>
                <Input
                  placeholder="Tablet description..."
                  value={tabletSlots[i]}
                  onChange={(e) => handleTabletChange(i, e.target.value)}
                  className="h-8 text-xs"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PageContainer>
  )
}
