"""Exception hierarchy for the Virtual Clinic client.

All exceptions inherit from :class:`VirtualClinicError` so callers can catch
the base class for blanket error handling, or catch specific subclasses for
fine-grained control.
"""

from __future__ import annotations

from typing import Any


class VirtualClinicError(Exception):
    """Base exception for all Virtual Clinic client errors."""

    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message)


class APIError(VirtualClinicError):
    """An error response was returned by the API.

    Attributes:
        status_code: The HTTP status code.
        message: Human-readable error message from the API.
        details: Optional additional error details (e.g. validation errors).
        body: The raw response body as a dict, if available.
    """

    def __init__(
        self,
        status_code: int,
        message: str,
        details: dict[str, Any] | None = None,
        body: dict[str, Any] | None = None,
    ) -> None:
        self.status_code = status_code
        self.details = details
        self.body = body
        super().__init__(f"[{status_code}] {message}")


class AuthenticationError(APIError):
    """401 Unauthorized — missing or invalid Bearer token."""

    def __init__(self, message: str = "Unauthorized", **kwargs: Any) -> None:
        super().__init__(status_code=401, message=message, **kwargs)


class ForbiddenError(APIError):
    """403 Forbidden — insufficient permissions (e.g. user token on admin-only endpoint)."""

    def __init__(self, message: str = "Forbidden", **kwargs: Any) -> None:
        super().__init__(status_code=403, message=message, **kwargs)


class NotFoundError(APIError):
    """404 Not Found — the requested resource does not exist."""

    def __init__(self, message: str = "Not found", **kwargs: Any) -> None:
        super().__init__(status_code=404, message=message, **kwargs)


class ValidationError(APIError):
    """400 Bad Request — request body or parameters failed validation."""

    def __init__(self, message: str = "Validation error", **kwargs: Any) -> None:
        super().__init__(status_code=400, message=message, **kwargs)


class ServerError(APIError):
    """5xx Server Error — an unexpected error occurred on the API server."""

    def __init__(
        self,
        status_code: int = 500,
        message: str = "Internal server error",
        **kwargs: Any,
    ) -> None:
        super().__init__(status_code=status_code, message=message, **kwargs)


class ConnectionError(VirtualClinicError):
    """Failed to connect to the API server (network error, DNS failure, timeout, etc.)."""

    def __init__(
        self, message: str = "Failed to connect to the Virtual Clinic API"
    ) -> None:
        super().__init__(message)
