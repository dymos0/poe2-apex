import { cn } from "@/lib/utils"
import type { Affix } from "@/lib/types"

interface AffixTagProps {
  affix: Affix
  className?: string
}

export function AffixTag({ affix, className }: AffixTagProps) {
  const isPrefix = affix.type === "prefix"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs",
        isPrefix ? "bg-rarity-magic/10 text-rarity-magic" : "bg-status-safe/10 text-status-safe",
        className,
      )}
    >
      <span className="font-medium">{affix.name}</span>
      {affix.tier > 0 && (
        <span className="text-muted-foreground">T{affix.tier}</span>
      )}
    </span>
  )
}
