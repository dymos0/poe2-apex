import { useState, useRef, useCallback } from "react"
import type { KeyboardEvent } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatInputProps {
  onSend: (message: string) => void
  isStreaming: boolean
}

export function ChatInput({ onSend, isStreaming }: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    if (!input.trim() || isStreaming) return
    onSend(input)
    setInput("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }, [input, isStreaming, onSend])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  const handleInput = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
    }
  }, [])

  return (
    <div className="border-t p-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            handleInput()
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask the AI coach..."
          rows={1}
          className="flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          disabled={isStreaming}
        />
        <Button
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={handleSend}
          disabled={!input.trim() || isStreaming}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="mt-1.5 text-[10px] text-muted-foreground">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  )
}
