"use client";

import { useState } from "react";
import { GeneratedExample } from "@/lib/types";
import { CATEGORY_LABELS, SEVERITY_COLORS, SEVERITY_BG_COLORS } from "@/lib/constants";

interface DataTableRowProps {
  example: GeneratedExample;
  index: number;
  isNew?: boolean;
}

export function DataTableRow({ example, index, isNew }: DataTableRowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        onClick={() => setExpanded(!expanded)}
        className={`border-b border-zinc-800/50 cursor-pointer hover:bg-zinc-800/30 transition-colors ${
          isNew ? "animate-row-in" : ""
        } ${expanded ? "bg-zinc-800/20" : ""}`}
      >
        <td className="px-3 py-2.5 text-xs text-zinc-500 tabular-nums">
          {index + 1}
        </td>
        <td className="px-3 py-2.5">
          <span className="text-xs text-zinc-400">
            {CATEGORY_LABELS[example.category]}
          </span>
        </td>
        <td className="px-3 py-2.5">
          <span className="text-xs text-zinc-300 font-medium">
            {example.attackTechnique}
          </span>
        </td>
        <td className="px-3 py-2.5 max-w-xs">
          <p className="text-xs text-zinc-400 truncate">
            {example.attackPrompt}
          </p>
        </td>
        <td className="px-3 py-2.5 text-center">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              example.attackSuccess ? "bg-red-400" : "bg-emerald-400"
            }`}
            title={example.attackSuccess ? "Attack succeeded" : "Attack defended"}
          />
        </td>
        <td className="px-3 py-2.5">
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
              SEVERITY_COLORS[example.severity]
            } ${SEVERITY_BG_COLORS[example.severity]}`}
          >
            {example.severity}
          </span>
        </td>
        <td className="px-3 py-2.5 text-center">
          <svg
            className={`w-3.5 h-3.5 text-zinc-500 transition-transform inline-block ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </td>
      </tr>

      {expanded && (
        <tr className="border-b border-zinc-800/50 bg-zinc-900/50">
          <td colSpan={7} className="px-4 py-4">
            <div className="grid grid-cols-1 gap-4 max-w-4xl">
              {/* Attack Prompt */}
              <div>
                <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                  Attack Prompt
                </h4>
                <div className="rounded-md bg-zinc-950 border border-zinc-800 p-3">
                  <p className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {example.attackPrompt}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Target Response (Undefended) */}
                <div>
                  <h4 className="text-[10px] font-semibold text-red-400/70 uppercase tracking-wider mb-1">
                    Undefended Response (Failure)
                  </h4>
                  <div className="rounded-md bg-red-950/20 border border-red-900/30 p-3">
                    <p className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                      {example.targetResponse}
                    </p>
                  </div>
                </div>

                {/* Defended Response */}
                <div>
                  <h4 className="text-[10px] font-semibold text-emerald-400/70 uppercase tracking-wider mb-1">
                    Defended Response (Success)
                  </h4>
                  <div className="rounded-md bg-emerald-950/20 border border-emerald-900/30 p-3">
                    <p className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                      {example.defendedResponse}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                  Defensive Notes
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {example.notes}
                </p>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-[10px] text-zinc-600">
                <span>Subcategory: {example.subcategory}</span>
                <span>ID: {example.id.slice(0, 8)}</span>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
