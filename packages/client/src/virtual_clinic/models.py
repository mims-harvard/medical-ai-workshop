"""Pydantic models for Virtual Clinic API request and response types.

All models use ``snake_case`` field names with ``alias`` mappings for the
``camelCase`` JSON keys returned by the API.  Pydantic's ``model_validate``
automatically handles both cases thanks to ``populate_by_name=True``.
"""

from __future__ import annotations

from datetime import datetime
from typing import Generic, Literal, TypeVar

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

# ---------------------------------------------------------------------------
# Shared config
# ---------------------------------------------------------------------------

_CamelConfig = ConfigDict(alias_generator=to_camel, populate_by_name=True)

# ---------------------------------------------------------------------------
# Enums / Literals
# ---------------------------------------------------------------------------

TaskType = Literal["diagnosis", "treatment", "event"]
"""The clinical task type for a conversation session."""

MessageRole = Literal["system", "user", "assistant"]
"""The role of a message sender."""

# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------


class HealthStatus(BaseModel):
    """Response from ``GET /api/health``."""

    model_config = _CamelConfig

    status: Literal["ok", "degraded"]
    service: str
    timestamp: str
    database: Literal["connected", "disconnected"]
    db_latency_ms: int | None = None
    error: str | None = None


# ---------------------------------------------------------------------------
# Patients
# ---------------------------------------------------------------------------


class PatientSummary(BaseModel):
    """A patient record with basic demographics (from list endpoint)."""

    model_config = _CamelConfig

    id: str
    first: str
    last: str
    birth_date: str
    death_date: str | None = None
    gender: str
    race: str | None = None
    ethnicity: str | None = None
    city: str | None = None
    state: str | None = None


class Patient(BaseModel):
    """Full patient demographics (from detail endpoint)."""

    model_config = _CamelConfig

    id: str
    first: str
    last: str
    birth_date: str
    death_date: str | None = None
    gender: str
    race: str | None = None
    ethnicity: str | None = None
    marital: str | None = None
    birthplace: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    zip: str | None = None


class EHRSummary(BaseModel):
    """Aggregated EHR statistics for a patient."""

    model_config = _CamelConfig

    conditions_count: int
    active_conditions: list[str]
    medications_count: int
    active_medications: list[str]
    allergies_count: int
    allergies: list[str]
    encounters_count: int
    procedures_count: int
    immunizations_count: int
    active_careplan_count: int


class Condition(BaseModel):
    """A patient condition / diagnosis record."""

    model_config = _CamelConfig

    start: str
    stop: str | None = None
    patient_id: str
    encounter_id: str | None = None
    system: str | None = None
    code: str
    description: str


class Medication(BaseModel):
    """A patient medication record."""

    model_config = _CamelConfig

    start: str
    stop: str | None = None
    patient_id: str
    payer_id: str | None = None
    encounter_id: str | None = None
    code: str
    description: str
    base_cost: str | None = None
    payer_coverage: str | None = None
    dispenses: str | None = None
    total_cost: str | None = None
    reason_code: str | None = None
    reason_description: str | None = None


class Allergy(BaseModel):
    """A patient allergy record."""

    model_config = _CamelConfig

    start: str
    stop: str | None = None
    patient_id: str
    encounter_id: str | None = None
    code: str
    system: str | None = None
    description: str
    type: str | None = None
    category: str | None = None
    reaction1: str | None = None
    description1: str | None = None
    severity1: str | None = None
    reaction2: str | None = None
    description2: str | None = None
    severity2: str | None = None


class Procedure(BaseModel):
    """A patient procedure record."""

    model_config = _CamelConfig

    start: str
    stop: str | None = None
    patient_id: str
    encounter_id: str | None = None
    code: str
    description: str
    base_cost: str | None = None
    reason_code: str | None = None
    reason_description: str | None = None


class Encounter(BaseModel):
    """A patient encounter / visit record."""

    model_config = _CamelConfig

    id: str
    start: str
    stop: str | None = None
    patient_id: str
    organization_id: str | None = None
    provider_id: str | None = None
    payer_id: str | None = None
    encounter_class: str | None = None
    code: str | None = None
    description: str | None = None
    base_cost: str | None = None
    total_claim_cost: str | None = None
    payer_coverage: str | None = None
    reason_code: str | None = None
    reason_description: str | None = None


class Observation(BaseModel):
    """A clinical observation / lab result."""

    model_config = _CamelConfig

    date: str
    patient_id: str
    encounter_id: str | None = None
    category: str | None = None
    code: str
    description: str
    value: str | None = None
    units: str | None = None
    type: str | None = None


class Immunization(BaseModel):
    """A patient immunization record."""

    model_config = _CamelConfig

    date: str
    patient_id: str
    encounter_id: str | None = None
    code: str
    description: str
    base_cost: str | None = None


class CarePlan(BaseModel):
    """A patient care plan record."""

    model_config = _CamelConfig

    id: str
    start: str
    stop: str | None = None
    patient_id: str
    encounter_id: str | None = None
    code: str
    description: str
    reason_code: str | None = None
    reason_description: str | None = None


class PatientDetail(BaseModel):
    """Full patient profile including EHR summary and raw data arrays.

    Returned by ``GET /api/patients/{id}``.
    """

    model_config = _CamelConfig

    patient: Patient
    summary: EHRSummary
    conditions: list[Condition]
    medications: list[Medication]
    allergies: list[Allergy]
    procedures: list[Procedure]
    careplans: list[CarePlan]
    recent_observations: list[Observation]
    encounters: list[Encounter]
    immunizations: list[Immunization]


# ---------------------------------------------------------------------------
# Conversations
# ---------------------------------------------------------------------------


class ConversationSummary(BaseModel):
    """A conversation record without messages (from list endpoint)."""

    model_config = _CamelConfig

    id: str
    patient_id: str
    patient_name: str
    task_type: TaskType
    created_at: str
    updated_at: str
    metadata: str | None = None


class Message(BaseModel):
    """A single message in a conversation."""

    model_config = _CamelConfig

    id: str
    role: MessageRole
    content: str
    created_at: str


class ConversationWithMessages(BaseModel):
    """A conversation with its full message history.

    Returned by ``GET /api/conversations/{id}``.
    """

    model_config = _CamelConfig

    id: str
    patient_id: str
    patient_name: str
    task_type: TaskType
    created_at: str
    updated_at: str
    metadata: str | None = None
    messages: list[Message]


class CreatedConversation(BaseModel):
    """A newly created conversation.

    Returned by ``POST /api/conversations``.
    """

    model_config = _CamelConfig

    id: str
    patient_id: str
    task_type: TaskType
    patient_name: str
    created_at: str


class AssistantMessage(BaseModel):
    """The simulated patient's response to a user message.

    Returned by ``POST /api/conversations/{id}/messages``.
    """

    model_config = _CamelConfig

    conversation_id: str
    role: Literal["assistant"]
    content: str


# ---------------------------------------------------------------------------
# Pagination
# ---------------------------------------------------------------------------


class Pagination(BaseModel):
    """Pagination metadata included in list responses."""

    model_config = _CamelConfig

    page: int
    limit: int
    total: int
    total_pages: int


T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    """A paginated API response wrapping a list of items.

    Usage::

        result: PaginatedResponse[PatientSummary] = client.patients.list()
        for patient in result.data:
            print(patient.first, patient.last)
        print(f"Page {result.pagination.page} of {result.pagination.total_pages}")
    """

    model_config = _CamelConfig

    data: list[T]
    pagination: Pagination
