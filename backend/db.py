import sqlite3, os

DB_PATH = os.path.join(os.path.dirname(__file__), "notes.db")

conn = sqlite3.connect(DB_PATH, check_same_thread=False)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS lectures(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    transcript TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")
conn.commit()
