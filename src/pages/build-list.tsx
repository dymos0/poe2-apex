import { useNavigate } from "react-router"
import { Plus, Swords } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageContainer } from "@/components/layout/page-container"
import { BuildCard } from "@/components/shared/build-card"
import { usePageContext } from "@/hooks/use-page-context"
import { useStore } from "@/stores"

export function BuildList() {
  const navigate = useNavigate()
  const builds = useStore((s) => s.builds)
  const activeBuildId = useStore((s) => s.activeBuildId)
  const deleteBuild = useStore((s) => s.deleteBuild)

  usePageContext({ page: "build-list", label: "Build Planner", data: {} })

  return (
    <PageContainer
      title="Build Planner"
      description="Manage all your character builds in one place."
      actions={
        <Button size="sm" className="gap-1.5" onClick={() => navigate("/build/new")}>
          <Plus className="h-3.5 w-3.5" />
          New Build
        </Button>
      }
    >
      {builds.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Swords className="h-7 w-7 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">No builds yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first build to get started with the planner.
              </p>
            </div>
            <Button onClick={() => navigate("/build/new")} className="gap-1.5">
              <Plus className="h-4 w-4" />
              Create First Build
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {builds.map((build) => (
            <BuildCard
              key={build.id}
              build={build}
              isActive={build.id === activeBuildId}
              onDelete={deleteBuild}
            />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
