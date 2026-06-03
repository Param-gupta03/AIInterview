import httpx
from fastapi import HTTPException, status

from app.core.config import settings


def _gemini_error(response: httpx.Response) -> str:
    try:
        payload = response.json()
        return str(payload.get("error", {}).get("message") or response.text)
    except ValueError:
        return response.text


def _status_code(response: httpx.Response) -> int:
    error = _gemini_error(response).lower()
    if "quota" in error or "rate limit" in error:
        return status.HTTP_429_TOO_MANY_REQUESTS
    return response.status_code


async def generate_json(prompt: str, temperature: float) -> dict:
    if not settings.gemini_api_key:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Set GEMINI_API_KEY.")

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.gemini_model}:generateContent"
    )
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseMimeType": "application/json", "temperature": temperature},
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(url, params={"key": settings.gemini_api_key}, json=body)
    except httpx.HTTPError as exc:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, f"Could not reach Gemini: {exc}") from exc

    if response.status_code >= 400:
        raise HTTPException(_status_code(response), _gemini_error(response))
    return response.json()
