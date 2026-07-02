import cron from "node-cron";
import { loadConfig } from "./config.js";
import { generateReport } from "./agent.js";
import { saveReport } from "./reportStore.js";

const CRON_EXPRESSIONS = {
  daily: "0 8 * * *", // every day at 08:00
  weekly: "0 8 * * 1", // every Monday at 08:00
};

function runReportJob(topic) {
  console.log(`[Scheduler] Generating report for "${topic}"...`);
  const report = generateReport(topic);
  const filePath = saveReport(report);
  console.log(`[Scheduler] Report saved to ${filePath}`);
}

export function startScheduler() {
  const config = loadConfig();
  const cronExpression = CRON_EXPRESSIONS[config.frequency];

  if (!cronExpression) {
    throw new Error(`Unsupported frequency in config.json: "${config.frequency}"`);
  }

  console.log(`[Scheduler] Frequency: ${config.frequency}`);
  console.log(`[Scheduler] Cron expression: ${cronExpression}`);
  console.log("[Scheduler] Waiting for the next scheduled run... (Ctrl+C to stop)");

  cron.schedule(cronExpression, () => runReportJob(config.topic));
}
