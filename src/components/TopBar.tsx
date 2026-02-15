"use client";

import { GeneratedExample } from "@/lib/types";
import { ExportMenu } from "./ExportMenu";

interface TopBarProps {
  examples: GeneratedExample[];
  status: "idle" | "generating" | "completed" | "error";
  progress: number;
  total: number;
  error?: string;
  hasApiKey: boolean;
  onOpenSettings: () => void;
}

export function TopBar({
  examples,
  status,
  progress,
  total,
  error,
  hasApiKey,
  onOpenSettings,
}: TopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-5 col-span-2">
      <div className="flex items-center gap-4">
        <h1 className="text-base font-semibold text-zinc-100 tracking-tight">
          SyntheticDB{" "}
          <span className="text-red-400">Jailbreaks</span>
        </h1>

        <div className="h-4 w-px bg-zinc-800" />

        <StatusIndicator
          status={status}
          progress={progress}
          total={total}
          exampleCount={examples.length}
          error={error}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 transition-colors"
          title="API Key Settings"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              hasApiKey ? "bg-emerald-400" : "bg-zinc-600"
            }`}
          />
        </button>
        <ExportMenu examples={examples} />
      </div>
    </header>
  );
}

function StatusIndicator({
  status,
  progress,
  total,
  exampleCount,
  error,
}: {
  status: string;
  progress: number;
  total: number;
  exampleCount: number;
  error?: string;
}) {
  switch (status) {
    case "idle":
      return (
        <span className="text-xs text-zinc-500">
          Configure and generate a dataset
        </span>
      );
    case "generating":
      return (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs text-blue-400">
            Generating {progress}/{total}...
          </span>
          <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${(progress / total) * 100}%` }}
            />
          </div>
        </div>
      );
    case "completed":
      return (
        <span className="text-xs text-emerald-400">
          Complete: {exampleCount} examples generated
        </span>
      );
    case "error":
      return (
        <span className="text-xs text-red-400" title={error}>
          Error: {error || "Unknown error"}
        </span>
      );
    default:
      return null;
  }
}
