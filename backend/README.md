# LectureCapture AI v2 — FastAPI Backend

FastAPI backend service for **LectureCapture AI v2 MVP**. Converts Video, Audio, and PDF inputs into structured JSON study sheets using **Mistral AI**.

## 🚀 Key Features

- **Multi-Modal Text Extraction**: Supports PDF (`.pdf`), Audio (`.mp3`, `.wav`, `.m4a`), and Video (`.mp4`, `.webm`).
- **Clean AI Architecture**: Abstract provider pattern (`BaseAIProvider` $\rightarrow$ `MistralAIProvider` $\rightarrow$ `AIService`).
- **JSON-First Output**: Strictly outputs validated Pydantic models (`StudySheetResponse`). No Markdown/HTML generation.
- **Production Ready**: Fully Dockerized for **Hugging Face Spaces** (Port 7860).

## 🛠️ API Architecture

```text
backend/
├── Dockerfile
├── requirements.txt
├── .env
├── main.py
└── app/
    ├── core/
    │   └── config.py
    ├── extractors/
    │   ├── base.py
    │   ├── pdf_extractor.py
    │   └── media_extractor.py
    ├── prompts/
    │   └── study_sheet_prompt.py
    ├── schemas/
    │   └── study_sheet.py
    ├── services/
    │   └── ai/
    │       ├── base_provider.py
    │       ├── mistral_provider.py
    │       └── ai_service.py
    └── routers/
        └── process.py
```

## 🔑 Environment Variables (`.env`)

```env
MISTRAL_API_KEY=<YOUR_MISTRAL_API_KEY>
AI_PROVIDER=mistral
```

## 📦 Local Development

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start Uvicorn server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 7860 --reload
   ```
3. Test health check:
   ```bash
   curl http://localhost:7860/health
   ```

## 🐳 Hugging Face Spaces Deployment

Deploy as a **Docker Space** on Hugging Face:
- **SDK**: Docker
- **Port**: 7860
- **Secret**: Set `MISTRAL_API_KEY` under Space Secrets.
