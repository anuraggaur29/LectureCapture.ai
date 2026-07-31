import logging
from typing import Tuple
from app.services.ai.base_provider import BaseAIProvider
from app.services.ai.mistral_provider import MistralAIProvider
from app.schemas.study_sheet import StudySheetResponse
from app.core.config import settings

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        # Register Mistral AI as the primary provider
        self.provider: BaseAIProvider = MistralAIProvider()

    async def generate_study_sheet(self, text_content: str) -> Tuple[StudySheetResponse, str]:
        """
        Communicates with the configured AI provider (Mistral AI) to generate a structured StudySheetResponse.
        Returns (StudySheetResponse, provider_name).
        Raises RuntimeError if the AI request fails (no fake fallback data).
        """
        try:
            logger.info(f"Generating Study Sheet using provider: {self.provider.name}")
            result = await self.provider.generate_study_sheet(text_content)
            logger.info(f"Successfully generated Study Sheet with provider: {self.provider.name}")
            return result, self.provider.name
        except Exception as e:
            error_msg = f"AI Provider '{self.provider.name}' failed: {str(e)}"
            logger.error(error_msg)
            raise RuntimeError(error_msg)

ai_service = AIService()
