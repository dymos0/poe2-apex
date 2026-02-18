import type { POE2Class, Ascendancy } from "./types"

export const CLASS_ASCENDANCIES: Record<POE2Class, Ascendancy[]> = {
  Ranger: ["Deadeye", "Pathfinder"],
  Huntress: ["Amazon", "Ritualist"],
  Monk: ["Invoker", "Acolyte of Chayula"],
  Witch: ["Infernalist", "Blood Mage", "Lich", "Abyssal Lich"],
  Sorceress: ["Stormweaver", "Chronomancer", "Disciple of Varashta"],
  Warrior: ["Titan", "Warbringer", "Smith of Kitava"],
  Mercenary: ["Tactician", "Witchhunter", "Gemling Legionnaire"],
  Druid: ["Oracle", "Shaman"],
}

export const CLASSES: POE2Class[] = [
  "Ranger", "Sorceress", "Witch", "Monk",
  "Warrior", "Mercenary", "Huntress", "Druid",
]

export const DEFENSE_LAYERS = [
  { key: "hitMitigation", label: "Hit Mitigation", examples: "Armour, Evasion, Block" },
  { key: "damageReduction", label: "Damage Reduction", examples: "Resistances, mitigation %" },
  { key: "dotMitigation", label: "DoT Mitigation", examples: "Separate from hit mitigation" },
  { key: "healthPool", label: "Health Pool", examples: "Life and/or Energy Shield" },
  { key: "recovery", label: "Recovery", examples: "Regen / leech / on-kill / flask" },
  { key: "avoidance", label: "Avoidance", examples: "Movement, dodge roll, boss patterns" },
] as const

export const GEAR_SLOTS = [
  "Weapon", "Off-Hand", "Helmet", "Body Armour",
  "Gloves", "Boots", "Belt", "Amulet",
  "Ring 1", "Ring 2",
] as const

export const CURRENCY_ITEMS = [
  { name: "Orb of Alteration", shortName: "alt", description: "Reroll magic item affixes" },
  { name: "Augmentation Orb", shortName: "aug", description: "Add affix to magic item" },
  { name: "Regal Orb", shortName: "regal", description: "Magic -> rare, adds one affix" },
  { name: "Orb of Alchemy", shortName: "alch", description: "Normal -> rare" },
  { name: "Exalted Orb", shortName: "ex", description: "Add affix to rare item" },
  { name: "Chaos Orb", shortName: "chaos", description: "Reroll all rare affixes" },
  { name: "Vaal Orb", shortName: "vaal", description: "Corrupt item" },
] as const

export const CONTENT_ENCOUNTERS = [
  "Breach", "Delirium", "Ritual", "Expedition",
  "Shrines", "Strongboxes", "Essences", "Wisps",
  "Rogue Exiles", "Summoning Circles",
] as const

export const TEAM_ROLES = [
  { key: "carry", label: "Carry", description: "Primary damage — clear speed and boss DPS" },
  { key: "support", label: "Support/Aura", description: "Buffs, curses, exposure — scales carry output" },
  { key: "tank", label: "Tank/Distraction", description: "Holds aggro, survives, buys action windows" },
  { key: "utility", label: "Utility/Flex", description: "Totems, traps, mechanic-specific tasks" },
] as const

export const DEFAULT_SESSION_STATE = {
  patchLeague: "",
  class: "" as const,
  ascendancy: "" as const,
  level: 1,
  actOrTier: "",
  mainSkill: "",
  supports: [],
  weaponTypes: [],
  life: 0,
  energyShield: 0,
  armour: 0,
  evasion: 0,
  fireRes: 0,
  coldRes: 0,
  lightningRes: 0,
  chaosRes: 0,
  currentProblem: "",
  budget: "",
  goals: "",
}

export const DEFAULT_DEFENSE_PROFILE = {
  life: 0,
  energyShield: 0,
  armour: 0,
  evasion: 0,
  fireRes: 0,
  coldRes: 0,
  lightningRes: 0,
  chaosRes: 0,
  blockChance: 0,
  regenPerSec: 0,
  leechRate: 0,
}
