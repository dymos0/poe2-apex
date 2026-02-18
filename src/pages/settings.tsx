import { useState } from "react"
import {
  Save, RotateCcw, Trash2, Eye, EyeOff, AlertTriangle, Key,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PageContainer } from "@/components/layout/page-container"
import { usePageContext } from "@/hooks/use-page-context"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useStore } from "@/stores"
import type { POE2Class, Ascendancy } from "@/lib/types"
import { CLASSES, CLASS_ASCENDANCIES } from "@/lib/constants"

const API_KEY_STORAGE_KEY = "poe2-apex-api-key"

export function Settings() {
  const session = useStore((s) => s.session)
  const updateSession = useStore((s) => s.updateSession)
  const resetSession = useStore((s) => s.resetSession)

  // Local form state mirrors the store so we can batch-save
  const [form, setForm] = useState({ ...session })
  const [supportsInput, setSupportsInput] = useState(session.supports.join(", "))
  const [weaponsInput, setWeaponsInput] = useState(session.weaponTypes.join(", "))

  // API key (localStorage only -- never in zustand/persisted store)
  const [apiKey, setApiKey] = useLocalStorage(API_KEY_STORAGE_KEY, "")
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKeyDraft, setApiKeyDraft] = useState(apiKey)

  // Danger zone confirmation
  const [confirmClear, setConfirmClear] = useState(false)

  usePageContext({ page: "settings", label: "Settings", data: {} })

  const ascendancies: Ascendancy[] = form.class
    ? CLASS_ASCENDANCIES[form.class as POE2Class] ?? []
    : []

  function handleSave() {
    updateSession({
      ...form,
      supports: supportsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      weaponTypes: weaponsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    })
  }

  function handleReset() {
    resetSession()
    const fresh = useStore.getState().session
    setForm({ ...fresh })
    setSupportsInput("")
    setWeaponsInput("")
  }

  function handleSaveApiKey() {
    setApiKey(apiKeyDraft)
  }

  function handleClearAll() {
    // Clear persisted store
    localStorage.removeItem("poe2-apex-store")
    localStorage.removeItem(API_KEY_STORAGE_KEY)
    window.location.reload()
  }

  return (
    <PageContainer
      title="Settings"
      description="Configure your session state, API key, and data management."
    >
      {/* Session State Form */}
      <Card>
        <CardHeader>
          <CardTitle>Session State</CardTitle>
          <CardDescription>
            Fill in your current character info so the AI coach can give you targeted advice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Identity */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium">Patch / League</label>
              <Input
                placeholder="e.g. 1.2 / Dawn"
                value={form.patchLeague}
                onChange={(e) => setForm({ ...form, patchLeague: e.target.value })}
                className="h-8"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Class</label>
              <select
                value={form.class}
                onChange={(e) => setForm({ ...form, class: e.target.value as POE2Class | "", ascendancy: "" })}
                className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select class...</option>
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Ascendancy</label>
              <select
                value={form.ascendancy}
                onChange={(e) => setForm({ ...form, ascendancy: e.target.value as Ascendancy | "" })}
                className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={!form.class}
              >
                <option value="">None</option>
                {ascendancies.map((asc) => (
                  <option key={asc} value={asc}>{asc}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Level</label>
              <Input
                type="number"
                min={1}
                max={100}
                value={form.level}
                onChange={(e) => setForm({ ...form, level: Number(e.target.value) || 1 })}
                className="h-8"
              />
            </div>
          </div>

          {/* Progress & skill */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium">Act / Tier</label>
              <Input
                placeholder="e.g. Act 3 / T10"
                value={form.actOrTier}
                onChange={(e) => setForm({ ...form, actOrTier: e.target.value })}
                className="h-8"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Main Skill</label>
              <Input
                placeholder="e.g. Lightning Arrow"
                value={form.mainSkill}
                onChange={(e) => setForm({ ...form, mainSkill: e.target.value })}
                className="h-8"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Supports (comma-separated)</label>
              <Input
                placeholder="e.g. Added Lightning, Faster Attacks"
                value={supportsInput}
                onChange={(e) => setSupportsInput(e.target.value)}
                className="h-8"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Weapon Types (comma-separated)</label>
              <Input
                placeholder="e.g. Bow, Quiver"
                value={weaponsInput}
                onChange={(e) => setWeaponsInput(e.target.value)}
                className="h-8"
              />
            </div>
          </div>

          <Separator />

          {/* Defenses */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Defenses</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Life</label>
                <Input
                  type="number"
                  min={0}
                  value={form.life}
                  onChange={(e) => setForm({ ...form, life: Number(e.target.value) || 0 })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Energy Shield</label>
                <Input
                  type="number"
                  min={0}
                  value={form.energyShield}
                  onChange={(e) => setForm({ ...form, energyShield: Number(e.target.value) || 0 })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Armour</label>
                <Input
                  type="number"
                  min={0}
                  value={form.armour}
                  onChange={(e) => setForm({ ...form, armour: Number(e.target.value) || 0 })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Evasion</label>
                <Input
                  type="number"
                  min={0}
                  value={form.evasion}
                  onChange={(e) => setForm({ ...form, evasion: Number(e.target.value) || 0 })}
                  className="h-8"
                />
              </div>
            </div>
          </div>

          {/* Resistances */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Resistances (%)</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Fire</label>
                <Input
                  type="number"
                  value={form.fireRes}
                  onChange={(e) => setForm({ ...form, fireRes: Number(e.target.value) || 0 })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Cold</label>
                <Input
                  type="number"
                  value={form.coldRes}
                  onChange={(e) => setForm({ ...form, coldRes: Number(e.target.value) || 0 })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Lightning</label>
                <Input
                  type="number"
                  value={form.lightningRes}
                  onChange={(e) => setForm({ ...form, lightningRes: Number(e.target.value) || 0 })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Chaos</label>
                <Input
                  type="number"
                  value={form.chaosRes}
                  onChange={(e) => setForm({ ...form, chaosRes: Number(e.target.value) || 0 })}
                  className="h-8"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Goals */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium">Current Problem</label>
              <Input
                placeholder="e.g. dying to bosses"
                value={form.currentProblem}
                onChange={(e) => setForm({ ...form, currentProblem: e.target.value })}
                className="h-8"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Budget</label>
              <Input
                placeholder="e.g. 200 chaos"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                className="h-8"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Goals</label>
              <Input
                placeholder="e.g. farm T16 maps efficiently"
                value={form.goals}
                onChange={(e) => setForm({ ...form, goals: e.target.value })}
                className="h-8"
              />
            </div>
          </div>

          {/* Save / Reset */}
          <div className="flex gap-2">
            <Button onClick={handleSave} className="gap-1.5">
              <Save className="h-4 w-4" />
              Save Session
            </Button>
            <Button variant="outline" onClick={handleReset} className="gap-1.5">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Key */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Key
          </CardTitle>
          <CardDescription>
            Configure your Anthropic API key for the AI coach. Stored locally in your browser only.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showApiKey ? "text" : "password"}
                placeholder="sk-ant-..."
                value={apiKeyDraft}
                onChange={(e) => setApiKeyDraft(e.target.value)}
                className="h-8 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button size="sm" onClick={handleSaveApiKey}>
              <Save className="mr-1 h-3.5 w-3.5" />
              Save
            </Button>
          </div>
          {apiKey && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">Key configured</Badge>
              <span className="text-xs text-muted-foreground">
                {apiKey.slice(0, 10)}{"*".repeat(20)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Clear all app data including builds, crafting plans, teams, and session state.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!confirmClear ? (
            <Button
              variant="destructive"
              onClick={() => setConfirmClear(true)}
              className="gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-destructive">
                This will permanently delete ALL data. Are you sure?
              </p>
              <div className="flex gap-2">
                <Button variant="destructive" onClick={handleClearAll} className="gap-1.5">
                  <Trash2 className="h-4 w-4" />
                  Yes, Delete Everything
                </Button>
                <Button variant="outline" onClick={() => setConfirmClear(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  )
}
