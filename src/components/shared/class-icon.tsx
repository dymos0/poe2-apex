import {
  Target, Flame, Skull, HandMetal,
  Shield, Crosshair, TreePine, Compass,
} from "lucide-react"
import type { POE2Class } from "@/lib/types"
import { cn } from "@/lib/utils"

const CLASS_ICONS: Record<POE2Class, typeof Target> = {
  Ranger: Target,
  Sorceress: Flame,
  Witch: Skull,
  Monk: HandMetal,
  Warrior: Shield,
  Mercenary: Crosshair,
  Huntress: Compass,
  Druid: TreePine,
}

interface ClassIconProps {
  poe2Class: POE2Class
  size?: number
  className?: string
}

export function ClassIcon({ poe2Class, size = 20, className }: ClassIconProps) {
  const Icon = CLASS_ICONS[poe2Class]
  return <Icon className={cn("shrink-0", className)} size={size} />
}
