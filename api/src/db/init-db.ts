import { auth } from "../lib/auth";
import { getMigrations } from "better-auth/db/migration";

async function init() {
  console.log("Checking database schema...");

  const { runMigrations, toBeCreated } = await getMigrations(auth.options);

  if (toBeCreated.length === 0) {
    console.log("Database schema is already up to date.");
    return;
  }

  console.log(
    `Found ${toBeCreated.length} tables to create. Running migrations...`,
  );

  await runMigrations();

  console.log("Database populated successfully.");
}

init().catch((err) => {
  console.error("Initialization failed:", err);
  process.exit(1);
});
