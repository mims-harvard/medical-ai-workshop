"""Environment configuration for Virtual Clinic examples.

Settings are loaded from environment variables prefixed with ``VIRTUAL_CLINIC_``
and from a ``.env`` file in the current working directory.

Usage::

    from settings import settings

    print(settings.base_url)
    print(settings.token)
"""

from __future__ import annotations

from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Virtual Clinic example configuration.

    All values can be set via environment variables prefixed with
    ``VIRTUAL_CLINIC_`` or in a ``.env`` file.

    Attributes:
        token: JWT bearer token provided by workshop organizers.
        base_url: API base URL.
        patient_id: Optional patient UUID to use. If not set, the first
            patient from the list endpoint is used.
        task_type: Clinical task type for the conversation.
    """

    model_config = SettingsConfigDict(
        env_prefix="VIRTUAL_CLINIC_",
        env_file=".env",
        env_file_encoding="utf-8",
    )

    token: str
    base_url: str = "https://virtual-clinic-api.vercel.app"
    patient_id: str | None = None
    task_type: Literal["diagnosis", "treatment", "event"] = "diagnosis"


settings = Settings()
