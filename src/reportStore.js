import fs from "node:fs";
import path from "node:path";

const REPORTS_DIR = path.resolve("reports");

function timestampedFilename() {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `report-${stamp}.txt`;
}

export function saveReport(content) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const filePath = path.join(REPORTS_DIR, timestampedFilename());
  fs.writeFileSync(filePath, content);

  return filePath;
}
