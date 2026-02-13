import {
  pgTable,
  uuid,
  text,
  date,
  timestamp,
  numeric,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Synthea EHR Tables ────────────────────────────────────────────────────────

export const patients = pgTable("patients", {
  id: uuid("id").primaryKey(),
  birthDate: date("birth_date").notNull(),
  deathDate: date("death_date"),
  ssn: text("ssn").notNull(),
  drivers: text("drivers"),
  passport: text("passport"),
  prefix: text("prefix"),
  first: text("first").notNull(),
  last: text("last").notNull(),
  suffix: text("suffix"),
  maiden: text("maiden"),
  marital: text("marital"),
  race: text("race"),
  ethnicity: text("ethnicity"),
  gender: text("gender").notNull(),
  birthplace: text("birthplace"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  county: text("county"),
  fips: text("fips"),
  zip: text("zip"),
  lat: numeric("lat"),
  lon: numeric("lon"),
  healthcareExpenses: numeric("healthcare_expenses"),
  healthcareCoverage: numeric("healthcare_coverage"),
  income: numeric("income"),
});

export const encounters = pgTable(
  "encounters",
  {
    id: uuid("id").primaryKey(),
    start: timestamp("start").notNull(),
    stop: timestamp("stop"),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id),
    organizationId: uuid("organization_id"),
    providerId: uuid("provider_id"),
    payerId: uuid("payer_id"),
    encounterClass: text("encounter_class"),
    code: text("code"),
    description: text("description"),
    baseCost: numeric("base_cost"),
    totalClaimCost: numeric("total_claim_cost"),
    payerCoverage: numeric("payer_coverage"),
    reasonCode: text("reason_code"),
    reasonDescription: text("reason_description"),
  },
  (table) => [index("encounters_patient_idx").on(table.patientId)]
);

export const conditions = pgTable(
  "conditions",
  {
    start: date("start").notNull(),
    stop: date("stop"),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id),
    encounterId: uuid("encounter_id").references(() => encounters.id),
    system: text("system"),
    code: text("code").notNull(),
    description: text("description").notNull(),
  },
  (table) => [index("conditions_patient_idx").on(table.patientId)]
);

export const medications = pgTable(
  "medications",
  {
    start: timestamp("start").notNull(),
    stop: timestamp("stop"),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id),
    payerId: uuid("payer_id"),
    encounterId: uuid("encounter_id").references(() => encounters.id),
    code: text("code").notNull(),
    description: text("description").notNull(),
    baseCost: numeric("base_cost"),
    payerCoverage: numeric("payer_coverage"),
    dispenses: numeric("dispenses"),
    totalCost: numeric("total_cost"),
    reasonCode: text("reason_code"),
    reasonDescription: text("reason_description"),
  },
  (table) => [index("medications_patient_idx").on(table.patientId)]
);

export const observations = pgTable(
  "observations",
  {
    date: timestamp("date").notNull(),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id),
    encounterId: uuid("encounter_id").references(() => encounters.id),
    category: text("category"),
    code: text("code").notNull(),
    description: text("description").notNull(),
    value: text("value"),
    units: text("units"),
    type: text("type"),
  },
  (table) => [index("observations_patient_idx").on(table.patientId)]
);

export const allergies = pgTable(
  "allergies",
  {
    start: date("start").notNull(),
    stop: date("stop"),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id),
    encounterId: uuid("encounter_id").references(() => encounters.id),
    code: text("code").notNull(),
    system: text("system"),
    description: text("description").notNull(),
    type: text("type"),
    category: text("category"),
    reaction1: text("reaction1"),
    description1: text("description1"),
    severity1: text("severity1"),
    reaction2: text("reaction2"),
    description2: text("description2"),
    severity2: text("severity2"),
  },
  (table) => [index("allergies_patient_idx").on(table.patientId)]
);

export const procedures = pgTable(
  "procedures",
  {
    start: timestamp("start").notNull(),
    stop: timestamp("stop"),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id),
    encounterId: uuid("encounter_id").references(() => encounters.id),
    code: text("code").notNull(),
    description: text("description").notNull(),
    baseCost: numeric("base_cost"),
    reasonCode: text("reason_code"),
    reasonDescription: text("reason_description"),
  },
  (table) => [index("procedures_patient_idx").on(table.patientId)]
);

export const immunizations = pgTable(
  "immunizations",
  {
    date: timestamp("date").notNull(),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id),
    encounterId: uuid("encounter_id").references(() => encounters.id),
    code: text("code").notNull(),
    description: text("description").notNull(),
    baseCost: numeric("base_cost"),
  },
  (table) => [index("immunizations_patient_idx").on(table.patientId)]
);

export const careplans = pgTable(
  "careplans",
  {
    id: uuid("id").primaryKey(),
    start: date("start").notNull(),
    stop: date("stop"),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id),
    encounterId: uuid("encounter_id").references(() => encounters.id),
    code: text("code").notNull(),
    description: text("description").notNull(),
    reasonCode: text("reason_code"),
    reasonDescription: text("reason_description"),
  },
  (table) => [index("careplans_patient_idx").on(table.patientId)]
);

// ─── Conversation Tables ───────────────────────────────────────────────────────

export const taskTypeEnum = pgEnum("task_type", [
  "diagnosis",
  "treatment",
  "event",
]);

export const messageRoleEnum = pgEnum("message_role", [
  "system",
  "user",
  "assistant",
]);

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id),
    taskType: taskTypeEnum("task_type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    metadata: text("metadata"), // JSON string for extensibility
  },
  (table) => [index("conversations_patient_idx").on(table.patientId)]
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: messageRoleEnum("role").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("messages_conversation_idx").on(table.conversationId)]
);

// ─── Relations ─────────────────────────────────────────────────────────────────

export const patientsRelations = relations(patients, ({ many }) => ({
  encounters: many(encounters),
  conditions: many(conditions),
  medications: many(medications),
  observations: many(observations),
  allergies: many(allergies),
  procedures: many(procedures),
  immunizations: many(immunizations),
  careplans: many(careplans),
  conversations: many(conversations),
}));

export const encountersRelations = relations(encounters, ({ one }) => ({
  patient: one(patients, {
    fields: [encounters.patientId],
    references: [patients.id],
  }),
}));

export const conditionsRelations = relations(conditions, ({ one }) => ({
  patient: one(patients, {
    fields: [conditions.patientId],
    references: [patients.id],
  }),
}));

export const medicationsRelations = relations(medications, ({ one }) => ({
  patient: one(patients, {
    fields: [medications.patientId],
    references: [patients.id],
  }),
}));

export const observationsRelations = relations(observations, ({ one }) => ({
  patient: one(patients, {
    fields: [observations.patientId],
    references: [patients.id],
  }),
}));

export const allergiesRelations = relations(allergies, ({ one }) => ({
  patient: one(patients, {
    fields: [allergies.patientId],
    references: [patients.id],
  }),
}));

export const proceduresRelations = relations(procedures, ({ one }) => ({
  patient: one(patients, {
    fields: [procedures.patientId],
    references: [patients.id],
  }),
}));

export const immunizationsRelations = relations(immunizations, ({ one }) => ({
  patient: one(patients, {
    fields: [immunizations.patientId],
    references: [patients.id],
  }),
}));

export const careplansRelations = relations(careplans, ({ one }) => ({
  patient: one(patients, {
    fields: [careplans.patientId],
    references: [patients.id],
  }),
}));

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    patient: one(patients, {
      fields: [conversations.patientId],
      references: [patients.id],
    }),
    messages: many(messages),
  })
);

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));
