# SyntheticDB Jailbreaks

A Next.js web application for generating synthetic red team AI datasets. Produces structured jailbreak attack/defense pairs for AI safety research, model evaluation, and defensive training.

## What It Does

- Generates synthetic adversarial prompts across 7 attack categories
- Produces attack/defense pairs with severity ratings and defensive notes
- Streams results in real-time as they generate
- Exports datasets as CSV, JSON, or JSONL
- Configurable difficulty tiers: Basic, Intermediate, Advanced, Expert

## Attack Categories

| Category | Description |
|----------|-------------|
| Direct Instruction Override | Attempts to directly override system instructions |
| Role-play / Character Injection | Uses fictional personas to bypass safety filters |
| Encoding / Obfuscation | Base64, ROT13, leetspeak encoding tricks |
| Multi-turn Manipulation | Gradual escalation across conversation turns |
| Prompt Injection | Instructions disguised as data or context |
| Social Engineering | Emotional appeals, authority claims, urgency |
| Few-shot Manipulation | Examples that establish patterns toward harmful output |

## Tech Stack

- **Next.js 16** with App Router and Turbopack
- **TypeScript** with strict types
- **Tailwind CSS v4** for styling
- **Anthropic API** (Claude Sonnet 4) for generation

## Quick Start

```bash
# Install dependencies
npm install

# Set your Anthropic API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# Start dev server
npm run dev
```

Open http://localhost:3000, configure your dataset parameters, and click **Generate Dataset**.

You can also set your API key through the Settings dialog (key icon, top right) instead of `.env.local`.

## CLI Generator

A standalone script is included for headless generation:

```bash
ANTHROPIC_API_KEY=sk-ant-... node generate.mjs
```

Outputs `jailbreak-dataset.csv` and `jailbreak-dataset.json`.

## Output Format

Each generated example is a complete input/output pair with detailed, multi-paragraph responses:

| Field | Description |
|-------|-------------|
| `attackPrompt` | Full adversarial prompt (3-10+ sentences depending on difficulty) |
| `attackTechnique` | Short name of the technique (2-5 words) |
| `category` | Attack category classification |
| `subcategory` | More specific classification |
| `targetResponse` | Undefended model response showing complete failure mode (2-4 paragraphs) |
| `defendedResponse` | Defended model response with risk explanation and alternatives (2-3 paragraphs) |
| `attackSuccess` | Whether this attack typically bypasses safety |
| `severity` | Risk level: low, medium, high, critical |
| `notes` | Technical defense analysis with detection strategies and mitigations (3-5 sentences) |

## License

MIT
