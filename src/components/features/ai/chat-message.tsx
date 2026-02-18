import { Sparkles, User } from "lucide-react"
import { MarkdownRenderer } from "@/components/shared/markdown-renderer"
import { cn } from "@/lib/utils"
import type { ChatMessage as ChatMessageType } from "@/lib/types"

interface ChatMessageProps {
  message: ChatMessageType
  isStreaming?: boolean
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-secondary" : "bg-primary/10",
        )}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5" />
        ) : (
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        )}
      </div>
      <div
        className={cn(
          "flex-1 rounded-lg px-3 py-2 text-sm",
          isUser ? "bg-secondary" : "bg-muted",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}
        {isStreaming && (
          <span className="inline-block h-4 w-1.5 animate-pulse bg-primary/70 ml-0.5" />
        )}
      </div>
    </div>
  )
}
