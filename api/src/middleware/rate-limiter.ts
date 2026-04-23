import { Elysia } from "elysia";
import { logger } from "../lib/logger";

interface Window {
  count: number;
  resetAt: number;
}

const store = new Map<string, Window>();

setInterval(() => {
  const now = Date.now();
  for (const [key, window] of store) {
    if (now > window.resetAt) store.delete(key);
  }
}, 60_000);

function getIp(request: Request, server: any): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    server?.requestIP?.(request)?.address ??
    "unknown"
  );
}

interface RateLimitOptions {
  limit?: number;
  windowMs?: number;
  label?: string;
}

export function createRateLimiter({
  limit = 10,
  windowMs = 60_000,
  label = "endpoint",
}: RateLimitOptions = {}) {
  return new Elysia({ name: `rate-limiter-${label}` }).derive(
    ({ request, server }: any) => ({ _rl_ip: getIp(request, server) })
  ).onBeforeHandle(({ request, server, set, traceId }: any) => {
    const ip = getIp(request, server);
    const now = Date.now();
    const key = `${label}:${ip}`;

    let window = store.get(key);

    if (!window || now > window.resetAt) {
      window = { count: 1, resetAt: now + windowMs };
      store.set(key, window);
      return;
    }

    window.count += 1;

    if (window.count > limit) {
      const retryAfter = Math.ceil((window.resetAt - now) / 1000);

      logger.warn("rate limit exceeded", {
        traceId,
        label,
        ip,
        count: window.count,
        limit,
        retryAfterSeconds: retryAfter,
      });

      set.status = 429;
      set.headers["Retry-After"] = String(retryAfter);
      return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
        status: 429,
        headers: { "Content-Type": "application/json", "Retry-After": String(retryAfter) },
      });
    }
  });
}
