/**
 * Token generation script for the Virtual Clinic API.
 *
 * Mints JWT tokens signed with SUPABASE_JWT_SECRET for workshop distribution.
 *
 * Usage:
 *   pnpm create-tokens                              # 10 user tokens + 1 admin token, 7-day expiry
 *   pnpm create-tokens --users 30 --admins 3         # custom counts
 *   pnpm create-tokens --expiry 14d                   # custom expiry (e.g. 1d, 7d, 30d)
 *
 * Requires:
 *   - SUPABASE_JWT_SECRET environment variable (or in .env file)
 */

import { SignJWT } from "jose";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

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
      let value = trimmed.slice(eqIdx + 1).trim();
      // Strip surrounding quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

loadEnv();

// ─── Parse CLI args ────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  let users = 10;
  let admins = 1;
  let expiry = "7d";

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--users":
        users = parseInt(args[++i], 10);
        break;
      case "--admins":
        admins = parseInt(args[++i], 10);
        break;
      case "--expiry":
        expiry = args[++i];
        break;
    }
  }

  return { users, admins, expiry };
}

// ─── Token generation ──────────────────────────────────────────────────────────

async function createToken(
  secret: Uint8Array,
  sub: string,
  role: "user" | "admin",
  expiry: string
): Promise<string> {
  return new SignJWT({
    sub,
    role: "authenticated",
    app_metadata: { role },
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(expiry)
    .sign(secret);
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const jwtSecret = process.env.SUPABASE_JWT_SECRET;
  if (!jwtSecret) {
    console.error(
      "Error: SUPABASE_JWT_SECRET is not set. Add it to your .env file or set it as an environment variable."
    );
    process.exit(1);
  }

  const { users, admins, expiry } = parseArgs();
  const secret = new TextEncoder().encode(jwtSecret);
  const lines: string[] = [];

  lines.push("=== Virtual Clinic Workshop Tokens ===");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Expiry: ${expiry}`);
  lines.push("");

  // Generate admin tokens
  if (admins > 0) {
    lines.push(`--- Admin Tokens (${admins}) ---`);
    lines.push("These tokens can access ALL endpoints including patient data.");
    lines.push("");
    for (let i = 1; i <= admins; i++) {
      const id = `admin-${String(i).padStart(2, "0")}`;
      const token = await createToken(secret, id, "admin", expiry);
      lines.push(`  ${id}:`);
      lines.push(`    ${token}`);
      lines.push("");
    }
  }

  // Generate user tokens
  if (users > 0) {
    lines.push(`--- User Tokens (${users}) ---`);
    lines.push("These tokens can access conversation endpoints only.");
    lines.push("");
    for (let i = 1; i <= users; i++) {
      const id = `participant-${String(i).padStart(2, "0")}`;
      const token = await createToken(secret, id, "user", expiry);
      lines.push(`  ${id}:`);
      lines.push(`    ${token}`);
      lines.push("");
    }
  }

  lines.push("=== Usage ===");
  lines.push(
    '  curl -H "Authorization: Bearer <token>" https://virtual-clinic-api.vercel.app/api/conversations'
  );
  lines.push("");

  const content = lines.join("\n");
  const outPath = join(__dirname, "..", "tokens.txt");
  writeFileSync(outPath, content, "utf-8");
  console.log(`Tokens written to ${outPath}`);
}

main().catch((error) => {
  console.error("Token generation failed:", error);
  process.exit(1);
});
