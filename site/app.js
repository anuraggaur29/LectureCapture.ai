// ========== THEME ==========
function toggleTheme() {
  const html = document.documentElement;
  const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
  html.dataset.theme = next;
  localStorage.setItem('theme', next);
  document.querySelector('.theme-toggle').textContent = next === 'dark' ? '☀️' : '🌙';
}
(function () {
  const t = localStorage.getItem('theme') || 'light';
  document.documentElement.dataset.theme = t;
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
})();

// ========== INDEXEDDB ==========
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('LectureCaptureDB', 1);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('lectures')) {
        const store = db.createObjectStore('lectures', { keyPath: 'id', autoIncrement: true });
        store.createIndex('created_at', 'created_at');
      }
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = e => reject(e.target.error);
  });
}

async function saveLecture(data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('lectures', 'readwrite');
    const store = tx.objectStore('lectures');
    const req = store.add({ ...data, created_at: new Date().toISOString() });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ========== PROMPTS ==========
const CLEAN_PROMPT = "You are cleaning a lecture transcript.\n" +
  "Rules:\n" +
  "- Remove filler words (um, okay, guys, listen)\n" +
  "- Fix grammar\n" +
  "- Merge broken sentences\n" +
  "- Keep all academic meaning\n" +
  "- DO NOT summarize\n" +
  "- DO NOT add new information\n" +
  "Return only cleaned transcript.";

const LECTURE_PROMPT = "You are LectureCapture Web Engine operating in Transcript-Bound Mode.\n" +
  "You reconstruct lecture notes strictly from transcript.\n\n" +
  "Allowed: Rephrase, Organize, Clarify sentences\n" +
  "Forbidden: Add outside knowledge, Add textbook content, Add missing formulas, Add your own examples\n\n" +
  "If unclear: write 'Not clearly explained in lecture.'\n" +
  "If incomplete: write 'Definition incomplete in lecture.'\n" +
  "Never guess.\n\n" +
  "FORMATTING RULES:\n" +
  "- Use markdown tables wherever comparisons, properties, lists of items, or structured data appear.\n" +
  "- Use **bold** for key terms, *italics* for emphasis.\n" +
  "- Use bullet points for lists, numbered lists for steps/sequences.\n" +
  "- Add a comparison table if 2+ things are compared.\n" +
  "- Make every section visually scannable — no walls of text.\n" +
  "- DO NOT use mermaid diagrams. Use tables and nested bullet points instead.\n\n" +
  "OUTPUT FORMAT:\n\n" +
  "# 📘 <Course Name>\n" +
  "## 🗓 Lecture Date: " + new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + "\n" +
  "## 🎯 Topic: <Detected Main Topic>\n\n---\n\n" +
  "## 1️⃣ Core Concepts\n(Use a table: | Concept | Description |)\n\n" +
  "## 2️⃣ Definitions\n(Use a table: | Term | Definition |)\n\n" +
  "## 3️⃣ Detailed Explanation\n(Use paragraphs with bold key terms. Use numbered steps for processes.)\n\n" +
  "## 4️⃣ Examples Discussed\n(Use numbered list or table with Example | Explanation columns)\n\n" +
  "## 5️⃣ Comparisons (if applicable)\n(Use table: | Feature | Option A | Option B |)\n\n" +
  "## 6️⃣ Important / Exam Signals\n(Use ⚠️ bullets for things professor emphasized)\n\n" +
  "## 7️⃣ Quick Revision Flashcards\n(Use table: | Question | Answer |)\n\n" +
  "## 8️⃣ Formulas & Equations\n" +
  "(List ALL formulas, equations, syntax rules, or formal expressions mentioned or related to concepts in the lecture.\n" +
  "Use a table: | Formula / Expression | Meaning / When to Use |\n" +
  "If no formulas apply, write 'No formulas discussed in this lecture.')\n\n" +
  "## 9️⃣ Unclear Areas\n(List anything not clearly explained)";

// ========== UPLOAD LOGIC ==========
(function () {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('audio');
  const fileInfo = document.getElementById('file-info');
  const fileName = document.getElementById('file-name');
  const fileSize = document.getElementById('file-size');
  const removeFile = document.getElementById('remove-file');
  const btnSubmit = document.getElementById('btn-submit');
  const btnText = document.getElementById('btn-text');
  const progressSection = document.getElementById('progress-section');
  const progressBar = document.getElementById('progress-bar');
  const status = document.getElementById('status');

  if (!dropZone) return; // Not on upload page

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  function showFile(file) {
    fileName.textContent = file.name;
    fileSize.textContent = formatSize(file.size);
    fileInfo.classList.add('show');
    btnSubmit.disabled = false;
  }

  function clearFile() {
    fileInput.value = '';
    fileInfo.classList.remove('show');
    btnSubmit.disabled = true;
  }

  // Drag & drop
  dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      showFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) showFile(fileInput.files[0]);
  });

  removeFile.addEventListener('click', clearFile);

  function setStep(n) {
    for (let i = 1; i <= 3; i++) {
      const el = document.getElementById('step-' + i);
      el.classList.remove('active', 'done');
      if (i < n) el.classList.add('done');
      if (i === n) el.classList.add('active');
    }
    progressBar.style.width = ((n - 1) / 3 * 100) + '%';
  }

  btnSubmit.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) return;

    btnSubmit.disabled = true;
    btnText.innerHTML = '<span class="spinner"></span> Processing…';
    progressSection.classList.add('show');
    status.textContent = '';
    status.className = 'status-message';

    try {
      // Step 1: Transcribe
      setStep(1);
      const result = await puter.ai.speech2txt(file, { model: 'whisper-1' });
      const raw = result.text || result;

      // Step 2: Clean
      setStep(2);
      const cleanResp = await puter.ai.chat(
        CLEAN_PROMPT + "\n\n---\n\n" + raw,
        { model: 'gemini-2.0-flash' }
      );
      const cleaned = cleanResp.message?.content || cleanResp;

      // Step 3: Generate notes
      setStep(3);
      const notesResp = await puter.ai.chat(
        LECTURE_PROMPT + "\n\nFILENAME: " + file.name + "\n\n---\n\nTRANSCRIPT:\n" + cleaned,
        { model: 'gemini-2.0-flash' }
      );
      const notes = notesResp.message?.content || notesResp;

      // Save to IndexedDB
      progressBar.style.width = '100%';
      await saveLecture({ filename: file.name, transcript: cleaned, notes });

      status.textContent = '✅ Notes generated successfully!';
      status.className = 'status-message success';

      setTimeout(() => { window.location.href = 'history.html'; }, 1000);

    } catch (err) {
      status.textContent = '❌ ' + err.message;
      status.className = 'status-message error';
    } finally {
      btnSubmit.disabled = false;
      btnText.textContent = 'Upload & Process';
    }
  });
})();
