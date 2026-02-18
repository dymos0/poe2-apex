import { cn } from "@/lib/utils"

interface ActionItem {
  id: string
  label: string
  priority: number
  completed?: boolean
}

interface ActionPriorityListProps {
  items: ActionItem[]
  onToggle?: (id: string) => void
  className?: string
}

export function ActionPriorityList({ items, onToggle, className }: ActionPriorityListProps) {
  return (
    <ol className={cn("space-y-2", className)}>
      {items.map((item) => (
        <li
          key={item.id}
          className={cn(
            "flex items-start gap-3 rounded-lg border p-3 transition-colors",
            item.completed
              ? "border-border/50 bg-muted/30 text-muted-foreground line-through"
              : "border-border bg-card hover:bg-accent/50",
          )}
        >
          <button
            type="button"
            onClick={() => onToggle?.(item.id)}
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
              item.completed
                ? "border-muted-foreground bg-muted-foreground/20 text-muted-foreground"
                : "border-primary bg-primary/10 text-primary",
            )}
          >
            {item.priority}
          </button>
          <span className="text-sm">{item.label}</span>
        </li>
      ))}
    </ol>
  )
}
