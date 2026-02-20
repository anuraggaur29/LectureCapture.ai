const CLEAN_PROMPT = `You are cleaning a lecture transcript.
Rules:
- Remove filler words (um, okay, guys, listen)
- Fix grammar
- Merge broken sentences
- Keep all academic meaning
- DO NOT summarize
- DO NOT add new information
Return only cleaned transcript.`;

const LECTURE_PROMPT = "You are LectureCapture Web Engine operating in Transcript-Bound Mode.\n" +
"You reconstruct lecture notes strictly from transcript.\n\n" +
"Allowed: Rephrase, Organize, Clarify sentences\n" +
"Forbidden: Add outside knowledge, Add textbook content, Add missing formulas, Add your own examples\n\n" +
"If unclear: write 'Not clearly explained in lecture.'\n" +
"If incomplete: write 'Definition incomplete in lecture.'\n" +
"Never guess.\n\n" +
"FORMATTING RULES:\n" +
"- Use markdown tables wherever comparisons, properties, lists of items, or structured data appear.\n" +
"- Use mermaid code blocks (```mermaid) for any process flows, hierarchies, or relationships.\n" +
"- Use bold for key terms, italics for emphasis.\n" +
"- Use bullet points for lists, numbered lists for steps/sequences.\n" +
"- Add a comparison table if 2+ things are compared.\n" +
"- Add a flowchart/mermaid diagram if a process or sequence is explained.\n" +
"- Make every section visually scannable — no walls of text.\n\n" +
"OUTPUT FORMAT:\n\n" +
"# 📘 <Course Name>\n" +
"## 🗓 Lecture Date: <Date>\n" +
"## 🎯 Topic: <Detected Main Topic>\n\n---\n\n" +
"## 1️⃣ Core Concepts\n(Use a table: | Concept | Description |)\n\n" +
"## 2️⃣ Definitions\n(Use a table: | Term | Definition |)\n\n" +
"## 3️⃣ Detailed Explanation\n(Use paragraphs with bold key terms. Add mermaid flowchart if a process is described.)\n\n" +
"## 4️⃣ Examples Discussed\n(Use numbered list or table with Example | Explanation columns)\n\n" +
"## 5️⃣ Comparisons (if applicable)\n(Use table: | Feature | Option A | Option B |)\n\n" +
"## 6️⃣ Important / Exam Signals\n(Use ⚠️ bullets for things professor emphasized)\n\n" +
"## 7️⃣ Quick Revision Flashcards\n(Use table: | Question | Answer |)\n\n" +
"## 8️⃣ Visual Summary\n(Create a mermaid diagram using ```mermaid code block. Use graph TD for top-down flowchart showing how key concepts connect. Example:\n```mermaid\ngraph TD\n  A[SQL] --> B[PLSQL]\n  B --> C[Variables]\n```\n)\n\n" +
"## 9️⃣ Unclear Areas\n(List anything not clearly explained)";

const form = document.getElementById("upload-form");
const status = document.getElementById("status");
const step = document.getElementById("step");
const btn = document.getElementById("btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = document.getElementById("audio").files[0];
  if (!file) return (status.textContent = "Pick a file first.");

  btn.disabled = true;
  try {
    // Step 1: Transcribe
    status.textContent = "⏳ Processing…";
    step.textContent = "Step 1/3 — Transcribing audio (Whisper)…";
    const result = await puter.ai.speech2txt(file, { model: "whisper-1" });
    const raw = result.text || result;

    // Step 2: Clean transcript
    step.textContent = "Step 2/3 — Cleaning transcript (Gemini)…";
    const cleanResp = await puter.ai.chat(
      CLEAN_PROMPT + "\n\n---\n\n" + raw,
      { model: "gemini-2.0-flash" }
    );
    const cleaned = cleanResp.message?.content || cleanResp;

    // Step 3: Generate notes
    step.textContent = "Step 3/3 — Generating structured notes (Gemini)…";
    const notesResp = await puter.ai.chat(
      LECTURE_PROMPT + "\n\n---\n\nTRANSCRIPT:\n" + cleaned,
      { model: "gemini-2.0-flash" }
    );
    const notes = notesResp.message?.content || notesResp;

    // Save to backend
    step.textContent = "Saving…";
    const res = await fetch("/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, transcript: cleaned, notes }),
    });
    if (!res.ok) throw new Error(await res.text());

    status.textContent = "✅ Done!";
    step.textContent = "";
    setTimeout(() => (window.location.href = "/history"), 800);
  } catch (err) {
    status.textContent = "❌ Error: " + err.message;
    step.textContent = "";
  } finally {
    btn.disabled = false;
  }
});
