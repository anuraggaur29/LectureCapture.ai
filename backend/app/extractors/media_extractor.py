import os
import tempfile
import asyncio
from app.extractors.base import BaseExtractor
from app.core.config import settings

class MediaExtractor(BaseExtractor):
    async def extract_text(self, file_bytes: bytes, filename: str) -> str:
        # Determine file extension
        ext = os.path.splitext(filename)[1].lower() or ".mp3"
        
        # Save temporary file for transcription SDKs
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name

        try:
            # 1. Try OpenAI Whisper if OPENAI_API_KEY is available
            if settings.OPENAI_API_KEY:
                from openai import AsyncOpenAI
                client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
                with open(tmp_path, "rb") as audio_file:
                    transcript = await client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio_file
                    )
                if transcript.text:
                    return transcript.text.strip()

            # 2. Try Gemini audio transcription if GEMINI_API_KEY is available
            if settings.GEMINI_API_KEY:
                from google import genai
                client = genai.Client(api_key=settings.GEMINI_API_KEY)
                uploaded = client.files.upload(file=tmp_path)
                response = client.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=[uploaded, "Transcribe this lecture recording completely into verbatim text. Return only the raw transcript text."]
                )
                if response.text:
                    return response.text.strip()

            # If no transcription API keys are set, raise an informative error
            raise ValueError(
                "Audio/Video transcription requires an API key (OPENAI_API_KEY for Whisper or GEMINI_API_KEY for Gemini). "
                "Please configure an API key in backend/.env."
            )
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
