from pathlib import Path

import edge_tts
from faster_whisper import WhisperModel
from fastapi import HTTPException, status

from app.core.config import settings

whisper_model = WhisperModel(settings.whisper_model, device="cpu", compute_type="int8")


def transcribe_audio(input_path: str) -> str:
    segments, _ = whisper_model.transcribe(input_path, beam_size=5)
    text = "".join(segment.text for segment in segments).strip()
    if not text:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Could not understand audio. Please try again.")
    return text


async def text_to_speech(text: str, output_path: str) -> None:
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    communicate = edge_tts.Communicate(text, "en-US-BrianNeural")
    await communicate.save(output_path)
