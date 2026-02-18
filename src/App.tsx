import { RouterProvider } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import { router } from "./router"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>
  )
}
