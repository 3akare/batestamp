import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { getUploadUrl } from "./storage";

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
  })
  .post(
    "/api/v1/get-presigned-url",
    async ({ body }) => {
      const { fileName, fileType } = body;
      const url = await getUploadUrl(fileName, fileType);
      console.log(url);
      return { url };
    },
    {
      body: t.Object({
        fileName: t.String(),
        fileType: t.String(),
      }),
    },
  );

app.listen(3000);
console.log(
  `[${process.env.NODE_ENV ?? "development"}] ${app.server?.hostname}:${app.server?.port}`,
);
