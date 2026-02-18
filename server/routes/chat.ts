import { Hono } from "hono"
import { streamSSE } from "hono/streaming"
import Anthropic from "@anthropic-ai/sdk"
import { SYSTEM_PROMPT } from "../system-prompt"

const chat = new Hono()

interface ChatRequest {
  messages: { role: "user" | "assistant"; content: string }[]
  context?: { page: string; label: string; data: Record<string, unknown> }
  sessionState?: Record<string, unknown>
}

chat.post("/", async (c) => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return c.json({ error: "ANTHROPIC_API_KEY not configured" }, 500)
  }

  const body = await c.req.json<ChatRequest>()
  const { messages, context, sessionState } = body

  if (!messages || messages.length === 0) {
    return c.json({ error: "Messages are required" }, 400)
  }

  // Compose system prompt with context
  let systemPrompt = SYSTEM_PROMPT

  if (sessionState && Object.keys(sessionState).length > 0) {
    systemPrompt += `\n\n---\n\n## CURRENT USER STATE\n\n\`\`\`\n${JSON.stringify(sessionState, null, 2)}\n\`\`\``
  }

  if (context) {
    systemPrompt += `\n\n---\n\n## CURRENT PAGE CONTEXT\n\nThe user is currently viewing: **${context.label}** (${context.page})\n`
    if (context.data && Object.keys(context.data).length > 0) {
      systemPrompt += `\nPage data:\n\`\`\`\n${JSON.stringify(context.data, null, 2)}\n\`\`\``
    }
  }

  const client = new Anthropic({ apiKey })

  return streamSSE(c, async (stream) => {
    try {
      const response = client.messages.stream({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemPrompt,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      })

      for await (const event of response) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          await stream.writeSSE({
            data: JSON.stringify({ type: "text", text: event.delta.text }),
          })
        }
      }

      await stream.writeSSE({ data: "[DONE]" })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      await stream.writeSSE({
        data: JSON.stringify({ type: "error", error: message }),
      })
      await stream.writeSSE({ data: "[DONE]" })
    }
  })
})

export { chat }
