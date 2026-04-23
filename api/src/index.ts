import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { auth } from "./lib/auth";
import { logger } from "./lib/logger";
import { requestLogger } from "./middleware/request-logger";
import { createRateLimiter } from "./middleware/rate-limiter";
import { protectedRoutes } from "./routes/protected";

const corsOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const authRateLimiter = createRateLimiter({
  limit: 20,
  windowMs: 15 * 60 * 1000,
  label: "auth",
});

const app = new Elysia()
  .use(
    cors({
      origin: corsOrigins,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(requestLogger)
  .group("/api/auth", (app) =>
    app
      .use(authRateLimiter)
      .all("/*", async (ctx) => auth.handler(ctx.request))
  )
  .use(protectedRoutes)
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  app.listen(3000);
  logger.info("server started", {
    host: app.server?.hostname,
    port: app.server?.port,
    env: process.env.NODE_ENV ?? "development",
    corsOrigins,
  });
}

export default app;
