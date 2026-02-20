import openai, os
from prompts import CLEAN_TRANSCRIPT_PROMPT, LECTURE_CAPTURE_PROMPT

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))


def transcribe_audio(path: str) -> str:
    with open(path, "rb") as f:
        return client.audio.transcriptions.create(model="whisper-1", file=f).text


def _chat(system: str, user: str) -> str:
    return client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        temperature=0.3,
    ).choices[0].message.content


def clean_transcript(raw: str) -> str:
    return _chat(CLEAN_TRANSCRIPT_PROMPT, raw)


def generate_notes(cleaned: str) -> str:
    return _chat(LECTURE_CAPTURE_PROMPT, cleaned)
