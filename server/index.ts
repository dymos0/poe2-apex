import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { chat } from "./routes/chat"

const app = new Hono()

app.use("*", logger())
app.use(
  "*",
  cors({
    origin: ["http://localhost:5173"],
    allowMethods: ["GET", "POST"],
    allowHeaders: ["Content-Type"],
  }),
)

app.route("/api/chat", chat)

app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: Date.now() })
})

const port = parseInt(process.env.PORT || "3001", 10)

console.log(`POE2 Apex API server running on http://localhost:${port}`)

export default {
  port,
  fetch: app.fetch,
}
