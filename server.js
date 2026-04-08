import express from "express";
import { createServer } from "http";

const app = express();
app.use(express.json({ limit: "2mb" }));

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

app.post("/api/messages", async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다." });
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Anthropic proxy error:", err);
    res.status(502).json({ error: "API 요청 실패", detail: err.message });
  }
});

const PORT = process.env.PORT || 3001;
createServer(app).listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
