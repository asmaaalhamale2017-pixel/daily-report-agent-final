import { configExists, loadConfig } from "./src/config.js";
import { runSetupWizard } from "./src/setup.js";
import { generateReport } from "./src/agent.js";
import { saveReport } from "./src/reportStore.js";
import { startScheduler } from "./src/scheduler.js";

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
  const report = generateReport(config.topic);
  const filePath = saveReport(report);

  console.log(report);
  console.log(`\nReport saved to ${filePath}`);
}

main();
