"""Synchronous Python client for the Virtual Clinic REST API.

Usage::

    from virtual_clinic import VirtualClinic

    client = VirtualClinic(base_url="https://...", token="eyJ...")

    # List patients (admin only)
    patients = client.patients.list(page=1, limit=10)

    # Start a conversation
    convo = client.conversations.create(patient_id="...", task_type="diagnosis")

    # Interview the simulated patient
    reply = client.conversations.send_message(convo.id, content="What brings you in today?")
    print(reply.content)
"""

from __future__ import annotations

from typing import Any

import httpx

from ._constants import DEFAULT_BASE_URL, DEFAULT_TIMEOUT, USER_AGENT
from .exceptions import (
    APIError,
    AuthenticationError,
    ConnectionError,
    ForbiddenError,
    NotFoundError,
    ServerError,
    ValidationError,
)
from .models import (
    AssistantMessage,
    ConversationSummary,
    ConversationWithMessages,
    CreatedConversation,
    HealthStatus,
    PaginatedResponse,
    PatientDetail,
    PatientSummary,
    TaskType,
)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

_STATUS_MAP: dict[int, type[APIError]] = {
    400: ValidationError,
    401: AuthenticationError,
    403: ForbiddenError,
    404: NotFoundError,
}


def _raise_for_status(response: httpx.Response) -> None:
    """Raise a typed exception for non-2xx responses."""
    if response.is_success:
        return

    body: dict[str, Any] = {}
    try:
        body = response.json()
    except Exception:
        pass

    message = body.get("error", response.reason_phrase or "Unknown error")
    details = body.get("details")
    status = response.status_code

    exc_cls = _STATUS_MAP.get(status)
    if exc_cls is not None:
        raise exc_cls(message=message, details=details, body=body)

    if status >= 500:
        raise ServerError(
            status_code=status, message=message, details=details, body=body
        )

    raise APIError(status_code=status, message=message, details=details, body=body)


# ---------------------------------------------------------------------------
# Resource classes
# ---------------------------------------------------------------------------


class PatientsResource:
    """Methods for the ``/api/patients`` endpoints.

    Requires an **admin** token.
    """

    def __init__(self, http: httpx.Client) -> None:
        self._http = http

    def list(
        self, *, page: int = 1, limit: int = 20
    ) -> PaginatedResponse[PatientSummary]:
        """List patients with basic demographics.

        Args:
            page: Page number (1-indexed).
            limit: Items per page (1-100, default 20).

        Returns:
            A paginated list of :class:`PatientSummary` objects.

        Raises:
            AuthenticationError: If the token is missing or invalid.
            ForbiddenError: If the token does not have admin privileges.
        """
        params: dict[str, Any] = {"page": page, "limit": limit}
        response = self._http.get("/api/patients", params=params)
        _raise_for_status(response)
        data = response.json()
        return PaginatedResponse[PatientSummary].model_validate(data)

    def get(self, patient_id: str) -> PatientDetail:
        """Get a patient's full profile with complete EHR data.

        Args:
            patient_id: The patient's UUID.

        Returns:
            A :class:`PatientDetail` with demographics, summary, and raw EHR arrays.

        Raises:
            AuthenticationError: If the token is missing or invalid.
            ForbiddenError: If the token does not have admin privileges.
            NotFoundError: If the patient does not exist.
        """
        response = self._http.get(f"/api/patients/{patient_id}")
        _raise_for_status(response)
        data = response.json()
        return PatientDetail.model_validate(data["data"])


