from abc import ABC, abstractmethod
from app.schemas.study_sheet import StudySheetResponse

class BaseAIProvider(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        """Name of the LLM provider."""
        pass

    @abstractmethod
    async def generate_study_sheet(self, text_content: str) -> StudySheetResponse:
        """Generate structured StudySheetResponse from text content."""
        pass
