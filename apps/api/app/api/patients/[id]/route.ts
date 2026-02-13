import { NextRequest, NextResponse } from "next/server";
import { getPatientEHR } from "@/lib/agent/prompts";

/**
 * GET /api/patients/:id
 *
 * Get a single patient's full profile including summarized EHR data.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ehr = await getPatientEHR(id);

    if (!ehr) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        patient: ehr.patient,
        summary: {
          conditionsCount: ehr.conditions.length,
          activeConditions: ehr.conditions
            .filter((c) => !c.stop)
            .map((c) => c.description),
          medicationsCount: ehr.medications.length,
          activeMedications: ehr.medications
            .filter((m) => !m.stop)
            .map((m) => m.description),
          allergiesCount: ehr.allergies.length,
          allergies: ehr.allergies.map((a) => a.description),
          encountersCount: ehr.encounters.length,
          proceduresCount: ehr.procedures.length,
          immunizationsCount: ehr.immunizations.length,
          activeCareplanCount: ehr.careplans.filter((c) => !c.stop).length,
        },
        conditions: ehr.conditions,
        medications: ehr.medications,
        allergies: ehr.allergies,
        procedures: ehr.procedures,
        careplans: ehr.careplans,
        recentObservations: ehr.observations.slice(-30),
        encounters: ehr.encounters,
        immunizations: ehr.immunizations,
      },
    });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient" },
      { status: 500 }
    );
  }
}
