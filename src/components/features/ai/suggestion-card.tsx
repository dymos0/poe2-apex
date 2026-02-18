import { Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface SuggestionCardProps {
  prompt: string
  label: string
  onSelect: (prompt: string) => void
}

export function SuggestionCard({ prompt, label, onSelect }: SuggestionCardProps) {
  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-accent"
      onClick={() => onSelect(prompt)}
    >
      <CardContent className="flex items-center gap-2 p-3">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="text-xs">{label}</span>
      </CardContent>
    </Card>
  )
}
