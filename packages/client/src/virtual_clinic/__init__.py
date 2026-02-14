"""virtual-clinic — Python client for the Virtual Clinic REST API.

Quick start::

    from virtual_clinic import VirtualClinic

    client = VirtualClinic(
        base_url="https://virtual-clinic-api.vercel.app",
        token="your-jwt-token",
    )

    # List patients (admin only)
    patients = client.patients.list()

    # Start a diagnostic conversation
    convo = client.conversations.create(
        patient_id=patients.data[0].id,
        task_type="diagnosis",
    )

    # Interview the simulated patient
    reply = client.conversations.send_message(
        convo.id, content="What brings you in today?"
    )
    print(reply.content)
"""

from .client import VirtualClinic
from .exceptions import (
    APIError,
    AuthenticationError,
    ConnectionError,
    ForbiddenError,
    NotFoundError,
    ServerError,
    ValidationError,
    VirtualClinicError,
)
from .models import (
    Allergy,
    AssistantMessage,
    CarePlan,
    Condition,
    ConversationSummary,
    ConversationWithMessages,
    CreatedConversation,
    EHRSummary,
    Encounter,
    HealthStatus,
    Immunization,
    Medication,
    Message,
    MessageRole,
    Observation,
    PaginatedResponse,
    Pagination,
    Patient,
    PatientDetail,
    PatientSummary,
    Procedure,
    TaskType,
)

__all__ = [
    # Client
    "VirtualClinic",
    # Exceptions
    "VirtualClinicError",
    "APIError",
    "AuthenticationError",
    "ForbiddenError",
    "NotFoundError",
    "ValidationError",
    "ServerError",
    "ConnectionError",
    # Models — Health
    "HealthStatus",
    # Models — Patients
    "PatientSummary",
    "Patient",
    "PatientDetail",
    "EHRSummary",
    "Condition",
    "Medication",
    "Allergy",
    "Procedure",
    "Encounter",
    "Observation",
    "Immunization",
    "CarePlan",
    # Models — Conversations
    "ConversationSummary",
    "ConversationWithMessages",
    "CreatedConversation",
    "Message",
    "AssistantMessage",
    # Models — Shared
    "Pagination",
    "PaginatedResponse",
    # Types
    "TaskType",
    "MessageRole",
]

__version__ = "0.1.0"
