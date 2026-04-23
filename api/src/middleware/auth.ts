import { Elysia } from "elysia";
import { auth } from "../lib/auth";
import { logger } from "../lib/logger";

export const authMiddleware = new Elysia({ name: "auth-middleware" }).macro({
  auth: {
    async resolve({ error, request, traceId }: any) {
      const session = await auth.api.getSession({ headers: request.headers });

      if (!session) {
        logger.warn("unauthenticated request rejected", { traceId });
        return error(401, "Unauthorized");
      }

      logger.info("session validated", {
        traceId,
        userId: session.user.id,
        sessionId: session.session.id,
      });

      return {
        user: session.user,
        session: session.session,
      };
    },
  },
});
