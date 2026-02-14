import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

const DB_TIMEOUT_MS = 5_000;

export async function GET() {
  const timestamp = new Date().toISOString();

  let database: "connected" | "disconnected" = "disconnected";
  let dbError: string | undefined;
  let dbLatencyMs: number | undefined;

  try {
    const start = performance.now();

    await Promise.race([
      db.execute(sql`SELECT 1`),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error(`Database health check timed out after ${DB_TIMEOUT_MS}ms`)),
          DB_TIMEOUT_MS,
        ),
      ),
    ]);

    dbLatencyMs = Math.round(performance.now() - start);
    database = "connected";
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Unknown error";
  }

  const isHealthy = database === "connected";

  return NextResponse.json(
    {
      status: isHealthy ? "ok" : "degraded",
      service: "virtual-clinic-api",
      timestamp,
      database,
      ...(dbLatencyMs !== undefined && { dbLatencyMs }),
      ...(dbError && { error: dbError }),
    },
    { status: isHealthy ? 200 : 503 },
  );
}
