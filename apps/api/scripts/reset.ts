/**
 * Database reset script for the Virtual Clinic API.
 *
 * Drops all tables and enums in the public schema, then recreates
 * them from the Drizzle schema definition via `drizzle-kit push`.
 *
 * Usage:
 *   pnpm db:reset
 *
 * WARNING: This destroys ALL data in the public schema. Only use
 * for development / workshop environments.
 */

import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { join, resolve } from "path";
import postgres from "postgres";

// ─── Load .env if present ──────────────────────────────────────────────────────

function loadEnv() {
  const envPath = join(__dirname, "..", ".env");
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

loadEnv();

// ─── Main ──────────────────────────────────────────────────────────────────────

const API_DIR = resolve(__dirname, "..");

function log(msg: string) {
  console.log(`[reset] ${msg}`);
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required.");
  }

  log("=== Database Reset ===");
  log("");

  // 1. Drop and recreate the public schema
  log("Dropping public schema (CASCADE)...");
  const client = postgres(connectionString, { max: 1, prepare: false });
  await client.unsafe("DROP SCHEMA IF EXISTS public CASCADE");
  await client.unsafe("CREATE SCHEMA public");
  await client.unsafe("GRANT ALL ON SCHEMA public TO postgres");
  await client.unsafe("GRANT ALL ON SCHEMA public TO public");
  log("Public schema recreated.");
  await client.end();

  // 2. Push Drizzle schema to recreate all tables and enums
  log("Pushing Drizzle schema via drizzle-kit push...");
  execSync("pnpm db:push", {
    stdio: "inherit",
    cwd: API_DIR,
    env: { ...process.env },
  });

  log("");
  log("=== Reset complete! ===");
  log("All tables have been recreated from the Drizzle schema.");
}

main().catch((error) => {
  console.error("Reset failed:", error);
  process.exit(1);
});
