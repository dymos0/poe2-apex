import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepProgressProps {
  steps: { label: string; completed: boolean }[]
  currentStep: number
}

export function StepProgress({ steps, currentStep }: StepProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                step.completed
                  ? "bg-status-safe text-white"
                  : i === currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground",
              )}
            >
              {step.completed ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span
              className={cn(
                "text-xs",
                i === currentStep ? "font-medium" : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "h-px w-8",
                step.completed ? "bg-status-safe" : "bg-border",
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
