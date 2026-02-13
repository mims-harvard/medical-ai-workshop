/**
 * Patient Agent using Vercel AI SDK with OpenAI.
 *
 * Creates a patient simulation agent that responds based on
 * Synthea-generated EHR data. Supports multi-turn conversations
 * with conversation history persistence.
 */

import { generateText } from "ai";
import { createAzure } from "@ai-sdk/azure";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { buildSystemPrompt, getPatientEHR, type TaskType } from "./prompts";

const azure = createAzure({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments`,
});

export interface AgentResponse {
  content: string;
  conversationId: string;
}

/**
 * Send a message to the patient agent and get a response.
 * Loads the full conversation history, appends the new user message,
 * calls the LLM, and persists both messages.
 */
export async function sendMessage(
  conversationId: string,
  userMessage: string
): Promise<AgentResponse> {
  // 1. Load conversation with patient info
  const conversation = await db.query.conversations.findFirst({
    where: eq(schema.conversations.id, conversationId),
  });

  if (!conversation) {
    throw new Error(`Conversation ${conversationId} not found`);
  }

  // 2. Load patient EHR
  const ehr = await getPatientEHR(conversation.patientId);
  if (!ehr) {
    throw new Error(`Patient ${conversation.patientId} not found`);
  }

  // 3. Build system prompt
  const systemPrompt = buildSystemPrompt(ehr, conversation.taskType as TaskType);

  // 4. Load existing messages
  const existingMessages = await db
    .select()
    .from(schema.messages)
    .where(eq(schema.messages.conversationId, conversationId))
    .orderBy(asc(schema.messages.createdAt));

  // 5. Persist user message
  await db.insert(schema.messages).values({
    conversationId,
    role: "user",
    content: userMessage,
  });

  // 6. Build messages array for the LLM
  const llmMessages: { role: "user" | "assistant"; content: string }[] =
    existingMessages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

  // Add the new user message
  llmMessages.push({ role: "user", content: userMessage });

  // 7. Call the LLM
  const result = await generateText({
    model: azure(process.env.AZURE_OPENAI_DEPLOYMENT!),
    system: systemPrompt,
    messages: llmMessages,
    temperature: 0.7,
    maxTokens: 1024,
  });

  const assistantContent = result.text;

  // 8. Persist assistant message
  await db.insert(schema.messages).values({
    conversationId,
    role: "assistant",
    content: assistantContent,
  });

  // 9. Update conversation timestamp
  await db
    .update(schema.conversations)
    .set({ updatedAt: new Date() })
    .where(eq(schema.conversations.id, conversationId));

  return {
    content: assistantContent,
    conversationId,
  };
}
