import express from "express";
import { chat, createSession } from "./chat.js";
import { companyData } from "./data/company.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// เก็บ session ในหน่วยความจำ (key = sessionId)
const sessions = new Map();

function getOrCreateSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, createSession());
  }
  return sessions.get(sessionId);
}

// POST /chat — ส่งข้อความและรับคำตอบ
app.post("/chat", async (req, res) => {
  const { message, sessionId = "default" } = req.body;

  if (!message) {
    return res.status(400).json({ error: "กรุณาส่ง message" });
  }

  const messages = getOrCreateSession(sessionId);

  try {
    const { reply, toolsUsed } = await chat(messages, message);
    res.json({ reply, toolsUsed, sessionId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /chat/:sessionId — ล้าง session
app.delete("/chat/:sessionId", (req, res) => {
  sessions.delete(req.params.sessionId);
  res.json({ message: "ล้าง session แล้ว" });
});

// GET /company — ข้อมูลบริษัท
app.get("/company", (_req, res) => {
  res.json(companyData);
});

// GET /health
app.get("/health", (_req, res) => {
  res.json({ status: "ok", model: "llama3.1:latest", company: companyData.name });
});

app.listen(PORT, () => {
  console.log(`⚡ Volt Corp API — http://localhost:${PORT}`);
  console.log(`   POST /chat       — ส่งข้อความ`);
  console.log(`   DELETE /chat/:id — ล้าง session`);
  console.log(`   GET  /company    — ข้อมูลบริษัท`);
  console.log(`   GET  /health     — health check`);
});
