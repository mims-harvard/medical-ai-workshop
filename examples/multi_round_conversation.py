"""Multi-round conversation with a simulated patient.

This script demonstrates the full Virtual Clinic workflow:

1. Connect to the API and verify it's healthy
2. Browse available patients and inspect their EHR
3. Start a conversation session
4. Conduct a multi-round clinical interview
5. Review the full conversation history

Usage::

    cp .env.example .env   # fill in your token
    uv sync
    uv run multi_round_conversation.py
"""

from __future__ import annotations

import sys

from settings import settings
from virtual_clinic import (
    AuthenticationError,
    ForbiddenError,
    NotFoundError,
    VirtualClinic,
    VirtualClinicError,
)

# -- Interview questions -----------------------------------------------------
# Modify this list to change the interview flow. Each string is sent as a
# separate message to the simulated patient.

QUESTIONS: list[str] = [
    "Hello, I'm your doctor today. What brings you in?",
    "Can you describe your symptoms in more detail?",
    "How long have you been experiencing these symptoms?",
    "Are you currently taking any medications?",
    "Do you have any allergies I should know about?",
]


def separator(char: str = "-", width: int = 72) -> None:
    print(char * width)


def main() -> None:
    print(f"Connecting to {settings.base_url} ...")
    print()

    with VirtualClinic(base_url=settings.base_url, token=settings.token) as client:
        # ── 1. Health check ─────────────────────────────────────────────
        health = client.health()
        print(f"API status:   {health.status}")
        print(f"Database:     {health.database}")
        if health.db_latency_ms is not None:
            print(f"DB latency:   {health.db_latency_ms} ms")
        print()

        # ── 2. Select a patient ─────────────────────────────────────────
        if settings.patient_id:
            patient_id = settings.patient_id
            detail = client.patients.get(patient_id)
            patient = detail.patient
            summary = detail.summary
        else:
            patients = client.patients.list(page=1, limit=5)
            if not patients.data:
                print("No patients found. Has the database been seeded?")
                sys.exit(1)
            patient = patients.data[0]
            patient_id = patient.id
            detail = client.patients.get(patient_id)
            summary = detail.summary

        separator("=")
        print(f"Patient:      {patient.first} {patient.last}")
        print(f"Gender:       {patient.gender}")
        print(f"Born:         {patient.birth_date}")
        separator()
        print(
            f"Conditions:   {summary.conditions_count} total, {len(summary.active_conditions)} active"
        )
        for c in summary.active_conditions[:5]:
            print(f"  - {c}")
        print(
            f"Medications:  {summary.medications_count} total, {len(summary.active_medications)} active"
        )
        for m in summary.active_medications[:5]:
            print(f"  - {m}")
        print(f"Allergies:    {summary.allergies_count}")
        for a in summary.allergies[:5]:
            print(f"  - {a}")
        separator("=")
        print()

        # ── 3. Start a conversation ─────────────────────────────────────
        print(f"Starting '{settings.task_type}' conversation ...")
        convo = client.conversations.create(
            patient_id=patient_id,
            task_type=settings.task_type,
        )
        print(f"Conversation: {convo.id}")
        print()

        # ── 4. Multi-round interview ────────────────────────────────────
        separator("=")
        print("INTERVIEW")
        separator("=")
        print()

        for i, question in enumerate(QUESTIONS, 1):
            print(f"[you]     {question}")
            print()

            reply = client.conversations.send_message(
                convo.id,
                content=question,
            )

            print(f"[patient] {reply.content}")
            print()
            separator()
            print()

        # ── 5. Review full conversation history ─────────────────────────
        history = client.conversations.get(convo.id)

        separator("=")
        print("CONVERSATION HISTORY")
        separator("=")
        print()
        print(f"ID:        {history.id}")
        print(f"Patient:   {history.patient_name}")
        print(f"Task:      {history.task_type}")
        print(f"Messages:  {len(history.messages)}")
        print()

        for msg in history.messages:
            label = {"system": "system", "user": "you", "assistant": "patient"}.get(
                msg.role, msg.role
            )
            # Skip system messages in the printout
            if msg.role == "system":
                continue
            print(f"[{label}] {msg.content}")
            print()

        separator("=")
        print("Done.")


if __name__ == "__main__":
    try:
        main()
    except AuthenticationError:
        print("Error: Invalid or expired token. Check VIRTUAL_CLINIC_TOKEN in .env")
        sys.exit(1)
    except ForbiddenError:
        print(
            "Error: Insufficient permissions. Patient endpoints require an admin token."
        )
        sys.exit(1)
    except NotFoundError as e:
        print(f"Error: {e.message}")
        sys.exit(1)
    except VirtualClinicError as e:
        print(f"Error: {e.message}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nInterrupted.")
        sys.exit(130)
