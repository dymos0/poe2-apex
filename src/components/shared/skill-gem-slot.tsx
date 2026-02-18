import { cn } from "@/lib/utils"
import type { SkillGem } from "@/lib/types"

interface SkillGemSlotProps {
  gem: SkillGem
  linked?: boolean
  className?: string
}

export function SkillGemSlot({ gem, linked, className }: SkillGemSlotProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {linked && <div className="h-px w-3 bg-rarity-gem" />}
      <div
        className={cn(
          "flex items-center justify-center rounded-full border font-bold",
          gem.isSupport
            ? "h-7 w-7 border-rarity-gem/30 bg-rarity-gem/10 text-[10px] text-rarity-gem"
            : "h-9 w-9 border-rarity-gem/50 bg-rarity-gem/20 text-xs text-rarity-gem",
        )}
      >
        {gem.name.charAt(0)}
      </div>
      <div className="flex flex-col">
        <span className={cn("text-xs font-medium", gem.isSupport && "text-muted-foreground")}>
          {gem.name}
        </span>
        <span className="text-[10px] text-muted-foreground">
          Lv {gem.level}
          {gem.quality > 0 && ` / ${gem.quality}%`}
        </span>
      </div>
    </div>
  )
}
