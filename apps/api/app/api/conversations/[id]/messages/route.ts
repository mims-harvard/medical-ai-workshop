import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendMessage } from "@/lib/agent/patient-agent";

// Allow up to 60s for LLM responses (requires Vercel Pro plan)
export const maxDuration = 60;

const sendMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message content cannot be empty")
    .max(4096, "Message content too long (max 4096 characters)"),
});

/**
 * POST /api/conversations/:id/messages
 *
 * Send a message to the patient agent in a conversation.
 * Body: { content: string }
 * Returns the agent's response.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;

    const body = await request.json();
    const parsed = sendMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { content } = parsed.data;

    const response = await sendMessage(conversationId, content);

    return NextResponse.json({
      data: {
        conversationId: response.conversationId,
        role: "assistant",
        content: response.content,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send message";

    // Check for specific errors
    if (message.includes("not found")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    console.error("Error sending message:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
