import os
from dotenv import load_dotenv

# Load .env file from root backend folder if present
load_dotenv()
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
env_path = os.path.join(base_dir, ".env")
if os.path.exists(env_path):
    load_dotenv(env_path)

class Settings:
    PROJECT_NAME: str = "LectureCapture AI v2 Backend"
    VERSION: str = "2.0.0"

    @property
    def MISTRAL_API_KEY(self) -> str:
        return os.getenv("MISTRAL_API_KEY", "")

    @property
    def GEMINI_API_KEY(self) -> str:
        return os.getenv("GEMINI_API_KEY", "")

    @property
    def OPENAI_API_KEY(self) -> str:
        return os.getenv("OPENAI_API_KEY", "")

    @property
    def AI_PROVIDER(self) -> str:
        return os.getenv("AI_PROVIDER", "mistral")

settings = Settings()
