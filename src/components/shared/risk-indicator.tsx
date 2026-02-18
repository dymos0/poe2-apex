import { ShieldAlert, ShieldCheck, ShieldX } from "lucide-react"
import type { RiskLevel } from "@/lib/types"
import { cn } from "@/lib/utils"

const RISK_CONFIG: Record<RiskLevel, { icon: typeof ShieldCheck; label: string; color: string }> = {
  safe: { icon: ShieldCheck, label: "Safe", color: "text-status-safe" },
  warning: { icon: ShieldAlert, label: "Warning", color: "text-status-warning" },
  danger: { icon: ShieldX, label: "Danger", color: "text-status-danger" },
}

interface RiskIndicatorProps {
  level: RiskLevel
  label?: string
  className?: string
}

export function RiskIndicator({ level, label, className }: RiskIndicatorProps) {
  const config = RISK_CONFIG[level]
  const Icon = config.icon

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Icon className={cn("h-4 w-4", config.color)} />
      <span className={cn("text-xs font-medium", config.color)}>
        {label ?? config.label}
      </span>
    </div>
  )
}
