import { useLocation } from "react-router"
import { Search } from "lucide-react"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

const ROUTE_LABELS: Record<string, string> = {
  "/": "Dashboard",
  "/build": "Build Planner",
  "/build/new": "New Build",
  "/crafting": "Crafting Workshop",
  "/crafting/simulator": "Crafting Simulator",
  "/atlas": "Atlas Planner",
  "/trade": "Trade Advisor",
  "/team": "Team Planner",
  "/settings": "Settings",
}

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length === 0) return [{ label: "Dashboard", path: "/" }]

  const crumbs = [{ label: "Dashboard", path: "/" }]
  let currentPath = ""

  for (const segment of segments) {
    currentPath += `/${segment}`
    const label = ROUTE_LABELS[currentPath] ?? segment.charAt(0).toUpperCase() + segment.slice(1)
    crumbs.push({ label, path: currentPath })
  }

  return crumbs
}

interface TopBarProps {
  onOpenSearch?: () => void
}

export function TopBar({ onOpenSearch }: TopBarProps) {
  const location = useLocation()
  const breadcrumbs = getBreadcrumbs(location.pathname)

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 !h-4" />

      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1
            return (
              <span key={crumb.path} className="flex items-center gap-1">
                {i > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.path}>{crumb.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </span>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <Button
        variant="outline"
        size="sm"
        className="hidden gap-2 text-muted-foreground md:flex"
        onClick={onOpenSearch}
      >
        <Search className="h-3.5 w-3.5" />
        <span className="text-xs">Search...</span>
        <kbd className="pointer-events-none ml-2 inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          Ctrl+K
        </kbd>
      </Button>
    </header>
  )
}
