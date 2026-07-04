import dotenv from "dotenv";
dotenv.config();

import { configExists, loadConfig } from "./src/config.js";
import { runSetupWizard } from "./src/setup.js";
import { saveReport } from "./src/reportStore.js";
import { startScheduler } from "./src/scheduler.js";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
This report was generated in fallback mode.

Key Points:
- Daily monitoring process completed.
- Configuration loaded successfully.
- Scheduled execution remains operational.
- Claude integration is configured and ready when API access becomes available.

End of report.
`;
  }
}

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
import http from "http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("AI Agent is running successfully 🚀");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
main().catch((error) => {
  console.error("\n[Agent Error]");
  console.error(error.message);
});