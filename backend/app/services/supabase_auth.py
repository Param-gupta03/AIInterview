import base64
import hashlib
import hmac
import json
import time
from typing import Any

import httpx
from fastapi import HTTPException, status

from app.core.config import settings
from app.schemas.auth_schema import AuthResponse, UserResponse


class SupabaseAuthService:
    def __init__(self) -> None:
        self.auth_url = f"{settings.supabase_url.rstrip('/')}/auth/v1"
        self.headers = {
            "apikey": settings.supabase_anon_key,
            "Content-Type": "application/json",
        }
        self.expires_in = settings.auth_token_hours * 60 * 60

    @staticmethod
    def _b64encode(value: bytes) -> str:
        return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")

    @staticmethod
    def _b64decode(value: str) -> bytes:
        padding = "=" * (-len(value) % 4)
        return base64.urlsafe_b64decode(f"{value}{padding}")

    @property
    def _token_secret(self) -> bytes:
        secret = settings.auth_token_secret or settings.supabase_anon_key
        if not secret:
            secret = "development-auth-token-secret"
        return secret.encode("utf-8")

    def _ensure_configured(self) -> None:
        if (
            not settings.supabase_url
            or not settings.supabase_anon_key
            or "your-project" in settings.supabase_url
            or settings.supabase_anon_key == "your-supabase-anon-key"
        ):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Supabase auth is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.",
            )

    @staticmethod
    def _error_detail(payload: dict[str, Any]) -> str:
        return str(
            payload.get("msg")
            or payload.get("message")
            or payload.get("error_description")
            or payload.get("error")
            or "Authentication failed"
        )

    @staticmethod
    def _user_from_payload(payload: dict[str, Any]) -> UserResponse:
        user = payload.get("user") or payload
        metadata = user.get("user_metadata") or {}
        return UserResponse(
            id=str(user.get("id", "")),
            email=str(user.get("email", "")),
            full_name=str(metadata.get("full_name") or metadata.get("name") or ""),
        )

    def _create_access_token(self, user: UserResponse) -> tuple[str, int]:
        now = int(time.time())
        expires_at = now + self.expires_in
        header = {"alg": "HS256", "typ": "JWT"}
        payload = {
            "sub": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "iat": now,
            "exp": expires_at,
        }
        header_part = self._b64encode(
            json.dumps(header, separators=(",", ":")).encode("utf-8")
        )
        payload_part = self._b64encode(
            json.dumps(payload, separators=(",", ":")).encode("utf-8")
        )
        signed_part = f"{header_part}.{payload_part}".encode("ascii")
        signature = hmac.new(self._token_secret, signed_part, hashlib.sha256).digest()
        return f"{header_part}.{payload_part}.{self._b64encode(signature)}", expires_at

    def _verify_access_token(self, access_token: str) -> UserResponse:
        try:
            header_part, payload_part, signature_part = access_token.split(".")
            signed_part = f"{header_part}.{payload_part}".encode("ascii")
            expected_signature = hmac.new(
                self._token_secret,
                signed_part,
                hashlib.sha256,
            ).digest()
            actual_signature = self._b64decode(signature_part)
            if not hmac.compare_digest(expected_signature, actual_signature):
                raise ValueError("Invalid signature")

            payload = json.loads(self._b64decode(payload_part))
            if int(payload.get("exp", 0)) <= int(time.time()):
                raise ValueError("Token expired")

            return UserResponse(
                id=str(payload.get("sub", "")),
                email=str(payload.get("email", "")),
                full_name=str(payload.get("full_name") or ""),
            )
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired authentication token.",
            ) from exc

    def _auth_response(self, payload: dict[str, Any]) -> AuthResponse:
        user = self._user_from_payload(payload)
        access_token, expires_at = self._create_access_token(user)
        return AuthResponse(
            access_token=access_token,
            refresh_token=payload.get("refresh_token"),
            expires_in=self.expires_in,
            expires_at=expires_at,
            user=user,
        )

    async def signup(self, email: str, password: str, full_name: str) -> AuthResponse:
        self._ensure_configured()
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                response = await client.post(
                    f"{self.auth_url}/signup",
                    headers=self.headers,
                    json={
                        "email": email,
                        "password": password,
                        "data": {"full_name": full_name},
                    },
                )
        except httpx.HTTPError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Could not reach Supabase auth: {exc}",
            ) from exc

        payload = response.json()
        if response.status_code >= 400:
            raise HTTPException(response.status_code, self._error_detail(payload))
        return self._auth_response(payload)

    async def login(self, email: str, password: str) -> AuthResponse:
        self._ensure_configured()
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                response = await client.post(
                    f"{self.auth_url}/token?grant_type=password",
                    headers=self.headers,
                    json={"email": email, "password": password},
                )
        except httpx.HTTPError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Could not reach Supabase auth: {exc}",
            ) from exc

        payload = response.json()
        if response.status_code >= 400:
            raise HTTPException(response.status_code, self._error_detail(payload))
        return self._auth_response(payload)

    async def me(self, access_token: str) -> UserResponse:
        return self._verify_access_token(access_token)


supabase_auth_service = SupabaseAuthService()
