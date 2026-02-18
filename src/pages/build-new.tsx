import { useState, useMemo } from "react"
import { useNavigate } from "react-router"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PageContainer } from "@/components/layout/page-container"
import { ClassIcon } from "@/components/shared/class-icon"
import { usePageContext } from "@/hooks/use-page-context"
import { useStore } from "@/stores"
import type { POE2Class, Ascendancy } from "@/lib/types"
import { CLASSES, CLASS_ASCENDANCIES, DEFAULT_DEFENSE_PROFILE } from "@/lib/constants"

const STEPS = ["Class", "Ascendancy", "Details", "Review"] as const

export function BuildNew() {
  const navigate = useNavigate()
  const addBuild = useStore((s) => s.addBuild)
  const setActiveBuild = useStore((s) => s.setActiveBuild)

  const [step, setStep] = useState(0)
  const [selectedClass, setSelectedClass] = useState<POE2Class | null>(null)
  const [selectedAscendancy, setSelectedAscendancy] = useState<Ascendancy | "">("")
  const [name, setName] = useState("")
  const [mainSkill, setMainSkill] = useState("")
  const [notes, setNotes] = useState("")

  usePageContext({ page: "build-new", label: "New Build", data: {} })

  const ascendancies = useMemo(
    () => (selectedClass ? CLASS_ASCENDANCIES[selectedClass] : []),
    [selectedClass],
  )

  const canProceed = useMemo(() => {
    switch (step) {
      case 0: return selectedClass !== null
      case 1: return true // ascendancy is optional
      case 2: return name.trim().length > 0
      case 3: return true
      default: return false
    }
  }, [step, selectedClass, name])

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  function handleCreate() {
    if (!selectedClass || !name.trim()) return

    const id = crypto.randomUUID()
    addBuild({
      id,
      name: name.trim(),
      class: selectedClass,
      ascendancy: selectedAscendancy,
      level: 1,
      mainSkill: mainSkill.trim(),
      skillGems: [],
      gearSlots: [],
      defenses: { ...DEFAULT_DEFENSE_PROFILE },
      notes: notes.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    setActiveBuild(id)
    navigate(`/build/${id}`)
  }

  return (
    <PageContainer
      title="New Build"
      description="Create a new character build step by step."
    >
      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            {i > 0 && <Separator className="w-8" />}
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className={`flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors ${
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="h-3 w-3" /> : <span>{i + 1}</span>}
              {label}
            </button>
          </div>
        ))}
      </div>

      {/* Step 1: Class */}
      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Your Class</CardTitle>
            <CardDescription>Choose a base class for your build.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {CLASSES.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => {
                    setSelectedClass(cls)
                    setSelectedAscendancy("")
                  }}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-accent/50 ${
                    selectedClass === cls
                      ? "border-primary bg-primary/10"
                      : "border-border"
                  }`}
                >
                  <ClassIcon poe2Class={cls} size={28} />
                  <span className="text-sm font-medium">{cls}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Ascendancy */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Ascendancy</CardTitle>
            <CardDescription>
              Pick an ascendancy for {selectedClass}. You can also skip this for now.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setSelectedAscendancy("")}
                className={`flex items-center justify-center rounded-lg border p-4 text-sm transition-colors hover:bg-accent/50 ${
                  selectedAscendancy === ""
                    ? "border-primary bg-primary/10 font-medium"
                    : "border-border text-muted-foreground"
                }`}
              >
                None (decide later)
              </button>
              {ascendancies.map((asc) => (
                <button
                  key={asc}
                  type="button"
                  onClick={() => setSelectedAscendancy(asc)}
                  className={`flex items-center justify-center rounded-lg border p-4 text-sm font-medium transition-colors hover:bg-accent/50 ${
                    selectedAscendancy === asc
                      ? "border-primary bg-primary/10"
                      : "border-border"
                  }`}
                >
                  {asc}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Details */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Build Details</CardTitle>
            <CardDescription>Name your build and set its core info.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="build-name" className="mb-1.5 block text-sm font-medium">
                Build Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="build-name"
                placeholder="e.g. Lightning Arrow Deadeye"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="main-skill" className="mb-1.5 block text-sm font-medium">
                Main Skill
              </label>
              <Input
                id="main-skill"
                placeholder="e.g. Lightning Arrow"
                value={mainSkill}
                onChange={(e) => setMainSkill(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="notes" className="mb-1.5 block text-sm font-medium">
                Notes
              </label>
              <textarea
                id="notes"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Any notes about this build..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Review Your Build</CardTitle>
            <CardDescription>Confirm and create your new build.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-3">
                {selectedClass && <ClassIcon poe2Class={selectedClass} size={24} />}
                <span className="text-lg font-semibold">{name || "Unnamed Build"}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedClass && <Badge variant="secondary">{selectedClass}</Badge>}
                {selectedAscendancy && <Badge variant="outline">{selectedAscendancy}</Badge>}
              </div>
              {mainSkill && (
                <p className="text-sm text-muted-foreground">Main Skill: <span className="text-foreground">{mainSkill}</span></p>
              )}
              {notes && (
                <p className="text-sm text-muted-foreground">{notes}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={step === 0 ? () => navigate("/build") : handleBack}
          className="gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          {step === 0 ? "Cancel" : "Back"}
        </Button>

        {step < STEPS.length - 1 ? (
          <Button onClick={handleNext} disabled={!canProceed} className="gap-1.5">
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleCreate} disabled={!canProceed} className="gap-1.5">
            <Check className="h-4 w-4" />
            Create Build
          </Button>
        )}
      </div>
    </PageContainer>
  )
}
