import io
from pypdf import PdfReader
from app.extractors.base import BaseExtractor

class PDFExtractor(BaseExtractor):
    async def extract_text(self, file_bytes: bytes, filename: str) -> str:
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            text_parts = []
            for i, page in enumerate(reader.pages):
                extracted = page.extract_text()
                if extracted:
                    text_parts.append(f"--- Page {i+1} ---\n" + extracted)
            
            full_text = "\n\n".join(text_parts).strip()
            if not full_text:
                raise ValueError("No readable text found in PDF.")
            return full_text
        except Exception as e:
            raise ValueError(f"Failed to extract text from PDF file '{filename}': {str(e)}")
