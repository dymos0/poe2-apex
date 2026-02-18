import { Badge } from "@/components/ui/badge"
import type { PageContext } from "@/lib/types"

interface ContextChipProps {
  context: PageContext
}

export function ContextChip({ context }: ContextChipProps) {
  return (
    <Badge variant="outline" className="text-xs">
      {context.label}
    </Badge>
  )
}
