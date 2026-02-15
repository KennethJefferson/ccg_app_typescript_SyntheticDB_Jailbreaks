"use client";

import { GenerationConfig, AttackCategory, DifficultyLevel } from "@/lib/types";
import {
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
  DIFFICULTY_LABELS,
  ALL_CATEGORIES,
} from "@/lib/constants";

interface ConfigPanelProps {
  config: GenerationConfig;
  onChange: (config: GenerationConfig) => void;
  onGenerate: () => void;
  onAbort: () => void;
  onClear: () => void;
  status: "idle" | "generating" | "completed" | "error";
  hasExamples: boolean;
}

export function ConfigPanel({
  config,
  onChange,
  onGenerate,
  onAbort,
  onClear,
  status,
  hasExamples,
}: ConfigPanelProps) {
  const isGenerating = status === "generating";

  const toggleCategory = (cat: AttackCategory) => {
    const cats = config.categories.includes(cat)
      ? config.categories.filter((c) => c !== cat)
      : [...config.categories, cat];
    if (cats.length > 0) {
      onChange({ ...config, categories: cats });
    }
  };

  const toggleAll = () => {
    if (config.categories.length === ALL_CATEGORIES.length) {
      onChange({ ...config, categories: [ALL_CATEGORIES[0]] });
    } else {
      onChange({ ...config, categories: [...ALL_CATEGORIES] });
    }
  };

  return (
    <aside className="h-full overflow-y-auto border-r border-zinc-800 bg-zinc-950 p-4 flex flex-col gap-5">
      <div>
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-1">
          Generation Config
        </h2>
        <p className="text-xs text-zinc-500">
          Uses Anthropic API key
        </p>
      </div>

      {/* Count */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1.5">
          Number of Examples
        </label>
        <input
          type="number"
          min={1}
          max={100}
          value={config.count}
          onChange={(e) =>
            onChange({
              ...config,
              count: Math.max(1, Math.min(100, parseInt(e.target.value) || 1)),
            })
          }
          disabled={isGenerating}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1.5">
          Difficulty
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {(Object.keys(DIFFICULTY_LABELS) as DifficultyLevel[]).map((d) => (
            <button
              key={d}
              onClick={() => onChange({ ...config, difficulty: d })}
              disabled={isGenerating}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                config.difficulty === d
                  ? "border-blue-500 bg-blue-500/10 text-blue-400"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              {DIFFICULTY_LABELS[d]}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-zinc-400">
            Attack Categories
          </label>
          <button
            onClick={toggleAll}
            disabled={isGenerating}
            className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50"
          >
            {config.categories.length === ALL_CATEGORIES.length
              ? "Deselect All"
              : "Select All"}
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {ALL_CATEGORIES.map((cat) => (
            <label
              key={cat}
              className="flex items-start gap-2 rounded-md p-1.5 hover:bg-zinc-900 cursor-pointer group"
              title={CATEGORY_DESCRIPTIONS[cat]}
            >
              <input
                type="checkbox"
                checked={config.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                disabled={isGenerating}
                className="mt-0.5 rounded border-zinc-600 bg-zinc-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span className="text-xs text-zinc-300 group-hover:text-zinc-100">
                {CATEGORY_LABELS[cat]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Custom Instructions */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1.5">
          Custom Instructions{" "}
          <span className="text-zinc-600 font-normal">(optional)</span>
        </label>
        <textarea
          value={config.customInstructions}
          onChange={(e) =>
            onChange({ ...config, customInstructions: e.target.value })
          }
          disabled={isGenerating}
          placeholder="e.g., Focus on medical misinformation scenarios..."
          rows={3}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-zinc-800">
        {isGenerating ? (
          <button
            onClick={onAbort}
            className="w-full rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            Abort Generation
          </button>
        ) : (
          <button
            onClick={onGenerate}
            className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Generate Dataset
          </button>
        )}
        {hasExamples && !isGenerating && (
          <button
            onClick={onClear}
            className="w-full rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors"
          >
            Clear Results
          </button>
        )}
      </div>
    </aside>
  );
}
