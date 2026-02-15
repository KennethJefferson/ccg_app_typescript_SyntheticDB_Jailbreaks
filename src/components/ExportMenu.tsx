"use client";

import { useState, useRef, useEffect } from "react";
import { GeneratedExample } from "@/lib/types";
import { toCSV, toJSON, toJSONL, downloadFile } from "@/lib/export";

interface ExportMenuProps {
  examples: GeneratedExample[];
}

export function ExportMenu({ examples }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const disabled = examples.length === 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, "");

  const exportCSV = () => {
    downloadFile(
      toCSV(examples),
      `redteam-dataset-${timestamp}.csv`,
      "text/csv"
    );
    setOpen(false);
  };

  const exportJSON = () => {
    downloadFile(
      toJSON(examples),
      `redteam-dataset-${timestamp}.json`,
      "application/json"
    );
    setOpen(false);
  };

  const exportJSONL = () => {
    downloadFile(
      toJSONL(examples),
      `redteam-dataset-${timestamp}.jsonl`,
      "application/x-ndjson"
    );
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className="flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Export
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 rounded-md border border-zinc-700 bg-zinc-900 py-1 shadow-xl z-50">
          <button
            onClick={exportCSV}
            className="w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          >
            Download CSV
          </button>
          <button
            onClick={exportJSON}
            className="w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          >
            Download JSON
          </button>
          <button
            onClick={exportJSONL}
            className="w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          >
            Download JSONL
          </button>
        </div>
      )}
    </div>
  );
}
