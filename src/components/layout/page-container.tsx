import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function PageContainer({ title, description, actions, children, className }: PageContainerProps) {
  return (
    <div className={cn("flex flex-col gap-6 p-6", className)}>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  )
}
