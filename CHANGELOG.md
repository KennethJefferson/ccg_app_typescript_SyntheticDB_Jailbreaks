# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-02-15

### Changed
- Migrated from `@anthropic-ai/claude-agent-sdk` (Claude Code agent SDK) to `@anthropic-ai/sdk` (standard Anthropic API)
- API route now uses `client.messages.create()` instead of `query()` subprocess
- Generation hook accepts optional API key parameter passed via request header

### Added
- Settings dialog for entering Anthropic API key via the UI
- API key persistence in browser localStorage
- API key status indicator (green dot) in top bar
- Debug logging for raw API responses in server console
- Robust JSON extraction: strips markdown fences, leading/trailing non-JSON text
- Error details now surface in client console instead of silent skip

### Removed
- `@anthropic-ai/claude-agent-sdk` dependency
- `delete process.env.CLAUDECODE` workaround
- Claude Code CLI OAuth dependency

### Fixed
- Fatal errors (e.g., invalid API key) no longer show misleading "Complete: 0 examples" status

## [0.1.0] - 2026-02-14

### Added
- Initial web application with Next.js 16, TypeScript, Tailwind CSS v4
- Generation config panel: example count, difficulty tiers, attack categories, custom instructions
- 7 attack categories: direct override, role-play injection, encoding obfuscation, multi-turn, prompt injection, social engineering, few-shot manipulation
- 4 difficulty tiers: basic, intermediate, advanced, expert
- Streaming NDJSON generation with progressive table rendering
- Interactive data table with sorting, filtering, and search
- Expandable rows showing full attack/defense detail
- Export to CSV, JSON, JSONL formats
- Standalone CLI generator (`generate.mjs`)
