# Daily Report AI Agent

A simple Node.js CLI agent that walks you through a one-time setup, then generates a daily (or weekly) report on your chosen topic and saves it locally.

Built as a university project.

## How It Works

The agent runs in two phases:

1. **Setup wizard (first run only)**
   On the first run, no configuration exists yet, so the agent asks you three questions:
   - Report topic
   - Report frequency (`daily` or `weekly`)
   - Email address

   Your answers are validated and saved to `config.json` in the project root.

2. **Report generation (subsequent runs)**
   Once `config.json` exists, the agent reads your saved topic, generates a report, prints it to the terminal, and saves it as a timestamped `.txt` file inside the `reports/` folder.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)

### Installation

```bash
npm install
```

### Running the Project

```bash
node index.js
```

- **First run:** you'll be guided through the setup wizard.
- **Every run after that:** a new report is generated and saved automatically.

To redo the setup wizard, delete `config.json` and run the agent again.

## Project Structure

```
ai-agent/
├── index.js              # Entry point — routes to setup or report generation
├── config.json            # Your saved settings (generated, gitignored)
├── config.example.json    # Template showing the config shape
├── reports/                # Generated .txt reports
└── src/
    ├── setup.js            # First-run setup wizard
    ├── config.js           # Load/save config.json
    ├── agent.js            # Report content generation
    └── reportStore.js      # Saves reports to the reports/ folder
```

## Technologies Used

- **Node.js** — the only runtime dependency; no external APIs or frameworks

## Roadmap

- [ ] Scheduling support for automatic daily/weekly runs
- [ ] Email delivery of generated reports
