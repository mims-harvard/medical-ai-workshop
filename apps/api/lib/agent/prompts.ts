/**
 * System prompt templates for the simulated patient agent.
 *
 * The agent role-plays as a patient using their Synthea-generated EHR data.
 * It does NOT reveal diagnoses directly — instead it describes symptoms,
 * history, and experiences as a real patient would during a clinical interview.
 */

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export type TaskType = "diagnosis" | "treatment" | "event";

interface PatientEHR {
  patient: typeof schema.patients.$inferSelect;
  conditions: (typeof schema.conditions.$inferSelect)[];
  medications: (typeof schema.medications.$inferSelect)[];
  encounters: (typeof schema.encounters.$inferSelect)[];
  observations: (typeof schema.observations.$inferSelect)[];
  allergies: (typeof schema.allergies.$inferSelect)[];
  procedures: (typeof schema.procedures.$inferSelect)[];
  immunizations: (typeof schema.immunizations.$inferSelect)[];
  careplans: (typeof schema.careplans.$inferSelect)[];
}

export async function getPatientEHR(
  patientId: string
): Promise<PatientEHR | null> {
  const patient = await db.query.patients.findFirst({
    where: eq(schema.patients.id, patientId),
  });

  if (!patient) return null;

  const [
    conditions,
    medications,
    encounters,
    observations,
    allergies,
    procedures,
    immunizations,
    careplans,
  ] = await Promise.all([
    db
      .select()
      .from(schema.conditions)
      .where(eq(schema.conditions.patientId, patientId)),
    db
      .select()
      .from(schema.medications)
      .where(eq(schema.medications.patientId, patientId)),
    db
      .select()
      .from(schema.encounters)
      .where(eq(schema.encounters.patientId, patientId)),
    db
      .select()
      .from(schema.observations)
      .where(eq(schema.observations.patientId, patientId)),
    db
      .select()
      .from(schema.allergies)
      .where(eq(schema.allergies.patientId, patientId)),
    db
      .select()
      .from(schema.procedures)
      .where(eq(schema.procedures.patientId, patientId)),
    db
      .select()
      .from(schema.immunizations)
      .where(eq(schema.immunizations.patientId, patientId)),
    db
      .select()
      .from(schema.careplans)
      .where(eq(schema.careplans.patientId, patientId)),
  ]);

  return {
    patient,
    conditions,
    medications,
    encounters,
    observations,
    allergies,
    procedures,
    immunizations,
    careplans,
  };
}

