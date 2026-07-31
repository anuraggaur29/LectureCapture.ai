# 📘 LectureCapture AI v2 — 1-Page Study Sheet Generator

> **Turn Video, Audio, & PDF Lectures into Concise 1-Page Study Sheets via Mistral AI.**

LectureCapture AI v2 is a modern, production-grade full-stack AI application engineered to solve transcript bloat. Instead of generating unreadable walls of text, it extracts content from **Video (.mp4, .webm)**, **Audio (.mp3, .wav, .m4a)**, or **PDF (.pdf)** documents and synthesizes a structured, exam-ready 1-to-2 page JSON Study Sheet.

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
    subgraph Frontend [React + Material UI (Vercel Ready)]
        F1[LandingPage.jsx] --> F2[UploadPage.jsx]
        F2 -->|FileDropzone| F3[ProcessingPage.jsx]
        F3 -->|Axios POST /api/process| B1
        F3 -->|Render StudySheetResponse| F4[StudySheetPage.jsx]
    end

    subgraph Backend [FastAPI + Python (Hugging Face Spaces Port 7860)]
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
│   ├── app/
│   │   ├── core/          # Settings & env var configuration
│   │   ├── extractors/    # PDF & Media text extractors (pypdf, Whisper)
│   │   ├── prompts/       # Centralized system prompts (study_sheet_prompt.py)
│   │   ├── routers/       # FastAPI route handlers (/api/process)
│   │   ├── schemas/       # Pydantic JSON schemas (StudySheetResponse)
│   │   └── services/ai/   # Provider abstraction layer (MistralAIProvider, AIService)
│   ├── .env               # Local environment variables
│   ├── Dockerfile         # Hugging Face Spaces deployment container (Port 7860)
│   ├── main.py            # FastAPI entry point
│   └── requirements.txt   # Python dependencies
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI elements (Navbar, FileDropzone)
    │   ├── pages/         # Page views (LandingPage, UploadPage, ProcessingPage, StudySheetPage)
    │   ├── services/      # Axios API service
    │   ├── theme/         # Custom Material UI theme (Indigo/Cyan palette, Outfit/Inter typography)
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

# Create virtual environment (optional)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server (Port 7860)
uvicorn main:app --host 0.0.0.0 --port 7860 --reload
```

Verify backend health at `http://localhost:7860/health`.

### 2. Frontend Setup
```bash
cd frontend

# Install npm packages
npm install

# Start Vite dev server (Port 3000)
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🚀 Production Deployment Guide

### Backend $\rightarrow$ Hugging Face Spaces
1. Create a new **Docker Space** on [Hugging Face](https://huggingface.co/new-space).
2. Upload the `backend/` directory content.
3. In Space Settings, add Environment Secret:
   - `MISTRAL_API_KEY`: `<YOUR_MISTRAL_KEY>`
   - `AI_PROVIDER`: `mistral`

### Frontend $\rightarrow$ Vercel
1. Connect your repository to [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Add Environment Variable in Vercel:
   - `VITE_BACKEND_URL`: `https://YOUR-HUGGINGFACE-SPACE.hf.space`
4. Deploy!

---

## 🎓 Interview Highlights

When discussing this project in technical interviews:

1. **AI Software Architecture**: *"I decoupled the LLM provider using an abstract interface (`BaseAIProvider`). The application logic communicates exclusively with `AIService`, allowing new models to be added without touching API routes."*
2. **JSON-First Separation**: *"The backend strictly emits JSON (`StudySheetResponse`). It never generates Markdown or HTML. The frontend React app owns presentation, styling, and export mechanics."*
3. **Prompt Engineering**: *"I designed a transcript-bound prompt that forces Mistral AI to synthesize raw transcripts into concise, exam-ready study notes (~600–800 words) while eliminating conversational filler and hallucinated facts."*

---

## 📜 License
MIT License. Created by Anurag.
