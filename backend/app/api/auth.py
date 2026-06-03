from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.schemas.auth_schema import AuthResponse, LoginRequest, SignupRequest, UserResponse
from app.services.supabase_auth import supabase_auth_service

router = APIRouter()
bearer_scheme = HTTPBearer()


@router.post("/signup", response_model=AuthResponse)
async def signup(payload: SignupRequest) -> AuthResponse:
    return await supabase_auth_service.signup(
        email=payload.email,
        password=payload.password,
        full_name=payload.full_name,
    )


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest) -> AuthResponse:
    return await supabase_auth_service.login(
        email=payload.email,
        password=payload.password,
    )


@router.get("/me", response_model=UserResponse)
async def me(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> UserResponse:
    return await supabase_auth_service.me(credentials.credentials)
