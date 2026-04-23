type LogLevel = "info" | "warn" | "error" | "debug";

function createTraceId(): string {
  return crypto.randomUUID().slice(0, 8);
}

function write(level: LogLevel, message: string, fields: Record<string, unknown> = {}) {
  const { traceId, ...rest } = fields;
  const id = (traceId as string | undefined) ?? createTraceId();
  const ts = new Date().toISOString();
  const tag = level.toUpperCase().padEnd(5);
  const extras = Object.keys(rest).length > 0 ? " " + JSON.stringify(rest) : "";
  const line = `[${tag}] [${ts}] [${id}] ${message}${extras}`;

  if (level === "error" || level === "warn") {
    process.stderr.write(line + "\n");
  } else {
    process.stdout.write(line + "\n");
  }
}

export const logger = {
  info: (message: string, fields?: Record<string, unknown>) => write("info", message, fields),
  warn: (message: string, fields?: Record<string, unknown>) => write("warn", message, fields),
  error: (message: string, fields?: Record<string, unknown>) => write("error", message, fields),
  debug: (message: string, fields?: Record<string, unknown>) => write("debug", message, fields),
};
