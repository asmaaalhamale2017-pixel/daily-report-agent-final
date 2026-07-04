import dotenv from "dotenv";
dotenv.config();

import http from "http";

import { configExists, loadConfig } from "./src/config.js";
import { runSetupWizard } from "./src/setup.js";
import { saveReport } from "./src/reportStore.js";
import { startScheduler } from "./src/scheduler.js";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ================= AI REPORT =================
async function generateAIReport(topic) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: `Write a clear and structured daily tech summary about: ${topic}`,
        },
      ],
    });

    return response.content[0].text;
  } catch (error) {
    console.log("[Agent] Claude unavailable. Using fallback mode.");

    const dateLabel = new Date().toDateString();

    return `
Daily Report: ${topic}
Date: ${dateLabel}

Status:
Claude API is currently unavailable.

Summary:
Fallback mode active.

Key Points:
- System running normally
- Scheduler active
- Configuration loaded
- Report generated locally
`;
  }
}

// ================= MAIN LOGIC =================
async function main() {
  if (!configExists()) {
    await runSetupWizard();
    return;
  }

  if (process.argv.includes("--schedule")) {
    startScheduler();
    return;
  }

  const config = loadConfig();

  const report = await generateAIReport(config.topic);

  const filePath = saveReport(report);

  console.log("\n" + report);
  console.log(`\nReport saved to ${filePath}`);
}

// ================= HTTP SERVER (RENDER FIX) =================
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("AI Agent is running successfully 🚀");
  } 
  else if (req.url === "/status") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "active",
        service: "ai-agent",
        time: new Date().toISOString(),
      })
    );
  } 
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

const PORT = process.env.PORT || 3000;

// ================= START EVERYTHING =================
server.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);

  // تشغيل المنطق بعد تشغيل السيرفر (مهم لـ Render stability)
  main().catch((error) => {
    console.error("\n[Agent Error]");
    console.error(error.message);
  });
});