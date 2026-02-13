/**
 * Seed script for the Virtual Clinic API.
 *
 * 1. Runs Synthea to generate synthetic patient data as CSV.
 * 2. Parses the CSV files.
 * 3. Pushes the Drizzle schema to the database (creates/updates tables).
 * 4. Inserts parsed data into the Supabase PostgreSQL database.
 *
 * Usage:
 *   pnpm seed           (uses defaults: 20 patients, seed 42, Massachusetts)
 *
 * Requires:
 *   - Java 11+ on PATH
 *   - DATABASE_URL environment variable set (or .env file)
 *   - synthea.jar at apps/synthea.jar (relative to monorepo root)
 */

import { execSync } from "child_process";
import { readFileSync, existsSync, rmSync } from "fs";
import { join, resolve } from "path";
import { parse } from "csv-parse/sync";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import * as schema from "../lib/db/schema";

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

// ─── Configuration ─────────────────────────────────────────────────────────────

const POPULATION = parseInt(process.env.SYNTHEA_POPULATION || "20", 10);
const SEED = parseInt(process.env.SYNTHEA_SEED || "42", 10);
const STATE = process.env.SYNTHEA_STATE || "Massachusetts";

const API_DIR = resolve(__dirname, "..");
const MONOREPO_ROOT = resolve(API_DIR, "../..");
const SYNTHEA_JAR = join(API_DIR, "scripts", "synthea.jar");
const OUTPUT_DIR = join(API_DIR, "synthea-output");
const CSV_DIR = join(OUTPUT_DIR, "csv");

// ─── Helpers ───────────────────────────────────────────────────────────────────

function log(msg: string) {
  console.log(`[seed] ${msg}`);
}

function parseCsv<T extends Record<string, string>>(filePath: string): T[] {
  if (!existsSync(filePath)) {
    log(`  Skipping ${filePath} (not found)`);
    return [];
  }
  const content = readFileSync(filePath, "utf-8");
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as T[];
}

