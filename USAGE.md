# Usage Guide

## Prerequisites

- Node.js 22+
- npm
- An Anthropic API key ([get one here](https://console.anthropic.com/settings/keys))

## Installation

```bash
git clone https://github.com/KennethJefferson/ccg_app_typescript_SyntheticDB_Jailbreaks.git
cd ccg_app_typescript_SyntheticDB_Jailbreaks
npm install
```

## API Key Configuration

### Option 1: Environment File

Create a `.env.local` file in the project root:

```
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

### Option 2: Settings Dialog

1. Start the app with `npm run dev`
2. Click the key icon in the top-right corner
3. Paste your API key and click Save
4. Key is stored in browser localStorage

The app checks for a key in this order: UI-provided key > `.env.local` key.

## Web Application

### Starting the Server

```bash
npm run dev
```

Navigate to http://localhost:3000.

### Generating a Dataset

1. **Set example count** (1-100) in the left panel
2. **Pick a difficulty tier**:
   - **Basic** - Well-known, easily detectable attack patterns
   - **Intermediate** - Moderate sophistication with some misdirection
   - **Advanced** - Complex, multi-step, hard to distinguish from legitimate requests
   - **Expert** - State-of-the-art, novel combinations, minimal detection surface
3. **Select attack categories** - Check/uncheck the categories you want
4. **Add custom instructions** (optional) - e.g., "Focus on medical misinformation" or "Target function-calling models"
5. Click **Generate Dataset**

### Viewing Results

- Rows appear in the data table as they stream in
- Click any row to expand and see full details:
  - **Attack Prompt** - Complete jailbreak input (multi-sentence)
  - **Undefended Response** - Multi-paragraph output showing the full failure mode
  - **Defended Response** - Multi-paragraph proper refusal with risk explanation and alternatives
  - **Defensive Notes** - Technical analysis of attack vector, detection strategies, mitigations
- Use the filter bar to narrow by category, severity, or attack success
- Use the search box to find specific techniques or keywords

### Sorting and Filtering

| Control | Options |
|---------|---------|
| Search | Free-text across prompts, techniques, notes, subcategories |
| Category filter | Filter to a single attack category |
| Severity filter | Low, Medium, High, Critical |
| Result filter | Attack Succeeded / Attack Defended |
| Column sort | Click column headers to sort (click again to reverse) |

### Exporting Data

Click **Export** in the top-right corner to download as:

- **CSV** - Spreadsheet-compatible, comma-separated
- **JSON** - Pretty-printed array of objects
- **JSONL** - One JSON object per line (ideal for ML pipelines)

Files are named `redteam-dataset-<timestamp>.<format>`.

## CLI Generator

For batch generation without the web UI:

```bash
ANTHROPIC_API_KEY=sk-ant-... node generate.mjs
```

Generates 10 intermediate-difficulty examples and writes:
- `jailbreak-dataset.csv`
- `jailbreak-dataset.json`

To customize, edit the `COUNT` and `DIFFICULTY` constants at the top of `generate.mjs`.

## Cost Estimation

Each example makes one API call to Claude Sonnet 4. Approximate costs:

| Examples | Estimated Cost |
|----------|---------------|
| 10 | ~$0.10-0.20 |
| 50 | ~$0.50-1.00 |
| 100 | ~$1.00-2.00 |

Costs vary based on prompt complexity and response length. With detailed multi-paragraph outputs (up to 4096 tokens per example), costs are higher than minimal-response configurations.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No API key configured" | Set key in `.env.local` or Settings dialog |
| "invalid x-api-key" (401) | Your API key is incorrect - check it at console.anthropic.com |
| "Complete: 0 examples" | Check browser console and server terminal for parse errors |
| Generation is slow | Each example takes 5-15 seconds; Expert tier takes longer |
| Port 3000 in use | Kill the old process or use `npx next dev -p 3001` |
