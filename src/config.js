import fs from "node:fs";
import path from "node:path";

const CONFIG_PATH = path.resolve("config.json");

export function configExists() {
  return fs.existsSync(CONFIG_PATH);
}

export function loadConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
  return JSON.parse(raw);
}

export function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}
