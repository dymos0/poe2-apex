import { useEffect } from "react"
import { useStore } from "@/stores"
import type { PageContext } from "@/lib/types"

export function usePageContext(context: PageContext) {
  const setContext = useStore((s) => s.setContext)

  useEffect(() => {
    setContext(context)
    return () => setContext(null)
  }, [context.page, context.label, setContext])
}
