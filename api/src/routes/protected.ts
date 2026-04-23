import { Elysia } from "elysia";
import { authMiddleware } from "../middleware/auth";

export const protectedRoutes = new Elysia({ prefix: "/api" })
  .use(authMiddleware)
  .get("/", () => {
    return { message: "Hello from protected route!" };
  }, {
    auth: true,
  });
