import { useState } from "react"
import {
  Hammer, Plus, Trash2, Sparkles, FlaskConical,
  ChevronDown, ChevronUp, CornerDownRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { PageContainer } from "@/components/layout/page-container"
import { usePageContext } from "@/hooks/use-page-context"
import { useAiChat } from "@/hooks/use-ai-chat"
import { useStore } from "@/stores"
import type { CraftingPlan } from "@/lib/types"

export function CraftingHub() {
  const { askAi } = useAiChat()
  const plans = useStore((s) => s.plans)
  const activeWaystone = useStore((s) => s.activeWaystone)
  const addPlan = useStore((s) => s.addPlan)
  const deletePlan = useStore((s) => s.deletePlan)
  const updateWaystone = useStore((s) => s.updateWaystone)

  const [showNewPlan, setShowNewPlan] = useState(false)
  const [newPlanName, setNewPlanName] = useState("")
  const [newPlanTarget, setNewPlanTarget] = useState("")
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)

  usePageContext({ page: "crafting", label: "Crafting Workshop", data: {} })

  function handleAddPlan() {
    if (!newPlanName.trim()) return
    const plan: CraftingPlan = {
      id: crypto.randomUUID(),
      name: newPlanName.trim(),
      targetItem: newPlanTarget.trim(),
      steps: [],
      totalCost: "",
      buyNowPrice: "",
      notes: "",
    }
    addPlan(plan)
    setNewPlanName("")
    setNewPlanTarget("")
    setShowNewPlan(false)
  }

  return (
    <PageContainer
      title="Crafting Workshop"
      description="Plan your crafts, roll waystones, and track material costs."
      actions={
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => askAi("What is the most profitable crafting strategy I should focus on right now given my current session state?")}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Ask AI
        </Button>
      }
    >
      {/* Crafting Plans */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Crafting Plans</h2>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowNewPlan(!showNewPlan)}>
            <Plus className="h-3.5 w-3.5" />
            New Plan
          </Button>
        </div>

        {showNewPlan && (
          <Card>
            <CardContent className="space-y-3 p-4">
              <div>
                <label htmlFor="plan-name" className="mb-1 block text-xs text-muted-foreground">Plan Name</label>
                <Input
                  id="plan-name"
                  placeholder="e.g. Tier 16 Waystone Roller"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <label htmlFor="plan-target" className="mb-1 block text-xs text-muted-foreground">Target Item</label>
                <Input
                  id="plan-target"
                  placeholder="e.g. 6-affix Waystone with Abyss mod"
                  value={newPlanTarget}
                  onChange={(e) => setNewPlanTarget(e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddPlan} disabled={!newPlanName.trim()}>Create</Button>
                <Button size="sm" variant="outline" onClick={() => setShowNewPlan(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {plans.length === 0 && !showNewPlan ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12">
              <Hammer className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No crafting plans yet. Create one to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => (
              <Card key={plan.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="flex flex-1 items-center gap-2 text-left"
                      onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                    >
                      {expandedPlan === plan.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{plan.name}</p>
                        {plan.targetItem && (
                          <p className="text-xs text-muted-foreground">Target: {plan.targetItem}</p>
                        )}
                      </div>
                    </button>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{plan.steps.length} steps</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => deletePlan(plan.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {expandedPlan === plan.id && (
                    <div className="mt-3 space-y-2 border-t pt-3">
                      {plan.steps.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No steps defined. Use the Crafting Simulator to add steps.</p>
                      ) : (
                        plan.steps.map((step) => (
                          <div key={step.id} className="flex items-start gap-2 rounded border p-2">
                            <CornerDownRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium">{step.action}</p>
                              {step.materials && <p className="text-[11px] text-muted-foreground">Materials: {step.materials}</p>}
                              {step.stopCondition && <p className="text-[11px] text-muted-foreground">Stop: {step.stopCondition}</p>}
                            </div>
                            {step.completed && <Badge variant="default" className="shrink-0 text-[10px]">Done</Badge>}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* Waystone Roller */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <FlaskConical className="h-5 w-5 text-primary" />
          Waystone Roller
        </h2>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Waystone Config</CardTitle>
            <CardDescription>Adjust your active waystone rolling parameters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Tier</label>
                <Input
                  type="number"
                  min={1}
                  max={16}
                  value={activeWaystone.tier}
                  onChange={(e) => updateWaystone({ tier: Math.min(16, Math.max(1, Number(e.target.value) || 1)) })}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Affix Count</label>
                <Input
                  type="number"
                  min={0}
                  max={6}
                  value={activeWaystone.affixCount}
                  onChange={(e) => updateWaystone({ affixCount: Math.min(6, Math.max(0, Number(e.target.value) || 0)) })}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Liquid Count</label>
                <Input
                  type="number"
                  min={0}
                  max={3}
                  value={activeWaystone.liquidCount}
                  onChange={(e) => updateWaystone({ liquidCount: Math.min(3, Math.max(0, Number(e.target.value) || 0)) })}
                  className="h-8"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Liquid type buttons */}
              {(["none", "paranoia", "greed"] as const).map((lt) => (
                <Button
                  key={lt}
                  variant={activeWaystone.liquidType === lt ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateWaystone({ liquidType: lt })}
                >
                  {lt === "none" ? "No Liquid" : `Liquid ${lt.charAt(0).toUpperCase() + lt.slice(1)}`}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={activeWaystone.hasAbyssMod}
                  onChange={(e) => updateWaystone({ hasAbyssMod: e.target.checked })}
                  className="accent-primary"
                />
                Abyss Modifier
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={activeWaystone.corrupted}
                  onChange={(e) => updateWaystone({ corrupted: e.target.checked })}
                  className="accent-primary"
                />
                Corrupted
              </label>
            </div>

            {/* Summary badges */}
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary">T{activeWaystone.tier}</Badge>
              <Badge variant="secondary">{activeWaystone.affixCount} affixes</Badge>
              {activeWaystone.hasAbyssMod && <Badge variant="outline">Abyss</Badge>}
              {activeWaystone.liquidType !== "none" && (
                <Badge variant="outline">{activeWaystone.liquidCount}x {activeWaystone.liquidType}</Badge>
              )}
              {activeWaystone.corrupted && <Badge variant="destructive">Corrupted</Badge>}
            </div>
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  )
}
