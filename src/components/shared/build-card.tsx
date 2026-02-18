import { useNavigate } from "react-router"
import { Swords, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Build } from "@/lib/types"
import { cn } from "@/lib/utils"

interface BuildCardProps {
  build: Build
  isActive?: boolean
  onDelete?: (id: string) => void
  className?: string
}

export function BuildCard({ build, isActive, onDelete, className }: BuildCardProps) {
  const navigate = useNavigate()

  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors hover:bg-accent/50",
        isActive && "ring-1 ring-primary",
        className,
      )}
      onClick={() => navigate(`/build/${build.id}`)}
    >
      <CardContent className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Swords className="h-4 w-4 shrink-0 text-primary" />
            <h3 className="truncate text-sm font-medium">{build.name}</h3>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="text-xs">{build.class}</Badge>
            {build.ascendancy && (
              <Badge variant="outline" className="text-xs">{build.ascendancy}</Badge>
            )}
            <span className="text-xs text-muted-foreground">Lv {build.level}</span>
          </div>
          {build.mainSkill && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Main: {build.mainSkill}
            </p>
          )}
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(build.id)
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
