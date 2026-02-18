import { cn } from "@/lib/utils"

interface CurrencyDisplayProps {
  currency: string
  amount: number | string
  className?: string
}

export function CurrencyDisplay({ currency, amount, className }: CurrencyDisplayProps) {
  const abbrev = currency.slice(0, 2).toUpperCase()

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm", className)}>
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rarity-currency/20 text-[10px] font-bold text-rarity-currency">
        {abbrev}
      </span>
      <span className="font-mono">{amount}</span>
      <span className="text-muted-foreground">{currency}</span>
    </span>
  )
}