function parseTimestamp(val: string | undefined): Date | null {
  if (!val || val === "") return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

function parseDate(val: string | undefined): string | null {
  if (!val || val === "") return null;
  return val;
}

function parseNumeric(val: string | undefined): string | null {
  if (!val || val === "") return null;
  return val;
}

// ─── Step 1: Run Synthea ───────────────────────────────────────────────────────

function runSynthea() {
  log(`Running Synthea: ${POPULATION} patients, seed ${SEED}, ${STATE}`);

  if (!existsSync(SYNTHEA_JAR)) {
    throw new Error(
      `Synthea JAR not found at ${SYNTHEA_JAR}. ` +
        `Ensure synthea.jar is at apps/api/scripts/synthea.jar.`
    );
  }

  // Check Java is available
  try {
    execSync("java -version", { stdio: "pipe" });
  } catch {
    throw new Error(
      "Java is required to run Synthea. Install Java 11+ and ensure it is on your PATH."
    );
  }

  const cmd = [
    "java",
    "-jar",
    `"${SYNTHEA_JAR}"`,
    `-p ${POPULATION}`,
    `-s ${SEED}`,
    `--exporter.csv.export=true`,
    `--exporter.fhir.export=false`,
    `--exporter.hospital.fhir.export=false`,
    `--exporter.baseDirectory="${OUTPUT_DIR}"`,
    `--exporter.years_of_history=0`,
    STATE,
  ].join(" ");

  log(`Executing: ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: API_DIR });
  log("Synthea generation complete.");
}

// ─── Step 2: Parse CSVs ───────────────────────────────────────────────────────

interface ParsedData {
  patients: (typeof schema.patients.$inferInsert)[];
  encounters: (typeof schema.encounters.$inferInsert)[];
  conditions: (typeof schema.conditions.$inferInsert)[];
  medications: (typeof schema.medications.$inferInsert)[];
  observations: (typeof schema.observations.$inferInsert)[];
  allergies: (typeof schema.allergies.$inferInsert)[];
  procedures: (typeof schema.procedures.$inferInsert)[];
  immunizations: (typeof schema.immunizations.$inferInsert)[];
  careplans: (typeof schema.careplans.$inferInsert)[];
}

function parseSyntheaCsvs(): ParsedData {
  log("Parsing Synthea CSV output...");

  const patientsRaw = parseCsv(join(CSV_DIR, "patients.csv"));
  const encountersRaw = parseCsv(join(CSV_DIR, "encounters.csv"));
  const conditionsRaw = parseCsv(join(CSV_DIR, "conditions.csv"));
  const medicationsRaw = parseCsv(join(CSV_DIR, "medications.csv"));
  const observationsRaw = parseCsv(join(CSV_DIR, "observations.csv"));
  const allergiesRaw = parseCsv(join(CSV_DIR, "allergies.csv"));
  const proceduresRaw = parseCsv(join(CSV_DIR, "procedures.csv"));
  const immunizationsRaw = parseCsv(join(CSV_DIR, "immunizations.csv"));
  const careplansRaw = parseCsv(join(CSV_DIR, "careplans.csv"));

  log(
    `  Parsed: ${patientsRaw.length} patients, ${encountersRaw.length} encounters, ` +
      `${conditionsRaw.length} conditions, ${medicationsRaw.length} medications, ` +
      `${observationsRaw.length} observations, ${allergiesRaw.length} allergies, ` +
      `${proceduresRaw.length} procedures, ${immunizationsRaw.length} immunizations, ` +
      `${careplansRaw.length} careplans`
  );

  return {
    patients: patientsRaw.map((r) => ({
      id: r.Id,
      birthDate: r.BIRTHDATE,
      deathDate: parseDate(r.DEATHDATE),
      ssn: r.SSN,
      drivers: r.DRIVERS || null,
      passport: r.PASSPORT || null,
      prefix: r.PREFIX || null,
      first: r.FIRST,
      last: r.LAST,
      suffix: r.SUFFIX || null,
      maiden: r.MAIDEN || null,
      marital: r.MARITAL || null,
      race: r.RACE || null,
      ethnicity: r.ETHNICITY || null,
      gender: r.GENDER,
      birthplace: r.BIRTHPLACE || null,
      address: r.ADDRESS || null,
      city: r.CITY || null,
      state: r.STATE || null,
      county: r.COUNTY || null,
      fips: r.FIPS || null,
      zip: r.ZIP || null,
      lat: parseNumeric(r.LAT),
      lon: parseNumeric(r.LON),
      healthcareExpenses: parseNumeric(r.HEALTHCARE_EXPENSES),
      healthcareCoverage: parseNumeric(r.HEALTHCARE_COVERAGE),
      income: parseNumeric(r.INCOME),
    })),

    encounters: encountersRaw.map((r) => ({
      id: r.Id,
      start: parseTimestamp(r.START)!,
      stop: parseTimestamp(r.STOP),
      patientId: r.PATIENT,
      organizationId: r.ORGANIZATION || null,
      providerId: r.PROVIDER || null,
      payerId: r.PAYER || null,
      encounterClass: r.ENCOUNTERCLASS || null,
      code: r.CODE || null,
      description: r.DESCRIPTION || null,
      baseCost: parseNumeric(r.BASE_ENCOUNTER_COST),
      totalClaimCost: parseNumeric(r.TOTAL_CLAIM_COST),
      payerCoverage: parseNumeric(r.PAYER_COVERAGE),
      reasonCode: r.REASONCODE || null,
      reasonDescription: r.REASONDESCRIPTION || null,
    })),

    conditions: conditionsRaw.map((r) => ({
      start: r.START,
      stop: parseDate(r.STOP),
      patientId: r.PATIENT,
      encounterId: r.ENCOUNTER || null,
      system: r.SYSTEM || null,
      code: r.CODE,
      description: r.DESCRIPTION,
    })),

    medications: medicationsRaw.map((r) => ({
      start: parseTimestamp(r.START)!,
      stop: parseTimestamp(r.STOP),
      patientId: r.PATIENT,
      payerId: r.PAYER || null,
      encounterId: r.ENCOUNTER || null,
      code: r.CODE,
      description: r.DESCRIPTION,
      baseCost: parseNumeric(r.BASE_COST),
      payerCoverage: parseNumeric(r.PAYER_COVERAGE),
      dispenses: parseNumeric(r.DISPENSES),
      totalCost: parseNumeric(r.TOTALCOST),
      reasonCode: r.REASONCODE || null,
      reasonDescription: r.REASONDESCRIPTION || null,
    })),

    observations: observationsRaw.map((r) => ({
      date: parseTimestamp(r.DATE)!,
      patientId: r.PATIENT,
      encounterId: r.ENCOUNTER || null,
      category: r.CATEGORY || null,
      code: r.CODE,
      description: r.DESCRIPTION,
      value: r.VALUE || null,
      units: r.UNITS || null,
      type: r.TYPE || null,
    })),

    allergies: allergiesRaw.map((r) => ({
      start: r.START,
      stop: parseDate(r.STOP),
      patientId: r.PATIENT,
      encounterId: r.ENCOUNTER || null,
      code: r.CODE,
      system: r.SYSTEM || null,
      description: r.DESCRIPTION,
      type: r.TYPE || null,
      category: r.CATEGORY || null,
      reaction1: r.REACTION1 || null,
      description1: r.DESCRIPTION1 || null,
      severity1: r.SEVERITY1 || null,
      reaction2: r.REACTION2 || null,
      description2: r.DESCRIPTION2 || null,
      severity2: r.SEVERITY2 || null,
    })),

    procedures: proceduresRaw.map((r) => ({
      start: parseTimestamp(r.START)!,
      stop: parseTimestamp(r.STOP),
      patientId: r.PATIENT,
      encounterId: r.ENCOUNTER || null,
      code: r.CODE,
      description: r.DESCRIPTION,
      baseCost: parseNumeric(r.BASE_COST),
      reasonCode: r.REASONCODE || null,
      reasonDescription: r.REASONDESCRIPTION || null,
    })),

    immunizations: immunizationsRaw.map((r) => ({
      date: parseTimestamp(r.DATE)!,
      patientId: r.PATIENT,
      encounterId: r.ENCOUNTER || null,
      code: r.CODE,
      description: r.DESCRIPTION,
      baseCost: parseNumeric(r.BASE_COST),
    })),

    careplans: careplansRaw.map((r) => ({
      id: r.Id,
      start: r.START,
      stop: parseDate(r.STOP),
      patientId: r.PATIENT,
      encounterId: r.ENCOUNTER || null,
      code: r.CODE,
      description: r.DESCRIPTION,
      reasonCode: r.REASONCODE || null,
      reasonDescription: r.REASONDESCRIPTION || null,
    })),
  };
}

// ─── Step 3: Push schema & insert data ─────────────────────────────────────────

async function insertData(data: ParsedData) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required.");
  }

  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  log("Pushing schema to database via drizzle-kit...");
  try {
    execSync("pnpm db:push", {
      stdio: "inherit",
      cwd: API_DIR,
      env: { ...process.env },
    });
  } catch (e) {
    log("Warning: db:push failed, attempting to continue with existing schema...");
  }

  log("Clearing existing EHR data...");
  await db.delete(schema.messages);
  await db.delete(schema.conversations);
  await db.delete(schema.careplans);
  await db.delete(schema.immunizations);
  await db.delete(schema.procedures);
  await db.delete(schema.allergies);
  await db.delete(schema.observations);
  await db.delete(schema.medications);
  await db.delete(schema.conditions);
  await db.delete(schema.encounters);
  await db.delete(schema.patients);

  // Insert in batches to avoid oversized queries
  const BATCH_SIZE = 100;

  async function batchInsert<T extends Record<string, unknown>>(
    table: Parameters<typeof db.insert>[0],
    rows: T[],
    name: string
  ) {
    if (rows.length === 0) {
      log(`  Skipping ${name} (no data)`);
      return;
    }
    log(`  Inserting ${rows.length} ${name}...`);
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.insert(table).values(batch as any);
    }
  }

  await batchInsert(schema.patients, data.patients, "patients");
  await batchInsert(schema.encounters, data.encounters, "encounters");
  await batchInsert(schema.conditions, data.conditions, "conditions");
  await batchInsert(schema.medications, data.medications, "medications");
  await batchInsert(schema.observations, data.observations, "observations");
  await batchInsert(schema.allergies, data.allergies, "allergies");
  await batchInsert(schema.procedures, data.procedures, "procedures");
  await batchInsert(schema.immunizations, data.immunizations, "immunizations");
  await batchInsert(schema.careplans, data.careplans, "careplans");

  log("Data insertion complete.");
  await client.end();
}

// ─── Step 4: Cleanup ───────────────────────────────────────────────────────────

function cleanup() {
  if (existsSync(OUTPUT_DIR)) {
    log("Cleaning up Synthea output directory...");
    rmSync(OUTPUT_DIR, { recursive: true, force: true });
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  log("=== Virtual Clinic Seed Script ===");
  log("");

  try {
    runSynthea();
    const data = parseSyntheaCsvs();
    await insertData(data);
    cleanup();
    log("");
    log("=== Seed complete! ===");
    log(
      `Loaded ${data.patients.length} patients with their full EHR into the database.`
    );
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

main();
