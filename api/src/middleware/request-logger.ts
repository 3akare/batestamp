import { Elysia } from "elysia";
import { logger } from "../lib/logger";

export const requestLogger = new Elysia({ name: "request-logger" })
  .derive(() => ({
    traceId: crypto.randomUUID().slice(0, 8),
    requestStart: Date.now(),
  }))
  .onBeforeHandle(({ traceId, request }: any) => {
    logger.info("request received", {
      traceId,
      method: request.method,
      path: new URL(request.url).pathname,
    });
  })
  .onAfterHandle(({ traceId, requestStart, request, response }: any) => {
    const status = (response as Response)?.status ?? 200;

    logger.info("request completed", {
      traceId,
      method: request.method,
      path: new URL(request.url).pathname,
      status,
      durationMs: Date.now() - requestStart,
    });
  })
  .onError(({ traceId, requestStart, request, error, code }: any) => {
    logger.error("request error", {
      traceId,
      method: request.method,
      path: new URL(request.url).pathname,
      errorCode: code,
      errorMessage: error.message,
      durationMs: Date.now() - (requestStart ?? Date.now()),
    });
  });