function formatAge(birthDate: string, deathDate: string | null): string {
  const birth = new Date(birthDate);
  const ref = deathDate ? new Date(deathDate) : new Date();
  const age = Math.floor(
    (ref.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );
  return `${age} years old`;
}

function buildEHRContext(ehr: PatientEHR): string {
  const { patient } = ehr;
  const sections: string[] = [];

  // Demographics
  sections.push(`## Patient Demographics
- Name: ${patient.first} ${patient.last}
- Age: ${formatAge(patient.birthDate, patient.deathDate)}
- Date of Birth: ${patient.birthDate}
- Gender: ${patient.gender}
- Race: ${patient.race || "Unknown"}
- Ethnicity: ${patient.ethnicity || "Unknown"}
- Marital Status: ${patient.marital || "Unknown"}
- Location: ${[patient.city, patient.state].filter(Boolean).join(", ") || "Unknown"}`);

  // Active and past conditions
  if (ehr.conditions.length > 0) {
    const active = ehr.conditions.filter((c) => !c.stop);
    const resolved = ehr.conditions.filter((c) => c.stop);

    if (active.length > 0) {
      sections.push(
        `## Active Conditions\n${active.map((c) => `- ${c.description} (since ${c.start})`).join("\n")}`
      );
    }
    if (resolved.length > 0) {
      sections.push(
        `## Past/Resolved Conditions\n${resolved.map((c) => `- ${c.description} (${c.start} to ${c.stop})`).join("\n")}`
      );
    }
  }

  // Medications
  if (ehr.medications.length > 0) {
    const active = ehr.medications.filter((m) => !m.stop);
    const past = ehr.medications.filter((m) => m.stop);

    if (active.length > 0) {
      sections.push(
        `## Current Medications\n${active.map((m) => `- ${m.description}${m.reasonDescription ? ` (for ${m.reasonDescription})` : ""}`).join("\n")}`
      );
    }
    if (past.length > 0) {
      // Only show last 10 past medications
      const recentPast = past.slice(-10);
      sections.push(
        `## Past Medications (recent)\n${recentPast.map((m) => `- ${m.description}${m.reasonDescription ? ` (for ${m.reasonDescription})` : ""}`).join("\n")}`
      );
    }
  }

  // Allergies
  if (ehr.allergies.length > 0) {
    sections.push(
      `## Allergies\n${ehr.allergies.map((a) => `- ${a.description} (${a.category || "unknown category"})${a.description1 ? `, reaction: ${a.description1}` : ""}`).join("\n")}`
    );
  }

  // Recent observations (vital signs, labs) - last 20
  if (ehr.observations.length > 0) {
    const recent = ehr.observations.slice(-20);
    sections.push(
      `## Recent Observations/Labs\n${recent.map((o) => `- ${o.description}: ${o.value} ${o.units || ""} (${new Date(o.date).toISOString().split("T")[0]})`).join("\n")}`
    );
  }

  // Procedures
  if (ehr.procedures.length > 0) {
    const recent = ehr.procedures.slice(-10);
    sections.push(
      `## Recent Procedures\n${recent.map((p) => `- ${p.description} (${new Date(p.start).toISOString().split("T")[0]})${p.reasonDescription ? ` for ${p.reasonDescription}` : ""}`).join("\n")}`
    );
  }

  // Care plans
  if (ehr.careplans.length > 0) {
    const active = ehr.careplans.filter((c) => !c.stop);
    if (active.length > 0) {
      sections.push(
        `## Active Care Plans\n${active.map((c) => `- ${c.description}${c.reasonDescription ? ` (for ${c.reasonDescription})` : ""}`).join("\n")}`
      );
    }
  }

  // Immunizations (summary)
  if (ehr.immunizations.length > 0) {
    const uniqueImmunizations = [
      ...new Set(ehr.immunizations.map((i) => i.description)),
    ];
    sections.push(
      `## Immunization History\n${uniqueImmunizations.map((i) => `- ${i}`).join("\n")}`
    );
  }

  // Encounter summary
  if (ehr.encounters.length > 0) {
    const classCounts: Record<string, number> = {};
    for (const enc of ehr.encounters) {
      const cls = enc.encounterClass || "unknown";
      classCounts[cls] = (classCounts[cls] || 0) + 1;
    }
    sections.push(
      `## Encounter Summary\n${Object.entries(classCounts)
        .map(([cls, count]) => `- ${cls}: ${count} visits`)
        .join("\n")}`
    );
  }

  return sections.join("\n\n");
}

const TASK_INSTRUCTIONS: Record<TaskType, string> = {
  diagnosis: `The interviewer is trying to determine your diagnosis. You should describe your symptoms, how you feel, your history, and answer their questions — but NEVER explicitly state your diagnosis or medical condition names. Use layperson language to describe how things feel. If directly asked "what is your diagnosis?", deflect by saying something like "That's what I'm hoping you can help me figure out" or "The doctors haven't explained it to me in those terms."`,

  treatment: `The interviewer is trying to predict your treatment plan. You may discuss your symptoms, how treatments have affected you, and what medications you take (using common names if you know them). Do NOT volunteer your full treatment plan proactively — let the interviewer ask questions and piece it together. You can confirm or deny specific treatments if asked directly.`,

  event: `The interviewer is trying to predict whether a specific clinical event (like hospitalization, complication, or worsening) will happen. Share how you're feeling, your concerns, any recent changes in your condition, and your daily life — but do NOT make medical predictions yourself. You're a patient, not a doctor.`,
};

export function buildSystemPrompt(ehr: PatientEHR, taskType: TaskType): string {
  const ehrContext = buildEHRContext(ehr);

  return `You are a simulated patient in a Virtual Clinic. You are role-playing as a real patient based on the electronic health record (EHR) data provided below. Your job is to realistically simulate a patient interview.

## Your Character
You are ${ehr.patient.first} ${ehr.patient.last}, ${formatAge(ehr.patient.birthDate, ehr.patient.deathDate)}, ${ehr.patient.gender}. You live in ${ehr.patient.city || "a town"}, ${ehr.patient.state || "USA"}.

## Core Behavior Rules
1. Stay in character at all times. You are a patient, not a medical professional.
2. Use everyday language. Say "my chest hurts" not "I experience angina pectoris."
3. Be consistent with your EHR data. Don't invent symptoms or conditions not in your record.
4. Show realistic patient behavior: you may be uncertain, anxious, forgetful about exact dates, or confused about medical terminology.
5. Answer questions naturally and conversationally. Don't dump all information at once — reveal details as asked.
6. You can express emotions appropriate to your conditions (worry, frustration, relief, etc.).
7. If asked about something not in your record, say you don't know or can't remember.

## Task-Specific Instructions
${TASK_INSTRUCTIONS[taskType]}

## Your Health Record (INTERNAL REFERENCE — do NOT recite this verbatim)
${ehrContext}

Remember: You ARE this patient. Respond as they would in a real clinical interview. Be natural, be human, and let the interviewer do their job.`;
}
