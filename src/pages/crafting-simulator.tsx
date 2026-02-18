import { useState, useMemo } from "react"
import {
  Sparkles, Plus, RotateCcw, Check, ChevronRight, Coins,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { PageContainer } from "@/components/layout/page-container"
import { usePageContext } from "@/hooks/use-page-context"
import { useAiChat } from "@/hooks/use-ai-chat"
import { useStore } from "@/stores"
import type { CraftingStep } from "@/lib/types"
import { CURRENCY_ITEMS } from "@/lib/constants"

export function CraftingSimulator() {
  const { askAi } = useAiChat()
  const plans = useStore((s) => s.plans)
  const addStep = useStore((s) => s.addStep)
  const toggleStepComplete = useStore((s) => s.toggleStepComplete)

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(plans[0]?.id ?? null)
  const [newAction, setNewAction] = useState("")
  const [newMaterials, setNewMaterials] = useState("")
  const [newCost, setNewCost] = useState("")
  const [newStopCondition, setNewStopCondition] = useState("")

  // Currency counters for cost tracking
  const [currencyUsed, setCurrencyUsed] = useState<Record<string, number>>(
    () => Object.fromEntries(CURRENCY_ITEMS.map((c) => [c.shortName, 0])),
  )

  usePageContext({ page: "crafting-simulator", label: "Crafting Simulator", data: {} })

  const selectedPlan = useMemo(
    () => plans.find((p) => p.id === selectedPlanId),
    [plans, selectedPlanId],
  )

  const completedCount = useMemo(
    () => selectedPlan?.steps.filter((s) => s.completed).length ?? 0,
    [selectedPlan],
  )

  function handleAddStep() {
    if (!selectedPlanId || !newAction.trim()) return
    const step: CraftingStep = {
      id: crypto.randomUUID(),
      order: (selectedPlan?.steps.length ?? 0) + 1,
      action: newAction.trim(),
      materials: newMaterials.trim(),
      cost: newCost.trim(),
      stopCondition: newStopCondition.trim(),
      completed: false,
    }
    addStep(selectedPlanId, step)
    setNewAction("")
    setNewMaterials("")
    setNewCost("")
    setNewStopCondition("")
  }

  function handleCurrencyChange(shortName: string, delta: number) {
    setCurrencyUsed((prev) => ({
      ...prev,
      [shortName]: Math.max(0, (prev[shortName] ?? 0) + delta),
    }))
  }

  function resetCounters() {
    setCurrencyUsed(Object.fromEntries(CURRENCY_ITEMS.map((c) => [c.shortName, 0])))
  }

  const totalCurrencyUsed = useMemo(
    () => Object.values(currencyUsed).reduce((a, b) => a + b, 0),
    [currencyUsed],
  )

  return (
    <PageContainer
      title="Crafting Simulator"
      description="Walk through crafting steps, track currency usage, and calculate costs."
      actions={
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() =>
            askAi(
              selectedPlan
                ? `Help me optimize my crafting plan "${selectedPlan.name}" targeting "${selectedPlan.targetItem}". I have ${selectedPlan.steps.length} steps so far. What should I adjust?`
                : "What is the best step-by-step crafting plan for my current build?"
            )
          }
        >
          <Sparkles className="h-3.5 w-3.5" />
          Ask AI
        </Button>
      }
    >
      {/* Plan Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Active Plan:</span>
        {plans.length === 0 ? (
          <span className="text-sm text-muted-foreground">No plans created. Go to Crafting Workshop first.</span>
        ) : (
          plans.map((plan) => (
            <Button
              key={plan.id}
              variant={selectedPlanId === plan.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPlanId(plan.id)}
            >
              {plan.name}
            </Button>
          ))
        )}
      </div>

      {selectedPlan && (
        <>
          {/* Cost Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-primary" />
                  Currency Tracker
                </span>
                <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={resetCounters}>
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </Button>
              </CardTitle>
              <CardDescription>
                Track how much currency you spend. Total used: <span className="font-medium text-foreground">{totalCurrencyUsed}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                {CURRENCY_ITEMS.map((currency) => (
                  <div key={currency.shortName} className="space-y-1.5">
                    <p className="truncate text-[11px] text-muted-foreground" title={currency.name}>
                      {currency.name}
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 shrink-0 text-xs"
                        onClick={() => handleCurrencyChange(currency.shortName, -1)}
                        disabled={currencyUsed[currency.shortName] === 0}
                      >
                        -
                      </Button>
                      <span className="min-w-[24px] text-center text-sm font-medium tabular-nums">
                        {currencyUsed[currency.shortName]}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 shrink-0 text-xs"
                        onClick={() => handleCurrencyChange(currency.shortName, 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step-by-step view */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Steps ({completedCount}/{selectedPlan.steps.length} completed)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedPlan.steps.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No steps yet. Add one below.
                </p>
              ) : (
                <ol className="space-y-2">
                  {selectedPlan.steps.map((step, i) => (
                    <li
                      key={step.id}
                      className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                        step.completed ? "border-border/50 bg-muted/30" : "bg-card"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleStepComplete(selectedPlan.id, step.id)}
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs transition-colors ${
                          step.completed
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground hover:border-primary"
                        }`}
                      >
                        {step.completed && <Check className="h-3 w-3" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium ${step.completed ? "line-through text-muted-foreground" : ""}`}>
                          {i + 1}. {step.action}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
                          {step.materials && (
                            <span className="text-[11px] text-muted-foreground">
                              <ChevronRight className="mr-0.5 inline h-3 w-3" />
                              Materials: {step.materials}
                            </span>
                          )}
                          {step.cost && (
                            <span className="text-[11px] text-muted-foreground">Cost: {step.cost}</span>
                          )}
                          {step.stopCondition && (
                            <span className="text-[11px] text-status-warning">Stop: {step.stopCondition}</span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              )}

              <Separator />

              {/* Add step form */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground">Add New Step</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] text-muted-foreground">Action *</label>
                    <Input
                      placeholder="e.g. Use Chaos Orb"
                      value={newAction}
                      onChange={(e) => setNewAction(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-muted-foreground">Materials</label>
                    <Input
                      placeholder="e.g. 1x Chaos Orb"
                      value={newMaterials}
                      onChange={(e) => setNewMaterials(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-muted-foreground">Cost</label>
                    <Input
                      placeholder="e.g. ~2 chaos"
                      value={newCost}
                      onChange={(e) => setNewCost(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-muted-foreground">Stop Condition</label>
                    <Input
                      placeholder="e.g. Hit T1 life + res"
                      value={newStopCondition}
                      onChange={(e) => setNewStopCondition(e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>
                <Button size="sm" onClick={handleAddStep} disabled={!newAction.trim()}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add Step
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </PageContainer>
  )
}
