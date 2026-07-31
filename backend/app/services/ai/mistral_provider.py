import json
import logging
import httpx
from app.services.ai.base_provider import BaseAIProvider
from app.prompts.study_sheet_prompt import STUDY_SHEET_SYSTEM_PROMPT
from app.schemas.study_sheet import StudySheetResponse
from app.core.config import settings

logger = logging.getLogger(__name__)

# Max input length (~100,000 chars ≈ 25,000 tokens) to prevent context limit errors
MAX_INPUT_CHARS = 100000

class MistralAIProvider(BaseAIProvider):
    def __init__(self):
        self.api_key = settings.MISTRAL_API_KEY
        self.model = "mistral-small-latest"

    @property
    def name(self) -> str:
        return "Mistral AI"

    async def generate_study_sheet(self, text_content: str) -> StudySheetResponse:
        if not self.api_key:
            raise RuntimeError("Mistral API key (MISTRAL_API_KEY) is missing.")

        # Truncate overly massive transcripts/documents to fit comfortably in token limits
        if len(text_content) > MAX_INPUT_CHARS:
            logger.info(f"Truncating long text content from {len(text_content)} to {MAX_INPUT_CHARS} characters for high-yield note generation.")
            text_content = text_content[:MAX_INPUT_CHARS] + "\n\n[... Note: Extended material truncated to maintain concise 1-page study sheet focus ...]"

        url = "https://api.mistral.ai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        
        payload = {
            "model": self.model,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": STUDY_SHEET_SYSTEM_PROMPT},
                {"role": "user", "content": f"Create a structured 1-to-2 page study sheet strictly in JSON format from the following lecture content:\n\n{text_content}"}
            ],
            "temperature": 0.2,
            "max_tokens": 2500,
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            if response.status_code != 200:
                raise RuntimeError(f"Mistral API error [{response.status_code}]: {response.text}")
            
            data = response.json()
            raw_content = data["choices"][0]["message"]["content"]
            
            parsed_json = json.loads(raw_content)
            return StudySheetResponse.model_validate(parsed_json)
