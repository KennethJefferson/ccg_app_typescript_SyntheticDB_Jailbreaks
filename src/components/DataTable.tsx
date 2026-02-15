"use client";

import {
  GeneratedExample,
  TableControls,
  SortField,
  AttackCategory,
  SeverityLevel,
} from "@/lib/types";
import { CATEGORY_LABELS, ALL_CATEGORIES } from "@/lib/constants";
import { DataTableRow } from "./DataTableRow";

interface DataTableProps {
  examples: GeneratedExample[];
  controls: TableControls;
  onSort: (field: SortField) => void;
  onFilterCategory: (value: AttackCategory | "all") => void;
  onFilterSeverity: (value: SeverityLevel | "all") => void;
  onFilterSuccess: (value: boolean | "all") => void;
  onSearch: (value: string) => void;
  onResetFilters: () => void;
  status: "idle" | "generating" | "completed" | "error";
  total: number;
  progress: number;
}

export function DataTable({
  examples,
  controls,
  onSort,
  onFilterCategory,
  onFilterSeverity,
  onFilterSuccess,
  onSearch,
  onResetFilters,
  status,
  total,
  progress,
}: DataTableProps) {
  const hasFilters =
    controls.filterCategory !== "all" ||
    controls.filterSeverity !== "all" ||
    controls.filterSuccess !== "all" ||
    controls.searchQuery !== "";

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Filter Bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-zinc-800 bg-zinc-950/50 flex-shrink-0">
        <input
          type="text"
          placeholder="Search prompts, techniques, notes..."
          value={controls.searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="flex-1 max-w-xs rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
        />

        <select
          value={controls.filterCategory}
          onChange={(e) =>
            onFilterCategory(e.target.value as AttackCategory | "all")
          }
          className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-300 focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Categories</option>
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>

        <select
          value={controls.filterSeverity}
          onChange={(e) =>
            onFilterSeverity(e.target.value as SeverityLevel | "all")
          }
          className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-300 focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <select
          value={String(controls.filterSuccess)}
          onChange={(e) => {
            const v = e.target.value;
            onFilterSuccess(v === "all" ? "all" : v === "true");
          }}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-300 focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Results</option>
          <option value="true">Attack Succeeded</option>
          <option value="false">Attack Defended</option>
        </select>

        {hasFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs text-zinc-500 hover:text-zinc-300"
          >
            Clear filters
          </button>
        )}

        <span className="ml-auto text-xs text-zinc-600 tabular-nums">
          {examples.length} result{examples.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        {examples.length === 0 ? (
          <EmptyState status={status} progress={progress} total={total} />
        ) : (
          <table className="w-full">
            <thead className="sticky top-0 bg-zinc-950 z-10">
              <tr className="border-b border-zinc-800">
                <SortableHeader label="#" width="w-10" />
                <SortableHeader
                  label="Category"
                  field="category"
                  currentSort={controls.sortField}
                  direction={controls.sortDirection}
                  onSort={onSort}
                  width="w-40"
                />
                <SortableHeader
                  label="Technique"
                  field="attackTechnique"
                  currentSort={controls.sortField}
                  direction={controls.sortDirection}
                  onSort={onSort}
                  width="w-40"
                />
                <SortableHeader label="Attack Prompt" width="min-w-0" />
                <SortableHeader
                  label="Result"
                  field="attackSuccess"
                  currentSort={controls.sortField}
                  direction={controls.sortDirection}
                  onSort={onSort}
                  width="w-16"
                  center
                />
                <SortableHeader
                  label="Severity"
                  field="severity"
                  currentSort={controls.sortField}
                  direction={controls.sortDirection}
                  onSort={onSort}
                  width="w-24"
                />
                <SortableHeader label="" width="w-8" />
              </tr>
            </thead>
            <tbody>
              {examples.map((ex, i) => (
                <DataTableRow
                  key={ex.id}
                  example={ex}
                  index={i}
                  isNew={status === "generating" && i === examples.length - 1}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function SortableHeader({
  label,
  field,
  currentSort,
  direction,
  onSort,
  width,
  center,
}: {
  label: string;
  field?: SortField;
  currentSort?: SortField | null;
  direction?: "asc" | "desc";
  onSort?: (field: SortField) => void;
  width?: string;
  center?: boolean;
}) {
  const isActive = field && currentSort === field;
  const sortable = field && onSort;

  return (
    <th
      className={`px-3 py-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider ${
        width || ""
      } ${center ? "text-center" : "text-left"} ${
        sortable ? "cursor-pointer hover:text-zinc-300 select-none" : ""
      }`}
      onClick={() => sortable && onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive && (
          <svg
            className={`w-3 h-3 ${
              direction === "desc" ? "rotate-180" : ""
            } transition-transform`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        )}
      </span>
    </th>
  );
}

function EmptyState({
  status,
  progress,
  total,
}: {
  status: string;
  progress: number;
  total: number;
}) {
  if (status === "generating") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
          <span className="text-sm">
            Generating example {progress + 1} of {total}...
          </span>
        </div>
        <p className="text-xs text-zinc-600">
          Each example takes a few seconds to generate
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-2 text-zinc-600">
      <svg
        className="w-10 h-10 text-zinc-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <p className="text-sm">No examples yet</p>
      <p className="text-xs">
        Configure your parameters and click Generate Dataset
      </p>
    </div>
  );
}
