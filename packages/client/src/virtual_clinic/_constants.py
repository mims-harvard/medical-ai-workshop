"""Default constants for the Virtual Clinic client."""

DEFAULT_TIMEOUT: float = 60.0
"""Default request timeout in seconds (matches the API's 60s max for LLM responses)."""

DEFAULT_BASE_URL: str = "https://virtual-clinic-api.vercel.app"
"""Default API base URL for the hosted Virtual Clinic API."""

USER_AGENT: str = "virtual-clinic-python/0.1.0"
"""User-Agent header sent with every request."""
