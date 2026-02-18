import { useState, useMemo } from "react"
import {
  ArrowLeftRight, Sparkles, Plus, Trash2, Search, X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { PageContainer } from "@/components/layout/page-container"
import { usePageContext } from "@/hooks/use-page-context"
import { useAiChat } from "@/hooks/use-ai-chat"
import { useStore } from "@/stores"
import type { TradeSearch } from "@/lib/types"

const PRICING_STRATEGIES = [
  { situation: "Commodity (waystones, common crafts)", strategy: "Undercut tight; volume > margin" },
  { situation: "Premium roll (rare affix combos)", strategy: "Price high, reduce daily; buyer will find it" },
  { situation: "Fast sellers (meta base + meta skill)", strategy: "Price at market rate for quick sale" },
  { situation: "Slow sellers (niche, off-meta)", strategy: "Price above cost; patience required" },
]

export function TradeAdvisor() {
  const { askAi } = useAiChat()
  const searches = useStore((s) => s.searches)
  const addSearch = useStore((s) => s.addSearch)
  const deleteSearch = useStore((s) => s.deleteSearch)
  const activeSearchId = useStore((s) => s.activeSearchId)
  const setActiveSearch = useStore((s) => s.setActiveSearch)

  // New search form
  const [showNewSearch, setShowNewSearch] = useState(false)
  const [newName, setNewName] = useState("")
  const [newMaxPrice, setNewMaxPrice] = useState("")
  const [newNotes, setNewNotes] = useState("")

  // Affix search builder
  const [mustHaveInput, setMustHaveInput] = useState("")
  const [niceToHaveInput, setNiceToHaveInput] = useState("")
  const [mustHaveAffixes, setMustHaveAffixes] = useState<string[]>([])
  const [niceToHaveAffixes, setNiceToHaveAffixes] = useState<string[]>([])

  usePageContext({ page: "trade", label: "Trade Advisor", data: {} })

  const activeSearch = useMemo(
    () => searches.find((s) => s.id === activeSearchId),
    [searches, activeSearchId],
  )

  function handleAddMustHave() {
    const val = mustHaveInput.trim()
    if (val && !mustHaveAffixes.includes(val)) {
      setMustHaveAffixes([...mustHaveAffixes, val])
      setMustHaveInput("")
    }
  }

  function handleAddNiceToHave() {
    const val = niceToHaveInput.trim()
    if (val && !niceToHaveAffixes.includes(val)) {
      setNiceToHaveAffixes([...niceToHaveAffixes, val])
      setNiceToHaveInput("")
    }
  }

  function handleCreateSearch() {
    if (!newName.trim()) return
    const search: TradeSearch = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      mustHaveAffixes: [...mustHaveAffixes],
      niceToHaveAffixes: [...niceToHaveAffixes],
      maxPrice: newMaxPrice.trim(),
      notes: newNotes.trim(),
    }
    addSearch(search)
    setActiveSearch(search.id)
    setNewName("")
    setNewMaxPrice("")
    setNewNotes("")
    setMustHaveAffixes([])
    setNiceToHaveAffixes([])
    setShowNewSearch(false)
  }

  return (
    <PageContainer
      title="Trade Advisor"
      description="Search for items, build affix filters, and get AI pricing advice."
      actions={
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() =>
            askAi(
              activeSearch
                ? `Help me optimize my trade search "${activeSearch.name}". Must-have affixes: ${activeSearch.mustHaveAffixes.join(", ") || "none"}. Nice-to-have: ${activeSearch.niceToHaveAffixes.join(", ") || "none"}. Max price: ${activeSearch.maxPrice || "no limit"}. What should I adjust for best value?`
                : "What items should I prioritize buying or selling right now based on my session state?"
            )
          }
        >
          <Sparkles className="h-3.5 w-3.5" />
          Ask AI
        </Button>
      }
    >
      {/* Saved Searches */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Saved Searches</h2>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowNewSearch(!showNewSearch)}>
            <Plus className="h-3.5 w-3.5" />
            New Search
          </Button>
        </div>

        {showNewSearch && (
          <Card>
            <CardContent className="space-y-4 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Search Name *</label>
                  <Input
                    placeholder="e.g. Life + Res Helmet"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Max Price</label>
                  <Input
                    placeholder="e.g. 50 chaos"
                    value={newMaxPrice}
                    onChange={(e) => setNewMaxPrice(e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>

              {/* Must-have affixes */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Must-Have Affixes</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. +80 to Maximum Life"
                    value={mustHaveInput}
                    onChange={(e) => setMustHaveInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddMustHave()}
                    className="h-8"
                  />
                  <Button size="sm" variant="outline" onClick={handleAddMustHave} disabled={!mustHaveInput.trim()}>
                    Add
                  </Button>
                </div>
                {mustHaveAffixes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {mustHaveAffixes.map((a) => (
                      <Badge key={a} variant="default" className="gap-1 text-xs">
                        {a}
                        <button type="button" onClick={() => setMustHaveAffixes(mustHaveAffixes.filter((x) => x !== a))}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Nice-to-have affixes */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Nice-to-Have Affixes</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. Movement Speed"
                    value={niceToHaveInput}
                    onChange={(e) => setNiceToHaveInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddNiceToHave()}
                    className="h-8"
                  />
                  <Button size="sm" variant="outline" onClick={handleAddNiceToHave} disabled={!niceToHaveInput.trim()}>
                    Add
                  </Button>
                </div>
                {niceToHaveAffixes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {niceToHaveAffixes.map((a) => (
                      <Badge key={a} variant="secondary" className="gap-1 text-xs">
                        {a}
                        <button type="button" onClick={() => setNiceToHaveAffixes(niceToHaveAffixes.filter((x) => x !== a))}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Notes</label>
                <textarea
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Additional search notes..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreateSearch} disabled={!newName.trim()}>
                  <Search className="mr-1 h-3.5 w-3.5" />
                  Create Search
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowNewSearch(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {searches.length === 0 && !showNewSearch ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12">
              <ArrowLeftRight className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No saved searches. Create one to start tracking trade targets.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {searches.map((search) => (
              <Card
                key={search.id}
                className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                  activeSearchId === search.id ? "ring-1 ring-primary" : ""
                }`}
                onClick={() => setActiveSearch(search.id)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{search.name}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {search.mustHaveAffixes.slice(0, 3).map((a) => (
                        <Badge key={a} variant="default" className="text-[10px]">{a}</Badge>
                      ))}
                      {search.niceToHaveAffixes.slice(0, 2).map((a) => (
                        <Badge key={a} variant="secondary" className="text-[10px]">{a}</Badge>
                      ))}
                      {search.maxPrice && (
                        <Badge variant="outline" className="text-[10px]">Max: {search.maxPrice}</Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSearch(search.id)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* Pricing Strategy Quick Reference */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Pricing Strategy Reference</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {PRICING_STRATEGIES.map((ps) => (
            <Card key={ps.situation}>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-primary">{ps.situation}</p>
                <p className="mt-1 text-sm text-muted-foreground">{ps.strategy}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PageContainer>
  )
}
