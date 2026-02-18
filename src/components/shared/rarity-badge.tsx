import { cn } from "@/lib/utils"
import type { Rarity } from "@/lib/types"

const RARITY_STYLES: Record<Rarity, string> = {
  normal: "text-rarity-normal border-rarity-normal/30",
  magic: "text-rarity-magic border-rarity-magic/30",
  rare: "text-rarity-rare border-rarity-rare/30",
  unique: "text-rarity-unique border-rarity-unique/30",
  currency: "text-rarity-currency border-rarity-currency/30",
  gem: "text-rarity-gem border-rarity-gem/30",
}

interface RarityBadgeProps {
  rarity: Rarity
  className?: string
}

export function RarityBadge({ rarity, className }: RarityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-1.5 py-0.5 text-xs capitalize",
        RARITY_STYLES[rarity],
        className,
      )}
    >
      {rarity}
    </span>
  )
}
