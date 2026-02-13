import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDb() {
  if (_db) return _db;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is required. See .env.example for reference."
    );
  }

  const client = postgres(connectionString, {
    max: 1, // Limit connections per serverless instance
    prepare: false, // Required for connection poolers in transaction mode (e.g. Supabase)
  });
  _db = drizzle(client, { schema });
  return _db;
}

/**
 * Lazy-initialized Drizzle database client.
 * The connection is created on first access, allowing Next.js to build
 * without DATABASE_URL being set at build time.
 */
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});

export type Database = typeof db;
