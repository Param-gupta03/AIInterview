from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.schemas.auth_schema import UserResponse
from app.schemas.interview_schema import (
    EvaluationRequest,
    EvaluationResponse,
    InterviewDifficulty,
    InterviewDomain,
    QuestionsResponse,
    TranscribeResponse,
)
from app.services.gemini_interviewer import gemini_interviewer
from app.services.speech_service import transcribe_audio
from app.services.supabase_auth import supabase_auth_service
from app.services.temp_audio import TempAudioPair

router = APIRouter()
bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> UserResponse:
    return await supabase_auth_service.me(credentials.credentials)


@router.post("/questions", response_model=QuestionsResponse)
async def questions_endpoint(
    domain: InterviewDomain = Form(...),
    difficulty: InterviewDifficulty = Form(...),
    current_user: UserResponse = Depends(get_current_user),
) -> QuestionsResponse:
    questions = await gemini_interviewer.generate_questions(domain, difficulty)
    return QuestionsResponse(questions=questions)


@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_endpoint(
    file: UploadFile = File(...),
    current_user: UserResponse = Depends(get_current_user),
) -> TranscribeResponse:
    temp_audio = TempAudioPair()
    try:
        await temp_audio.write_upload(file)
        return TranscribeResponse(transcript=transcribe_audio(temp_audio.input_path))
    finally:
        temp_audio.cleanup()


@router.post("/evaluate", response_model=EvaluationResponse)
async def evaluate_endpoint(
    payload: EvaluationRequest,
    current_user: UserResponse = Depends(get_current_user),
) -> EvaluationResponse:
    answer_text = "\n".join(
        f"Q: {item.question}\nA: {'SKIPPED' if item.skipped else item.answer}"
        for item in payload.answers
    )
    skipped_count = sum(1 for item in payload.answers if item.skipped)
    answered_count = len(payload.answers) - skipped_count
    return await gemini_interviewer.evaluate_interview(
        payload.domain,
        
        payload.difficulty,
        answer_text,
        answered_count,
        skipped_count,
    )
