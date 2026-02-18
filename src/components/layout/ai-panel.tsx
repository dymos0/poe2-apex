import { useRef, useEffect } from "react"
import { X, Sparkles, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/stores"
import { useAiChat } from "@/hooks/use-ai-chat"
import { ChatMessage } from "@/components/features/ai/chat-message"
import { ChatInput } from "@/components/features/ai/chat-input"

export function AiPanel() {
  const setAiPanelOpen = useStore((s) => s.setAiPanelOpen)
  const { messages, isStreaming, streamingContent, context, sendMessage, clearMessages } = useAiChat()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, streamingContent])

  return (
    <div className="flex h-full flex-col border-l bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">AI Coach</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={clearMessages}
            title="Clear chat"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setAiPanelOpen(false)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Context */}
      {context && (
        <div className="border-b px-4 py-2">
          <Badge variant="secondary" className="text-xs">
            Context: {context.label}
          </Badge>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="flex flex-col gap-4">
          {messages.length === 0 && !isStreaming && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Sparkles className="h-8 w-8 text-primary/50" />
              <div>
                <p className="text-sm font-medium">POE2 Apex AI Coach</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ask about builds, crafting, atlas strategy, trade advice, or team composition.
                </p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isStreaming && streamingContent && (
            <ChatMessage
              message={{
                id: "streaming",
                role: "assistant",
                content: streamingContent,
                timestamp: Date.now(),
              }}
              isStreaming
            />
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput onSend={sendMessage} isStreaming={isStreaming} />
    </div>
  )
}
