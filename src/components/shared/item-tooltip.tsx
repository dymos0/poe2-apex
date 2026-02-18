import type { ReactNode } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { AffixTag } from "./affix-tag"
import { cn } from "@/lib/utils"
import type { Rarity, Affix } from "@/lib/types"

const RARITY_BORDER: Record<Rarity, string> = {
  normal: "border-t-rarity-normal",
  magic: "border-t-rarity-magic",
  rare: "border-t-rarity-rare",
  unique: "border-t-rarity-unique",
  currency: "border-t-rarity-currency",
  gem: "border-t-rarity-gem",
}

const RARITY_TEXT: Record<Rarity, string> = {
  normal: "text-rarity-normal",
  magic: "text-rarity-magic",
  rare: "text-rarity-rare",
  unique: "text-rarity-unique",
  currency: "text-rarity-currency",
  gem: "text-rarity-gem",
}

interface ItemTooltipProps {
  name: string
  rarity: Rarity
  affixes: Affix[]
  children: ReactNode
}

export function ItemTooltip({ name, rarity, affixes, children }: ItemTooltipProps) {
  const prefixes = affixes.filter((a) => a.type === "prefix")
  const suffixes = affixes.filter((a) => a.type === "suffix")

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        className={cn("w-64 border-t-2 bg-background p-0", RARITY_BORDER[rarity])}
      >
        <div className="border-b p-3">
          <p className={cn("text-sm font-semibold", RARITY_TEXT[rarity])}>{name}</p>
        </div>
        {affixes.length > 0 && (
          <div className="space-y-2 p-3">
            {prefixes.length > 0 && (
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Prefixes</p>
                {prefixes.map((a) => (
                  <AffixTag key={a.id} affix={a} />
                ))}
              </div>
            )}
            {suffixes.length > 0 && (
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Suffixes</p>
                {suffixes.map((a) => (
                  <AffixTag key={a.id} affix={a} />
                ))}
              </div>
            )}
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
