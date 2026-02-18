import { useLocation, useNavigate } from "react-router"
import {
  LayoutDashboard, Swords, Hammer, Map, ArrowLeftRight,
  Users, Settings, Sparkles, ChevronDown,
} from "lucide-react"
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarFooter, SidebarSeparator,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useStore } from "@/stores"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/build", label: "Build Planner", icon: Swords, badgeKey: "builds" as const },
  { path: "/crafting", label: "Crafting Workshop", icon: Hammer },
  { path: "/atlas", label: "Atlas Planner", icon: Map },
  { path: "/trade", label: "Trade Advisor", icon: ArrowLeftRight },
  { path: "/team", label: "Team Planner", icon: Users },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const builds = useStore((s) => s.builds)
  const activeBuildId = useStore((s) => s.activeBuildId)
  const setActiveBuild = useStore((s) => s.setActiveBuild)
  const aiPanelOpen = useStore((s) => s.aiPanelOpen)
  const toggleAiPanel = useStore((s) => s.toggleAiPanel)

  const activeBuild = builds.find((b) => b.id === activeBuildId)

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/"
    return location.pathname.startsWith(path)
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={() => navigate("/")}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
            A
          </div>
          <span className="text-lg font-semibold tracking-tight">
            POE2 <span className="text-primary">APEX</span>
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={isActive(item.path)}
                    className="justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {item.badgeKey === "builds" && builds.length > 0 && (
                      <Badge variant="secondary" className="h-5 min-w-5 justify-center px-1 text-xs">
                        {builds.length}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {builds.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Active Build</SidebarGroupLabel>
            <SidebarGroupContent>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent">
                    <span className="truncate">
                      {activeBuild ? activeBuild.name : "Select a build..."}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {builds.map((build) => (
                    <DropdownMenuItem
                      key={build.id}
                      onClick={() => setActiveBuild(build.id)}
                      className={cn(build.id === activeBuildId && "bg-accent")}
                    >
                      <span className="truncate">
                        {build.name} — {build.class}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate("/settings")}
              isActive={isActive("/settings")}
            >
              <Settings className="h-4 w-4" />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleAiPanel} className="justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Coach
              </span>
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  aiPanelOpen ? "bg-status-safe" : "bg-muted-foreground",
                )}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
