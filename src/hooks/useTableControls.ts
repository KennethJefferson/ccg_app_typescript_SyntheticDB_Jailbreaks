"use client";

import { useMemo, useState, useCallback } from "react";
import {
  GeneratedExample,
  TableControls,
  SortField,
  AttackCategory,
  SeverityLevel,
} from "@/lib/types";

const DEFAULT_CONTROLS: TableControls = {
  sortField: null,
  sortDirection: "asc",
  filterCategory: "all",
  filterSeverity: "all",
  filterSuccess: "all",
  searchQuery: "",
};

export function useTableControls(examples: GeneratedExample[]) {
  const [controls, setControls] = useState<TableControls>(DEFAULT_CONTROLS);

  const filteredData = useMemo(() => {
    let result = [...examples];

    if (controls.filterCategory !== "all") {
      result = result.filter((e) => e.category === controls.filterCategory);
    }
    if (controls.filterSeverity !== "all") {
      result = result.filter((e) => e.severity === controls.filterSeverity);
    }
    if (controls.filterSuccess !== "all") {
      result = result.filter((e) => e.attackSuccess === controls.filterSuccess);
    }
    if (controls.searchQuery) {
      const q = controls.searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.attackPrompt.toLowerCase().includes(q) ||
          e.attackTechnique.toLowerCase().includes(q) ||
          e.notes.toLowerCase().includes(q) ||
          e.subcategory.toLowerCase().includes(q)
      );
    }

    if (controls.sortField) {
      const field = controls.sortField;
      const dir = controls.sortDirection === "asc" ? 1 : -1;
      result.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        if (typeof aVal === "boolean") {
          return (aVal === bVal ? 0 : aVal ? 1 : -1) * dir;
        }
        return String(aVal).localeCompare(String(bVal)) * dir;
      });
    }

    return result;
  }, [examples, controls]);

  const setSort = useCallback((field: SortField) => {
    setControls((prev) => ({
      ...prev,
      sortField: field,
      sortDirection:
        prev.sortField === field && prev.sortDirection === "asc"
          ? "desc"
          : "asc",
    }));
  }, []);

  const setFilterCategory = useCallback(
    (value: AttackCategory | "all") => {
      setControls((prev) => ({ ...prev, filterCategory: value }));
    },
    []
  );

  const setFilterSeverity = useCallback(
    (value: SeverityLevel | "all") => {
      setControls((prev) => ({ ...prev, filterSeverity: value }));
    },
    []
  );

  const setFilterSuccess = useCallback((value: boolean | "all") => {
    setControls((prev) => ({ ...prev, filterSuccess: value }));
  }, []);

  const setSearchQuery = useCallback((value: string) => {
    setControls((prev) => ({ ...prev, searchQuery: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setControls(DEFAULT_CONTROLS);
  }, []);

  return {
    controls,
    filteredData,
    setSort,
    setFilterCategory,
    setFilterSeverity,
    setFilterSuccess,
    setSearchQuery,
    resetFilters,
  };
}
