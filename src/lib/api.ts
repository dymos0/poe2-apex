import type { ChatMessage, PageContext, SessionState } from "./types"

export interface ChatRequest {
  messages: Pick<ChatMessage, "role" | "content">[]
  context?: PageContext
  sessionState?: SessionState
}

export async function streamChat(
  request: ChatRequest,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (error: Error) => void,
) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Chat API error: ${response.status} - ${errorText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error("No response body")

    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split("\n")

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6)
          if (data === "[DONE]") {
            onDone()
            return
          }
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === "content_block_delta" && parsed.delta?.text) {
              onChunk(parsed.delta.text)
            } else if (parsed.type === "text") {
              onChunk(parsed.text)
            }
          } catch {
            // Non-JSON data line, treat as raw text
            if (data.trim()) onChunk(data)
          }
        }
      }
    }

    onDone()
  } catch (error) {
    onError(error instanceof Error ? error : new Error(String(error)))
  }
}
