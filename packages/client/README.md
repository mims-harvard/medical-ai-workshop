# virtual-clinic

Python client for the **ASPIRE Virtual Clinic REST API** — multi-turn conversations with LLM-based simulated patient agents powered by Synthea-generated electronic health records.

## Installation

```bash
pip install virtual-clinic
```

Or install from source (for development):

```bash
# From the repo root
cd packages/client
uv pip install -e .
```

## Quick Start

```python
from virtual_clinic import VirtualClinic

client = VirtualClinic(
    base_url="https://virtual-clinic-api.vercel.app",
    token="your-jwt-token",  # provided by workshop organizers
)

# 1. List available patients (requires admin token)
patients = client.patients.list(page=1, limit=10)
for p in patients.data:
    print(f"{p.first} {p.last} — {p.gender}, born {p.birth_date}")

print(f"Page {patients.pagination.page} of {patients.pagination.total_pages}")

# 2. Inspect a patient's full EHR
detail = client.patients.get(patients.data[0].id)
print(f"Active conditions: {detail.summary.active_conditions}")
print(f"Active medications: {detail.summary.active_medications}")
print(f"Allergies: {detail.summary.allergies}")

# 3. Start a diagnostic conversation
convo = client.conversations.create(
    patient_id=patients.data[0].id,
    task_type="diagnosis",
)
print(f"Conversation {convo.id} started with {convo.patient_name}")

# 4. Interview the simulated patient
reply = client.conversations.send_message(
    convo.id,
    content="Hello, what brings you in today?",
)
print(f"Patient: {reply.content}")

# Continue the conversation...
reply = client.conversations.send_message(
    convo.id,
    content="How long have you been experiencing these symptoms?",
)
print(f"Patient: {reply.content}")

# 5. Review the full conversation history
history = client.conversations.get(convo.id)
for msg in history.messages:
    print(f"[{msg.role}] {msg.content[:80]}...")

# 6. Clean up
client.close()
```

## Context Manager

The client supports the context manager protocol for automatic cleanup:

```python
with VirtualClinic(base_url="...", token="...") as client:
    health = client.health()
    print(health.status, health.database)
```

## API Reference

### `VirtualClinic(*, base_url, token, timeout=60.0)`

The main client. All parameters are keyword-only.

| Parameter  | Type    | Default | Description |
|-----------|---------|---------|-------------|
| `base_url` | `str`   | `"https://virtual-clinic-api.vercel.app"` | API base URL |
| `token`    | `str`   | *(required)* | JWT bearer token |
| `timeout`  | `float` | `60.0`  | Request timeout in seconds |

### Health

```python
client.health() -> HealthStatus
```

Check API health (public, no auth required).

### Patients (admin token required)

```python
client.patients.list(*, page=1, limit=20) -> PaginatedResponse[PatientSummary]
client.patients.get(patient_id: str) -> PatientDetail
```

### Conversations

```python
client.conversations.list(*, page=1, limit=20, patient_id=None, task_type=None) -> PaginatedResponse[ConversationSummary]
client.conversations.create(*, patient_id, task_type, metadata=None) -> CreatedConversation
client.conversations.get(conversation_id: str) -> ConversationWithMessages
client.conversations.send_message(conversation_id: str, *, content: str) -> AssistantMessage
```

### Task Types

| Value | Description |
|-------|-------------|
| `"diagnosis"` | Interview the patient to propose a diagnosis |
| `"treatment"` | Interview the patient to predict the treatment plan |
| `"event"` | Interview the patient to estimate probability of a clinical event |

## Error Handling

All API errors raise typed exceptions:

```python
from virtual_clinic import (
    VirtualClinicError,     # base class — catch-all
    AuthenticationError,    # 401 — invalid or missing token
    ForbiddenError,         # 403 — insufficient permissions
    NotFoundError,          # 404 — resource not found
    ValidationError,        # 400 — invalid request
    ServerError,            # 5xx — server error
    ConnectionError,        # network/DNS/timeout failure
)

try:
    patient = client.patients.get("nonexistent-uuid")
except NotFoundError as e:
    print(f"Patient not found: {e.message}")
except AuthenticationError:
    print("Check your token!")
except VirtualClinicError as e:
    print(f"Something went wrong: {e.message}")
```

API error exceptions expose these attributes:

| Attribute | Type | Description |
|-----------|------|-------------|
| `status_code` | `int` | HTTP status code |
| `message` | `str` | Error message from the API |
| `details` | `dict \| None` | Validation error details (if any) |
| `body` | `dict \| None` | Raw response body |

## Models

All API responses are returned as [Pydantic v2](https://docs.pydantic.dev/) models with full type hints. This gives you autocomplete in IDEs, runtime validation, and easy serialization:

```python
# Convert to dict
patient_dict = patient.model_dump()

# Convert to JSON string
patient_json = patient.model_dump_json()

# Access fields with autocomplete
print(detail.summary.active_conditions)
print(detail.patient.first, detail.patient.last)
```

## Requirements

- Python >= 3.10
- `httpx >= 0.27`
- `pydantic >= 2.0`
