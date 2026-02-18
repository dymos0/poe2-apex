import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { serveStatic } from "hono/bun"
import { chat } from "./routes/chat"

const app = new Hono()

app.use("*", logger())
app.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST"],
    allowHeaders: ["Content-Type"],
  }),
)

app.route("/api/chat", chat)

app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: Date.now() })
})

// In production, serve the Vite build from dist/
app.use("/*", serveStatic({ root: "./dist" }))

// SPA fallback — serve index.html for any non-API, non-asset route
app.get("*", serveStatic({ root: "./dist", path: "/index.html" }))

const port = parseInt(process.env.PORT || "3001", 10)

console.log(`POE2 Apex running on http://localhost:${port}`)

export default {
  port,
  fetch: app.fetch,
}
