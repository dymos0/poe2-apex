import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "./chat-message"
import type { ChatMessage as ChatMessageType } from "@/lib/types"

interface ChatHistoryProps {
  messages: ChatMessageType[]
  streamingContent?: string
  isStreaming: boolean
}

export function ChatHistory({ messages, streamingContent, isStreaming }: ChatHistoryProps) {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="flex flex-col gap-4">
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
  )
}
