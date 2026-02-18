import type { StateCreator } from "zustand"
import type { ChatMessage, PageContext } from "@/lib/types"

export interface ChatSlice {
  messages: ChatMessage[]
  isStreaming: boolean
  streamingContent: string
  context: PageContext | null
  addMessage: (message: ChatMessage) => void
  setStreaming: (streaming: boolean) => void
  appendStreamContent: (chunk: string) => void
  clearMessages: () => void
  setContext: (context: PageContext | null) => void
}

export const createChatSlice: StateCreator<ChatSlice, [], [], ChatSlice> = (set) => ({
  messages: [],
  isStreaming: false,
  streamingContent: "",
  context: null,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setStreaming: (streaming) =>
    set({ isStreaming: streaming, streamingContent: streaming ? "" : "" }),
  appendStreamContent: (chunk) =>
    set((state) => ({ streamingContent: state.streamingContent + chunk })),
  clearMessages: () => set({ messages: [], streamingContent: "" }),
  setContext: (context) => set({ context }),
})
