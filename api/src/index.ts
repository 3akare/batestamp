import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

const corsOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const app = new Elysia()
  .use(
    cors({
      origin: corsOrigins,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .get("/status", ({ status }) => {
    return status(200, { statusCode: 200 });
  });

app.listen(3000);
console.log(
  `[${process.env.NODE_ENV ?? "development"}] ${app.server?.hostname}:${app.server?.port}`,
);
