export type POE2Class =
  | "Ranger" | "Sorceress" | "Witch" | "Monk"
  | "Warrior" | "Mercenary" | "Huntress" | "Druid"

export type Ascendancy =
  | "Deadeye" | "Pathfinder"
  | "Amazon" | "Ritualist"
  | "Invoker" | "Acolyte of Chayula"
  | "Infernalist" | "Blood Mage" | "Lich" | "Abyssal Lich"
  | "Stormweaver" | "Chronomancer" | "Disciple of Varashta"
  | "Titan" | "Warbringer" | "Smith of Kitava"
  | "Tactician" | "Witchhunter" | "Gemling Legionnaire"
  | "Oracle" | "Shaman"

export type DamageType = "physical" | "fire" | "cold" | "lightning" | "chaos"
export type DefenseLayer = "life" | "es" | "armour" | "evasion"
export type Rarity = "normal" | "magic" | "rare" | "unique" | "currency" | "gem"
export type RiskLevel = "safe" | "warning" | "danger"

export interface SessionState {
  patchLeague: string
  class: POE2Class | ""
  ascendancy: Ascendancy | ""
  level: number
  actOrTier: string
  mainSkill: string
  supports: string[]
  weaponTypes: string[]
  life: number
  energyShield: number
  armour: number
  evasion: number
  fireRes: number
  coldRes: number
  lightningRes: number
  chaosRes: number
  currentProblem: string
  budget: string
  goals: string
}

export interface SkillGem {
  id: string
  name: string
  isSupport: boolean
  level: number
  quality: number
}

export interface GearSlot {
  slot: string
  itemName: string
  rarity: Rarity
  targetAffixes: Affix[]
  currentAffixes: Affix[]
}

export interface Affix {
  id: string
  name: string
  type: "prefix" | "suffix"
  tier: number
  value: string
}

export interface Build {
  id: string
  name: string
  class: POE2Class
  ascendancy: Ascendancy | ""
  level: number
  mainSkill: string
  skillGems: SkillGem[]
  gearSlots: GearSlot[]
  defenses: DefenseProfile
  notes: string
  createdAt: number
  updatedAt: number
}

export interface DefenseProfile {
  life: number
  energyShield: number
  armour: number
  evasion: number
  fireRes: number
  coldRes: number
  lightningRes: number
  chaosRes: number
  blockChance: number
  regenPerSec: number
  leechRate: number
}

export interface CraftingStep {
  id: string
  order: number
  action: string
  materials: string
  cost: string
  stopCondition: string
  completed: boolean
}

export interface CraftingPlan {
  id: string
  name: string
  targetItem: string
  steps: CraftingStep[]
  totalCost: string
  buyNowPrice: string
  notes: string
}

export interface WaystoneConfig {
  tier: number
  affixCount: number
  hasAbyssMod: boolean
  liquidType: "paranoia" | "greed" | "none"
  liquidCount: number
  corrupted: boolean
}

export interface AtlasNode {
  id: string
  name: string
  allocated: boolean
  category: string
}

export interface TradeSearch {
  id: string
  name: string
  mustHaveAffixes: string[]
  niceToHaveAffixes: string[]
  maxPrice: string
  notes: string
}

export type TeamRole = "carry" | "support" | "tank" | "utility"

export interface TeamMember {
  id: string
  name: string
  role: TeamRole
  class: POE2Class
  ascendancy: Ascendancy | ""
  mainSkill: string
  defenseContributions: string[]
}

export interface Team {
  id: string
  name: string
  members: TeamMember[]
  notes: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  context?: string
}

export interface PageContext {
  page: string
  label: string
  data: Record<string, unknown>
}
