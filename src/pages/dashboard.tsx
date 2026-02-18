import { useMemo } from "react"
import { useNavigate } from "react-router"
import { Heart, Shield, Zap, Wind, Sparkles, Settings, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PageContainer } from "@/components/layout/page-container"
import { StatCard } from "@/components/shared/stat-card"
import { ActionPriorityList } from "@/components/shared/action-priority-list"
import { BuildCard } from "@/components/shared/build-card"
import { usePageContext } from "@/hooks/use-page-context"
import { useAiChat } from "@/hooks/use-ai-chat"
import { useStore } from "@/stores"

const SUGGESTION_CHIPS = [
  "Optimize my defenses",
  "Best next upgrade",
  "Atlas strategy",
  "Crafting priority",
  "What should I farm?",
]

const PLACEHOLDER_ACTIONS = [
  { id: "1", priority: 1, label: "Cap elemental resistances to 75% before progressing further" },
  { id: "2", priority: 2, label: "Upgrade your main skill gem to max available level" },
  { id: "3", priority: 3, label: "Acquire a 2nd defense layer (armour or evasion base)" },
  { id: "4", priority: 4, label: "Roll waystones with at least 4 affixes for tablet slot access" },
  { id: "5", priority: 5, label: "Set up your Atlas passive tree for your target mechanic" },
]

export function Dashboard() {
  const navigate = useNavigate()
  const { askAi } = useAiChat()
  const session = useStore((s) => s.session)
  const builds = useStore((s) => s.builds)
  const activeBuildId = useStore((s) => s.activeBuildId)

  const hasSession = useMemo(
    () => session.class !== "" || session.mainSkill !== "" || session.level > 1,
    [session.class, session.mainSkill, session.level],
  )

  usePageContext({ page: "dashboard", label: "Dashboard", data: {} })

  return (
    <PageContainer
      title="Dashboard"
      description="Your POE2 command center — session overview, priorities, and quick AI actions."
      actions={
        <Button
          variant="default"
          size="sm"
          className="gap-1.5"
          onClick={() => askAi("Based on my current session state, what are my best next actions?")}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Ask AI
        </Button>
      }
    >
      {/* Session prompt or summary */}
      {!hasSession ? (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to POE2 Apex</CardTitle>
            <CardDescription>
              Configure your session state so the AI coach can give you targeted advice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/settings")} className="gap-2">
              <Settings className="h-4 w-4" />
              Go to Settings
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-wrap items-center gap-4 p-4">
            {session.class && <Badge variant="secondary">{session.class}</Badge>}
            {session.ascendancy && <Badge variant="outline">{session.ascendancy}</Badge>}
            <span className="text-sm text-muted-foreground">Level {session.level}</span>
            {session.actOrTier && (
              <span className="text-sm text-muted-foreground">{session.actOrTier}</span>
            )}
            {session.mainSkill && (
              <>
                <Separator orientation="vertical" className="!h-4" />
                <span className="text-sm">Main: <span className="font-medium text-primary">{session.mainSkill}</span></span>
              </>
            )}
            <div className="ml-auto">
              <Button variant="ghost" size="sm" onClick={() => navigate("/settings")}>
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Life"
          value={session.life}
          icon={<Heart className="h-5 w-5 text-defense-life" />}
          color="bg-defense-life/10"
        />
        <StatCard
          label="Energy Shield"
          value={session.energyShield}
          icon={<Zap className="h-5 w-5 text-defense-es" />}
          color="bg-defense-es/10"
        />
        <StatCard
          label="Armour"
          value={session.armour}
          icon={<Shield className="h-5 w-5 text-defense-armour" />}
          color="bg-defense-armour/10"
        />
        <StatCard
          label="Evasion"
          value={session.evasion}
          icon={<Wind className="h-5 w-5 text-defense-evasion" />}
          color="bg-defense-evasion/10"
        />
      </div>

      {/* Best Next Actions */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Best Next Actions</h2>
        <ActionPriorityList items={PLACEHOLDER_ACTIONS} />
      </section>

      {/* Builds */}
      {builds.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Builds</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/build")}>
              View all
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {builds.slice(0, 3).map((build) => (
              <BuildCard
                key={build.id}
                build={build}
                isActive={build.id === activeBuildId}
              />
            ))}
          </div>
        </section>
      )}

      {/* Quick AI suggestions */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Quick AI Suggestions</h2>
        <div className="flex flex-wrap gap-2">
          {SUGGESTION_CHIPS.map((chip) => (
            <Button
              key={chip}
              variant="secondary"
              size="sm"
              className="gap-1.5"
              onClick={() => askAi(chip)}
            >
              <Sparkles className="h-3 w-3" />
              {chip}
            </Button>
          ))}
        </div>
      </section>
    </PageContainer>
  )
}
