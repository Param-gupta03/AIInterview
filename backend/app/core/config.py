from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Interview Auth API"
    app_env: str = "development"
    supabase_url: str = ""
    supabase_anon_key: str = ""
    gemini_api_key: str = Field(default="", alias="GEMINI_API_KEY")
    gemini_model: str = Field(default="gemini-2.0-flash", alias="GEMINI_MODEL")
    whisper_model: str = Field(default="base", alias="WHISPER_MODEL")
    auth_token_secret: str = Field(default="", alias="AUTH_TOKEN_SECRET")
    auth_token_hours: int = Field(default=24, alias="AUTH_TOKEN_HOURS")
    allowed_origins_raw: str = Field(
        default="http://localhost:3000,http://127.0.0.1:3000",
        alias="ALLOWED_ORIGINS",
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def allowed_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.allowed_origins_raw.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
