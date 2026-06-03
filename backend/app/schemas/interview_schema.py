from enum import StrEnum

from pydantic import BaseModel, Field


class InterviewDomain(StrEnum):
    dsa = "DSA"
    full_stack = "FULL STACK DEVELOPER"
    frontend = "FRONTEND DEVELOPER"
    ai_ml = "AI ML ENGINEER"
    data_analyst = "DATA ANALYST"


class InterviewDifficulty(StrEnum):
    beginner = "BEGINNER"
    intermediate = "INTERMEDIATE"
    advanced = "ADVANCED"


class InterviewResult(BaseModel):
    question: str = Field(min_length=1)
    feedback: str = Field(min_length=1)
    score: int = Field(ge=0, le=10)


class QuestionResponse(BaseModel):
    question: str


class QuestionsResponse(BaseModel):
    questions: list[str]


class TranscribeResponse(BaseModel):
    transcript: str


class InterviewAnswer(BaseModel):
    question: str
    answer: str = ""
    skipped: bool = False


class EvaluationRequest(BaseModel):
    domain: InterviewDomain
    difficulty: InterviewDifficulty
    answers: list[InterviewAnswer]


class EvaluationResponse(BaseModel):
    feedback: str
    score: int = Field(ge=0, le=100)
    evaluator: str = "Gemini"
