import os
import logging
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.extractors.pdf_extractor import PDFExtractor
from app.extractors.media_extractor import MediaExtractor
from app.services.ai.ai_service import ai_service
from app.schemas.study_sheet import StudySheetResponse
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["process"])

# 100MB max upload size limit for MVP
MAX_FILE_SIZE = 100 * 1024 * 1024

class ProcessResponse(BaseModel):
    success: bool
    provider_used: str
    data: StudySheetResponse

@router.post("/process", response_model=ProcessResponse)
async def process_file(file: UploadFile = File(...)):
    filename = file.filename or "uploaded_file"
    ext = os.path.splitext(filename)[1].lower()
    
    logger.info(f"Processing uploaded file: '{filename}', content-type: '{file.content_type}'")
    
    try:
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        if len(file_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File size exceeds the 100MB limit. Current size: {len(file_bytes) / (1024*1024):.1f}MB."
            )

        # 1. Select text extractor based on file extension / content-type
        if ext == ".pdf" or file.content_type == "application/pdf":
            extractor = PDFExtractor()
        elif ext in [".mp3", ".wav", ".m4a", ".ogg", ".mp4", ".webm"] or (file.content_type and ("audio" in file.content_type or "video" in file.content_type)):
            extractor = MediaExtractor()
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file format '{ext}'. Supported inputs are PDF (.pdf), Audio (.mp3, .wav, .m4a, .ogg) and Video (.mp4, .webm)."
            )

        extracted_text = await extractor.extract_text(file_bytes, filename)
        if not extracted_text or len(extracted_text.strip()) < 10:
            raise HTTPException(status_code=400, detail="Could not extract readable text content from the file.")

        # 2. AI Processing via AIService (Mistral AI Provider)
        study_sheet, provider_used = await ai_service.generate_study_sheet(extracted_text)

        return ProcessResponse(
            success=True,
            provider_used=provider_used,
            data=study_sheet
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing file '{filename}': {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Processing error: {str(e)}"
        )
