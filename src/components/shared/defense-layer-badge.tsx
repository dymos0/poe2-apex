import { cn } from "@/lib/utils"
import type { DefenseLayer } from "@/lib/types"

const LAYER_COLORS: Record<DefenseLayer, string> = {
  life: "bg-defense-life",
  es: "bg-defense-es",
  armour: "bg-defense-armour",
  evasion: "bg-defense-evasion",
}

const LAYER_LABELS: Record<DefenseLayer, string> = {
  life: "Life",
  es: "ES",
  armour: "Armour",
  evasion: "Evasion",
}

interface DefenseLayerBadgeProps {
  layer: DefenseLayer
  value?: number
  className?: string
}

export function DefenseLayerBadge({ layer, value, className }: DefenseLayerBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-secondary px-2 py-0.5 text-xs",
        className,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", LAYER_COLORS[layer])} />
      <span>{LAYER_LABELS[layer]}</span>
      {value !== undefined && (
        <span className="font-mono text-muted-foreground">{value.toLocaleString()}</span>
      )}
    </span>
  )
}
