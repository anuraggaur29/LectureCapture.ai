import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from db import conn, cur

app = FastAPI()

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend")


class LectureSave(BaseModel):
    filename: str
    transcript: str
    notes: str


# --- API ---

@app.post("/save")
def save_lecture(data: LectureSave):
    cur.execute(
        "INSERT INTO lectures(filename, transcript, notes) VALUES(?,?,?)",
        (data.filename, data.transcript, data.notes),
    )
    conn.commit()
    return {"status": "done", "id": cur.lastrowid}


@app.get("/lectures")
def list_lectures():
    rows = cur.execute(
        "SELECT id, filename, created_at FROM lectures ORDER BY created_at DESC"
    ).fetchall()
    return [dict(r) for r in rows]


@app.get("/lectures/{lecture_id}")
def get_lecture(lecture_id: int):
    row = cur.execute(
        "SELECT * FROM lectures WHERE id=?", (lecture_id,)
    ).fetchone()
    return dict(row) if row else {"error": "not found"}


# --- Serve frontend ---

@app.get("/")
def index():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))


@app.get("/history")
def history():
    return FileResponse(os.path.join(FRONTEND_DIR, "history.html"))


app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")
