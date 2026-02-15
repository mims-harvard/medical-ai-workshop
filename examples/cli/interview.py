from __future__ import annotations

import logging

import typer
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, SystemMessage
from langchain_openai import AzureChatOpenAI
from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel
from rich.text import Text

from virtual_clinic import (
    AuthenticationError,
    ForbiddenError,
    NotFoundError,
    VirtualClinic,
    VirtualClinicError,
)

from cli.config import Config
from cli.prompts import TaskType, get_system_prompt
from cli.utils import format_rich

logger = logging.getLogger(__name__)
console = Console()


def _resolve_patient(
    client: VirtualClinic,
    patient_id: str | None,
) -> tuple[str, str]:
    """Return ``(patient_id, patient_name)``."""
    if patient_id:
        detail = client.patients.get(patient_id)
        return patient_id, f"{detail.patient.first} {detail.patient.last}"

    patients = client.patients.list(page=1, limit=5)
    if not patients.data:
        logger.error("No patients found. Has the database been seeded?")
        raise typer.Exit(1)

    p = patients.data[0]
    return p.id, f"{p.first} {p.last}"


def _print_message(label: str, style: str, content: str) -> None:
    """Print a single interview message."""
    console.print(Text(f"[{label}]", style=style))
    console.print(content)
    console.print()


def _run_interview(
    client: VirtualClinic,
    llm: AzureChatOpenAI,
    conversation_id: str,
    messages: list[BaseMessage],
    max_turns: int,
) -> str | None:
    """Execute the interview loop. Returns the assessment text or ``None``."""
    console.rule(format_rich("Interview", "bold"))
    console.print()

    for turn in range(1, max_turns + 1):
        logger.info(f"Turn {turn}/{max_turns}")

        response = llm.invoke(messages)
        doctor_msg = response.content

        messages.append(AIMessage(content=doctor_msg, name="doctor"))
        _print_message("Doctor", "bold cyan", doctor_msg)

        reply = client.conversations.send_message(
            conversation_id,
            content=doctor_msg,
        )
        messages.append(HumanMessage(content=reply.content, name="patient"))
        _print_message("Patient", "bold green", reply.content)
    else:
        logger.warning(f"Max turns ({max_turns}) reached, forcing wrap-up.")
        messages.append(
            HumanMessage(
                content="Please wrap up the interview and provide your diagnostic assessment now.",
                name="patient",
            )
        )
        response = llm.invoke(messages)
        final = response.content

        if final:
            _print_message("Doctor", "bold cyan", final)

        return final or None


def interview(
    task_type: TaskType = typer.Option(
        "diagnosis",
        "--task-type",
        "-t",
        help="Clinical task type.",
    ),
    patient_id: str | None = typer.Option(
        None,
        "--patient-id",
        "-p",
        help="Patient UUID. If omitted, uses the first patient from the list.",
    ),
    max_turns: int = typer.Option(
        10,
        "--max-turns",
        "-n",
        help="Max interview rounds.",
    ),
) -> None:
    """Conduct a clinical interview with a simulated patient."""
    config = Config()

    logger.info(f"Connecting to {config.virtual_clinic_base_url}")
    logger.info(
        f"Azure deployment: {config.azure_openai_deployment}  |  Max turns: {max_turns}"
    )

    try:
        with VirtualClinic(
            base_url=config.virtual_clinic_base_url, token=config.virtual_clinic_token
        ) as client:
            health = client.health()
            logger.info(f"API {health.status}  |  DB {health.database}")

            pid, patient_name = _resolve_patient(client, patient_id)

            convo = client.conversations.create(
                patient_id=pid,
                task_type=task_type,
            )

            console.print(
                Panel(
                    f"{format_rich(patient_name, 'bold')}\n"
                    f"Task: {task_type}  |  Conversation: {convo.id}",
                    title="Interview started",
                    border_style="blue",
                )
            )

            system_msg = SystemMessage(
                content=get_system_prompt(task_type, patient_name),
            )
            messages: list[BaseMessage] = [system_msg]

            llm = AzureChatOpenAI(
                azure_endpoint=config.azure_openai_endpoint,
                api_key=config.azure_openai_api_key,
                azure_deployment=config.azure_openai_deployment,
                api_version=config.azure_openai_api_version,
            )

            assessment = _run_interview(client, llm, convo.id, messages, max_turns)

            if assessment:
                console.rule(format_rich("Assessment", "bold"))
                console.print()
                console.print(Markdown(assessment))
                console.print()

            console.rule(format_rich("Done", "bold green"))

    except AuthenticationError:
        logger.error("Invalid or expired token. Check VIRTUAL_CLINIC_TOKEN in .env")
        raise typer.Exit(1)
    except ForbiddenError:
        logger.error(
            "Insufficient permissions. Patient endpoints require an admin token."
        )
        raise typer.Exit(1)
    except NotFoundError as exc:
        logger.error(f"Not found: {exc.message}")
        raise typer.Exit(1)
    except VirtualClinicError as exc:
        logger.error(f"API error: {exc.message}")
        raise typer.Exit(1)
    except KeyboardInterrupt:
        console.print("\n" + format_rich("Interrupted.", "yellow"))
        raise typer.Exit(130)
