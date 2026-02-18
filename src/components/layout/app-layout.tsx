import { Outlet } from "react-router"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { AppSidebar } from "./app-sidebar"
import { TopBar } from "./top-bar"
import { AiPanel } from "./ai-panel"
import { useStore } from "@/stores"

export function AppLayout() {
  const aiPanelOpen = useStore((s) => s.aiPanelOpen)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex h-dvh flex-col overflow-hidden">
        <TopBar />
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={aiPanelOpen ? 65 : 100} minSize={40}>
            <main className="h-full overflow-auto">
              <Outlet />
            </main>
          </ResizablePanel>

          {aiPanelOpen && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
                <AiPanel />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </SidebarInset>
    </SidebarProvider>
  )
}
