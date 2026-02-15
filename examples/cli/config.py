"""Configuration loaded from environment variables and ``.env`` file."""

from __future__ import annotations

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    """Virtual Clinic example configuration."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

    virtual_clinic_token: str
    virtual_clinic_base_url: str = "https://virtual-clinic-api.vercel.app"

    azure_openai_endpoint: str = Field(validation_alias="AZURE_OPENAI_ENDPOINT")
    azure_openai_api_key: str = Field(validation_alias="AZURE_OPENAI_API_KEY")
    azure_openai_deployment: str = Field(
        default="gpt5",
        validation_alias="AZURE_OPENAI_DEPLOYMENT",
    )
    azure_openai_api_version: str = Field(
        default="2024-08-01-preview",
        validation_alias="AZURE_OPENAI_API_VERSION",
    )
