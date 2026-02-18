import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: number | string
  icon?: ReactNode
  color?: string
  className?: string
}

export function StatCard({ label, value, icon, color, className }: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="flex items-center gap-3 p-4">
        {icon && (
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", color ?? "bg-muted")}>
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold tabular-nums">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
