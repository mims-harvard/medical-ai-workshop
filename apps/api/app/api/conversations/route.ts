import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, sql, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

/**
 * GET /api/conversations
 *
 * List all conversations with pagination.
 * Supports filtering by patientId and taskType via query params.
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

    const patientId = searchParams.get("patientId");
    const taskType = searchParams.get("taskType");

    // Build where conditions
    const conditions = [];
    if (patientId) {
      conditions.push(eq(schema.conversations.patientId, patientId));
    }
    if (
      taskType &&
      ["diagnosis", "treatment", "event"].includes(taskType)
    ) {
      conditions.push(
        eq(
          schema.conversations.taskType,
          taskType as "diagnosis" | "treatment" | "event"
        )
      );
    }

    const whereClause =
      conditions.length > 0
        ? sql`${sql.join(
            conditions.map((c) => sql`${c}`),
            sql` AND `
          )}`
        : undefined;

    const [rows, countResult] = await Promise.all([
      db
        .select({
          id: schema.conversations.id,
          patientId: schema.conversations.patientId,
          taskType: schema.conversations.taskType,
          createdAt: schema.conversations.createdAt,
          updatedAt: schema.conversations.updatedAt,
          metadata: schema.conversations.metadata,
          patientFirst: schema.patients.first,
          patientLast: schema.patients.last,
        })
        .from(schema.conversations)
        .leftJoin(
          schema.patients,
          eq(schema.conversations.patientId, schema.patients.id)
        )
        .where(whereClause)
        .orderBy(desc(schema.conversations.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(schema.conversations)
        .where(whereClause),
    ]);

    const total = Number(countResult[0]?.count || 0);

    return NextResponse.json({
      data: rows.map((r) => ({
        id: r.id,
        patientId: r.patientId,
        patientName:
          r.patientFirst && r.patientLast
            ? `${r.patientFirst} ${r.patientLast}`
            : "Unknown",
        taskType: r.taskType,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        metadata: r.metadata,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error listing conversations:", error);
    return NextResponse.json(
      { error: "Failed to list conversations" },
      { status: 500 }
    );
  }
}

const createConversationSchema = z.object({
  patientId: z.string().uuid("patientId must be a valid UUID"),
  taskType: z.enum(["diagnosis", "treatment", "event"]),
  metadata: z.string().optional(),
});

/**
 * POST /api/conversations
 *
 * Create a new conversation with a simulated patient.
 * Body: { patientId: string, taskType: "diagnosis" | "treatment" | "event" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createConversationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { patientId, taskType, metadata } = parsed.data;

    // Verify patient exists
    const patient = await db.query.patients.findFirst({
      where: eq(schema.patients.id, patientId),
    });

    if (!patient) {
      return NextResponse.json(
        { error: `Patient ${patientId} not found` },
        { status: 404 }
      );
    }

    // Create conversation
    const [conversation] = await db
      .insert(schema.conversations)
      .values({
        patientId,
        taskType,
        metadata: metadata || null,
      })
      .returning();

    return NextResponse.json(
      {
        data: {
          id: conversation.id,
          patientId: conversation.patientId,
          taskType: conversation.taskType,
          patientName: `${patient.first} ${patient.last}`,
          createdAt: conversation.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
