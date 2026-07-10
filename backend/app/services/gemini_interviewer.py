import json
import uuid

from fastapi import HTTPException, status

from app.schemas.interview_schema import EvaluationResponse, InterviewDifficulty, InterviewDomain
from app.services.gemini_http import generate_json
from app.services.local_interviewer import evaluate_interview_locally, generate_local_questions


class GeminiInterviewer:
    def _questions_prompt(self, domain: InterviewDomain, difficulty: InterviewDifficulty) -> str:
        # Add a random seed to ensure uniqueness even for same domain/difficulty
        session_seed = str(uuid.uuid4())[:8]
        return (
            "Return only JSON with key 'questions' as an array of exactly 10 unique, "
            "diverse, and high-quality technical interview questions. "
            f"Domain: {domain.value}. Difficulty Level: {difficulty.value}. "
            f"Session Seed: {session_seed}. "
            "Ensure the questions cover different aspects of the domain (e.g., theory, practical applications, architecture, problem-solving). "
            "CRITICAL: Do not repeat common questions. Provide a fresh mix of standard and creative ones."
        )

    def _evaluate_prompt(self, domain: InterviewDomain, difficulty: InterviewDifficulty, answers: str) -> str:
        return (
            "Return only JSON with keys feedback and score. Score is 0 to 100. "
            "Judge correctness, depth, clarity, and skipped questions. "
            f"Domain: {domain.value}. Level: {difficulty.value}. Interview answers: {answers}"
        )

    async def generate_questions(self, domain: InterviewDomain, difficulty: InterviewDifficulty) -> list[str]:
        try:
            payload = await generate_json(self._questions_prompt(domain, difficulty), 0.9)
            text = payload["candidates"][0]["content"]["parts"][0]["text"]
            questions = json.loads(text).get("questions", [])
            if len(questions) != 10:
                raise ValueError("Expected 10 questions.")
            return [str(question) for question in questions]
        except Exception as exc:
            # Fallback to local questions for any error (API key error, timeout, rate limit, parse error, etc.)
            return generate_local_questions(domain, difficulty)

    async def evaluate_interview(
        self,
        domain: InterviewDomain,
        difficulty: InterviewDifficulty,
        answers: str,
        answered_count: int,
        skipped_count: int,
    ) -> EvaluationResponse:
        try:
            payload = await generate_json(self._evaluate_prompt(domain, difficulty, answers), 0.4)
            text = payload["candidates"][0]["content"]["parts"][0]["text"]
            result = EvaluationResponse.model_validate(json.loads(text))
            return result.model_copy(update={"evaluator": "Gemini"})
        except Exception as exc:
            # Fallback to local evaluation for any error
            feedback, score = evaluate_interview_locally(answers, answered_count, skipped_count)
            return EvaluationResponse(feedback=feedback, score=score, evaluator="Local fallback")


gemini_interviewer = GeminiInterviewer()
