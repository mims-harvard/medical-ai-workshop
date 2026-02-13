import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

/**
 * GET /api/patients
 *
 * List all patients with basic demographics.
 * Supports pagination via ?page=1&limit=20 query params.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
    );
    const offset = (page - 1) * limit;

    const [patientRows, countResult] = await Promise.all([
      db
        .select({
          id: patients.id,
          first: patients.first,
          last: patients.last,
          birthDate: patients.birthDate,
          deathDate: patients.deathDate,
          gender: patients.gender,
          race: patients.race,
          ethnicity: patients.ethnicity,
          city: patients.city,
          state: patients.state,
        })
        .from(patients)
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(patients),
    ]);

    const total = Number(countResult[0]?.count || 0);

    return NextResponse.json({
      data: patientRows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}
