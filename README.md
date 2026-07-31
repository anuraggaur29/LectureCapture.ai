# 📘 LectureCapture AI v2 — 1-Page Study Sheet Generator

[![Vercel Deployment](https://img.shields.io/badge/Frontend-Live%20on%20Vercel-000000?style=for-the-badge&logo=vercel)](https://lecturecapture-ai.vercel.app)
[![FastAPI Backend](https://img.shields.io/badge/Backend-FastAPI%20Vercel-009688?style=for-the-badge&logo=fastapi)](https://lecturecapture-ai-backend.vercel.app/health)
[![Mistral AI](https://img.shields.io/badge/AI%20Provider-Mistral%20AI-ff7000?style=for-the-badge)](https://mistral.ai)

> **Turn Video, Audio, & PDF Lectures into Concise 1-Page Study Sheets via Mistral AI.**

LectureCapture AI v2 is a modern, production-grade full-stack AI application engineered to solve transcript bloat. Instead of generating unreadable walls of text, it extracts content from **Video (.mp4, .webm)**, **Audio (.mp3, .wav, .m4a)**, or **PDF (.pdf)** documents and synthesizes a structured, exam-ready 1-to-2 page JSON Study Sheet.

- 🌐 **Live Web App**: [https://lecturecapture-ai.vercel.app](https://lecturecapture-ai.vercel.app)
- ⚡ **Live Backend API**: [https://lecturecapture-ai-backend.vercel.app](https://lecturecapture-ai-backend.vercel.app)

---

## 🌟 Key Features

- **Multi-Input Ingestion**: Ingests Video, Audio, and PDF slide decks seamlessly.
- **Transcript-Bound AI Synthesis**: Powered by **Mistral AI** (`mistral-small-latest`) with strict JSON schema mode.
- **Concise Study Material**: Output is optimized for revision (~600–800 words, max 2 pages) across 10 structured sections:
  1. Title & Subject
  2. Learning Objectives (3-5 core items)
  3. Key Concepts & Descriptions
  4. Academic Definitions
  5. Formulae & Syntax Rules (where applicable)
  6. Examples Discussed
  7. Common Mistakes & Exam Traps
  8. High-Yield Revision Bullets
  9. Executive Summary
- **JSON-First Architecture**: Backend emits validated Pydantic JSON (`StudySheetResponse`). Frontend completely owns Material UI presentation.
- **One-Click Export**: Export Study Sheets directly to PDF or copy as Markdown.

---

## 📐 System Architecture

```mermaid
graph TD
    subgraph Frontend [React + Material UI (Vercel SPA)]
        F1[LandingPage.jsx] --> F2[UploadPage.jsx]
        F2 -->|FileDropzone| F3[ProcessingPage.jsx]
        F3 -->|Axios POST /api/process| B1
        F3 -->|Render StudySheetResponse| F4[StudySheetPage.jsx]
    end

    subgraph Backend [FastAPI + Python (Vercel Serverless)]
        B1[main.py /routers/process.py] --> B2{MIME Check}
        B2 -->|PDF| B3[PDFExtractor / pypdf]
        B2 -->|Audio / Video| B4[MediaExtractor / Whisper]
        B3 & B4 --> B5[AIService / MistralAIProvider]
        B5 -->|POST api.mistral.ai/v1/chat/completions| B6[Mistral AI API]
        B6 -->|Structured JSON| B7[StudySheetResponse Validation]
        B7 -->|Clean JSON Response| F4
    end
```

---

## 📁 Repository Structure

```text
LectureCapture AI/
├── backend/
│   ├── api/               # Vercel serverless entrypoint (index.py)
│   ├── app/
│   │   ├── core/          # Settings & env var configuration
│   │   ├── extractors/    # PDF & Media text extractors (pypdf, Whisper)
│   │   ├── prompts/       # Centralized system prompts (study_sheet_prompt.py)
│   │   ├── routers/       # FastAPI route handlers (/api/process)
│   │   ├── schemas/       # Pydantic JSON schemas (StudySheetResponse)
│   │   └── services/ai/   # Provider abstraction layer (MistralAIProvider, AIService)
│   ├── .env               # Local environment variables
│   ├── Dockerfile         # Docker container setup (Port 7860)
│   ├── main.py            # FastAPI entry point
│   └── requirements.txt   # Python dependencies
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI elements (Navbar, FileDropzone, MuiIcons)
    │   ├── pages/         # Page views (LandingPage, UploadPage, ProcessingPage, StudySheetPage)
    │   ├── services/      # Axios API service
    │   ├── theme/         # Google Material Design 3 Theme
    │   ├── App.jsx        # Step state machine router
    │   └── main.jsx       # React DOM entry point
    ├── package.json       # React + Vite + MUI dependencies
    ├── vercel.json        # Vercel SPA deployment configuration
    └── vite.config.js     # Vite dev server & proxy settings
```

---

## ⚡ Quickstart & Local Setup

### Prerequisites
- Python 3.10+
- Node.js v18+

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 7860 --reload
```
Verify backend health at `http://localhost:7860/health`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🎓 Interview Highlights

When discussing this project in technical interviews:

1. **AI Software Architecture**: *"I decoupled the LLM provider using an abstract interface (`BaseAIProvider`). The application logic communicates exclusively with `AIService`, allowing new models to be added without touching API routes."*
2. **JSON-First Separation**: *"The backend strictly emits JSON (`StudySheetResponse`). It never generates Markdown or HTML. The frontend React app owns presentation, styling, and export mechanics."*
3. **Prompt Engineering**: *"I designed a transcript-bound prompt that forces Mistral AI to synthesize raw transcripts into concise, exam-ready study notes (~600–800 words) while eliminating conversational filler and hallucinated facts."*

---

## 📜 License
MIT License. Created by Anurag Gaur.
