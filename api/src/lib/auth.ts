import { betterAuth } from "better-auth";
import { Database } from "bun:sqlite";

const trustedOrigins = (process.env.TRUSTED_ORIGINS ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export const auth = betterAuth({
  database: new Database("sqlite.db"),
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
  },
});
