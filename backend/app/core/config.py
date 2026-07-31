import os
from dotenv import load_dotenv

# Load .env file from root backend folder if present
load_dotenv()

class Settings:
    PROJECT_NAME: str = "LectureCapture AI v2 Backend"
    VERSION: str = "2.0.0"
    MISTRAL_API_KEY: str = os.getenv("MISTRAL_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "mistral")

settings = Settings()
