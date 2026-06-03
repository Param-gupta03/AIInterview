from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.interview import router as interview_router # NEW IMPORT
from app.core.config import settings

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=[
        "AI-Text-Response",
        "Interview-Feedback",
        "Interview-Score",
        "Interview-Transcript",
    ],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(interview_router, prefix="/interview", tags=["interview"]) # NEW ROUTER

@app.get("/")
async def health_check() -> dict[str, str]:
    return {"message": "API running", "environment": settings.app_env}
