from abc import ABC, abstractmethod

class BaseExtractor(ABC):
    @abstractmethod
    async def extract_text(self, file_bytes: bytes, filename: str) -> str:
        """Extract plain text from uploaded file bytes."""
        pass
