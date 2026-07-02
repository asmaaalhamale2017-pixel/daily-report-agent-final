import readline from "node:readline";
import { saveConfig } from "./config.js";

const VALID_FREQUENCIES = ["daily", "weekly"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateTopic(topic) {
  return topic.length > 0;
}

function validateFrequency(frequency) {
  return VALID_FREQUENCIES.includes(frequency.toLowerCase());
}

function validateEmail(email) {
  return EMAIL_REGEX.test(email);
}

function prompt(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function askUntilValid(rl, question, validate, errorMessage) {
  while (true) {
    const answer = (await prompt(rl, question)).trim();
    if (validate(answer)) return answer;
    console.log(errorMessage);
  }
}

export async function runSetupWizard() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("No configuration found. Let's set up your Daily Report Agent.\n");

  const topic = await askUntilValid(
    rl,
    "Report topic: ",
    validateTopic,
    "Topic cannot be empty. Please try again.",
  );

  const frequency = (
    await askUntilValid(
      rl,
      "Report frequency (daily/weekly): ",
      validateFrequency,
      'Frequency must be "daily" or "weekly". Please try again.',
    )
  ).toLowerCase();

  const email = await askUntilValid(
    rl,
    "Email address: ",
    validateEmail,
    "Please enter a valid email address.",
  );

  rl.close();

  const config = {
    topic,
    frequency,
    email,
    createdAt: new Date().toISOString(),
  };

  saveConfig(config);

  console.log("\nSetup complete! Configuration saved to config.json.");

  return config;
}
