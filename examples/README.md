# Examples

Example scripts demonstrating how to use the [`virtual-clinic`](https://pypi.org/project/virtual-clinic/) Python client to conduct multi-turn conversations with LLM-based simulated patients.

## Prerequisites

- Python 3.10+
- [uv](https://docs.astral.sh/uv/) package manager
- A JWT token provided by workshop organizers

## Setup

```bash
# Copy the env template and fill in your token
cp .env.example .env

# Install dependencies
uv sync
```

Edit `.env` and set your token:

```env
VIRTUAL_CLINIC_TOKEN=eyJhbGciOiJIUzI1NiIs...
VIRTUAL_CLINIC_BASE_URL=https://virtual-clinic-api.vercel.app
```

## Run

```bash
uv run multi_round_conversation.py
```

## Configuration

All settings are managed via environment variables (prefix `VIRTUAL_CLINIC_`) or the `.env` file:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VIRTUAL_CLINIC_TOKEN` | Yes | -- | JWT bearer token |
| `VIRTUAL_CLINIC_BASE_URL` | No | `https://virtual-clinic-api.vercel.app` | API base URL |
| `VIRTUAL_CLINIC_PATIENT_ID` | No | First patient in list | UUID of the patient to interview |
| `VIRTUAL_CLINIC_TASK_TYPE` | No | `diagnosis` | Task type: `diagnosis`, `treatment`, or `event` |

## Customizing the interview

Edit the `QUESTIONS` list in `multi_round_conversation.py` to change the interview flow:

```python
QUESTIONS: list[str] = [
    "Hello, I'm your doctor today. What brings you in?",
    "Can you describe your symptoms in more detail?",
    "How long have you been experiencing these symptoms?",
    # Add your own questions here
]
```

## Example output

```
Connecting to https://virtual-clinic-api.vercel.app ...

API status:   ok
Database:     connected
DB latency:   12 ms

========================================================================
Patient:      John Doe
Gender:       M
Born:         1980-01-15
------------------------------------------------------------------------
Conditions:   5 total, 2 active
  - Essential hypertension
  - Diabetes mellitus type 2
Medications:  3 total, 2 active
  - Lisinopril 10 MG Oral Tablet
  - Metformin 500 MG Oral Tablet
Allergies:    1
  - Peanut allergy
========================================================================

Starting 'diagnosis' conversation ...
Conversation: a1b2c3d4-...

========================================================================
INTERVIEW
========================================================================

[you]     Hello, I'm your doctor today. What brings you in?

[patient] Hi doctor, thanks for seeing me. I've been feeling really tired
          lately and getting these headaches that won't go away...

------------------------------------------------------------------------

[you]     Can you describe your symptoms in more detail?

[patient] Well, the tiredness has been going on for a few weeks now...

...
```