class ConversationsResource:
    """Methods for the ``/api/conversations`` endpoints."""

    def __init__(self, http: httpx.Client) -> None:
        self._http = http

    def list(
        self,
        *,
        page: int = 1,
        limit: int = 20,
        patient_id: str | None = None,
        task_type: TaskType | None = None,
    ) -> PaginatedResponse[ConversationSummary]:
        """List conversations with optional filtering.

        Args:
            page: Page number (1-indexed).
            limit: Items per page (1-100, default 20).
            patient_id: Filter by patient UUID.
            task_type: Filter by task type (``"diagnosis"``, ``"treatment"``, or ``"event"``).

        Returns:
            A paginated list of :class:`ConversationSummary` objects.
        """
        params: dict[str, Any] = {"page": page, "limit": limit}
        if patient_id is not None:
            params["patientId"] = patient_id
        if task_type is not None:
            params["taskType"] = task_type

        response = self._http.get("/api/conversations", params=params)
        _raise_for_status(response)
        data = response.json()
        return PaginatedResponse[ConversationSummary].model_validate(data)

    def create(
        self,
        *,
        patient_id: str,
        task_type: TaskType,
        metadata: str | None = None,
    ) -> CreatedConversation:
        """Start a new conversation with a simulated patient.

        Args:
            patient_id: The UUID of the patient to converse with.
            task_type: The clinical task type (``"diagnosis"``, ``"treatment"``, or ``"event"``).
            metadata: Optional JSON metadata string.

        Returns:
            A :class:`CreatedConversation` with the new conversation's ID and details.

        Raises:
            ValidationError: If the request body is invalid.
            NotFoundError: If the patient does not exist.
        """
        body: dict[str, Any] = {
            "patientId": patient_id,
            "taskType": task_type,
        }
        if metadata is not None:
            body["metadata"] = metadata

        response = self._http.post("/api/conversations", json=body)
        _raise_for_status(response)
        data = response.json()
        return CreatedConversation.model_validate(data["data"])

    def get(self, conversation_id: str) -> ConversationWithMessages:
        """Retrieve a conversation with its full message history.

        Args:
            conversation_id: The conversation's UUID.

        Returns:
            A :class:`ConversationWithMessages` including all messages.

        Raises:
            NotFoundError: If the conversation does not exist.
        """
        response = self._http.get(f"/api/conversations/{conversation_id}")
        _raise_for_status(response)
        data = response.json()
        return ConversationWithMessages.model_validate(data["data"])

    def send_message(self, conversation_id: str, *, content: str) -> AssistantMessage:
        """Send a message to the simulated patient and receive a response.

        The user message and the agent's response are both persisted on the server.
        This call may take up to 60 seconds as the LLM generates a response.

        Args:
            conversation_id: The conversation's UUID.
            content: The message text (1-4096 characters).

        Returns:
            An :class:`AssistantMessage` with the simulated patient's reply.

        Raises:
            ValidationError: If the message content is invalid.
            NotFoundError: If the conversation does not exist.
        """
        response = self._http.post(
            f"/api/conversations/{conversation_id}/messages",
            json={"content": content},
        )
        _raise_for_status(response)
        data = response.json()
        return AssistantMessage.model_validate(data["data"])


# ---------------------------------------------------------------------------
# Main client
# ---------------------------------------------------------------------------


class VirtualClinic:
    """Synchronous client for the Virtual Clinic REST API.

    Args:
        base_url: The API's base URL (e.g. ``"https://virtual-clinic-api.vercel.app"``).
        token: A JWT bearer token provided by the workshop organizers.
        timeout: Request timeout in seconds. Defaults to 60s to accommodate
            LLM response generation.

    Usage::

        from virtual_clinic import VirtualClinic

        client = VirtualClinic(
            base_url="https://virtual-clinic-api.vercel.app",
            token="eyJhbGciOiJIUzI1NiIs...",
        )

        # Check API health
        health = client.health()
        print(health.status, health.database)

        # List patients (admin only)
        result = client.patients.list(page=1, limit=10)
        for p in result.data:
            print(f"{p.first} {p.last} ({p.gender}, born {p.birth_date})")

        # Start a conversation and interview the patient
        convo = client.conversations.create(
            patient_id=result.data[0].id,
            task_type="diagnosis",
        )
        reply = client.conversations.send_message(
            convo.id,
            content="Hello, what brings you in today?",
        )
        print(reply.content)

        # Always close the client when done
        client.close()

    The client can also be used as a context manager::

        with VirtualClinic(base_url="...", token="...") as client:
            health = client.health()
    """

    def __init__(
        self,
        *,
        base_url: str = DEFAULT_BASE_URL,
        token: str,
        timeout: float = DEFAULT_TIMEOUT,
    ) -> None:
        self._http = httpx.Client(
            base_url=base_url,
            headers={
                "Authorization": f"Bearer {token}",
                "User-Agent": USER_AGENT,
            },
            timeout=timeout,
        )
        self.patients = PatientsResource(self._http)
        """Access patient endpoints (admin only). See :class:`PatientsResource`."""

        self.conversations = ConversationsResource(self._http)
        """Access conversation endpoints. See :class:`ConversationsResource`."""

    def health(self) -> HealthStatus:
        """Check API health and database connectivity.

        This endpoint is public and does not require authentication.

        Returns:
            A :class:`HealthStatus` with service status and database connectivity info.
        """
        try:
            response = self._http.get("/api/health")
        except httpx.ConnectError as exc:
            raise ConnectionError(str(exc)) from exc

        _raise_for_status(response)
        return HealthStatus.model_validate(response.json())

    def close(self) -> None:
        """Close the underlying HTTP connection pool.

        It is good practice to call this when you are done using the client,
        or use the client as a context manager instead.
        """
        self._http.close()

    def __enter__(self) -> VirtualClinic:
        return self

    def __exit__(self, *args: Any) -> None:
        self.close()

    def __repr__(self) -> str:
        return f"VirtualClinic(base_url={self._http.base_url!r})"
