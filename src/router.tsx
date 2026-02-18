import { lazy, Suspense } from "react"
import { createBrowserRouter } from "react-router"
import { AppLayout } from "@/components/layout/app-layout"
import { Skeleton } from "@/components/ui/skeleton"

const Dashboard = lazy(() => import("@/pages/dashboard").then((m) => ({ default: m.Dashboard })))
const BuildList = lazy(() => import("@/pages/build-list").then((m) => ({ default: m.BuildList })))
const BuildDetail = lazy(() => import("@/pages/build-detail").then((m) => ({ default: m.BuildDetail })))
const BuildNew = lazy(() => import("@/pages/build-new").then((m) => ({ default: m.BuildNew })))
const CraftingHub = lazy(() => import("@/pages/crafting-hub").then((m) => ({ default: m.CraftingHub })))
const CraftingSimulator = lazy(() => import("@/pages/crafting-simulator").then((m) => ({ default: m.CraftingSimulator })))
const AtlasPlanner = lazy(() => import("@/pages/atlas-planner").then((m) => ({ default: m.AtlasPlanner })))
const TradeAdvisor = lazy(() => import("@/pages/trade-advisor").then((m) => ({ default: m.TradeAdvisor })))
const TeamPlanner = lazy(() => import("@/pages/team-planner").then((m) => ({ default: m.TeamPlanner })))
const Settings = lazy(() => import("@/pages/settings").then((m) => ({ default: m.Settings })))

function PageLoader() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    </div>
  )
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: withSuspense(Dashboard) },
      { path: "build", element: withSuspense(BuildList) },
      { path: "build/new", element: withSuspense(BuildNew) },
      { path: "build/:id", element: withSuspense(BuildDetail) },
      { path: "crafting", element: withSuspense(CraftingHub) },
      { path: "crafting/simulator", element: withSuspense(CraftingSimulator) },
      { path: "atlas", element: withSuspense(AtlasPlanner) },
      { path: "trade", element: withSuspense(TradeAdvisor) },
      { path: "team", element: withSuspense(TeamPlanner) },
      { path: "settings", element: withSuspense(Settings) },
    ],
  },
])
