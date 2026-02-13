import { NextResponse } from "next/server";

/**
 * GET /api/swagger
 *
 * Returns the OpenAPI 3.1 specification for the Virtual Clinic API.
 */
export async function GET() {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: "Virtual Clinic API",
      version: "0.1.0",
      description:
        "REST API for the ASPIRE Virtual Clinic — multi-turn conversations with LLM-based simulated patient agents powered by Synthea-generated electronic health records.\n\n" +
        "## Workflow\n" +
        "1. **List patients** — Browse available synthetic patients via `GET /api/patients`\n" +
        "2. **Inspect a patient** — View full EHR details via `GET /api/patients/{id}`\n" +
        "3. **Start a conversation** — Create a session via `POST /api/conversations` with a patient ID and task type\n" +
        "4. **Interview the patient** — Send messages via `POST /api/conversations/{id}/messages` and receive the simulated patient's responses\n" +
        "5. **Review history** — Retrieve full conversation via `GET /api/conversations/{id}`\n\n" +
        "## Task Types\n" +
        "- **diagnosis** — Interview the patient to propose a diagnosis\n" +
        "- **treatment** — Interview the patient to predict the treatment plan\n" +
        "- **event** — Interview the patient to estimate probability of a clinical event",
      contact: {
        name: "ASPIRE Workshop",
        url: "https://icml-workshop.vercel.app",
      },
    },
    servers: [
      {
        url: "{protocol}://{host}",
        variables: {
          protocol: { default: "http", enum: ["http", "https"] },
          host: { default: "localhost:3001" },
        },
      },
    ],
    paths: {
      "/api/health": {
        get: {
          tags: ["System"],
          summary: "Health check",
          description: "Returns the API health status.",
          operationId: "healthCheck",
          responses: {
            "200": {
              description: "API is healthy",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      service: {
                        type: "string",
                        example: "virtual-clinic-api",
                      },
                      timestamp: {
                        type: "string",
                        format: "date-time",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/patients": {
        get: {
          tags: ["Patients"],
          summary: "List patients",
          description:
            "Returns a paginated list of synthetic patients with basic demographics.",
          operationId: "listPatients",
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1, minimum: 1 },
              description: "Page number",
            },
            {
              name: "limit",
              in: "query",
              schema: {
                type: "integer",
                default: 20,
                minimum: 1,
                maximum: 100,
              },
              description: "Items per page",
            },
          ],
          responses: {
            "200": {
              description: "Paginated list of patients",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/PatientSummary" },
                      },
                      pagination: {
                        $ref: "#/components/schemas/Pagination",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/patients/{id}": {
        get: {
          tags: ["Patients"],
          summary: "Get patient details",
          description:
            "Returns a single patient's full profile including summarized EHR data (conditions, medications, allergies, procedures, observations, etc.).",
          operationId: "getPatient",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Patient UUID",
            },
          ],
          responses: {
            "200": {
              description: "Full patient profile with EHR summary",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "object",
                        properties: {
                          patient: {
                            $ref: "#/components/schemas/Patient",
                          },
                          summary: {
                            $ref: "#/components/schemas/EHRSummary",
                          },
                          conditions: {
                            type: "array",
                            items: { type: "object" },
                          },
                          medications: {
                            type: "array",
                            items: { type: "object" },
                          },
                          allergies: {
                            type: "array",
                            items: { type: "object" },
                          },
                          procedures: {
                            type: "array",
                            items: { type: "object" },
                          },
                          careplans: {
                            type: "array",
                            items: { type: "object" },
                          },
                          recentObservations: {
                            type: "array",
                            items: { type: "object" },
                          },
                          encounters: {
                            type: "array",
                            items: { type: "object" },
                          },
                          immunizations: {
                            type: "array",
                            items: { type: "object" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "404": {
              description: "Patient not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/api/conversations": {
        get: {
          tags: ["Conversations"],
          summary: "List conversations",
          description:
            "Returns a paginated list of conversations. Supports optional filtering by patientId and taskType.",
          operationId: "listConversations",
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1, minimum: 1 },
              description: "Page number",
            },
            {
              name: "limit",
              in: "query",
              schema: {
                type: "integer",
                default: 20,
                minimum: 1,
                maximum: 100,
              },
              description: "Items per page",
            },
            {
              name: "patientId",
              in: "query",
              schema: { type: "string", format: "uuid" },
              description: "Filter by patient UUID",
            },
            {
              name: "taskType",
              in: "query",
              schema: {
                type: "string",
                enum: ["diagnosis", "treatment", "event"],
              },
              description: "Filter by task type",
            },
          ],
          responses: {
            "200": {
              description: "Paginated list of conversations",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/ConversationSummary",
                        },
                      },
                      pagination: {
                        $ref: "#/components/schemas/Pagination",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Conversations"],
          summary: "Create a conversation",
          description:
            "Start a new multi-turn conversation with a simulated patient. Choose a task type to set the interaction mode.",
          operationId: "createConversation",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["patientId", "taskType"],
                  properties: {
                    patientId: {
                      type: "string",
                      format: "uuid",
                      description: "The UUID of the patient to converse with",
                    },
                    taskType: {
                      type: "string",
                      enum: ["diagnosis", "treatment", "event"],
                      description:
                        "The clinical task type for this conversation",
                    },
                    metadata: {
                      type: "string",
                      description:
                        "Optional JSON metadata for the conversation",
                    },
                  },
                },
                example: {
                  patientId: "00000000-0000-0000-0000-000000000000",
                  taskType: "diagnosis",
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Conversation created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "object",
                        properties: {
                          id: { type: "string", format: "uuid" },
                          patientId: { type: "string", format: "uuid" },
                          taskType: {
                            type: "string",
                            enum: ["diagnosis", "treatment", "event"],
                          },
                          patientName: { type: "string" },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            "404": {
              description: "Patient not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/api/conversations/{id}": {
        get: {
          tags: ["Conversations"],
          summary: "Get conversation",
          description:
            "Retrieve a conversation with all its messages (full conversation history).",
          operationId: "getConversation",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Conversation UUID",
            },
          ],
          responses: {
            "200": {
              description: "Conversation with messages",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        $ref: "#/components/schemas/ConversationWithMessages",
                      },
                    },
                  },
                },
              },
            },
            "404": {
              description: "Conversation not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/api/conversations/{id}/messages": {
        post: {
          tags: ["Conversations"],
          summary: "Send a message",
          description:
            "Send a message to the simulated patient agent. The agent will respond based on the patient's EHR data and conversation history. Both the user message and agent response are persisted.",
          operationId: "sendMessage",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Conversation UUID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["content"],
                  properties: {
                    content: {
                      type: "string",
                      minLength: 1,
                      maxLength: 4096,
                      description: "The message to send to the patient agent",
                    },
                  },
                },
                example: {
                  content:
                    "Hello, can you tell me what brings you in today? What symptoms have you been experiencing?",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Agent response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "object",
                        properties: {
                          conversationId: {
                            type: "string",
                            format: "uuid",
                          },
                          role: {
                            type: "string",
                            enum: ["assistant"],
                          },
                          content: {
                            type: "string",
                            description:
                              "The simulated patient's response",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            "404": {
              description: "Conversation not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        PatientSummary: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            first: { type: "string" },
            last: { type: "string" },
            birthDate: { type: "string", format: "date" },
            deathDate: { type: "string", format: "date", nullable: true },
            gender: { type: "string" },
            race: { type: "string", nullable: true },
            ethnicity: { type: "string", nullable: true },
            city: { type: "string", nullable: true },
            state: { type: "string", nullable: true },
          },
        },
        Patient: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            first: { type: "string" },
            last: { type: "string" },
            birthDate: { type: "string", format: "date" },
            deathDate: { type: "string", format: "date", nullable: true },
            gender: { type: "string" },
            race: { type: "string", nullable: true },
            ethnicity: { type: "string", nullable: true },
            marital: { type: "string", nullable: true },
            birthplace: { type: "string", nullable: true },
            address: { type: "string", nullable: true },
            city: { type: "string", nullable: true },
            state: { type: "string", nullable: true },
            zip: { type: "string", nullable: true },
          },
        },
        EHRSummary: {
          type: "object",
          properties: {
            conditionsCount: { type: "integer" },
            activeConditions: {
              type: "array",
              items: { type: "string" },
            },
            medicationsCount: { type: "integer" },
            activeMedications: {
              type: "array",
              items: { type: "string" },
            },
            allergiesCount: { type: "integer" },
            allergies: { type: "array", items: { type: "string" } },
            encountersCount: { type: "integer" },
            proceduresCount: { type: "integer" },
            immunizationsCount: { type: "integer" },
            activeCareplanCount: { type: "integer" },
          },
        },
        ConversationSummary: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            patientId: { type: "string", format: "uuid" },
            patientName: { type: "string" },
            taskType: {
              type: "string",
              enum: ["diagnosis", "treatment", "event"],
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            metadata: { type: "string", nullable: true },
          },
        },
        ConversationWithMessages: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            patientId: { type: "string", format: "uuid" },
            patientName: { type: "string" },
            taskType: {
              type: "string",
              enum: ["diagnosis", "treatment", "event"],
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            messages: {
              type: "array",
              items: { $ref: "#/components/schemas/Message" },
            },
          },
        },
        Message: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            role: {
              type: "string",
              enum: ["system", "user", "assistant"],
            },
            content: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            total: { type: "integer" },
            totalPages: { type: "integer" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
            details: { type: "object" },
          },
        },
      },
    },
    tags: [
      {
        name: "System",
        description: "System health and status endpoints",
      },
      {
        name: "Patients",
        description:
          "Browse synthetic patients and their electronic health records",
      },
      {
        name: "Conversations",
        description:
          "Multi-turn conversations with simulated patient agents",
      },
    ],
  };

  return NextResponse.json(spec, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
