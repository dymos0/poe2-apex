import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface CostItem {
  name: string
  cost: string
  quantity: number
}

interface CostCalculatorProps {
  items: CostItem[]
  total?: string
}

export function CostCalculator({ items, total }: CostCalculatorProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {item.name} x{item.quantity}
            </span>
            <span className="font-mono">{item.cost}</span>
          </div>
        ))}
        {total && (
          <>
            <Separator />
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Total</span>
              <span className="font-mono text-primary">{total}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
