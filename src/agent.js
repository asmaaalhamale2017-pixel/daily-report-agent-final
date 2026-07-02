export function generateReport(topic) {
  const dateLabel = new Date().toDateString();

  return [
    `Daily Report: ${topic}`,
    `Date: ${dateLabel}`,
    "",
    `This is a sample report on "${topic}".`,
    "Real content generation will be added in a future phase.",
  ].join("\n");
}
