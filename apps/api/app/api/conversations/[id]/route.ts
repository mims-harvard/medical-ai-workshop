import { NextRequest, NextResponse } from "next/server";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

/**
 * GET /api/conversations/:id
 *
 * Get a conversation with all its messages.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const conversation = await db.query.conversations.findFirst({
      where: eq(schema.conversations.id, id),
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Load patient info
    const patient = await db.query.patients.findFirst({
      where: eq(schema.patients.id, conversation.patientId),
    });

    // Load messages
    const messages = await db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.conversationId, id))
      .orderBy(asc(schema.messages.createdAt));

    return NextResponse.json({
      data: {
        id: conversation.id,
        patientId: conversation.patientId,
        patientName: patient ? `${patient.first} ${patient.last}` : "Unknown",
        taskType: conversation.taskType,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        metadata: conversation.metadata,
        messages: messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: m.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}
