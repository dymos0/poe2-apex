import { useCallback } from "react"
import { useStore } from "@/stores"
import { streamChat } from "@/lib/api"

export function useAiChat() {
  const messages = useStore((s) => s.messages)
  const isStreaming = useStore((s) => s.isStreaming)
  const streamingContent = useStore((s) => s.streamingContent)
  const context = useStore((s) => s.context)
  const session = useStore((s) => s.session)
  const addMessage = useStore((s) => s.addMessage)
  const setStreaming = useStore((s) => s.setStreaming)
  const appendStreamContent = useStore((s) => s.appendStreamContent)
  const clearMessages = useStore((s) => s.clearMessages)
  const setAiPanelOpen = useStore((s) => s.setAiPanelOpen)

  const sendMessage = useCallback(
    async (content: string) => {
      if (isStreaming || !content.trim()) return

      const userMessage = {
        id: crypto.randomUUID(),
        role: "user" as const,
        content: content.trim(),
        timestamp: Date.now(),
      }
      addMessage(userMessage)
      setStreaming(true)

      const chatMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      await streamChat(
        {
          messages: chatMessages,
          context: context ?? undefined,
          sessionState: session,
        },
        (text) => appendStreamContent(text),
        () => {
          const finalContent = useStore.getState().streamingContent
          addMessage({
            id: crypto.randomUUID(),
            role: "assistant",
            content: finalContent,
            timestamp: Date.now(),
          })
          setStreaming(false)
        },
        (error) => {
          console.error("Chat error:", error)
          addMessage({
            id: crypto.randomUUID(),
            role: "assistant",
            content: `Error: ${error.message}`,
            timestamp: Date.now(),
          })
          setStreaming(false)
        },
      )
    },
    [messages, isStreaming, context, session, addMessage, setStreaming, appendStreamContent],
  )

  const askAi = useCallback(
    (prompt: string) => {
      setAiPanelOpen(true)
      sendMessage(prompt)
    },
    [sendMessage, setAiPanelOpen],
  )

  return {
    messages,
    isStreaming,
    streamingContent,
    context,
    sendMessage,
    clearMessages,
    askAi,
  }
}
