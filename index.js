import http from "http";

import { configExists, loadConfig } from "./src/config.js";
import { runSetupWizard } from "./src/setup.js";
import { saveReport } from "./src/reportStore.js";
import { startScheduler } from "./src/scheduler.js";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ================= AI =================
async function generateAIReport(topic) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: `Write a clear daily tech summary about: ${topic}`,
        },
      ],
    });

    return response.content[0].text;
  } catch (error) {
    return `Fallback report for: ${topic}`;
  }
}

// ================= SERVER =================
const server = http.createServer(async (req, res) => {
  // الصفحة الرئيسية (UI)
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <html>
        <head>
          <title>AI Agent</title>
        </head>
        <body>
          <h2>AI Agent 🚀</h2>
          <form method="GET" action="/generate">
            <input name="topic" placeholder="Enter topic..." required />
            <button type="submit">Generate Report</button>
          </form>
        </body>
      </html>
    `);
  }

  // توليد التقرير
  else if (req.url.startsWith("/generate")) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const topic = url.searchParams.get("topic");

    const report = await generateAIReport(topic);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <h2>Generated Report</h2>
      <pre>${report}</pre>
      <br><a href="/">← Back</a>
    `);
  }

  // status
  else if (req.url === "/status") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "active" }));
  }

  else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

// ================= START =================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});